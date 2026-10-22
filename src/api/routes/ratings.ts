import { Hono } from "hono";

import type { ApiEnv } from "../env";

import { insertRating, ratingCountsSince } from "../db/ratings";
import { NO_STORE } from "../lib/cache";
import { validate } from "../lib/validate";
import { requireToken } from "../middleware/requireToken";
import { ratingBody, ratingSummaryQuery } from "../schemas/ratings";

const DAY_MS = 86_400_000;

export const ratings = new Hono<ApiEnv>()
  .use(requireToken)
  .post("/", validate("json", ratingBody), async (c) => {
    await insertRating(c.env.DB, c.req.valid("json"));
    return c.body(null, 201);
  })
  .get("/summary", validate("query", ratingSummaryQuery), async (c) => {
    const { days } = c.req.valid("query");
    const since = new Date(Date.now() - days * DAY_MS).toISOString();
    const counts = await ratingCountsSince(c.env.DB, since);
    c.header("Cache-Control", NO_STORE);
    return c.json({ data: summarise(counts, since) }, 200);
  });

function summarise(
  counts: Array<{ count: number; rating: number }>,
  since: string,
) {
  const byRating: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let count = 0;
  let total = 0;
  for (const row of counts) {
    byRating[row.rating] = row.count;
    count += row.count;
    total += row.rating * row.count;
  }
  return {
    average: count ? Math.round((total / count) * 100) / 100 : null,
    byRating,
    count,
    since,
  };
}
