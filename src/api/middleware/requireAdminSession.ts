import { getCookie } from "hono/cookie";

import { findSessionUser } from "../db/users";
import { factory } from "../factory";
import { ApiError } from "../lib/errors";
import { hashSessionToken, SESSION_COOKIE } from "../lib/sessions";

export const requireAdminSession = factory.createMiddleware(async (c, next) => {
  const token = getCookie(c, SESSION_COOKIE, "host");
  const user = token
    ? await findSessionUser(
        c.env.DB,
        await hashSessionToken(token),
        new Date().toISOString(),
      )
    : null;
  if (!user) throw new ApiError(401, "unauthorized", "Not signed in");
  if (user.role !== "admin") {
    throw new ApiError(403, "forbidden", "Admin role required");
  }
  c.set("user", user);
  await next();
});
