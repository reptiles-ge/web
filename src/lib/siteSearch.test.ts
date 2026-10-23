import { describe, expect, it } from "vitest";

import { buildSearchIndex } from "@/lib/searchIndexBuild";
import { flattenGroups, searchIndex } from "@/lib/siteSearch";

import {
  searchCatalogsFixture,
  searchContributorsFixture,
} from "../../tests/fixtures/speciesCatalog";

const kaIndex = buildSearchIndex(
  "ka",
  searchCatalogsFixture(),
  searchContributorsFixture(),
);
const ruIndex = buildSearchIndex(
  "ru",
  searchCatalogsFixture(),
  searchContributorsFixture(),
);

describe("search scoring", () => {
  const index = kaIndex;

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

describe("search scoring (ru)", () => {
  const index = ruIndex;

  it("finds Macrovipera by Russian vernacular", () => {
    const { groups } = searchIndex(index, "гюрза", "all");
    const hits = flattenGroups(groups).filter(
      (item) => item.kind === "species",
    );
    expect(hits.some((item) => item.id === "macrovipera-lebetina")).toBe(true);
  });
});
