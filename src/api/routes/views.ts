import { Hono } from "hono";

import type { ApiEnv } from "../env";

import { inBackground } from "../lib/background";
import { countPageView, countView, isBotUserAgent } from "../lib/contentViews";
import { countryCode } from "../lib/country";
import { validate } from "../lib/validate";
import { rateLimitViews } from "../middleware/rateLimitViews";
import { requireSiteOrigin } from "../middleware/requireSiteOrigin";
import { viewBody } from "../schemas/views";

export const views = new Hono<ApiEnv>().post(
  "/",
  requireSiteOrigin,
  rateLimitViews,
  validate("json", viewBody),
  (c) => {
    const userAgent = c.req.header("User-Agent");
    if (!isBotUserAgent(userAgent)) {
      const body = c.req.valid("json");
      const request = {
        acceptLanguage: c.req.header("Accept-Language"),
        country: countryCode(c.req.header("cf-ipcountry")),
        ip: c.req.header("cf-connecting-ip"),
        now: new Date(),
        userAgent,
      };
      inBackground(
        c,
        ("path" in body
          ? countPageView(c.env.DB, body, request)
          : countView(c.env.DB, body, request)
        ).catch((error: unknown) => {
          console.error("View count failed", error);
        }),
      );
    }
    return c.body(null, 202);
  },
);
