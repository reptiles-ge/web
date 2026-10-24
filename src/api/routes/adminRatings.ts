import { Hono } from "hono";

import type { ApiEnv } from "../env";

import { listRatings, ratingCounts } from "../db/ratings";
import { NO_STORE } from "../lib/cache";
import { summariseRatings } from "../lib/ratingSummary";
import { validate } from "../lib/validate";
import { requireAdmin } from "../middleware/requireAdmin";
import { adminRatingsQuery } from "../schemas/ratings";

export const adminRatings = new Hono<ApiEnv>().get(
  "/",
  requireAdmin,
  validate("query", adminRatingsQuery),
  async (c) => {
    const { limit, page, ...filters } = c.req.valid("query");
    const [result, counts] = await Promise.all([
      listRatings(c.env.DB, filters, { limit, page }),
      ratingCounts(c.env.DB),
    ]);
    c.header("Cache-Control", NO_STORE);
    return c.json({ ...result, summary: summariseRatings(counts) }, 200);
  },
);
