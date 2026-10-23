import { describe, expect, it } from "vitest";

import {
  atlasFacetCount,
  type AtlasFacets,
  countAtlasFacets,
  defaultAtlasFilters,
} from "@/data/atlasFilters";

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

describe("atlasFacetCount", () => {
  const facets = {
    danger: { all: 145, harmless: 68, venomous: 11 },
    group: { all: 145, snake: 22 },
    habitat: { all: 145, forest: 83 },
    region: { all: 145, kakheti: 72 },
  } as unknown as AtlasFacets;

  it("reads the API count for a filter value", () => {
    expect(atlasFacetCount(facets, "group", "snake")).toBe(22);
    expect(atlasFacetCount(facets, "region", "all")).toBe(145);
    expect(atlasFacetCount(facets, "danger", "venomous")).toBe(11);
  });

  it("counts a value the API did not list as zero", () => {
    expect(atlasFacetCount(facets, "region", "paris")).toBe(0);
  });
});
