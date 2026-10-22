import { cache } from "hono/cache";

export const PUBLIC_CACHE = "public, max-age=300, s-maxage=3600";

export const NO_STORE = "no-store";

export const edgeCache = (cacheName: string) =>
  cache({
    cacheName,
    onCacheNotAvailable: false,
    vary: ["Origin"],
    wait: false,
  });
