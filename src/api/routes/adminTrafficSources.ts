import { Hono } from "hono";

import type { ApiEnv } from "../env";

import { listAdminTrafficSources } from "../db/pageViews";
import { NO_STORE } from "../lib/cache";
import { firstViewDay } from "../lib/contentViews";
import { validate } from "../lib/validate";
import { requireAdmin } from "../middleware/requireAdmin";
import { adminTrafficSourceListQuery } from "../schemas/views";

export const adminTrafficSources = new Hono<ApiEnv>().get(
  "/",
  requireAdmin,
  validate("query", adminTrafficSourceListQuery),
  async (c) => {
    const { days, lang, limit, page, q, source } = c.req.valid("query");
    const result = await listAdminTrafficSources(
      c.env.DB,
      { lang, q, since: firstViewDay(new Date(), days), source },
      { limit, page },
    );
    c.header("Cache-Control", NO_STORE);
    return c.json(result, 200);
  },
);
