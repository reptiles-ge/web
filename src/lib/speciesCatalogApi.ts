import { cache } from "react";

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

export class CatalogPageError extends Error {
  constructor(readonly status: number) {
    super(`Species catalog API answered ${status}`);
  }
}

export function getCreditPhotoCatalog() {
  return getSpeciesCatalog(routing.defaultLocale, "photos");
}

export async function getSpeciesCatalogPage(
  locale: AppLocale,
  { cursor, limit }: { cursor?: string; limit: number },
): Promise<{ data: CatalogCard[]; nextCursor: null | string }> {
  const response = await createApiClient().v1.catalog.$get(
    {
      header: { "x-locale": locale },
      query: {
        limit: String(limit),
        view: "card",
        ...(cursor ? { cursor } : {}),
      },
    },
    speciesFetchOptions(["species"]),
  );
  if (!response.ok) {
    throw new CatalogPageError(response.status);
  }
  const { data, nextCursor } = await response.json();
  return { data: data as CatalogCard[], nextCursor };
}
