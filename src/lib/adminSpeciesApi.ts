import type { CoverTarget } from "@/lib/adminCover";

import { createApiClient } from "@/lib/apiClient";
import { serverEnv } from "@/lib/env";

const ACTOR = "local-admin";

export async function readAdminSpecies(id: string) {
  return unwrap(
    await species().$get({ param: { id } }, { headers: noStore() }),
  );
}

export async function removeAdminSpeciesPhoto(id: string, src: string) {
  return unwrap(
    await species().photos.remove.$post({
      json: { actor: ACTOR, src },
      param: { id },
    }),
  );
}

export async function reorderAdminSpeciesPhotos(id: string, srcs: string[]) {
  return unwrap(
    await species().photos.order.$post({
      json: { actor: ACTOR, srcs },
      param: { id },
    }),
  );
}

export async function setAdminSpeciesCover(
  id: string,
  input: { coverSrc?: string; src: string; target: CoverTarget },
) {
  return unwrap(
    await species().photos.cover.$post({
      json: { actor: ACTOR, ...input },
      param: { id },
    }),
  );
}

export async function setAdminSpeciesPhotoCoordinates(
  id: string,
  src: string,
  coordinates: null | { lat: number; lng: number },
) {
  return unwrap(
    await species().photos.coordinates.$post({
      json: { actor: ACTOR, coordinates, src },
      param: { id },
    }),
  );
}

function noStore() {
  return { "Cache-Control": "no-store" };
}

function species() {
  const token = serverEnv().API_WRITE_TOKEN;
  if (!token) throw new Error("API_WRITE_TOKEN is not set for the local admin");
  return createApiClient({ token }).v1.admin.species[":id"];
}

async function unwrap<T>(response: {
  json: () => Promise<T>;
  ok: boolean;
  status: number;
}): Promise<T extends { data: infer D } ? D : never> {
  const body = (await response.json()) as unknown;
  if (!response.ok) {
    const message =
      (body as null | { error?: { message?: string } })?.error?.message ??
      `Species API answered ${response.status}`;
    throw new Error(message);
  }
  return (body as { data: T extends { data: infer D } ? D : never }).data;
}
