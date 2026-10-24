import type { InferRequestType, InferResponseType } from "hono/client";

import { checkAdminResponse, checkAdminSave } from "./adminResponse";
import { api } from "./apiClient";

export type AdminAuthor = InferResponseType<
  typeof api.v1.admin.authors.$get,
  200
>["data"][number];

export type AdminAuthorPhoto = InferResponseType<
  (typeof api.v1.admin.authors)[":id"]["photos"]["$get"],
  200
>["data"][number];

export type AdminAuthorRecord = InferResponseType<
  (typeof api.v1.admin.authors)[":id"]["$get"],
  200
>["data"];

export type AuthorTextsInput = InferRequestType<
  (typeof api.v1.admin.authors)[":id"]["texts"]["$post"]
>["json"]["texts"];

export async function clearAuthorCache(id: string) {
  checkAdminResponse(
    await api.v1.admin.authors[":id"].revalidate.$post({ param: { id } }),
    "Contributor cache clear failed",
  );
}

export async function clearAuthorsCache() {
  checkAdminResponse(
    await api.v1.admin.authors.revalidate.$post(),
    "Authors cache clear failed",
  );
}

export async function fetchAdminAuthorPhotos(
  id: string,
): Promise<AdminAuthorPhoto[] | null> {
  const response = await api.v1.admin.authors[":id"].photos.$get({
    param: { id },
  });
  const status: number = response.status;
  if (status === 404) return null;
  checkAdminResponse(response, "Author photos failed");
  return (await response.json()).data;
}

export async function fetchAdminAuthorRecord(
  id: string,
): Promise<AdminAuthorRecord | null> {
  const response = await api.v1.admin.authors[":id"].$get({ param: { id } });
  const status: number = response.status;
  if (status === 404) return null;
  checkAdminResponse(response, "Author record failed");
  return (await response.json()).data;
}

export async function fetchAdminAuthors(): Promise<AdminAuthor[]> {
  const response = await api.v1.admin.authors.$get();
  checkAdminResponse(response, "Authors list failed");
  return (await response.json()).data;
}

export async function saveAuthorTexts(id: string, texts: AuthorTextsInput) {
  const response = await api.v1.admin.authors[":id"].texts.$post({
    json: { texts },
    param: { id },
  });
  await checkAdminSave(response, "Author texts save failed");
}
