import type { ApiBindings } from "../env";

import { purgeApiCache } from "./cachePurge";
import { ApiError } from "./errors";

const SITE_ORIGIN = "https://reptiles.ge";

export function clearCaches(env: ApiBindings) {
  return purgeApiCache(env).then((purged) =>
    clearSiteCache(env).then((cleared) => cleared && purged === "purged"),
  );
}

export async function ensureSiteRevalidated(pending: Promise<boolean>) {
  if (!(await pending)) {
    throw new ApiError(
      502,
      "site_unavailable",
      "The cache could not be cleared",
    );
  }
}

async function clearSiteCache(env: ApiBindings) {
  if (!env.SITE || !env.REVALIDATE_TOKEN) {
    console.error("Site revalidation is not configured");
    return false;
  }
  try {
    const response = await env.SITE.fetch(
      new Request(`${SITE_ORIGIN}/api/revalidate`, {
        headers: { Authorization: `Bearer ${env.REVALIDATE_TOKEN}` },
        method: "POST",
      }),
    );
    if (!response.ok) {
      console.error(`Site revalidation answered ${response.status}`);
    }
    return response.ok;
  } catch (error) {
    console.error("Site revalidation failed", error);
    return false;
  }
}
