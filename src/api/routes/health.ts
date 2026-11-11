import { Hono } from "hono";

import type { ApiEnv } from "../env";

import { pingDatabase } from "../db/health";
import { NO_STORE } from "../lib/cache";
import { ApiError } from "../lib/errors";

export const health = new Hono<ApiEnv>().get("/", async (c) => {
  c.header("Cache-Control", NO_STORE);
  const reachable = await pingDatabase(c.env.DB).catch((error: unknown) => {
    console.error("Health check failed", error);
    return false;
  });
  if (!reachable) {
    throw new ApiError(503, "service_unavailable", "Database unavailable");
  }
  return c.json({ data: { database: "ok", status: "ok" } }, 200);
});
