import { factory } from "../factory";
import { ApiError } from "../lib/errors";
import { withinLimit } from "../lib/rateLimit";

export const rateLimitRatings = factory.createMiddleware(async (c, next) => {
  const visitor = c.req.header("cf-connecting-ip") ?? "unknown";
  if (
    !(await withinLimit(c.env.RATING_VISITOR_LIMITER, visitor, "Rating")) ||
    !(await withinLimit(c.env.RATING_GLOBAL_LIMITER, "all", "Rating"))
  ) {
    throw new ApiError(429, "rate_limited", "Too many ratings");
  }
  await next();
});
