"use client";

import { useState } from "react";

import type { AtlasFacets, AtlasFilters } from "@/data/atlasFilters";
import type { AppLocale } from "@/i18n/routing";
import type { AtlasPage } from "@/lib/atlasList";
import type { ResolvedImageEntries } from "@/lib/optimizedImageSources";

import { useCachedJson } from "@/components/useCachedJson";
import {
  type AtlasQuery,
  atlasQueryParams,
  defaultAtlasQuery,
} from "@/lib/atlasQuery";

type AtlasCounts = { facets: AtlasFacets; total: number };

type AtlasPageResult = AtlasPage & { entries?: ResolvedImageEntries };

const REQUEST_DELAY_MS = 200;

export function useAtlasCounts(
  locale: AppLocale,
  filters: AtlasFilters,
  current: AtlasCounts & { filters: AtlasFilters },
  enabled: boolean,
) {
  const params = atlasQueryParams({ filters, page: 1, sort: "featured" });
  const same =
    params.toString() ===
    atlasQueryParams({
      filters: current.filters,
      page: 1,
      sort: "featured",
    }).toString();
  params.set("counts", "1");
  const url = enabled && !same ? atlasUrl(locale, params) : null;
  const { data } = useCachedJson<AtlasCounts>(
    url,
    EMPTY_SEED,
    REQUEST_DELAY_MS,
  );
  const [shown, setShown] = useState<AtlasCounts | null>(null);
  if (data && data !== shown) setShown(data);
  if (same || !enabled) return current;
  return data ?? shown ?? current;
}

export function useAtlasPage(
  locale: AppLocale,
  query: AtlasQuery,
  initial: AtlasPage,
) {
  const url = atlasUrl(locale, atlasQueryParams(query));
  const [seed] = useState(() => ({
    [atlasUrl(locale, atlasQueryParams(defaultAtlasQuery))]: initial,
  }));
  const { data, failed, retry } = useCachedJson<AtlasPageResult>(
    url,
    seed,
    REQUEST_DELAY_MS,
  );
  const [shown, setShown] = useState<AtlasPageResult>(initial);
  if (data && data !== shown) setShown(data);
  return { failed, loading: !data && !failed, page: data ?? shown, retry };
}

const EMPTY_SEED = {};

function atlasUrl(locale: AppLocale, params: URLSearchParams) {
  const search = params.toString();
  return `/api/atlas/${locale}${search ? `?${search}` : ""}`;
}
