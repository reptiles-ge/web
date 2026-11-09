import { Hono } from "hono";

import type { ApiEnv } from "../env";

import { listAdminPageViews } from "../db/pageViews";
import { NO_STORE } from "../lib/cache";
import { firstViewDay } from "../lib/contentViews";
import { validate } from "../lib/validate";
import { requireAdmin } from "../middleware/requireAdmin";
import { adminPageViewListQuery } from "../schemas/views";

export const adminPageViews = new Hono<ApiEnv>().get(
  "/",
  requireAdmin,
  validate("query", adminPageViewListQuery),
  async (c) => {
    const { days, lang, limit, page, q } = c.req.valid("query");
    const result = await listAdminPageViews(
      c.env.DB,
      { lang, q, since: firstViewDay(new Date(), days) },
      { limit, page },
    );
    c.header("Cache-Control", NO_STORE);
    return c.json(result, 200);
  },
);
