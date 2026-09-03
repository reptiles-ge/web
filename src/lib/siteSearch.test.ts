import { describe, expect, it } from "vitest";

import { getSearchIndex } from "@/data/search-index.generated";
import { flattenGroups, searchIndex } from "@/lib/siteSearch";

describe("search scoring", () => {
  const index = getSearchIndex("ka");

  it("finds გიურზა by Georgian common name", () => {
    const { groups } = searchIndex(index, "გიურზა", "all");
    const hits = flattenGroups(groups).filter(
      (item) => item.kind === "species",
    );
    expect(hits.some((item) => item.id === "macrovipera-lebetina")).toBe(true);
  });

  it("finds the same taxon by scientific name", () => {
    const { groups } = searchIndex(index, "Macrovipera", "all");
    const hits = flattenGroups(groups).filter(
      (item) => item.kind === "species",
    );
    expect(hits.some((item) => item.id === "macrovipera-lebetina")).toBe(true);
  });

  it("finds the same taxon by Georgian alias latinization", () => {
    const { groups } = searchIndex(index, "giurza", "all");
    const hits = flattenGroups(groups).filter(
      (item) => item.kind === "species",
    );
    expect(hits.some((item) => item.id === "macrovipera-lebetina")).toBe(true);
  });
});
