import { timingSafeEqual } from "hono/utils/buffer";

import { factory } from "../factory";
import { ApiError } from "../lib/errors";

export const requireToken = factory.createMiddleware(async (c, next) => {
  const token = c.env.API_WRITE_TOKEN;
  const header = c.req.header("Authorization") ?? "";
  if (!token || !(await timingSafeEqual(header, `Bearer ${token}`))) {
    throw new ApiError(401, "unauthorized", "Missing or invalid token");
  }
  await next();
});
