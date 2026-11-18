import { factory } from "../factory";
import { ApiError } from "../lib/errors";
import { withinLimit } from "../lib/rateLimit";

export const rateLimitMcp = factory.createMiddleware(async (c, next) => {
  const visitor = c.req.header("cf-connecting-ip") ?? "unknown";
  if (!(await withinLimit(c.env.MCP_LIMITER, visitor, "MCP"))) {
    throw new ApiError(429, "rate_limited", "Too many MCP requests");
  }
  await next();
});
