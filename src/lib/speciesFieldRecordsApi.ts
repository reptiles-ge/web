import { cache } from "react";

import type { SpeciesFieldRecord } from "@/data/speciesTypes";

import { createApiClient } from "@/lib/apiClient";
import { speciesFetchOptions } from "@/lib/speciesApiFetch";

export const getSpeciesFieldRecords = cache(
  async (id: string): Promise<SpeciesFieldRecord[]> => {
    const response = await createApiClient().v1.species[":slug"][
      "field-records"
    ].$get(
      { header: { "x-locale": "en" }, param: { slug: id } },
      speciesFetchOptions(["species", `species:${id}`]),
    );
    if (!response.ok) {
      const status: number = response.status;
      if (status === 404) return [];
      throw new Error(`Species API answered ${status} for ${id} field records`);
    }
    const { data } = await response.json();
    return data;
  },
);
