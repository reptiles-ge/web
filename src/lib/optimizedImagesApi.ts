import type { OptimizedImageEntry } from "@/lib/optimizedImageSources";
import type { SchemaCrop } from "@/lib/schemaCropTypes";

import { createApiClient, responseOk } from "@/lib/apiClient";

const WRITE_BATCH = 100;

export type ImageManifestRecord = {
  entry: ManifestEntryRecord;
  key: string;
  src: string;
};

export type ImageManifestWrite = ImageManifestRecord & {
  asset: null | OptimizedImageEntry;
};

export type SchemaImageCropsRecord = { crops: SchemaCrop[]; src: string };

type ManifestEntryRecord = {
  configFingerprint: string;
  derivatives: Array<{
    byteSize: number;
    format: "avif" | "webp";
    height: number;
    key: string;
    width: number;
  }>;
  height: number;
  originalKey: string;
  originalSize: number;
  sourceHash: string;
  updatedAt: string;
  width: number;
};

export async function getAdminSchemaImageCrops(
  token: string,
): Promise<SchemaImageCropsRecord[]> {
  const response = await createApiClient({ token }).v1.admin.images[
    "schema-crops"
  ].$get();
  if (!response.ok) {
    throw new Error(`Schema crops API answered ${response.status}`);
  }
  const { data } = await response.json();
  return data;
}

export async function getImageManifest(
  token: string,
): Promise<ImageManifestRecord[]> {
  const response = await createApiClient({
    token,
  }).v1.admin.images.manifest.$get();
  if (!response.ok) {
    throw new Error(`Image manifest API answered ${response.status}`);
  }
  const { data } = await response.json();
  return data;
}

export async function getSchemaImageCrops(): Promise<null | Record<
  string,
  SchemaCrop[]
>> {
  const response = await createApiClient().v1.images["schema-crops"].$get();
  const status: number = response.status;
  if (status === 404) return null;
  if (!response.ok) {
    throw new Error(`Schema crops API answered ${response.status}`);
  }
  const { data } = await response.json();
  return Object.fromEntries(data.map(({ crops, src }) => [src, crops]));
}

export async function getUploadedOptimizedImages(): Promise<null | Record<
  string,
  OptimizedImageEntry
>> {
  const response = await createApiClient().v1.images.$get();
  const status: number = response.status;
  if (status === 404) return null;
  if (!responseOk(response)) {
    throw new Error(`Optimized images API answered ${response.status}`);
  }
  const { data } = await response.json();
  return Object.fromEntries(data.map(({ src, ...entry }) => [src, entry]));
}

export async function putImageManifest(
  token: string,
  images: ImageManifestWrite[],
) {
  const client = createApiClient({ token });
  for (let start = 0; start < images.length; start += WRITE_BATCH) {
    const response = await client.v1.admin.images.manifest.$put({
      json: { images: images.slice(start, start + WRITE_BATCH) },
    });
    if (!response.ok) {
      throw new Error(
        `Image manifest API refused the write (${response.status}): ${await response.text()}`,
      );
    }
  }
}

export async function putSchemaImageCrops(
  token: string,
  images: SchemaImageCropsRecord[],
) {
  const client = createApiClient({ token });
  for (let start = 0; start < images.length; start += WRITE_BATCH) {
    const response = await client.v1.admin.images["schema-crops"].$put({
      json: { images: images.slice(start, start + WRITE_BATCH) },
    });
    if (!response.ok) {
      throw new Error(
        `Schema crops API refused the write (${response.status}): ${await response.text()}`,
      );
    }
  }
}
