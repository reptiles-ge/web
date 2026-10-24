import type { InferResponseType } from "hono/client";

import type { EncodedPhoto } from "./photoEncoding";

import { checkAdminResponse } from "./adminResponse";
import { api } from "./apiClient";

export type PhotoCreditFields = {
  date?: string;
  georgiaField?: boolean;
  lat?: string;
  lng?: string;
  location?: string;
  locationEn?: string;
  photographer?: string;
  photographerEn?: string;
  url?: string;
};

export type UploadedPhoto = InferResponseType<
  (typeof api.v1.admin.species)[":id"]["photos"]["$post"],
  201
>["data"];

export function encodePhotoFile(file: File): Promise<EncodedPhoto> {
  const worker = new Worker(
    new URL("./photoEncoder.worker.ts", import.meta.url),
    { type: "module" },
  );
  return new Promise((resolve, reject) => {
    worker.onmessage = (
      event: MessageEvent<{ error?: string; photo?: EncodedPhoto }>,
    ) => {
      worker.terminate();
      if (event.data.photo) resolve(event.data.photo);
      else reject(new Error(event.data.error ?? "Could not encode photo"));
    };
    worker.onerror = () => {
      worker.terminate();
      reject(new Error("Could not encode photo"));
    };
    worker.postMessage(file);
  });
}

export async function uploadSpeciesPhoto(
  id: string,
  { georgiaField, ...credit }: PhotoCreditFields,
  photo: EncodedPhoto,
): Promise<UploadedPhoto> {
  const text = Object.fromEntries(
    Object.entries(credit).flatMap(([key, value]) =>
      value?.trim() ? [[key, value.trim()]] : [],
    ),
  );
  const response = await api.v1.admin.species[":id"].photos.$post({
    form: {
      ...text,
      derivatives: photo.derivatives,
      georgiaField: georgiaField ? "1" : "0",
      original: photo.original,
    },
    param: { id },
  });
  const status: number = response.status;
  if (status === 400) {
    const body = (await response.json()) as { error?: { message?: string } };
    throw new Error(body.error?.message ?? "The photo was rejected");
  }
  checkAdminResponse(response, "Photo upload failed");
  return ((await response.json()) as { data: UploadedPhoto }).data;
}
