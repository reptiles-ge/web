import { cache } from "react";

import type { AuthorProfile, ContributorProfile } from "@/data/authors";
import type { AppLocale } from "@/i18n/routing";

import { createApiClient } from "@/lib/apiClient";
import { contributorDirectory } from "@/lib/contributorCredits";
import { speciesFetchOptions } from "@/lib/speciesApiFetch";

const getAuthorProfile = cache(
  async (id: string, locale: AppLocale): Promise<AuthorProfile> => {
    const response = await createApiClient().v1.authors[":id"].$get(
      { header: { "x-locale": locale }, param: { id } },
      speciesFetchOptions(["authors", `author:${id}`]),
    );
    if (!response.ok) {
      throw new Error(`Authors API answered ${response.status} for ${id}`);
    }
    return (await response.json()).data as AuthorProfile;
  },
);

export const getContributors = cache(
  async (locale: AppLocale): Promise<ContributorProfile[]> => {
    const response = await createApiClient().v1.authors.$get(
      { header: { "x-locale": locale }, query: { contributor: "true" } },
      speciesFetchOptions(["authors"]),
    );
    if (!response.ok) {
      throw new Error(`Authors API answered ${response.status}`);
    }
    const { data } = await response.json();
    return (await Promise.all(
      data.map(({ id }) => getAuthorProfile(id, locale)),
    )) as ContributorProfile[];
  },
);

export const getContributorDirectory = cache(async (locale: AppLocale) =>
  contributorDirectory(await getContributors(locale)),
);
