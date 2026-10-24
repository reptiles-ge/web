import type { Context } from "hono";

import { timingSafeEqual } from "hono/utils/buffer";

import type { ApiEnv } from "../env";

import { findActiveApiKey, touchApiKey } from "../db/apiKeys";
import { factory } from "../factory";
import {
  API_KEY_HEADER,
  apiKeyMode,
  hashApiKey,
  looksLikeApiKey,
} from "../lib/apiKeys";
import { inBackground } from "../lib/background";
import { ApiError } from "../lib/errors";
import { withinLimit } from "../lib/rateLimit";

const LOOKUP_TTL_MS = 60_000;

const LOOKUP_LIMIT = 1000;

const TOUCH_INTERVAL_MS = 24 * 60 * 60 * 1000;

const SITE_CALLER = "site";

const lookups = new Map<string, { expires: number; id: null | string }>();

export function clearApiKeyLookups() {
  lookups.clear();
}

export const requireApiKey = factory.createMiddleware(async (c, next) => {
  const mode = apiKeyMode(c.env.API_KEY_MODE);
  if (mode === "off") return next();
  const key = c.req.header(API_KEY_HEADER);
  const caller = key ? await identify(c, key) : null;
  if (caller && caller !== SITE_CALLER) {
    if (!(await withinLimit(c.env.API_KEY_LIMITER, caller, "API key"))) {
      throw new ApiError(429, "rate_limited", "Too many requests for this key");
    }
  }
  if (!caller) {
    if (mode === "enforce") {
      throw new ApiError(
        401,
        "unauthorized",
        key ? "Invalid API key" : "Missing API key",
      );
    }
    console.warn("API request without a valid key", {
      key: key ? "invalid" : "missing",
      origin: c.req.header("Origin") ?? null,
      path: c.req.path,
    });
  }
  await next();
});

async function identify(c: Context<ApiEnv>, key: string) {
  const siteKey = c.env.SITE_API_KEY;
  if (siteKey && (await timingSafeEqual(key, siteKey))) return SITE_CALLER;
  if (!looksLikeApiKey(key)) return null;
  const hash = await hashApiKey(key);
  const now = Date.now();
  const cached = lookups.get(hash);
  if (cached && cached.expires > now) return cached.id;
  const row = await findActiveApiKey(
    c.env.DB,
    hash,
    new Date(now).toISOString(),
  );
  remember(hash, { expires: now + LOOKUP_TTL_MS, id: row?.id ?? null });
  if (
    row &&
    (!row.last_used_at ||
      Date.parse(row.last_used_at) < now - TOUCH_INTERVAL_MS)
  ) {
    inBackground(
      c,
      touchApiKey(c.env.DB, row.id, new Date(now).toISOString()).catch(
        (error: unknown) => console.error("API key touch failed", error),
      ),
    );
  }
  return row?.id ?? null;
}

function remember(hash: string, entry: { expires: number; id: null | string }) {
  if (lookups.size >= LOOKUP_LIMIT) {
    const oldest = lookups.keys().next().value;
    if (oldest !== undefined) lookups.delete(oldest);
  }
  lookups.set(hash, entry);
}
