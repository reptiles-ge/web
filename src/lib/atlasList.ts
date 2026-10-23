import type {
  AtlasIndexItem,
  AtlasPhoto,
  SpeciesListItem,
} from "@/data/speciesListItem";

import { atlasSpeciesImage } from "@/data/atlasFilters";
import { getRegionsForSpecies } from "@/data/regions";
import { getRecentlyUpdatedSpecies } from "@/data/speciesAtlas";
import { type AppLocale, routing } from "@/i18n/routing";
import {
  type CatalogCard,
  getSpeciesCatalog,
  getSpeciesCatalogPage,
} from "@/lib/speciesCatalogApi";

export const ATLAS_PHOTO_PAGE_SIZE = 24;

export type AtlasPhotoPage = {
  nextCursor: null | string;
  photos: Record<string, AtlasPhoto>;
};

export async function getAtlasListItems(
  locale: AppLocale,
): Promise<AtlasIndexItem[]> {
  const [catalog, searchTexts] = await Promise.all([
    getSpeciesCatalog(locale),
    atlasSearchTexts(),
  ]);
  return catalog.map((item) => ({
    commonName: item.commonName,
    hasPhoto: Boolean(atlasSpeciesImage(item)),
    id: item.id,
    location: item.location,
    regionIds: getRegionsForSpecies(item.id).map((region) => region.id),
    scientificName: item.scientificName,
    searchText: searchTexts.get(item.id) ?? "",
    ...(item.danger ? { danger: item.danger } : {}),
  }));
}

export async function getAtlasPhotoPage(
  locale: AppLocale,
  cursor?: string,
): Promise<AtlasPhotoPage> {
  const page = await getSpeciesCatalogPage(locale, {
    limit: ATLAS_PHOTO_PAGE_SIZE,
    ...(cursor ? { cursor } : {}),
  });
  const photos: Record<string, AtlasPhoto> = {};
  for (const item of page.data) {
    if (!atlasSpeciesImage(item)) continue;
    photos[item.id] = {
      image: item.image,
      ...(item.mobileImage ? { mobileImage: item.mobileImage } : {}),
    };
  }
  return { nextCursor: page.nextCursor, photos };
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
