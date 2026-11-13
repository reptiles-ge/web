import { cache } from "react";

import type { AppLocale } from "@/i18n/routing";

import { createApiClient, responseOk } from "@/lib/apiClient";
import { speciesFetchOptions } from "@/lib/speciesApiFetch";
import {
  getSpeciesSlugMaps,
  liveSpeciesPublicSlug,
} from "@/lib/speciesSlugRuntime";

export const getSpeciesRangeMap = cache(
  async (id: string, locale: AppLocale) => {
    const slug =
      locale === "ka"
        ? liveSpeciesPublicSlug(await getSpeciesSlugMaps(), id, locale)
        : id;
    const response = await createApiClient().v1.species[":slug"][
      "range-map"
    ].$get(
      {
        header: { "x-locale": locale },
        param: { slug },
      },
      speciesFetchOptions(["species", `species:${id}`]),
    );
    if (!responseOk(response)) {
      const status: number = response.status;
      if (status === 404) return null;
      throw new Error(`Species API answered ${status} for ${id} range map`);
    }
    return (await response.json()).data;
  },
);
