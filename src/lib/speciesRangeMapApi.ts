import { cache } from "react";

import type { AppLocale } from "@/i18n/routing";

import { createApiClient } from "@/lib/apiClient";
import { speciesFetchOptions } from "@/lib/speciesApiFetch";
import { getSpeciesPublicSlug } from "@/lib/speciesSlugTable";

export const getSpeciesRangeMap = cache(
  async (id: string, locale: AppLocale) => {
    const response = await createApiClient().v1.species[":slug"][
      "range-map"
    ].$get(
      {
        header: { "x-locale": locale },
        param: { slug: getSpeciesPublicSlug(id, locale) },
      },
      speciesFetchOptions(["species", `species:${id}`]),
    );
    if (!response.ok) {
      const status: number = response.status;
      if (status === 404) return null;
      throw new Error(`Species API answered ${status} for ${id} range map`);
    }
    return (await response.json()).data;
  },
);
