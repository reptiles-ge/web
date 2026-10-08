import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { SearchDocument } from "@/lib/siteSearch";

import {
  flattenGroups,
  readRecent,
  resolveRecent,
  searchIndex,
  writeRecent,
} from "@/lib/siteSearch";

function doc(overrides: Partial<SearchDocument>): SearchDocument {
  const id = overrides.id ?? "x";
  return {
    href: "/" as never,
    icon: "species" as never,
    id,
    key: `${overrides.kind ?? "page"}:${id}`,
    kind: "page",
    scoreTitles: [overrides.title ?? id],
    searchText: overrides.title ?? id,
    subtitle: "",
    title: id,
    ...overrides,
  };
}

const index: SearchDocument[] = [
  doc({ id: "home", kind: "page", rank: 1, suggested: true, title: "Home" }),
  doc({ id: "quiz", kind: "page", rank: 2, suggested: true, title: "Quiz" }),
  doc({ id: "about", kind: "page", title: "About" }),
  doc({ featured: true, id: "viper", kind: "species", title: "Viper" }),
  doc({ id: "tortoise", kind: "species", title: "Tortoise" }),
  doc({ id: "kakheti", kind: "region", title: "Kakheti" }),
];

describe("searchIndex with an empty query", () => {
  it("shows suggested pages and featured species for 'all'", () => {
    const { groups, totals } = searchIndex(index, "   ", "all");
    const ids = flattenGroups(groups).map((item) => item.id);
    expect(ids).toEqual(expect.arrayContaining(["home", "quiz", "viper"]));
    expect(ids).not.toContain("about");
    expect(ids).not.toContain("tortoise");
    expect(ids).not.toContain("kakheti");
    expect(totals.page).toBe(2);
  });

  it("orders suggested pages by rank", () => {
    const pages = flattenGroups(searchIndex(index, "", "all").groups).filter(
      (item) => item.kind === "page",
    );
    expect(pages.map((item) => item.id)).toEqual(["home", "quiz"]);
  });

  it("lists every region and every page when filtered to that kind", () => {
    expect(
      flattenGroups(searchIndex(index, "", "region").groups).map(
        (item) => item.id,
      ),
    ).toEqual(["kakheti"]);
    expect(flattenGroups(searchIndex(index, "", "page").groups)).toHaveLength(
      3,
    );
  });

  it("lists only featured species when filtered to species", () => {
    expect(
      flattenGroups(searchIndex(index, "", "species").groups).map(
        (item) => item.id,
      ),
    ).toEqual(["viper"]);
  });
});

describe("searchIndex with a query", () => {
  it("finds a document by title", () => {
    const ids = flattenGroups(searchIndex(index, "Viper", "all").groups).map(
      (item) => item.id,
    );
    expect(ids).toContain("viper");
  });

  it("restricts results to the chosen kind", () => {
    const ids = flattenGroups(searchIndex(index, "a", "region").groups).map(
      (item) => item.kind,
    );
    expect(ids.every((kind) => kind === "region")).toBe(true);
  });

  it("returns no groups for a query that matches nothing", () => {
    const { groups, totals } = searchIndex(index, "zzzzqqqq", "all");
    expect(groups).toEqual([]);
    expect(totals).toEqual({ page: 0, region: 0, species: 0 });
  });
});

describe("resolveRecent", () => {
  it("maps recent refs to documents and drops stale ones", () => {
    expect(
      resolveRecent(index, [
        { id: "viper", kind: "species" },
        { id: "gone", kind: "species" },
        { id: "viper", kind: "page" },
      ]).map((item) => item.id),
    ).toEqual(["viper"]);
  });
});

describe("recent searches storage", () => {
  const store = new Map<string, string>();

  beforeEach(() => {
    store.clear();
    vi.stubGlobal("window", {
      localStorage: {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => void store.set(key, value),
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("is empty at first", () => {
    expect(readRecent()).toEqual([]);
  });

  it("puts the newest first, removes duplicates and keeps five", () => {
    for (const id of ["a", "b", "c", "d", "e", "f"]) {
      writeRecent({ id, kind: "species" });
    }
    writeRecent({ id: "c", kind: "species" });
    expect(readRecent().map((item) => item.id)).toEqual([
      "c",
      "f",
      "e",
      "d",
      "b",
    ]);
  });

  it("treats the same id under another kind as a different entry", () => {
    writeRecent({ id: "x", kind: "species" });
    writeRecent({ id: "x", kind: "page" });
    expect(readRecent()).toHaveLength(2);
  });

  it("ignores corrupt or malformed storage", () => {
    store.set("reptiles.search.recent", "not json");
    expect(readRecent()).toEqual([]);
    store.set("reptiles.search.recent", JSON.stringify({ not: "a list" }));
    expect(readRecent()).toEqual([]);
    store.set(
      "reptiles.search.recent",
      JSON.stringify([
        { id: "ok", kind: "page" },
        { id: 4, kind: "page" },
        null,
      ]),
    );
    expect(readRecent()).toEqual([{ id: "ok", kind: "page" }]);
  });

  it("returns nothing without a window", () => {
    vi.unstubAllGlobals();
    expect(readRecent()).toEqual([]);
  });
});
