import type { InferResponseType } from "hono/client";

import { checkAdminResponse } from "./adminResponse";
import { api } from "./apiClient";

export type AdminNews = InferResponseType<
  typeof api.v1.admin.news.$get,
  200
>["data"][number];

export async function clearNewsCache(slug: string) {
  checkAdminResponse(
    await api.v1.admin.news[":slug"].revalidate.$post({ param: { slug } }),
    "Article cache clear failed",
  );
}

export async function clearNewsSectionCache() {
  checkAdminResponse(
    await api.v1.admin.news.revalidate.$post(),
    "News cache clear failed",
  );
}

export async function fetchAdminNews(): Promise<AdminNews[]> {
  const response = await api.v1.admin.news.$get();
  checkAdminResponse(response, "News list failed");
  return (await response.json()).data;
}
