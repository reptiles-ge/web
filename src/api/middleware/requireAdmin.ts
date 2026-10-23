import { factory } from "../factory";
import { requireAdminSession } from "./requireAdminSession";
import { requireToken } from "./requireToken";

export const requireAdmin = factory.createMiddleware((c, next) =>
  c.req.header("Authorization") === undefined
    ? requireAdminSession(c, next)
    : requireToken(c, next),
);
