import { factory } from "../factory";
import { ApiError } from "../lib/errors";
import { withinLimit } from "../lib/rateLimit";

export const rateLimitUpload = factory.createMiddleware(async (c, next) => {
  const visitor = c.req.header("cf-connecting-ip") ?? "unknown";
  if (!(await withinLimit(c.env.UPLOAD_LIMITER, visitor, "Photo upload"))) {
    throw new ApiError(429, "rate_limited", "Too many photo uploads");
  }
  await next();
});
