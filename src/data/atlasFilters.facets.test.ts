import { describe, expect, it } from "vitest";

import type { AtlasIndexItem } from "@/data/speciesListItem";

import {
  countAtlasFacets,
  defaultAtlasFilters,
  filterAtlasSpecies,
  sortAtlasSpecies,
} from "@/data/atlasFilters";

function item(id: string, overrides: Partial<AtlasIndexItem> = {}) {
  return {
    commonName: id,
    hasPhoto: false,
    id,
    location: "",
    regionIds: [],
    scientificName: id,
    searchText: id,
    ...overrides,
  } as AtlasIndexItem;
}

const catalog = [
  item("macrovipera-lebetina", { danger: "High" }),
  item("natrix-natrix", {
    danger: "Harmless",
    regionIds: ["kakheti", "imereti"],
  }),
  item("testudo-graeca", { danger: "Harmless", regionIds: ["kakheti"] }),
  item("falco-peregrinus"),
];

function ids(filters: Partial<typeof defaultAtlasFilters>) {
  return filterAtlasSpecies(catalog, {
    ...defaultAtlasFilters,
    ...filters,
  }).map((entry) => entry.id);
}

describe("countAtlasFacets", () => {
  it("counts only non-default facets and ignores the query", () => {
    expect(countAtlasFacets(defaultAtlasFilters)).toBe(0);
    expect(countAtlasFacets({ ...defaultAtlasFilters, query: "x" })).toBe(0);
    expect(
      countAtlasFacets({
        danger: "venomous",
        group: "snake",
        habitat: "all",
        query: "",
        region: "kakheti",
      }),
    ).toBe(3);
  });
});

describe("filterAtlasSpecies", () => {
  it("returns everything for the default filters", () => {
    expect(ids({})).toHaveLength(catalog.length);
  });

  it("filters by group", () => {
    expect(ids({ group: "snake" })).toEqual([
      "macrovipera-lebetina",
      "natrix-natrix",
    ]);
    expect(ids({ group: "bird" })).toEqual(["falco-peregrinus"]);
  });

  it("filters venomous and harmless, excluding groups with no venom concept", () => {
    expect(ids({ danger: "venomous" })).toEqual(["macrovipera-lebetina"]);
    expect(ids({ danger: "harmless" })).toEqual([
      "natrix-natrix",
      "testudo-graeca",
    ]);
  });

  it("filters by habitat tag", () => {
    const withHabitat = ids({ habitat: "forest" });
    for (const id of withHabitat)
      expect(catalog.map((c) => c.id)).toContain(id);
    expect(withHabitat.length).toBeLessThan(catalog.length);
  });

  it("filters by region using the species range data", () => {
    expect(ids({ region: "kakheti" })).toEqual([
      "natrix-natrix",
      "testudo-graeca",
    ]);
    expect(ids({ region: "imereti" })).toEqual(["natrix-natrix"]);
    expect(ids({ region: "no-such-region" })).toEqual([]);
  });

  it("matches the query case-insensitively against searchText", () => {
    expect(ids({ query: "  NATRIX " })).toEqual(["natrix-natrix"]);
    expect(ids({ query: "zzz" })).toEqual([]);
  });

  it("combines filters with AND", () => {
    expect(ids({ danger: "venomous", group: "turtle" })).toEqual([]);
  });
});

describe("sortAtlasSpecies", () => {
  it("puts species with a photo first for the featured sort, keeping ties in order", () => {
    const withPhotos = [
      item("a"),
      item("b", { hasPhoto: true }),
      item("c"),
      item("d", { hasPhoto: true }),
    ];
    expect(
      sortAtlasSpecies(withPhotos, "featured", "en").map((entry) => entry.id),
    ).toEqual(["b", "d", "a", "c"]);
  });

  it("sorts by region count for the range sort, keeping ties in order", () => {
    expect(
      sortAtlasSpecies(catalog, "range", "en").map((entry) => entry.id),
    ).toEqual([
      "natrix-natrix",
      "testudo-graeca",
      "macrovipera-lebetina",
      "falco-peregrinus",
    ]);
  });
});
