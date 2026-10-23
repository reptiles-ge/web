import { beforeAll, describe, expect, it } from "vitest";

import { getRegionContent } from "@/data/regionContent";
import {
  getCatalogRegionStats,
  getRegionSpecies,
  getRegionTooltipPreviews,
  isRegionCardVenomous,
  regions,
  toRegionSpeciesCard,
} from "@/data/regions";
import { routing } from "@/i18n/routing";
import { type CatalogCard, getSpeciesCatalog } from "@/lib/speciesCatalogApi";

import {
  localizedFixture,
  speciesFixture,
} from "../../tests/fixtures/speciesCatalog";

let catalog: CatalogCard[];

beforeAll(async () => {
  catalog = await getSpeciesCatalog("ka");
});

describe("getCatalogRegionStats", () => {
  let stats: Awaited<ReturnType<typeof getCatalogRegionStats>>;

  beforeAll(async () => {
    stats = await getCatalogRegionStats("ka");
  });

  it("counts the 12 regions", () => {
    expect(stats.regionCount).toBe(12);
  });

  it("counts each species once even when it appears in many regions", () => {
    const unique = new Set(regions.flatMap((region) => region.speciesIds));
    expect(stats.speciesCount).toBe(unique.size);
    expect(stats.venomousCount).toBeLessThanOrEqual(stats.speciesCount);
  });
});

describe("getRegionSpecies", () => {
  it("resolves only species that exist", () => {
    for (const region of regions) {
      const resolved = getRegionSpecies(region, catalog);
      expect(resolved.length, region.id).toBeLessThanOrEqual(
        region.speciesIds.length,
      );
      for (const item of resolved) {
        expect(region.speciesIds).toContain(item.id);
      }
    }
  });

  it("skips ids that are not in the catalog", () => {
    const region = { ...regions[0], speciesIds: ["no-such-species"] };
    expect(getRegionSpecies(region, catalog)).toEqual([]);
  });
});

describe("getRegionTooltipPreviews", () => {
  it.each(routing.locales)(
    "has a capped preview per region (%s)",
    async (locale) => {
      const previews = await getRegionTooltipPreviews(locale);
      expect(Object.keys(previews).sort()).toEqual(
        regions.map((region) => region.id).sort(),
      );
      for (const list of Object.values(previews)) {
        expect(list.length).toBeLessThanOrEqual(3);
      }
    },
  );
});

describe("species cards", () => {
  const viper = speciesFixture("macrovipera-lebetina")!;
  const grassSnake = speciesFixture("natrix-natrix")!;

  it("flags High and Moderate cards as venomous", () => {
    expect(isRegionCardVenomous({ danger: "High" } as never)).toBe(true);
    expect(isRegionCardVenomous({ danger: "Moderate" } as never)).toBe(true);
    expect(isRegionCardVenomous({ danger: "Harmless" } as never)).toBe(false);
    expect(isRegionCardVenomous({} as never)).toBe(false);
  });

  it("builds a localized card with the danger level", () => {
    const card = toRegionSpeciesCard(localizedFixture(viper, "en"));
    expect(card.id).toBe(viper.id);
    expect(card.scientificName).toBe(viper.scientificName);
    expect(card.danger).toBe(viper.danger);
    expect(card.commonName).toBeTruthy();
  });

  it("omits danger and mobileImage when the species has none", () => {
    const card = toRegionSpeciesCard({
      ...grassSnake,
      danger: undefined,
      mobileImage: undefined,
    });
    expect(card).not.toHaveProperty("danger");
    expect(card).not.toHaveProperty("mobileImage");
  });
});

describe("region content", () => {
  it.each(regions.map((region) => region.id))(
    "%s spells the Levantine viper as its profile does",
    (id) => {
      expect(JSON.stringify(getRegionContent(id))).not.toMatch(
        /Macrovipera lebetina\b/,
      );
    },
  );
});
