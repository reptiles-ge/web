import type { InferResponseType } from "hono/client";

import type { AppLocale } from "@/i18n/routing";
import type { ContentViewKind } from "@/lib/contentViewInput";
import type { TrafficSourceId } from "@/lib/trafficSource";

import { checkAdminResponse } from "./adminResponse";
import { api } from "./apiClient";
import { type PagedQuery, toQueryParams } from "./pagination";

export type AdminPageView = AdminPageViewsPage["data"][number];

export type AdminPageViewFilters = {
  days: AdminViewPeriod;
  lang: AppLocale;
};

export type AdminPageViewsPage = InferResponseType<
  (typeof api.v1.admin)["page-views"]["$get"],
  200
>;

export type AdminTrafficSource = AdminTrafficSourcesPage["data"][number];

export type AdminTrafficSourceFilters = AdminPageViewFilters & {
  source: TrafficSourceId;
};

export type AdminTrafficSourcesPage = InferResponseType<
  (typeof api.v1.admin)["traffic-sources"]["$get"],
  200
>;

export type AdminView = AdminViewsPage["data"][number];

export type AdminViewFilters = {
  days: AdminViewPeriod;
  kind: ContentViewKind;
};

export type AdminViewPeriod = 1 | 7 | 30;

export type AdminViewsPage = InferResponseType<
  typeof api.v1.admin.views.$get,
  200
>;

export async function fetchAdminPageViews(
  query: PagedQuery<AdminPageViewFilters>,
): Promise<AdminPageViewsPage> {
  const response = await api.v1.admin["page-views"].$get({
    query: toQueryParams(query),
  });
  checkAdminResponse(response, "Page views list failed");
  return response.json();
}

export async function fetchAdminTrafficSources(
  query: PagedQuery<AdminTrafficSourceFilters>,
): Promise<AdminTrafficSourcesPage> {
  const response = await api.v1.admin["traffic-sources"].$get({
    query: toQueryParams(query),
  });
  checkAdminResponse(response, "Traffic sources list failed");
  return response.json();
}

export async function fetchAdminViews(
  query: PagedQuery<AdminViewFilters>,
): Promise<AdminViewsPage> {
  const response = await api.v1.admin.views.$get({
    query: toQueryParams(query),
  });
  checkAdminResponse(response, "Views list failed");
  return response.json();
}
