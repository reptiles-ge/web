import type { RateLimiter } from "../env";

import { factory } from "../factory";
import { ApiError } from "../lib/errors";

export const rateLimitRatings = factory.createMiddleware(async (c, next) => {
  const visitor = c.req.header("cf-connecting-ip") ?? "unknown";
  if (
    !(await allowed(c.env.RATING_VISITOR_LIMITER, visitor)) ||
    !(await allowed(c.env.RATING_GLOBAL_LIMITER, "all"))
  ) {
    throw new ApiError(429, "rate_limited", "Too many ratings");
  }
  await next();
});

async function allowed(limiter: RateLimiter | undefined, key: string) {
  if (!limiter) return true;
  try {
    return (await limiter.limit({ key })).success;
  } catch (error) {
    console.error("Rating rate limit check failed", error);
    return true;
  }
}
