import { cache } from "react";

import type {
  CatalogCard,
  CatalogFullSpecies,
} from "@/data/speciesCatalogTypes";
import type { AppLocale } from "@/i18n/routing";

import { createApiClient } from "@/lib/apiClient";
import { speciesFetchOptions } from "@/lib/speciesApiFetch";

export type { CatalogCard };

type CatalogEntries<View extends CatalogView> = View extends "full"
  ? CatalogFullSpecies[]
  : CatalogCard[];

type CatalogView = "card" | "full";

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
