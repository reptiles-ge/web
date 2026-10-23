import { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

import type { ApiEnv } from "../env";

import { createSession, deleteSession, findUserByEmail } from "../db/users";
import { NO_STORE } from "../lib/cache";
import { ApiError } from "../lib/errors";
import { dummyPasswordHash, verifyPassword } from "../lib/passwords";
import {
  hashSessionToken,
  newSessionToken,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
} from "../lib/sessions";
import { validate } from "../lib/validate";
import { rateLimitLogin } from "../middleware/rateLimitLogin";
import { requireAdminSession } from "../middleware/requireAdminSession";
import { requireSiteOrigin } from "../middleware/requireSiteOrigin";
import { loginBody } from "../schemas/users";

const COOKIE_OPTIONS = {
  httpOnly: true,
  path: "/",
  prefix: "host",
  sameSite: "Strict",
  secure: true,
} as const;

export const auth = new Hono<ApiEnv>()
  .post(
    "/login",
    requireSiteOrigin,
    rateLimitLogin,
    validate("json", loginBody),
    async (c) => {
      const { email, password } = c.req.valid("json");
      const found = await findUserByEmail(c.env.DB, email);
      const valid = await verifyPassword(
        password,
        found?.passwordHash ?? (await dummyPasswordHash()),
      );
      if (!found || !valid || found.disabled) {
        throw new ApiError(401, "unauthorized", "Invalid email or password");
      }
      const token = newSessionToken();
      const now = Date.now();
      await createSession(c.env.DB, {
        expiresAt: new Date(now + SESSION_TTL_SECONDS * 1000).toISOString(),
        now: new Date(now).toISOString(),
        tokenHash: await hashSessionToken(token),
        userId: found.user.id,
      });
      setCookie(c, SESSION_COOKIE, token, {
        ...COOKIE_OPTIONS,
        maxAge: SESSION_TTL_SECONDS,
      });
      c.header("Cache-Control", NO_STORE);
      return c.json({ data: found.user }, 200);
    },
  )
  .get("/me", requireAdminSession, (c) => {
    c.header("Cache-Control", NO_STORE);
    return c.json({ data: c.var.user! }, 200);
  })
  .post("/logout", requireSiteOrigin, rateLimitLogin, async (c) => {
    const token = getCookie(c, SESSION_COOKIE, "host");
    if (token) await deleteSession(c.env.DB, await hashSessionToken(token));
    deleteCookie(c, SESSION_COOKIE, COOKIE_OPTIONS);
    c.header("Cache-Control", NO_STORE);
    return c.body(null, 204);
  });
