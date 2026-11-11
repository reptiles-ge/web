import { Hono } from "hono";

import type { ApiEnv } from "../env";

import { pingDatabase } from "../db/health";
import { NO_STORE } from "../lib/cache";

// `status` reports the API worker itself and `database` reports D1, so an
// uptime monitor can tell "API down" apart from "API up, database down".
export const health = new Hono<ApiEnv>().get("/", async (c) => {
  c.header("Cache-Control", NO_STORE);
  const reachable = await pingDatabase(c.env.DB).catch((error: unknown) => {
    console.error("Health check failed", error);
    return false;
  });
  if (!reachable) {
    return c.json({ data: { database: "error", status: "ok" } }, 503);
  }
  return c.json({ data: { database: "ok", status: "ok" } }, 200);
});
