import { factory } from "../factory";
import { ApiError } from "../lib/errors";
import { withinLimit } from "../lib/rateLimit";

export const rateLimitLogin = factory.createMiddleware(async (c, next) => {
  const visitor = c.req.header("cf-connecting-ip") ?? "unknown";
  if (!(await withinLimit(c.env.LOGIN_LIMITER, visitor, "Login"))) {
    throw new ApiError(429, "rate_limited", "Too many login attempts");
  }
  await next();
});
