import { Hono } from "hono";

import type { ApiEnv } from "../env";

import { listAdminViews } from "../db/views";
import { NO_STORE } from "../lib/cache";
import { firstViewDay } from "../lib/contentViews";
import { validate } from "../lib/validate";
import { requireAdmin } from "../middleware/requireAdmin";
import { adminViewListQuery } from "../schemas/views";

export const adminViews = new Hono<ApiEnv>().get(
  "/",
  requireAdmin,
  validate("query", adminViewListQuery),
  async (c) => {
    const { days, kind, limit, page, q } = c.req.valid("query");
    const result = await listAdminViews(
      c.env.DB,
      { kind, q, since: firstViewDay(new Date(), days) },
      { limit, page },
    );
    c.header("Cache-Control", NO_STORE);
    return c.json(result, 200);
  },
);
