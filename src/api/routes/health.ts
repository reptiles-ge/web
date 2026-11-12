import { Hono } from "hono";

import type { ApiQueryMeta } from "../db/database";
import type { ApiEnv } from "../env";

import { pingDatabase } from "../db/health";
import { inBackground } from "../lib/background";
import { NO_STORE } from "../lib/cache";
import { ApiError } from "../lib/errors";

// A `SELECT 1` normally takes a few ms; anything slower is logged with D1's meta, so a stall
// can be split into time spent in SQL vs. time spent waiting on D1.
export const SLOW_PING_MS = 1000;

export const health = new Hono<ApiEnv>().get("/", async (c) => {
  c.header("Cache-Control", NO_STORE);
  const startedAt = Date.now();
  const ping = pingDatabase(c.env.DB).then(
    ({ meta, ok }) => {
      const elapsedMs = Date.now() - startedAt;
      if (elapsedMs >= SLOW_PING_MS) logSlowPing(startedAt, elapsedMs, meta);
      return ok;
    },
    (error: unknown) => {
      console.error("Health check failed", {
        elapsedMs: Date.now() - startedAt,
        error:
          error instanceof Error
            ? `${error.name}: ${error.message}`
            : String(error),
        startedAt: new Date(startedAt).toISOString(),
      });
      return false;
    },
  );
  // A stalled call usually outlives the caller's timeout, which cancels this request.
  // Keeping the ping alive in the background still gets it logged when D1 finally answers.
  inBackground(c, ping);
  if (!(await ping)) {
    throw new ApiError(503, "service_unavailable", "Database unavailable");
  }
  return c.json({ data: { database: "ok", status: "ok" } }, 200);
});

function logSlowPing(
  startedAt: number,
  elapsedMs: number,
  meta?: ApiQueryMeta,
) {
  console.warn("Slow D1 health ping", {
    duration: meta?.duration ?? null,
    elapsedMs,
    servedByPrimary: meta?.served_by_primary ?? null,
    servedByRegion: meta?.served_by_region ?? null,
    sqlDurationMs: meta?.timings?.sql_duration_ms ?? null,
    startedAt: new Date(startedAt).toISOString(),
    totalAttempts: meta?.total_attempts ?? null,
  });
}
