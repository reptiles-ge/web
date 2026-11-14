import type { ApiBindings } from "../env";

import { bumpCacheGeneration } from "../db/cacheGeneration";
import { forgetCacheGeneration } from "./cache";

export type CachePurgeResult = "failed" | "purged";

export async function purgeApiCache(
  env: ApiBindings,
): Promise<CachePurgeResult> {
  try {
    await bumpCacheGeneration(env.DB);
    forgetCacheGeneration();
    return "purged";
  } catch (error) {
    console.error("API cache purge failed", error);
    return "failed";
  }
}
