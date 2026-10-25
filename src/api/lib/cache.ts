import type { Context } from "hono";

import { timingSafeEqual } from "hono/utils/buffer";

import type { ApiEnv } from "../env";

import { factory } from "../factory";
import { LOCALE_HEADER } from "../schemas/common";

export const PUBLIC_CACHE = "public, max-age=300, s-maxage=3600";

export const NO_STORE = "no-store";

const CACHE_BYPASS_HEADER = "X-Cache-Bypass";

const CACHE_TAG_HEADER = "Cache-Tag";

export const API_CACHE_TAG_PREFIX = "api:";

export function apiCacheTag(tag: string) {
  return `${API_CACHE_TAG_PREFIX}${tag}`;
}

export function cacheTags(c: Context<ApiEnv>, ...tags: string[]) {
  c.set("cacheTags", [...(c.get("cacheTags") ?? []), ...tags]);
}

const VARY = ["origin", LOCALE_HEADER.toLowerCase()];

const UNCACHEABLE = /(?:^|,\s*)(?:private|no-(?:store|cache))(?:\s*(?:=|,|$))/i;

export const edgeCache = (cacheName: string, baseTags: string[]) =>
  factory.createMiddleware(async (c, next) => {
    if (
      !globalThis.caches ||
      c.req.method !== "GET" ||
      c.req.raw.headers.has("Authorization")
    ) {
      await next();
      return;
    }
    const key = cacheKey(c.req.raw);
    const [store, refresh] = await Promise.all([
      caches.open(cacheName),
      canBypass(c.req.header(CACHE_BYPASS_HEADER), c.env.REVALIDATE_TOKEN),
    ]);
    if (!refresh) {
      const hit = await store.match(key);
      if (hit) return new Response(hit.body, hit);
    }
    await next();
    if (c.res.status !== 200) return;
    const vary = new Set([...parseVary(c.res.headers.get("Vary")), ...VARY]);
    c.header("Vary", [...vary].join(", "));
    if (
      UNCACHEABLE.test(c.res.headers.get("Cache-Control") ?? "") ||
      c.res.headers.has("Set-Cookie")
    ) {
      return;
    }
    const tags = [...new Set([...baseTags, ...(c.get("cacheTags") ?? [])])];
    c.header(CACHE_TAG_HEADER, tags.map(apiCacheTag).join(","));
    const put = store.put(key, c.res.clone());
    if (refresh) await put;
    else c.executionCtx.waitUntil(put);
  });

function cacheKey(request: Request) {
  const url = new URL(request.url);
  for (const name of VARY) {
    url.searchParams.append(`__vary_${name}`, request.headers.get(name) ?? "");
  }
  return url.href;
}

async function canBypass(header: string | undefined, token?: string) {
  return Boolean(header && token && (await timingSafeEqual(header, token)));
}

function parseVary(vary: null | string) {
  return (vary ?? "")
    .split(",")
    .map((name) => name.trim().toLowerCase())
    .filter(Boolean);
}
