import { cache } from "hono/cache";
import { timingSafeEqual } from "hono/utils/buffer";

import { factory } from "../factory";
import { LOCALE_HEADER } from "../schemas/common";

export const PUBLIC_CACHE = "public, max-age=300, s-maxage=3600";

export const NO_STORE = "no-store";

const CACHE_BYPASS_HEADER = "X-Cache-Bypass";

export const edgeCache = (cacheName: string) => {
  const cached = cache({
    cacheName,
    onCacheNotAvailable: false,
    vary: ["Origin", LOCALE_HEADER],
    wait: false,
  });
  return factory.createMiddleware(async (c, next) => {
    const bypass = c.req.header(CACHE_BYPASS_HEADER);
    const token = c.env.REVALIDATE_TOKEN;
    if (bypass && token && (await timingSafeEqual(bypass, token))) {
      await next();
      return;
    }
    return cached(c, next);
  });
};
