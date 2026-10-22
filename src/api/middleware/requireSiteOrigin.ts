import { factory } from "../factory";
import { ApiError } from "../lib/errors";
import { allowedOrigins } from "../lib/origins";

export const requireSiteOrigin = factory.createMiddleware(async (c, next) => {
  const origin = c.req.header("Origin");
  if (!origin || !allowedOrigins(c.env).includes(origin)) {
    throw new ApiError(403, "forbidden", "Origin not allowed");
  }
  await next();
});
