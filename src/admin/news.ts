import type { InferRequestType, InferResponseType } from "hono/client";

import { checkAdminResponse, checkAdminSave } from "./adminResponse";
import { api } from "./apiClient";

export type AdminNews = InferResponseType<
  typeof api.v1.admin.news.$get,
  200
>["data"][number];

export type AdminNewsRecord = InferResponseType<
  (typeof api.v1.admin.news)[":slug"]["$get"],
  200
>["data"];

export type NewsCopyInput = InferRequestType<
  (typeof api.v1.admin.news)[":slug"]["copy"]["$post"]
>["json"];

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

export async function fetchAdminNewsRecord(
  slug: string,
): Promise<AdminNewsRecord | null> {
  const response = await api.v1.admin.news[":slug"].$get({ param: { slug } });
  const status: number = response.status;
  if (status === 404) return null;
  checkAdminResponse(response, "Article failed");
  return (await response.json()).data;
}

export async function saveNewsCopy(slug: string, json: NewsCopyInput) {
  const response = await api.v1.admin.news[":slug"].copy.$post({
    json,
    param: { slug },
  });
  await checkAdminSave(response, "Article save failed");
  return ((await response.json()) as { data: { version: number } }).data
    .version;
}
