"use client";

import { useEffect, useState } from "react";

import type { AtlasFacets, AtlasFilters } from "@/data/atlasFilters";
import type { AppLocale } from "@/i18n/routing";
import type { AtlasPage } from "@/lib/atlasList";
import type { ResolvedImageEntries } from "@/lib/optimizedImageSources";

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
  const { data } = useCachedJson<AtlasCounts>(url, EMPTY_SEED);
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
  const { data, failed, retry } = useCachedJson<AtlasPageResult>(url, seed);
  const [shown, setShown] = useState<AtlasPageResult>(initial);
  if (data && data !== shown) setShown(data);
  return { failed, loading: !data && !failed, page: data ?? shown, retry };
}

const EMPTY_SEED = {};

function atlasUrl(locale: AppLocale, params: URLSearchParams) {
  const search = params.toString();
  return `/api/atlas/${locale}${search ? `?${search}` : ""}`;
}

function useCachedJson<T>(url: null | string, seed: Record<string, T>) {
  const [cache, setCache] = useState<Record<string, T>>(seed);
  const [failedUrl, setFailedUrl] = useState<null | string>(null);
  const failed = url !== null && failedUrl === url;
  const hit = url === null ? undefined : cache[url];

  useEffect(() => {
    if (url === null || hit !== undefined || failed) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      fetch(url, { signal: controller.signal })
        .then((response) => {
          if (!response.ok) throw new Error(`Atlas ${response.status}`);
          return response.json() as Promise<T>;
        })
        .then((body) => setCache((current) => ({ ...current, [url]: body })))
        .catch(() => {
          if (!controller.signal.aborted) setFailedUrl(url);
        });
    }, REQUEST_DELAY_MS);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [failed, hit, url]);

  return { data: hit, failed, retry: () => setFailedUrl(null) };
}
