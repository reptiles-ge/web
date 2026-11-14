import { cache } from "react";

import type { AnimalGroup } from "@/data/speciesAtlasMeta";
import type { Species } from "@/data/speciesTypes";
import type { AppLocale } from "@/i18n/routing";

import { createApiClient, responseOk } from "@/lib/apiClient";
import { speciesFetchOptions } from "@/lib/speciesApiFetch";
import {
  getSpeciesSlugMaps,
  liveSpeciesPublicSlug,
} from "@/lib/speciesSlugRuntime";

type SpeciesProfile = {
  group: AnimalGroup;
  ranks: { class: null | string; order: null | string };
  species: Species;
  views: number;
};

export const getSpeciesProfile = cache(
  async (id: string, locale: AppLocale): Promise<null | SpeciesProfile> =>
    getSpeciesProfileBySlug(
      locale === "ka"
        ? liveSpeciesPublicSlug(await getSpeciesSlugMaps(), id, locale)
        : id,
      locale,
      id,
    ),
);

export const getSpeciesProfileBySlug = cache(
  async (
    slug: string,
    locale: AppLocale,
    id: string,
  ): Promise<null | SpeciesProfile> => {
    const response = await createApiClient().v1.species[":slug"].$get(
      {
        header: { "x-locale": locale },
        param: { slug },
      },
      speciesFetchOptions(["species", `species:${id}`]),
    );
    if (!responseOk(response)) {
      const status: number = response.status;
      if (status === 404) return null;
      throw new Error(`Species API answered ${status} for ${id}`);
    }
    const { data, views } = await response.json();
    const {
      checklistStatus: _checklistStatus,
      class: className,
      group,
      habitats: _habitats,
      lookalikes: _lookalikes,
      order,
      slug: _slug,
      ...species
    } = data;
    return {
      group,
      ranks: { class: className, order },
      species: species,
      views,
    };
  },
);
