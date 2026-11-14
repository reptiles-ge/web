import { cache } from "react";

import type { SpeciesFieldRecord } from "@/data/speciesTypes";

import { createApiClient, responseOk } from "@/lib/apiClient";
import { serverEnv } from "@/lib/env";
import { speciesFetchOptions } from "@/lib/speciesApiFetch";

type FieldRecordsOptions = Parameters<
  ReturnType<
    typeof createApiClient
  >["v1"]["species"][":slug"]["field-records"]["$get"]
>[1];

function fetchSpeciesFieldRecords(
  api: ReturnType<typeof createApiClient>,
  id: string,
  options: FieldRecordsOptions,
) {
  const request = {
    header: { "x-locale": "en" as const },
    param: { slug: id },
  };
  return serverEnv().SITE_API_KEY
    ? api.v1.site.species[":slug"]["field-records"].$get(request, options)
    : api.v1.species[":slug"]["field-records"].$get(request, options);
}

export const getSpeciesFieldRecords = cache(
  async (id: string): Promise<SpeciesFieldRecord[]> => {
    const response = await fetchSpeciesFieldRecords(
      createApiClient(),
      id,
      speciesFetchOptions(["species", `species:${id}`]),
    );
    if (!responseOk(response)) {
      const status: number = response.status;
      if (status === 404) return [];
      throw new Error(`Species API answered ${status} for ${id} field records`);
    }
    const { data } = await response.json();
    return data;
  },
);
