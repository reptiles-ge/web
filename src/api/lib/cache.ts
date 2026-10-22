import { cache } from "hono/cache";

import { factory } from "../factory";

export const PUBLIC_CACHE = "public, max-age=300, s-maxage=3600";

export const NO_STORE = "no-store";

export const edgeCache = (cacheName: string) => {
  const cached = cache({
    cacheName,
    onCacheNotAvailable: false,
    vary: ["Origin"],
    wait: false,
  });
  return factory.createMiddleware(async (c, next) => {
    if (/\bno-cache\b/i.test(c.req.header("Cache-Control") ?? "")) {
      await next();
      return;
    }
    return cached(c, next);
  });
};
