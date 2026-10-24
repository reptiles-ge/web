import { Hono } from "hono";

import { formatApiAccessRequestNotification } from "@/lib/apiAccessRequestNotification";
import { sendTelegramMessage } from "@/lib/telegram";

import type { ApiEnv } from "../env";

import { ApiError } from "../lib/errors";
import { validate } from "../lib/validate";
import { rateLimitAccessRequests } from "../middleware/rateLimitAccessRequests";
import { requireSiteKey } from "../middleware/requireSiteKey";
import { requireSiteOrigin } from "../middleware/requireSiteOrigin";
import { accessRequestBody } from "../schemas/accessRequests";

export const accessRequests = new Hono<ApiEnv>().post(
  "/",
  requireSiteKey,
  requireSiteOrigin,
  rateLimitAccessRequests,
  validate("json", accessRequestBody),
  async (c) => {
    const status = await sendTelegramMessage(
      { chatId: c.env.TELEGRAM_CHAT_ID, token: c.env.TELEGRAM_BOT_TOKEN },
      formatApiAccessRequestNotification(c.req.valid("json")),
    );
    if (status !== "sent") {
      console.error(`API access request Telegram ${status}`);
      throw new ApiError(503, "delivery_failed", "Request not delivered");
    }
    return c.body(null, 201);
  },
);
