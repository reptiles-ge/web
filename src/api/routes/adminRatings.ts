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
    const { cursor, limit, rating } = c.req.valid("query");
    const [rows, counts] = await Promise.all([
      listRatings(c.env.DB, { cursor, limit: limit + 1, rating }),
      ratingCounts(c.env.DB),
    ]);
    const summary = summariseRatings(counts);
    const data = rows.slice(0, limit);
    c.header("Cache-Control", NO_STORE);
    return c.json(
      {
        data,
        nextCursor: rows.length > limit ? (data.at(-1)?.id ?? null) : null,
        summary,
        total: rating === undefined ? summary.count : summary.byRating[rating],
      },
      200,
    );
  },
);
