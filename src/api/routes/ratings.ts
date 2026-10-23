import { Hono } from "hono";

import { formatRatingNotification } from "@/lib/ratingNotification";
import { sendTelegramMessage } from "@/lib/telegram";

import type { ApiEnv } from "../env";

import { insertRating, ratingCountsSince } from "../db/ratings";
import { inBackground } from "../lib/background";
import { NO_STORE } from "../lib/cache";
import { summariseRatings } from "../lib/ratingSummary";
import { validate } from "../lib/validate";
import { rateLimitRatings } from "../middleware/rateLimitRatings";
import { requireSiteOrigin } from "../middleware/requireSiteOrigin";
import { requireToken } from "../middleware/requireToken";
import { ratingBody, ratingSummaryQuery } from "../schemas/ratings";

const DAY_MS = 86_400_000;

export const ratings = new Hono<ApiEnv>()
  .post(
    "/",
    requireSiteOrigin,
    rateLimitRatings,
    validate("json", ratingBody),
    async (c) => {
      const body = c.req.valid("json");
      const origin = new URL(c.req.header("Origin") ?? "https://reptiles.ge");
      const country = countryCode(c.req.header("cf-ipcountry"));
      await insertRating(c.env.DB, {
        country,
        feedback: body.feedback,
        locale: body.locale,
        path: body.path,
        rating: body.rating,
      });
      inBackground(
        c,
        sendTelegramMessage(
          { chatId: c.env.TELEGRAM_CHAT_ID, token: c.env.TELEGRAM_BOT_TOKEN },
          formatRatingNotification({
            acceptLanguage: c.req.header("Accept-Language") ?? null,
            country,
            feedback: body.feedback,
            host: origin.host,
            locale: body.locale,
            pages: body.pages,
            pageUrl: new URL(body.path, origin).href,
            rating: body.rating,
            referrer: body.referrer,
            seconds: body.seconds,
            userAgent: c.req.header("User-Agent") ?? null,
          }),
        ).then((status) => {
          if (status !== "sent") console.error(`Rating Telegram ${status}`);
        }),
      );
      return c.body(null, 201);
    },
  )
  .get(
    "/summary",
    requireToken,
    validate("query", ratingSummaryQuery),
    async (c) => {
      const { days } = c.req.valid("query");
      const since = new Date(Date.now() - days * DAY_MS).toISOString();
      const counts = await ratingCountsSince(c.env.DB, since);
      c.header("Cache-Control", NO_STORE);
      return c.json({ data: { ...summariseRatings(counts), since } }, 200);
    },
  );

function countryCode(value: string | undefined) {
  return value && /^[A-Z]{2}$/.test(value) && value !== "XX" ? value : null;
}
