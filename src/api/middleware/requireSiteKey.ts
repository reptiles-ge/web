import { timingSafeEqual } from "hono/utils/buffer";

import { factory } from "../factory";
import { API_KEY_HEADER } from "../lib/apiKeys";
import { ApiError } from "../lib/errors";

export const requireSiteKey = factory.createMiddleware(async (c, next) => {
  const siteKey = c.env.SITE_API_KEY;
  const key = c.req.header(API_KEY_HEADER);
  if (!siteKey || !key || !(await timingSafeEqual(key, siteKey))) {
    throw new ApiError(
      401,
      "unauthorized",
      key ? "Invalid API key" : "Missing API key",
    );
  }
  await next();
});
