import type { InferResponseType } from "hono/client";

import type { AUTHOR_KINDS, AUTHOR_ROLES } from "@/lib/authorTaxonomy";
import type { Page } from "@/lib/pagination";

import { checkAdminResponse } from "./adminResponse";
import { api } from "./apiClient";
import { type PagedQuery, toQueryParams } from "./pagination";

export type AdminAuthor = InferResponseType<
  typeof api.v1.admin.authors.$get,
  200
>["data"][number];

export type AdminAuthorFilters = {
  contributor: boolean;
  kind: (typeof AUTHOR_KINDS)[number];
  role: (typeof AUTHOR_ROLES)[number];
};

export type AdminAuthorPhoto = InferResponseType<
  (typeof api.v1.admin.authors)[":id"]["photos"]["$get"],
  200
>["data"][number];

export type AdminAuthorRecord = InferResponseType<
  (typeof api.v1.admin.authors)[":id"]["$get"],
  200
>["data"];

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

export async function fetchAdminAuthors(
  query: PagedQuery<AdminAuthorFilters>,
): Promise<Page<AdminAuthor>> {
  const response = await api.v1.admin.authors.$get({
    query: toQueryParams(query),
  });
  checkAdminResponse(response, "Authors list failed");
  return response.json();
}
