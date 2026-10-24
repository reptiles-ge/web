import type { InferResponseType } from "hono/client";

import type { ContentViewKind } from "@/lib/contentViewInput";

import { checkAdminResponse } from "./adminResponse";
import { api } from "./apiClient";
import { type PagedQuery, toQueryParams } from "./pagination";

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

export async function fetchAdminViews(
  query: PagedQuery<AdminViewFilters>,
): Promise<AdminViewsPage> {
  const response = await api.v1.admin.views.$get({
    query: toQueryParams(query),
  });
  checkAdminResponse(response, "Views list failed");
  return response.json();
}
