import { factory } from "../factory";
import { ApiError } from "../lib/errors";
import { withinLimit } from "../lib/rateLimit";

export const rateLimitAdmin = factory.createMiddleware(async (c, next) => {
  const visitor = c.req.header("cf-connecting-ip") ?? "unknown";
  if (!(await withinLimit(c.env.ADMIN_LIMITER, visitor, "Admin action"))) {
    throw new ApiError(429, "rate_limited", "Too many admin actions");
  }
  await next();
});
