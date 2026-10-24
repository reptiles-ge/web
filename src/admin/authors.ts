import type { InferResponseType } from "hono/client";

import { checkAdminResponse } from "./adminResponse";
import { api } from "./apiClient";

export type AdminAuthor = InferResponseType<
  typeof api.v1.admin.authors.$get,
  200
>["data"][number];

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

export async function fetchAdminAuthors(): Promise<AdminAuthor[]> {
  const response = await api.v1.admin.authors.$get();
  checkAdminResponse(response, "Authors list failed");
  return (await response.json()).data;
}
