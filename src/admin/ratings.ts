import type { InferResponseType } from "hono/client";

import { checkAdminResponse } from "./adminResponse";
import { api } from "./apiClient";
import { type PagedQuery, toQueryParams } from "./pagination";

export type AdminRating = AdminRatingsPage["data"][number];

export type AdminRatingsPage = InferResponseType<
  typeof api.v1.admin.ratings.$get,
  200
>;

export async function fetchAdminRatings(
  query: PagedQuery<{ rating: number }>,
): Promise<AdminRatingsPage> {
  const response = await api.v1.admin.ratings.$get({
    query: toQueryParams(query),
  });
  checkAdminResponse(response, "Ratings list failed");
  return response.json();
}
