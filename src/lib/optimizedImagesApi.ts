import type { OptimizedImageEntry } from "@/lib/optimizedImageSources";

import { createApiClient } from "@/lib/apiClient";

export async function getUploadedOptimizedImages(): Promise<null | Record<
  string,
  OptimizedImageEntry
>> {
  const response = await createApiClient().v1.images.$get();
  const status: number = response.status;
  if (status === 404) return null;
  if (!response.ok) {
    throw new Error(`Optimized images API answered ${response.status}`);
  }
  const { data } = await response.json();
  return Object.fromEntries(data.map(({ src, ...entry }) => [src, entry]));
}
