import { describe, expect, it } from "vitest";

import type { SpeciesListItem } from "@/data/speciesListItem";

import {
  countAtlasFacets,
  defaultAtlasFilters,
  filterAtlasSpecies,
} from "@/data/atlasFilters";

function item(id: string, overrides: Partial<SpeciesListItem> = {}) {
  return {
    commonName: id,
    description: "",
    family: "",
    genus: "",
    id,
    image: "",
    location: "",
    scientificName: id,
    searchText: id,
    updatedAt: "2026-01-01",
    ...overrides,
  } as SpeciesListItem;
}

const catalog = [
  item("macrovipera-lebetina", { danger: "High" }),
  item("natrix-natrix", { danger: "Harmless" }),
  item("testudo-graeca", { danger: "Harmless" }),
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
