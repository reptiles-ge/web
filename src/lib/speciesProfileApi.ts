import { cache } from "react";

import type { AnimalGroup } from "@/data/speciesAtlasMeta";
import type { Species } from "@/data/speciesTypes";
import type { AppLocale } from "@/i18n/routing";

import { createApiClient } from "@/lib/apiClient";
import { speciesFetchOptions } from "@/lib/speciesApiFetch";
import { getSpeciesPublicSlug } from "@/lib/speciesSlugTable";

type SpeciesProfile = {
  group: AnimalGroup;
  species: Species;
  views: number;
};

export const getSpeciesProfile = cache(
  async (id: string, locale: AppLocale): Promise<null | SpeciesProfile> => {
    const response = await createApiClient().v1.species[":slug"].$get(
      {
        header: { "x-locale": locale },
        param: { slug: getSpeciesPublicSlug(id, locale) },
      },
      speciesFetchOptions(["species", `species:${id}`]),
    );
    if (!response.ok) {
      const status: number = response.status;
      if (status === 404) return null;
      throw new Error(`Species API answered ${status} for ${id}`);
    }
    const { data, views } = await response.json();
    const {
      group,
      habitats: _habitats,
      lookalikes: _lookalikes,
      slug: _slug,
      ...species
    } = data;
    return { group, species: species as Species, views };
  },
);
