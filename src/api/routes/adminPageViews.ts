import { Hono } from "hono";

import type { ApiEnv } from "../env";

import { listAdminPageViews } from "../db/pageViews";
import { NO_STORE } from "../lib/cache";
import { validate } from "../lib/validate";
import { requireAdmin } from "../middleware/requireAdmin";
import { adminPageViewListQuery } from "../schemas/views";

export const adminPageViews = new Hono<ApiEnv>().get(
  "/",
  requireAdmin,
  validate("query", adminPageViewListQuery),
  async (c) => {
    const { from, lang, limit, page, q, to } = c.req.valid("query");
    const result = await listAdminPageViews(
      c.env.DB,
      { from, lang, q, to },
      { limit, page },
    );
    c.header("Cache-Control", NO_STORE);
    return c.json(result, 200);
  },
);
