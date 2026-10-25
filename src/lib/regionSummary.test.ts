import { createTranslator } from "next-intl";
import { beforeAll, describe, expect, it, vi } from "vitest";

import type { AppLocale } from "@/i18n/routing";

import { regions } from "@/data/regions";
import { getSpeciesAtlasMeta, isVenomousDanger } from "@/data/speciesAtlasMeta";
import { getRegionSummary, regionSummaryFacts } from "@/lib/regionSummary";
import { type CatalogCard, getSpeciesCatalog } from "@/lib/speciesCatalogApi";

import en from "../../messages/en.json";
import ka from "../../messages/ka.json";
import ru from "../../messages/ru.json";
import tr from "../../messages/tr.json";
import { speciesFixture } from "../../tests/fixtures/speciesCatalog";

const MESSAGES = { en, ka, ru, tr } as const;
const LOCALES = ["ka", "en", "ru", "tr"] as const satisfies AppLocale[];

vi.mock("next-intl/server", () => ({
  getTranslations: async ({
    locale,
    namespace,
  }: {
    locale: AppLocale;
    namespace: string;
  }) =>
    createTranslator({
      locale,
      messages: MESSAGES[locale] as typeof en,
      namespace: namespace as "regions.summary",
    }),
}));

let catalog: CatalogCard[];

beforeAll(async () => {
  catalog = await getSpeciesCatalog("ka");
});

function wordCount(paragraphs: string[]) {
  return paragraphs.join(" ").trim().split(/\s+/).length;
}

describe("region summary facts", () => {
  it.each(regions.map((region) => [region.id, region] as const))(
    "%s counts match the region speciesIds",
    (_, region) => {
      const facts = regionSummaryFacts(region, catalog);
      expect(facts.total).toBe(region.speciesIds.length);
      expect(facts.groups.reduce((sum, item) => sum + item.count, 0)).toBe(
        region.speciesIds.length,
      );
      for (const { count, group } of facts.groups) {
        expect(count, group).toBe(
          region.speciesIds.filter(
            (id) => getSpeciesAtlasMeta(id).group === group,
          ).length,
        );
      }
      expect(facts.venomous.map((item) => item.id)).toEqual(
        region.speciesIds.filter((id) =>
          isVenomousDanger(speciesFixture(id)?.danger),
        ),
      );
    },
  );
});

describe("region summary copy", () => {
  it.each(
    regions.flatMap((region) =>
      LOCALES.map((locale) => [region.id, locale, region] as const),
    ),
  )(
    "%s %s is 120–170 words built from the region data",
    async (_, locale, region) => {
      const summary = await getRegionSummary(region, locale);
      const text = summary.join(" ");
      const words = wordCount(summary);
      expect(words).toBeGreaterThanOrEqual(120);
      expect(words).toBeLessThanOrEqual(170);
      expect(text).not.toMatch(/\{|\}/);
      if (locale !== "en") expect(text).not.toMatch(/\band\b/);
      expect(text).toContain(String(region.speciesIds.length));
      for (const item of regionSummaryFacts(region, catalog).venomous) {
        expect(text).toContain(item.scientificName);
      }
    },
  );

  it("names no venomous species the region does not list", async () => {
    for (const region of regions) {
      const listed = new Set(region.speciesIds);
      const text = (await getRegionSummary(region, "en")).join(" ");
      for (const other of regions) {
        for (const id of other.speciesIds) {
          const item = speciesFixture(id);
          if (!item || listed.has(id) || !isVenomousDanger(item.danger)) {
            continue;
          }
          expect(text, `${region.id} ${id}`).not.toContain(item.scientificName);
        }
      }
    }
  });
});
