import type {
  CatalogCard,
  CatalogFullSpecies,
} from "@/data/speciesCatalogTypes";
import type { AppLocale } from "@/i18n/routing";

import { getCatalogSpecies } from "@/data/species";
import { type AnimalGroup, speciesAtlasMeta } from "@/data/speciesAtlasMeta";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { getSpeciesLookalikes } from "@/lib/speciesLookalikes";
import { getSpeciesPublicSlug } from "@/lib/speciesSlugTable";

const fixtures = new Map<AppLocale, Array<CatalogCard & CatalogFullSpecies>>();

export function searchCatalogsFixture(): Record<
  AppLocale,
  Array<CatalogCard & CatalogFullSpecies>
> {
  return {
    en: speciesCatalogFixture("en"),
    ka: speciesCatalogFixture("ka"),
    ru: speciesCatalogFixture("ru"),
    tr: speciesCatalogFixture("tr"),
  };
}

export function speciesCatalogFixture(
  locale: AppLocale,
): Array<CatalogCard & CatalogFullSpecies> {
  let fixture = fixtures.get(locale);
  if (!fixture) {
    fixture = getCatalogSpecies().map((item) => ({
      ...localizeSpecies(item, locale),
      ...speciesAtlasMeta[item.id]!,
      lookalikes: getSpeciesLookalikes(item.id),
      photoCount: item.gallery.length,
      slug: getSpeciesPublicSlug(item.id, locale),
    }));
    fixtures.set(locale, fixture);
  }
  return fixture;
}

export function speciesGroupFixture(
  group: AnimalGroup,
  locale: AppLocale = "ka",
) {
  return speciesCatalogFixture(locale)
    .filter((item) => item.group === group)
    .sort((a, b) => a.scientificName.localeCompare(b.scientificName));
}
