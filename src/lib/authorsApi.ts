import { cache } from "react";

import type { ContributorProfile } from "@/data/authors";
import type { AppLocale } from "@/i18n/routing";

import { createApiClient } from "@/lib/apiClient";
import { contributorDirectory } from "@/lib/contributorCredits";
import { speciesFetchOptions } from "@/lib/speciesApiFetch";

const listContributorProfiles = cache(
  async (locale: AppLocale, limit?: number) => {
    const response = await createApiClient().v1.contributors.$get(
      {
        header: { "x-locale": locale },
        query: limit === undefined ? {} : { limit: String(limit) },
      },
      speciesFetchOptions(["authors"]),
    );
    if (!response.ok) {
      throw new Error(`Contributors API answered ${response.status}`);
    }
    const { data, total } = await response.json();
    return {
      contributors: data as Array<
        ContributorProfile & { speciesCount: number }
      >,
      total,
    };
  },
);

const listContributors = cache(async (locale: AppLocale) => {
  const response = await createApiClient().v1.authors.$get(
    { header: { "x-locale": locale }, query: { contributor: "true" } },
    speciesFetchOptions(["authors"]),
  );
  if (!response.ok) {
    throw new Error(`Authors API answered ${response.status}`);
  }
  return (await response.json()).data;
});

export const getContributor = cache(async (id: string, locale: AppLocale) => {
  const response = await createApiClient().v1.contributors[":id"].$get(
    { header: { "x-locale": locale }, param: { id } },
    speciesFetchOptions(["authors", `author:${id}`]),
  );
  const status: number = response.status;
  if (status === 404) return null;
  if (!response.ok) {
    throw new Error(`Contributors API answered ${status} for ${id}`);
  }
  return (await response.json()).data as ContributorProfile & {
    speciesCount: number;
  };
});

export const getContributors = cache(
  async (locale: AppLocale): Promise<ContributorProfile[]> =>
    (await listContributorProfiles(locale)).contributors,
);

export function getTopContributors(locale: AppLocale, limit: number) {
  return listContributorProfiles(locale, limit);
}

export const getContributorDirectory = cache(async (locale: AppLocale) => {
  const contributors = await listContributors(locale);
  return contributorDirectory(
    contributors.every(({ aliases }) => Array.isArray(aliases))
      ? contributors
      : await getContributors(locale),
  );
});
