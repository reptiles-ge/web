import { Hono } from "hono";

import type { ApiEnv } from "../env";

import { findUserByEmail, insertUser } from "../db/users";
import { NO_STORE } from "../lib/cache";
import { ApiError } from "../lib/errors";
import { hashPassword } from "../lib/passwords";
import { validate } from "../lib/validate";
import { requireToken } from "../middleware/requireToken";
import { userCreateBody } from "../schemas/users";

export const adminUsers = new Hono<ApiEnv>()
  .use(requireToken)
  .post("/", validate("json", userCreateBody), async (c) => {
    const { email, name, password, role } = c.req.valid("json");
    if (await findUserByEmail(c.env.DB, email)) {
      throw new ApiError(409, "conflict", "A user with this email exists");
    }
    const user = { email, id: crypto.randomUUID(), name, role };
    await insertUser(c.env.DB, {
      ...user,
      passwordHash: await hashPassword(password),
    });
    c.header("Cache-Control", NO_STORE);
    return c.json({ data: user }, 201);
  });
