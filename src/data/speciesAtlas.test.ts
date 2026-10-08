import { describe, expect, it } from "vitest";

import { getCatalogSpecies } from "@/data/species";
import {
  getAtlasStats,
  getCatalogByDanger,
  getCatalogSpeciesByGroup,
  getRecentlyUpdatedSpecies,
  getVenomousCatalogSpecies,
  isVenomousDanger,
} from "@/data/speciesAtlas";

const catalog = getCatalogSpecies();

describe("getAtlasStats", () => {
  const stats = getAtlasStats();

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

  it("matches the documented published group sizes", () => {
    expect(stats.snakes).toBe(getCatalogSpeciesByGroup("snake").length);
    expect(stats.turtles).toBe(getCatalogSpeciesByGroup("turtle").length);
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

  it("handles an empty catalog", () => {
    const empty = getAtlasStats([]);
    expect(empty.total).toBe(0);
    expect(empty.lastUpdated).toBeNull();
    expect(empty.venomous).toBe(0);
  });
});

describe("getCatalogByDanger", () => {
  const groups = getCatalogByDanger();

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
  it("returns only that group, sorted by scientific name", () => {
    const snakes = getCatalogSpeciesByGroup("snake");
    const names = snakes.map((item) => item.scientificName);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    expect(snakes.map((item) => item.id)).toContain("natrix-natrix");
    expect(snakes.map((item) => item.id)).not.toContain("pseudopus-apodus");
  });

  it("never returns the unpublished Dolichophis caspius", () => {
    expect(
      getCatalogSpeciesByGroup("snake").map((item) => item.id),
    ).not.toContain("dolichophis-caspius");
  });
});

describe("getRecentlyUpdatedSpecies", () => {
  it("returns the newest first and respects the limit", () => {
    const recent = getRecentlyUpdatedSpecies(5);
    expect(recent).toHaveLength(5);
    for (let index = 1; index < recent.length; index += 1) {
      expect(Date.parse(recent[index - 1].updatedAt)).toBeGreaterThanOrEqual(
        Date.parse(recent[index].updatedAt),
      );
    }
  });

  it("defaults to four", () => {
    expect(getRecentlyUpdatedSpecies()).toHaveLength(4);
  });
});

describe("getVenomousCatalogSpecies", () => {
  it("returns only venomous snakes", () => {
    const venomous = getVenomousCatalogSpecies();
    expect(venomous.length).toBeGreaterThan(0);
    for (const item of venomous) {
      expect(isVenomousDanger(item.danger), item.id).toBe(true);
    }
    expect(venomous.map((item) => item.id)).toContain("macrovipera-lebetina");
  });
});
