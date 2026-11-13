import { cache } from "react";

import type { CatalogCard } from "@/data/speciesCatalogTypes";

import { getPathname } from "@/i18n/navigation";
import { type AppLocale, routing } from "@/i18n/routing";
import { createApiClient, responseOk } from "@/lib/apiClient";
import {
  ANIMAL_GROUP_TO_HUB,
  type GroupHubId,
  RESERVED_HUB_SLUGS,
} from "@/lib/groupHubs";
import { type LocaleSpeciesHref, speciesHrefForHub } from "@/lib/localeSwitch";
import { absoluteUrl } from "@/lib/site";
import { getSpeciesCatalog } from "@/lib/speciesCatalogApi";
import {
  buildPublishedSlugMaps,
  type SpeciesSlugMaps,
} from "@/lib/speciesSlugRules";
import { getSpeciesHubId } from "@/lib/speciesSlugTable";

type FreshFetchOptions = {
  headers: Record<string, string>;
  init: { cache: "no-store" };
};

export function speciesSlugMapsFromCatalog(
  catalog: readonly CatalogCard[],
): SpeciesSlugMaps {
  return buildPublishedSlugMaps(
    catalog.map((item) => ({
      hub: ANIMAL_GROUP_TO_HUB[item.group],
      id: item.id,
      slug: item.slug,
      slugAliases: item.slugAliases,
    })),
  );
}

export const getSpeciesSlugMaps = cache(async (): Promise<SpeciesSlugMaps> =>
  speciesSlugMapsFromCatalog(await getSpeciesCatalog("ka")),
);

export function liveSpeciesAlternates(
  maps: SpeciesSlugMaps,
  locale: AppLocale,
  id: string,
) {
  const languages: Record<string, string> = {
    "x-default": liveSpeciesPageUrl(maps, "ka", id),
  };
  for (const loc of routing.locales) {
    languages[loc] = liveSpeciesPageUrl(maps, loc, id);
  }
  return {
    canonical: liveSpeciesPageUrl(maps, locale, id),
    languages,
  };
}

export function liveSpeciesPageUrl(
  maps: SpeciesSlugMaps,
  locale: AppLocale,
  id: string,
) {
  return absoluteUrl(liveSpeciesPath(maps, id, locale));
}

export function liveSpeciesPath(
  maps: SpeciesSlugMaps,
  id: string,
  locale: AppLocale,
) {
  return getPathname({ href: liveSpeciesHref(maps, id, locale), locale });
}

export function liveSpeciesPublicSlug(
  maps: SpeciesSlugMaps,
  id: string,
  locale: AppLocale,
) {
  if (locale !== "ka") return id;
  return maps.kaSlugById[id] ?? id;
}

export async function readFreshSpeciesSlugMaps(
  api: ReturnType<typeof createApiClient>,
  options: FreshFetchOptions,
): Promise<SpeciesSlugMaps | undefined> {
  const response = await api.v1.catalog.$get(
    { header: { "x-locale": "ka" }, query: { view: "card" } },
    options,
  );
  if (!responseOk(response)) return undefined;
  return speciesSlugMapsFromCatalog(
    (await response.json()).data as CatalogCard[],
  );
}

export async function resolveLiveSpeciesIdInHub(
  hubId: GroupHubId,
  slug: string,
): Promise<string | undefined> {
  if (RESERVED_HUB_SLUGS[hubId].includes(slug)) return undefined;
  const maps = await getSpeciesSlugMaps();
  const id = maps.idByAnySlug[slug];
  if (!id || maps.hubById[id] !== hubId) return undefined;
  return id;
}

function liveSpeciesHref(
  maps: SpeciesSlugMaps,
  id: string,
  locale: AppLocale,
): LocaleSpeciesHref {
  return speciesHrefForHub(
    maps.hubById[id] ?? getSpeciesHubId(id),
    liveSpeciesPublicSlug(maps, id, locale),
  );
}
