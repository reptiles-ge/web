import { describe, expect, it } from "vitest";

import { getCatalogSpecies } from "@/data/species";
import { routing } from "@/i18n/routing";
import { buildSearchIndex } from "@/lib/searchIndexBuild";

describe.each(routing.locales)("buildSearchIndex(%s)", (locale) => {
  const index = buildSearchIndex(locale);

  it("is not empty and every document has the basics", () => {
    expect(index.length).toBeGreaterThan(0);
    for (const doc of index) {
      expect(doc.id, doc.key).toBeTruthy();
      expect(doc.title, doc.key).toBeTruthy();
      expect(doc.href, doc.key).toBeTruthy();
      expect(doc.searchText, doc.key).toBeTruthy();
      expect(["page", "region", "species"]).toContain(doc.kind);
    }
  });

  it("has a unique key per document", () => {
    const keys = index.map((doc) => doc.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("has exactly one species document per published species", () => {
    const species = index.filter((doc) => doc.kind === "species");
    expect(species.map((doc) => doc.id).sort()).toEqual(
      getCatalogSpecies()
        .map((item) => item.id)
        .sort(),
    );
  });

  it("has one document for each of the 12 regions", () => {
    expect(index.filter((doc) => doc.kind === "region")).toHaveLength(12);
  });

  it("does not index the unpublished Dolichophis caspius", () => {
    expect(index.some((doc) => doc.id === "dolichophis-caspius")).toBe(false);
  });

  it("indexes the venomous viper under its scientific name", () => {
    const viper = index.find((doc) => doc.id === "macrovipera-lebetina");
    expect(viper?.kind).toBe("species");
    expect(viper?.searchText.toLowerCase()).toContain("macrovipera");
  });

  it("includes suggested pages for the empty-query state", () => {
    expect(index.some((doc) => doc.suggested)).toBe(true);
  });
});

describe("buildSearchIndex across locales", () => {
  it("indexes the same set of documents in every locale", () => {
    const keysPerLocale = routing.locales.map((locale) =>
      buildSearchIndex(locale)
        .map((doc) => doc.key)
        .sort(),
    );
    for (const keys of keysPerLocale) {
      expect(keys).toEqual(keysPerLocale[0]);
    }
  });
});
