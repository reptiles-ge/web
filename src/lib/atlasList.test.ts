import { describe, expect, it } from "vitest";

import { getRegionsForSpecies } from "@/data/regions";
import { getAtlasListItems, getAtlasRecentItems } from "@/lib/atlasList";

import {
  localizedFixture,
  speciesFixture,
} from "../../tests/fixtures/speciesCatalog";

describe("atlas list", () => {
  it("keeps published taxa and omits unpublished ones", async () => {
    const items = await getAtlasListItems("ka");
    expect(items.some((item) => item.id === "macrovipera-lebetina")).toBe(true);
    expect(items.some((item) => item.id === "dolichophis-caspius")).toBe(false);
  });

  it("indexes names across locales without shipping full essays", async () => {
    const giurza = speciesFixture("macrovipera-lebetina");
    expect(giurza).toBeDefined();
    const item = (await getAtlasListItems("ka")).find(
      (entry) => entry.id === "macrovipera-lebetina",
    );
    expect(item).toBeDefined();
    const en = localizedFixture(giurza!, "en");
    expect(giurza!.overview.length).toBeGreaterThan(40);
    expect(item!.searchText).toContain(en.commonName.toLowerCase());
    expect(item!.searchText).not.toContain(giurza!.overview.toLowerCase());
  });

  it("carries region membership as ids for the client filters", async () => {
    for (const item of await getAtlasListItems("en")) {
      expect(item.regionIds).toEqual(
        getRegionsForSpecies(item.id).map((region) => region.id),
      );
    }
    const giurza = (await getAtlasListItems("ka")).find(
      (entry) => entry.id === "macrovipera-lebetina",
    );
    expect(giurza!.regionIds.length).toBeGreaterThan(0);
  });

  it("lists the most recently updated species first", async () => {
    const recent = await getAtlasRecentItems("en", 3);
    expect(recent).toHaveLength(3);
    expect(recent[0]!.searchText).toContain(
      recent[0]!.scientificName.toLowerCase(),
    );
  });
});
