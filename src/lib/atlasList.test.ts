import { afterEach, describe, expect, it } from "vitest";

import { defaultAtlasFilters } from "@/data/atlasFilters";
import { getRegionsForSpecies } from "@/data/mapRegions";
import { getSpeciesAtlasMeta, isVenomousDanger } from "@/data/speciesAtlasMeta";
import {
  getAtlasPage,
  getAtlasRecentItems,
  getAtlasVenomousSnakes,
} from "@/lib/atlasList";
import { ATLAS_PAGE_SIZE } from "@/lib/atlasPages";
import { defaultAtlasQuery } from "@/lib/atlasQuery";

import { catalogSpeciesFixture } from "../../tests/fixtures/speciesCatalog";
import { recordRequests } from "../../tests/msw/server";

let recording: ReturnType<typeof recordRequests> | undefined;

afterEach(() => {
  recording?.stop();
  recording = undefined;
});

describe("atlas list", () => {
  it("loads one page of cards with the counts of every match", async () => {
    recording = recordRequests();
    const page = await getAtlasPage("ka", defaultAtlasQuery);
    expect(page.items).toHaveLength(ATLAS_PAGE_SIZE);
    expect(page.total).toBe(catalogSpeciesFixture().length);
    expect(page.facets.group.all).toBe(page.total);
    expect(page.items.some((item) => item.id === "dolichophis-caspius")).toBe(
      false,
    );
    for (const url of recording.urls) {
      expect(new URL(url).searchParams.get("limit")).toBe(
        String(ATLAS_PAGE_SIZE),
      );
    }
  });

  it("sends only the fields the cards use, with region ids", async () => {
    const { items } = await getAtlasPage("en", defaultAtlasQuery);
    for (const item of items) {
      expect(item.regionIds).toEqual(
        getRegionsForSpecies(item.id).map((region) => region.id),
      );
      for (const field of ["description", "family", "genus", "searchText"]) {
        expect(item).not.toHaveProperty(field);
      }
    }
    expect(items.some((item) => item.image)).toBe(true);
  });

  it("filters, searches and pages on the API", async () => {
    const snakes = await getAtlasPage("en", {
      ...defaultAtlasQuery,
      filters: { ...defaultAtlasFilters, danger: "venomous", group: "snake" },
    });
    expect(snakes.total).toBe(snakes.items.length);
    for (const item of snakes.items) {
      expect(getSpeciesAtlasMeta(item.id).group).toBe("snake");
      expect(isVenomousDanger(item.danger)).toBe(true);
    }
    const found = await getAtlasPage("en", {
      ...defaultAtlasQuery,
      filters: { ...defaultAtlasFilters, query: " გიურზა " },
    });
    expect(found.items.map((item) => item.id)).toEqual([
      "macrovipera-lebetina",
    ]);
    const first = await getAtlasPage("en", defaultAtlasQuery);
    const second = await getAtlasPage("en", { ...defaultAtlasQuery, page: 2 });
    expect(second.page).toBe(2);
    expect(second.total).toBe(first.total);
    const firstIds = new Set(first.items.map((item) => item.id));
    expect(second.items.some((item) => firstIds.has(item.id))).toBe(false);
  });

  it("lists the most recently updated species first", async () => {
    const recent = await getAtlasRecentItems("en", 3);
    expect(recent).toHaveLength(3);
    const times = recent.map((item) => Date.parse(item.updatedAt));
    expect(times).toEqual([...times].sort((a, b) => b - a));
    expect(recent[0]!.description.length).toBeGreaterThan(0);
  });

  it("lists venomous snakes for the SEO block", async () => {
    const snakes = await getAtlasVenomousSnakes("ka");
    expect(snakes.length).toBeGreaterThan(0);
    for (const item of snakes) {
      expect(getSpeciesAtlasMeta(item.id).group).toBe("snake");
      expect(isVenomousDanger(item.danger)).toBe(true);
    }
  });
});
