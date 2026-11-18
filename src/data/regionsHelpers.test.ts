import { beforeAll, describe, expect, it } from "vitest";

import { REGION_ATLAS_GROUPS } from "@/data/regionAtlasGroups";
import { getRegionContent } from "@/data/regionContent";
import {
  getCatalogRegionStats,
  getRegionAtlasEntries,
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
import { defined } from "../../tests/support/defined";

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

describe("getRegionAtlasEntries", () => {
  it.each(routing.locales)(
    "describes every region in map order (%s)",
    async (locale) => {
      const entries = await getRegionAtlasEntries(locale);

      expect(entries.map((entry) => entry.id)).toEqual(
        regions.map((region) => region.id),
      );
      for (const [index, entry] of entries.entries()) {
        const region = defined(regions[index]);
        expect(entry.name).toBe(region.name[locale] ?? region.name.en);
        expect(entry.biome).toBe(getRegionContent(region.id).biome[locale]);
        expect(entry.description).toBe(
          region.description[locale] ?? region.description.en,
        );
      }
    },
  );

  it("splits each region's species into the five compared groups", async () => {
    const entries = await getRegionAtlasEntries("ka");

    for (const [index, entry] of entries.entries()) {
      const species = getRegionSpecies(defined(regions[index]), catalog);
      expect(entry.groupCounts).toHaveLength(REGION_ATLAS_GROUPS.length);
      expect(entry.speciesCount, entry.id).toBe(species.length);
      expect(
        entry.groupCounts.reduce((sum, count) => sum + count, 0),
        entry.id,
      ).toBe(entry.speciesCount);
      expect(entry.venomousCount, entry.id).toBe(
        species.filter(
          (item) => item.danger === "High" || item.danger === "Moderate",
        ).length,
      );
    }
  });

  it("counts snakes, lizards with turtles, amphibians and birds apart", async () => {
    const kakheti = defined(
      (await getRegionAtlasEntries("ka")).find(
        (entry) => entry.id === "kakheti",
      ),
    );
    const [snakes, lizardsTurtles, amphibians, birds, other] =
      kakheti.groupCounts;

    for (const count of [snakes, lizardsTurtles, amphibians, birds, other]) {
      expect(count).toBeGreaterThan(0);
    }
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
    const region = {
      ...defined(regions[0]),
      speciesIds: ["no-such-species"],
    };
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
    expect(card).not.toHaveProperty("introduced");
  });

  it("marks only a species the checklist calls introduced", () => {
    expect(
      toRegionSpeciesCard({ ...grassSnake, checklistStatus: "introduced" })
        .introduced,
    ).toBe(true);
    expect(
      toRegionSpeciesCard({ ...grassSnake, checklistStatus: "confirmed" }),
    ).not.toHaveProperty("introduced");
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
