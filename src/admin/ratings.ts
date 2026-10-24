import type { InferResponseType } from "hono/client";

import { api } from "./apiClient";
import { SessionExpiredError } from "./species";

export type AdminRating = AdminRatingsPage["data"][number];

export type AdminRatingsPage = InferResponseType<
  typeof api.v1.admin.ratings.$get,
  200
>;

export async function fetchAdminRatings({
  cursor,
  rating,
}: {
  cursor?: number;
  rating?: number;
}): Promise<AdminRatingsPage> {
  const response = await api.v1.admin.ratings.$get({
    query: {
      cursor: cursor === undefined ? undefined : String(cursor),
      rating: rating === undefined ? undefined : String(rating),
    },
  });
  const status: number = response.status;
  if (status === 401 || status === 403) throw new SessionExpiredError();
  if (!response.ok) throw new Error(`Ratings list failed: ${status}`);
  return response.json();
}
