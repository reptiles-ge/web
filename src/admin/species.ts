import type { InferRequestType, InferResponseType } from "hono/client";

import type { CoverTarget } from "@/lib/adminCover";
import type { Page } from "@/lib/pagination";

import { checkAdminResponse, checkAdminSave } from "./adminResponse";
import { api } from "./apiClient";
import { fetchAllPages, type PagedQuery, toQueryParams } from "./pagination";

export { SessionExpiredError } from "./adminResponse";

export type AdminFieldRecord = InferResponseType<
  (typeof api.v1.admin.species)[":id"]["field-records"]["$get"],
  200
>["data"][number];

export type AdminSpecies = InferResponseType<
  typeof api.v1.admin.species.$get,
  200
>["data"][number];

export type AdminSpeciesFilters = {
  group: AdminSpecies["group"];
  status: AdminSpecies["status"];
};

export type AdminSpeciesRecord = InferResponseType<
  (typeof api.v1.admin.species)[":id"]["$get"],
  200
>["data"];

export type SpeciesTextsInput = InferRequestType<
  (typeof api.v1.admin.species)[":id"]["texts"]["$post"]
>["json"];

type SpeciesTextsSaved = InferResponseType<
  (typeof api.v1.admin.species)[":id"]["texts"]["$post"],
  200
>["data"];

export const SPECIES_STATUS_COLORS: Record<AdminSpecies["status"], string> = {
  draft: "gold",
  published: "green",
  unpublished: "default",
};

export type PhotoCreditInput = InferRequestType<
  (typeof api.v1.admin.species)[":id"]["photos"]["credit"]["$post"]
>["json"]["credit"];

export async function clearSpeciesCache(id: string) {
  checkAdminResponse(
    await api.v1.admin.species[":id"].revalidate.$post({ param: { id } }),
    "Species cache clear failed",
  );
}

export async function deleteSpeciesPhoto(
  id: string,
  src: string,
  expectedVersion: number,
): Promise<number> {
  const response = await api.v1.admin.species[":id"].photos.delete.$post({
    json: { expectedVersion, src },
    param: { id },
  });
  await checkAdminSave(response, "Photo delete failed");
  return ((await response.json()) as { data: { version: number } }).data
    .version;
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

export async function fetchAdminSpecies(
  query: PagedQuery<AdminSpeciesFilters>,
): Promise<Page<AdminSpecies>> {
  const response = await api.v1.admin.species.$get({
    query: toQueryParams(query),
  });
  checkAdminResponse(response, "Species list failed");
  return response.json();
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

export function fetchAllAdminSpecies() {
  return fetchAllPages(fetchAdminSpecies);
}

export async function reorderSpeciesPhotos(
  id: string,
  srcs: string[],
  expectedVersion: number,
): Promise<number> {
  const response = await api.v1.admin.species[":id"].photos.reorder.$post({
    json: { expectedVersion, srcs },
    param: { id },
  });
  await checkAdminSave(response, "Gallery order save failed");
  return ((await response.json()) as { data: { version: number } }).data
    .version;
}

export async function saveSpeciesPhotoCredit(
  id: string,
  src: string,
  credit: PhotoCreditInput,
  expectedVersion: number,
): Promise<number> {
  const response = await api.v1.admin.species[":id"].photos.credit.$post({
    json: { credit, expectedVersion, src },
    param: { id },
  });
  await checkAdminSave(response, "Photo credit save failed");
  return ((await response.json()) as { data: { version: number } }).data
    .version;
}

export async function saveSpeciesTexts(
  id: string,
  json: SpeciesTextsInput,
): Promise<SpeciesTextsSaved> {
  const response = await api.v1.admin.species[":id"].texts.$post({
    json,
    param: { id },
  });
  await checkAdminSave(response, "Species texts save failed");
  return ((await response.json()) as { data: SpeciesTextsSaved }).data;
}

export async function setSpeciesCover(
  id: string,
  src: string,
  target: CoverTarget,
  expectedVersion: number,
): Promise<number> {
  const response = await api.v1.admin.species[":id"].photos["set-cover"].$post({
    json: { expectedVersion, src, target },
    param: { id },
  });
  await checkAdminSave(response, "Cover save failed");
  return ((await response.json()) as { data: { version: number } }).data
    .version;
}
