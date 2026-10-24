import { Hono } from "hono";

import { formatRatingNotification } from "@/lib/ratingNotification";
import { sendTelegramMessage } from "@/lib/telegram";

import type { ApiEnv } from "../env";

import { insertRating } from "../db/ratings";
import { inBackground } from "../lib/background";
import { validate } from "../lib/validate";
import { rateLimitRatings } from "../middleware/rateLimitRatings";
import { requireSiteOrigin } from "../middleware/requireSiteOrigin";
import { ratingBody } from "../schemas/ratings";

export const ratings = new Hono<ApiEnv>().post(
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
);

function countryCode(value: string | undefined) {
  return value && /^[A-Z]{2}$/.test(value) && value !== "XX" ? value : null;
}
