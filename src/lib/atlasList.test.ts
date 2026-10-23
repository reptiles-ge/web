import { describe, expect, it } from "vitest";

import { getRegionsForSpecies } from "@/data/regions";
import {
  ATLAS_PHOTO_PAGE_SIZE,
  getAtlasListItems,
  getAtlasPhotoPage,
  getAtlasRecentItems,
} from "@/lib/atlasList";

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

  it("sends only the fields the filters, search and cards use", async () => {
    const items = await getAtlasListItems("ka");
    for (const item of items) {
      expect(Object.keys(item).sort()).toEqual(
        expect.arrayContaining([
          "commonName",
          "hasPhoto",
          "id",
          "location",
          "regionIds",
          "scientificName",
          "searchText",
        ]),
      );
      for (const field of ["description", "family", "genus", "image"]) {
        expect(item).not.toHaveProperty(field);
      }
    }
    expect(items.some((item) => item.hasPhoto)).toBe(true);
  });

  it("pages photos through the catalog cursor until the end", async () => {
    const items = await getAtlasListItems("en");
    const seen = new Set<string>();
    let page = await getAtlasPhotoPage("en");
    let pages = 1;
    for (const id of Object.keys(page.photos)) seen.add(id);
    while (page.nextCursor) {
      page = await getAtlasPhotoPage("en", page.nextCursor);
      pages += 1;
      for (const id of Object.keys(page.photos)) seen.add(id);
    }
    expect(pages).toBe(Math.ceil(items.length / ATLAS_PHOTO_PAGE_SIZE));
    expect([...seen].sort()).toEqual(
      items
        .filter((item) => item.hasPhoto)
        .map((item) => item.id)
        .sort(),
    );
  });
});
