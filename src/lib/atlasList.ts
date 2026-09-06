import type { SpeciesListItem } from "@/data/speciesListItem";
import type { Species } from "@/data/speciesTypes";

import { getCatalogSpecies } from "@/data/species";
import { getRecentlyUpdatedSpecies } from "@/data/speciesAtlas";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { type AppLocale, routing } from "@/i18n/routing";

export function getAtlasListItems(locale: AppLocale): SpeciesListItem[] {
  return getCatalogSpecies().map((item) => toAtlasListItem(item, locale));
}

export function getAtlasRecentItems(
  locale: AppLocale,
  limit = 4,
): SpeciesListItem[] {
  return getRecentlyUpdatedSpecies(limit).map((item) =>
    toAtlasListItem(item, locale),
  );
}

function atlasSearchText(item: Species) {
  const parts: string[] = [item.scientificName, item.genus, item.family];
  for (const locale of routing.locales) {
    const localized = localizeSpecies(item, locale);
    parts.push(localized.commonName, localized.location);
  }
  return parts.join(" ").toLowerCase();
}

function toAtlasListItem(item: Species, locale: AppLocale): SpeciesListItem {
  const localized = localizeSpecies(item, locale);
  return {
    commonName: localized.commonName,
    description: localized.description,
    family: item.family,
    genus: item.genus,
    id: item.id,
    image: item.image,
    location: localized.location,
    scientificName: item.scientificName,
    searchText: atlasSearchText(item),
    updatedAt: item.updatedAt,
    ...(item.danger ? { danger: item.danger } : {}),
    ...(item.mobileImage ? { mobileImage: item.mobileImage } : {}),
  };
}
