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

const VENOMOUS_SNAKE_LIMIT = 20;

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

export type CatalogCounts = {
  groups: Record<AnimalGroup, number>;
  lastUpdated: null | string;
  photos: number;
  total: number;
  venomous: number;
};

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

export const getSpeciesCatalogCounts = cache(
  async (locale: AppLocale): Promise<CatalogCounts> => {
    const response = await createApiClient().v1.catalog.$get(
      { header: { "x-locale": locale }, query: { limit: "1", view: "card" } },
      speciesFetchOptions(["species"]),
    );
    if (!response.ok) {
      throw new Error(`Species catalog API answered ${response.status}`);
    }
    const { facets, stats, total } = await response.json();
    return {
      groups: facets.group as Record<AnimalGroup, number>,
      total,
      ...stats,
    };
  },
);

export const getVenomousSnakeCards = cache(
  async (locale: AppLocale): Promise<CatalogCard[]> => {
    const response = await createApiClient().v1.catalog.$get(
      {
        header: { "x-locale": locale },
        query: {
          danger: "venomous",
          group: "snake",
          limit: String(VENOMOUS_SNAKE_LIMIT),
          view: "card",
        },
      },
      speciesFetchOptions(["species"]),
    );
    if (!response.ok) {
      throw new Error(`Species catalog API answered ${response.status}`);
    }
    return (await response.json()).data as CatalogCard[];
  },
);

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
