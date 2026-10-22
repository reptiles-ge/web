import { http, HttpResponse } from "msw";
import { beforeAll, describe, expect, it } from "vitest";

import type { DangerLevel } from "@/data/speciesTypes";

import { getCatalogSpecies } from "@/data/species";
import {
  getAtlasStats,
  getCatalogByDanger,
  getCatalogSpeciesByGroup,
  getRecentlyUpdatedSpecies,
  getVenomousCatalogSpecies,
  isVenomousDanger,
} from "@/data/speciesAtlas";
import { type CatalogCard, getSpeciesCatalog } from "@/lib/speciesCatalogApi";

import { server } from "../../tests/msw/server";

const catalog = getCatalogSpecies();

describe("getAtlasStats", () => {
  let stats: Awaited<ReturnType<typeof getAtlasStats>>;

  beforeAll(async () => {
    stats = await getAtlasStats("ka");
  });

  it("counts every published species exactly once across groups", () => {
    const groups =
      stats.snakes +
      stats.lizards +
      stats.turtles +
      stats.amphibians +
      stats.birds +
      stats.mammals +
      stats.spiders +
      stats.scorpions +
      stats.insects;
    expect(stats.total).toBe(catalog.length);
    expect(groups).toBe(stats.total);
  });

  it("matches the documented published group sizes", async () => {
    expect(stats.snakes).toBe(
      (await getCatalogSpeciesByGroup("snake", "en")).length,
    );
    expect(stats.turtles).toBe(
      (await getCatalogSpeciesByGroup("turtle", "en")).length,
    );
    expect(stats.regions).toBe(12);
  });

  it("counts venomous species and reports the latest update", () => {
    expect(stats.venomous).toBe(
      catalog.filter((item) => isVenomousDanger(item.danger)).length,
    );
    const latest = Math.max(
      ...catalog.map((item) => Date.parse(item.updatedAt)),
    );
    expect(Date.parse(stats.lastUpdated ?? "")).toBe(latest);
  });

  it("counts every gallery photo", () => {
    expect(stats.photos).toBe(
      catalog.reduce((sum, item) => sum + item.gallery.length, 0),
    );
  });

  it("handles an empty catalog", async () => {
    server.use(
      http.get("https://api.reptiles.ge/v1/catalog", () =>
        HttpResponse.json({ data: [] }),
      ),
    );
    const empty = await getAtlasStats("ka");
    expect(empty.total).toBe(0);
    expect(empty.lastUpdated).toBeNull();
    expect(empty.venomous).toBe(0);
  });
});

describe("getCatalogByDanger", () => {
  let groups: Record<DangerLevel, CatalogCard[]>;

  beforeAll(async () => {
    groups = getCatalogByDanger(await getSpeciesCatalog("en"));
  });

  it("puts each species with a danger level into exactly one bucket", () => {
    const withDanger = catalog.filter((item) => item.danger);
    const bucketed =
      groups.High.length + groups.Moderate.length + groups.Harmless.length;
    expect(bucketed).toBe(withDanger.length);
  });

  it("keeps the unrated species out of every bucket", () => {
    const ids = new Set(
      Object.values(groups)
        .flat()
        .map((item) => item.id),
    );
    for (const item of catalog.filter((entry) => !entry.danger)) {
      expect(ids.has(item.id), item.id).toBe(false);
    }
  });

  it("lists the giurza as high risk", () => {
    expect(groups.High.map((item) => item.id)).toContain(
      "macrovipera-lebetina",
    );
  });
});

describe("getCatalogSpeciesByGroup", () => {
  it("returns only that group, sorted by scientific name", async () => {
    const snakes = await getCatalogSpeciesByGroup("snake", "ka");
    const names = snakes.map((item) => item.scientificName);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    expect(snakes.map((item) => item.id)).toContain("natrix-natrix");
    expect(snakes.map((item) => item.id)).not.toContain("pseudopus-apodus");
  });

  it("never returns the unpublished Dolichophis caspius", async () => {
    expect(
      (await getCatalogSpeciesByGroup("snake", "ka")).map((item) => item.id),
    ).not.toContain("dolichophis-caspius");
  });
});

describe("getRecentlyUpdatedSpecies", () => {
  it("returns the newest first and respects the limit", async () => {
    const recent = await getRecentlyUpdatedSpecies("en", 5);
    expect(recent).toHaveLength(5);
    for (let index = 1; index < recent.length; index += 1) {
      expect(Date.parse(recent[index - 1].updatedAt)).toBeGreaterThanOrEqual(
        Date.parse(recent[index].updatedAt),
      );
    }
  });

  it("defaults to four", async () => {
    expect(await getRecentlyUpdatedSpecies("en")).toHaveLength(4);
  });
});

describe("getVenomousCatalogSpecies", () => {
  it("returns only venomous snakes", async () => {
    const venomous = await getVenomousCatalogSpecies("en");
    expect(venomous.length).toBeGreaterThan(0);
    for (const item of venomous) {
      expect(isVenomousDanger(item.danger), item.id).toBe(true);
    }
    expect(venomous.map((item) => item.id)).toContain("macrovipera-lebetina");
  });
});
