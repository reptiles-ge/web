import type { ApiBindings } from "../env";

import { apiCacheTag } from "./cache";

const PURGE_TAGS_PER_REQUEST = 100;

export type CachePurgeResult = "failed" | "not_configured" | "purged";

export async function purgeApiCache(
  env: ApiBindings,
  tags: string[],
): Promise<CachePurgeResult> {
  if (tags.length === 0) return "purged";
  if (!env.CACHE_PURGE_TOKEN || !env.CACHE_PURGE_ZONE_ID) {
    console.error("API cache purge is not configured");
    return "not_configured";
  }
  const unique = [...new Set(tags.map(apiCacheTag))];
  try {
    for (
      let start = 0;
      start < unique.length;
      start += PURGE_TAGS_PER_REQUEST
    ) {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${env.CACHE_PURGE_ZONE_ID}/purge_cache`,
        {
          body: JSON.stringify({
            tags: unique.slice(start, start + PURGE_TAGS_PER_REQUEST),
          }),
          headers: {
            Authorization: `Bearer ${env.CACHE_PURGE_TOKEN}`,
            "Content-Type": "application/json",
          },
          method: "POST",
        },
      );
      const body = (await response.json().catch(() => null)) as null | {
        success?: boolean;
      };
      if (!response.ok || body?.success !== true) {
        console.error(`API cache purge answered ${response.status}`);
        return "failed";
      }
    }
    return "purged";
  } catch (error) {
    console.error("API cache purge failed", error);
    return "failed";
  }
}
