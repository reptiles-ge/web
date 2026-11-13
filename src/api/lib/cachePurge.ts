import type { ApiBindings } from "../env";

import { bumpCacheGeneration } from "../db/cacheGeneration";

export type CachePurgeResult = "failed" | "purged";

export async function purgeApiCache(
  env: ApiBindings,
  tags: string[],
): Promise<CachePurgeResult> {
  if (tags.length === 0) return "purged";
  try {
    await bumpCacheGeneration(env.DB);
    return "purged";
  } catch (error) {
    console.error("API cache purge failed", error);
    return "failed";
  }
}
