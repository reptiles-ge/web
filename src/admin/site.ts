import type { InferResponseType } from "hono/client";

import { checkAdminResponse } from "./adminResponse";
import { api } from "./apiClient";

export type PageGroup = InferResponseType<
  typeof api.v1.admin.site.pages.$get,
  200
>["data"][number];

export async function clearPageGroupCache(id: string) {
  checkAdminResponse(
    await api.v1.admin.site.pages[":id"].revalidate.$post({ param: { id } }),
    "Page cache clear failed",
  );
}

export async function clearSiteCache(): Promise<string[]> {
  const response = await api.v1.admin.site.revalidate.$post();
  checkAdminResponse(response, "Site cache clear failed");
  return (await response.json()).data.species;
}

export async function fetchPageGroups(): Promise<PageGroup[]> {
  const response = await api.v1.admin.site.pages.$get();
  checkAdminResponse(response, "Page groups failed");
  return (await response.json()).data;
}
