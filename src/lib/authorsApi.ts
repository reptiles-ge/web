import { cache } from "react";

import type { ContributorProfile } from "@/data/authors";
import type { AppLocale } from "@/i18n/routing";

import { createApiClient } from "@/lib/apiClient";
import { contributorDirectory } from "@/lib/contributorCredits";
import { speciesFetchOptions } from "@/lib/speciesApiFetch";

export const getContributors = cache(async (locale: AppLocale) => {
  const response = await createApiClient().v1.contributors.$get(
    { header: { "x-locale": locale }, query: {} },
    speciesFetchOptions(["authors"]),
  );
  if (!response.ok) {
    throw new Error(`Contributors API answered ${response.status}`);
  }
  return (await response.json()).data as Array<
    ContributorProfile & { speciesCount: number }
  >;
});

export const getContributor = cache(async (id: string, locale: AppLocale) => {
  const response = await createApiClient().v1.contributors[":id"].$get(
    { header: { "x-locale": locale }, param: { id } },
    speciesFetchOptions(["authors", `author:${id}`]),
  );
  const status: number = response.status;
  if (status === 400 || status === 404) return null;
  if (!response.ok) {
    throw new Error(`Contributors API answered ${status} for ${id}`);
  }
  return (await response.json()).data as ContributorProfile & {
    speciesCount: number;
  };
});

export const getContributorDirectory = cache(async (locale: AppLocale) =>
  contributorDirectory(await getContributors(locale)),
);
