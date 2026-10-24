import type { InferResponseType } from "hono/client";

import { checkAdminResponse } from "./adminResponse";
import { api } from "./apiClient";

export { SessionExpiredError } from "./adminResponse";

export type AdminFieldRecord = InferResponseType<
  (typeof api.v1.admin.species)[":id"]["field-records"]["$get"],
  200
>["data"][number];

export type AdminSpecies = InferResponseType<
  typeof api.v1.admin.species.$get,
  200
>["data"][number];

export type AdminSpeciesRecord = InferResponseType<
  (typeof api.v1.admin.species)[":id"]["$get"],
  200
>["data"];

export const SPECIES_STATUS_COLORS: Record<AdminSpecies["status"], string> = {
  draft: "gold",
  published: "green",
  unpublished: "default",
};

export async function clearSpeciesCache(id: string) {
  checkAdminResponse(
    await api.v1.admin.species[":id"].revalidate.$post({ param: { id } }),
    "Species cache clear failed",
  );
}

export async function fetchAdminFieldRecords(
  id: string,
): Promise<AdminFieldRecord[] | null> {
  const response = await api.v1.admin.species[":id"]["field-records"].$get({
    param: { id },
  });
  const status: number = response.status;
  if (status === 404) return null;
  checkAdminResponse(response, "Field records failed");
  return (await response.json()).data;
}

export async function fetchAdminSpecies(): Promise<AdminSpecies[]> {
  const response = await api.v1.admin.species.$get();
  checkAdminResponse(response, "Species list failed");
  return (await response.json()).data;
}

export async function fetchAdminSpeciesRecord(
  id: string,
): Promise<AdminSpeciesRecord | null> {
  const response = await api.v1.admin.species[":id"].$get({ param: { id } });
  const status: number = response.status;
  if (status === 404) return null;
  checkAdminResponse(response, "Species record failed");
  return (await response.json()).data;
}
