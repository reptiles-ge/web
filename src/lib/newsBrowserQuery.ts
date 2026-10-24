import type { AppLocale } from "@/i18n/routing";
import type { NewsBrowserEntry } from "@/lib/newsBrowserItems";
import type { ResolvedImageEntries } from "@/lib/optimizedImageSources";

import { GROUP_HUBS, type GroupHubId } from "@/lib/groupHubs";

export type NewsBrowserPage = {
  facets: NewsTopicFacets;
  items: NewsBrowserEntry[];
  monthLabels: Record<string, string>;
  page: number;
  pageCount: number;
  total: number;
};

export type NewsBrowserQuery = { hub?: GroupHubId; page: number; q?: string };

export type NewsBrowserResult = NewsBrowserPage & {
  entries: ResolvedImageEntries;
};

export type NewsTopicFacets = { hub: Record<"all" | GroupHubId, number> };

const MAX_QUERY_LENGTH = 100;

export function newsBrowserUrl(locale: AppLocale, query: NewsBrowserQuery) {
  const params = new URLSearchParams();
  if (query.hub) params.set("hub", query.hub);
  if (query.page > 1) params.set("page", String(query.page));
  if (query.q) params.set("q", query.q);
  const search = params.toString();
  return `/api/news/${locale}${search ? `?${search}` : ""}`;
}

export function parseNewsBrowserParams(
  params: URLSearchParams,
): NewsBrowserQuery | null {
  const hub = params.get("hub") ?? undefined;
  const page = params.get("page") ?? "1";
  const q = params.get("q")?.trim() || undefined;
  if (hub !== undefined && !Object.hasOwn(GROUP_HUBS, hub)) return null;
  if (!/^[1-9]\d{0,5}$/.test(page)) return null;
  if (q && q.length > MAX_QUERY_LENGTH) return null;
  return {
    ...(hub ? { hub: hub as GroupHubId } : {}),
    page: Number(page),
    ...(q ? { q } : {}),
  };
}
