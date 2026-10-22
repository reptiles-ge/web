import type { AppLocale } from "@/i18n/routing";
import type { CatalogCard } from "@/lib/speciesCatalogApi";

import { getCatalogSpecies } from "@/data/species";
import { type AnimalGroup, speciesAtlasMeta } from "@/data/speciesAtlasMeta";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { getSpeciesLookalikes } from "@/lib/speciesLookalikes";
import { getSpeciesPublicSlug } from "@/lib/speciesSlugTable";

export function speciesCatalogFixture(locale: AppLocale): CatalogCard[] {
  return getCatalogSpecies().map((item) => ({
    ...localizeSpecies(item, locale),
    ...speciesAtlasMeta[item.id]!,
    lookalikes: getSpeciesLookalikes(item.id),
    photoCount: item.gallery.length,
    slug: getSpeciesPublicSlug(item.id, locale),
  }));
}

export function speciesGroupFixture(
  group: AnimalGroup,
  locale: AppLocale = "ka",
) {
  return speciesCatalogFixture(locale)
    .filter((item) => item.group === group)
    .sort((a, b) => a.scientificName.localeCompare(b.scientificName));
}
