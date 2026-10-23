import type { AtlasFacets } from "@/data/atlasFilters";
import type { AtlasCardItem, SpeciesListItem } from "@/data/speciesListItem";

import { getRegionsForSpecies } from "@/data/mapRegions";
import { type AppLocale } from "@/i18n/routing";
import { ATLAS_PAGE_SIZE } from "@/lib/atlasPages";
import { type AtlasQuery } from "@/lib/atlasQuery";
import {
  type CatalogCard,
  type CatalogMatchQuery,
  getCatalogMatches,
} from "@/lib/speciesCatalogApi";

export type AtlasPage = {
  facets: AtlasFacets;
  items: AtlasCardItem[];
  page: number;
  total: number;
};

export async function getAtlasPage(
  locale: AppLocale,
  query: AtlasQuery,
  limit = ATLAS_PAGE_SIZE,
): Promise<AtlasPage> {
  const { filters, page, sort } = query;
  const q = filters.query.trim();
  const matchQuery: CatalogMatchQuery = {
    limit,
    page,
    sort,
    ...(filters.danger !== "all" ? { danger: filters.danger } : {}),
    ...(filters.group !== "all" ? { group: filters.group } : {}),
    ...(filters.habitat !== "all" ? { habitat: filters.habitat } : {}),
    ...(filters.region !== "all" ? { region: filters.region } : {}),
    ...(q ? { q } : {}),
  };
  const { data, facets, total } = await getCatalogMatches(locale, matchQuery);
  return { facets, items: data.map(toAtlasCardItem), page, total };
}

export async function getAtlasRecentItems(
  locale: AppLocale,
  limit = 4,
): Promise<SpeciesListItem[]> {
  const { data } = await getCatalogMatches(locale, { limit, sort: "updated" });
  return data.map((item) => ({
    ...toAtlasCardItem(item),
    description: item.description,
    family: item.family,
    genus: item.genus,
    updatedAt: item.updatedAt,
  }));
}

export async function getAtlasVenomousSnakes(
  locale: AppLocale,
): Promise<AtlasCardItem[]> {
  const { data } = await getCatalogMatches(locale, {
    danger: "venomous",
    group: "snake",
    limit: 100,
  });
  return data.map(toAtlasCardItem);
}

function toAtlasCardItem(item: CatalogCard): AtlasCardItem {
  return {
    commonName: item.commonName,
    id: item.id,
    image: item.image,
    location: item.location,
    regionIds: getRegionsForSpecies(item.id).map((region) => region.id),
    scientificName: item.scientificName,
    ...(item.danger ? { danger: item.danger } : {}),
    ...(item.mobileImage ? { mobileImage: item.mobileImage } : {}),
  };
}
