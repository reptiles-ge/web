import type { SpeciesListItem } from "@/data/speciesListItem";

import { getRegionsForSpecies } from "@/data/regions";
import { getRecentlyUpdatedSpecies } from "@/data/speciesAtlas";
import { type AppLocale, routing } from "@/i18n/routing";
import { type CatalogCard, getSpeciesCatalog } from "@/lib/speciesCatalogApi";

export async function getAtlasListItems(
  locale: AppLocale,
): Promise<SpeciesListItem[]> {
  const [catalog, searchTexts] = await Promise.all([
    getSpeciesCatalog(locale),
    atlasSearchTexts(),
  ]);
  return catalog.map((item) => toAtlasListItem(item, searchTexts));
}

export async function getAtlasRecentItems(
  locale: AppLocale,
  limit = 4,
): Promise<SpeciesListItem[]> {
  const [recent, searchTexts] = await Promise.all([
    getRecentlyUpdatedSpecies(locale, limit),
    atlasSearchTexts(),
  ]);
  return recent.map((item) => toAtlasListItem(item, searchTexts));
}

async function atlasSearchTexts() {
  const catalogs = await Promise.all(
    routing.locales.map((locale) => getSpeciesCatalog(locale)),
  );
  const parts = new Map<string, string[]>();
  for (const catalog of catalogs) {
    for (const item of catalog) {
      const entry = parts.get(item.id) ?? [
        item.scientificName,
        item.genus,
        item.family,
      ];
      entry.push(item.commonName, item.location);
      parts.set(item.id, entry);
    }
  }
  return new Map(
    [...parts].map(([id, entry]) => [id, entry.join(" ").toLowerCase()]),
  );
}

function toAtlasListItem(
  item: CatalogCard,
  searchTexts: Map<string, string>,
): SpeciesListItem {
  return {
    commonName: item.commonName,
    description: item.description,
    family: item.family,
    genus: item.genus,
    id: item.id,
    image: item.image,
    location: item.location,
    regionIds: getRegionsForSpecies(item.id).map((region) => region.id),
    scientificName: item.scientificName,
    searchText: searchTexts.get(item.id) ?? "",
    updatedAt: item.updatedAt,
    ...(item.danger ? { danger: item.danger } : {}),
    ...(item.mobileImage ? { mobileImage: item.mobileImage } : {}),
  };
}
