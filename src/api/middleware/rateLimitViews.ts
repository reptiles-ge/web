import { factory } from "../factory";
import { ApiError } from "../lib/errors";
import { withinLimit } from "../lib/rateLimit";

export const rateLimitViews = factory.createMiddleware(async (c, next) => {
  const visitor = c.req.header("cf-connecting-ip") ?? "unknown";
  if (!(await withinLimit(c.env.VIEW_LIMITER, visitor, "View"))) {
    throw new ApiError(429, "rate_limited", "Too many views");
  }
  await next();
});
