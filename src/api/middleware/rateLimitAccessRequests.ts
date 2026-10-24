import { VISITOR_IP_HEADER } from "@/lib/visitorHeaders";

import { factory } from "../factory";
import { ApiError } from "../lib/errors";
import { withinLimit } from "../lib/rateLimit";

export const rateLimitAccessRequests = factory.createMiddleware(
  async (c, next) => {
    const visitor =
      c.req.header(VISITOR_IP_HEADER) ??
      c.req.header("cf-connecting-ip") ??
      "unknown";
    if (
      !(await withinLimit(
        c.env.ACCESS_REQUEST_VISITOR_LIMITER,
        visitor,
        "API access request",
      )) ||
      !(await withinLimit(
        c.env.ACCESS_REQUEST_GLOBAL_LIMITER,
        "all",
        "API access request",
      ))
    ) {
      throw new ApiError(429, "rate_limited", "Too many access requests");
    }
    await next();
  },
);
