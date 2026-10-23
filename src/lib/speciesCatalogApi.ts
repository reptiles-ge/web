import { cache } from "react";

import type { AtlasFacets } from "@/data/atlasFilters";
import type { AnimalGroup, HabitatTag } from "@/data/speciesAtlasMeta";
import type {
  CatalogCard,
  CatalogFullSpecies,
  CatalogPhotoSpecies,
  CatalogQuizSpecies,
} from "@/data/speciesCatalogTypes";

import { type AppLocale, routing } from "@/i18n/routing";
import { createApiClient } from "@/lib/apiClient";
import { speciesFetchOptions } from "@/lib/speciesApiFetch";

export type { CatalogCard };

type CatalogEntries<View extends CatalogView> = View extends "full"
  ? CatalogFullSpecies[]
  : View extends "quiz"
    ? CatalogQuizSpecies[]
    : View extends "photos"
      ? CatalogPhotoSpecies[]
      : CatalogCard[];

type CatalogView = "card" | "full" | "photos" | "quiz";

export const getSpeciesCatalog = cache(
  async <View extends CatalogView = "card">(
    locale: AppLocale,
    view: View = "card" as View,
  ): Promise<CatalogEntries<View>> => {
    const response = await createApiClient().v1.catalog.$get(
      { header: { "x-locale": locale }, query: { view } },
      speciesFetchOptions(["species"]),
    );
    if (!response.ok) {
      throw new Error(`Species catalog API answered ${response.status}`);
    }
    return (await response.json()).data as CatalogEntries<View>;
  },
);

export type CatalogMatches = {
  data: CatalogCard[];
  facets: AtlasFacets;
  stats: { lastUpdated: null | string; photos: number; venomous: number };
  total: number;
};

export type CatalogMatchQuery = {
  danger?: "harmless" | "venomous";
  group?: AnimalGroup;
  habitat?: HabitatTag;
  limit: number;
  page?: number;
  q?: string;
  region?: string;
  sort?: "az" | "catalog" | "featured" | "range" | "updated";
};

export class CatalogQueryError extends Error {
  constructor(readonly status: number) {
    super(`Species catalog API answered ${status}`);
  }
}

export function getCatalogMatches(
  locale: AppLocale,
  query: CatalogMatchQuery,
): Promise<CatalogMatches> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) params.set(key, String(value));
  }
  params.sort();
  return getCatalogMatchesBySearch(locale, params.toString());
}

export function getCreditPhotoCatalog() {
  return getSpeciesCatalog(routing.defaultLocale, "photos");
}

const getCatalogMatchesBySearch = cache(
  async (locale: AppLocale, search: string): Promise<CatalogMatches> => {
    const query = Object.fromEntries(
      new URLSearchParams(search),
    ) as unknown as {
      [K in keyof CatalogMatchQuery]: K extends "limit" | "page"
        ? string
        : CatalogMatchQuery[K];
    };
    const response = await createApiClient().v1.catalog.$get(
      { header: { "x-locale": locale }, query: { ...query, view: "card" } },
      speciesFetchOptions(["species"]),
    );
    if (!response.ok) {
      throw new CatalogQueryError(response.status);
    }
    const { data, facets, stats, total } = await response.json();
    return {
      data: data as CatalogCard[],
      facets: facets as AtlasFacets,
      stats,
      total,
    };
  },
);
