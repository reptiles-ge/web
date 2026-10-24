import { Hono } from "hono";

import type { ApiEnv } from "../env";

import {
  findApiKey,
  insertApiKey,
  listApiKeys,
  revokeApiKey,
} from "../db/apiKeys";
import { hashApiKey, newApiKey } from "../lib/apiKeys";
import { NO_STORE } from "../lib/cache";
import { ApiError } from "../lib/errors";
import { validate } from "../lib/validate";
import { rateLimitAdmin } from "../middleware/rateLimitAdmin";
import { requireAdmin } from "../middleware/requireAdmin";
import { requireAdminSession } from "../middleware/requireAdminSession";
import { requireSiteOrigin } from "../middleware/requireSiteOrigin";
import {
  apiKeyCreateBody,
  apiKeyListQuery,
  apiKeyParam,
} from "../schemas/apiKeys";

export const adminApiKeys = new Hono<ApiEnv>()
  .get("/", requireAdmin, validate("query", apiKeyListQuery), async (c) => {
    const { limit, page, ...filters } = c.req.valid("query");
    const result = await listApiKeys(c.env.DB, filters, { limit, page });
    c.header("Cache-Control", NO_STORE);
    return c.json(result, 200);
  })
  .post(
    "/",
    requireSiteOrigin,
    rateLimitAdmin,
    requireAdminSession,
    validate("json", apiKeyCreateBody),
    async (c) => {
      const { expiresAt, name, note } = c.req.valid("json");
      const { key, prefix } = newApiKey();
      const id = crypto.randomUUID();
      await insertApiKey(c.env.DB, {
        createdBy: c.var.user?.name ?? "admin",
        expiresAt,
        id,
        keyHash: await hashApiKey(key),
        keyPrefix: prefix,
        name,
        note,
      });
      const created = await findApiKey(c.env.DB, id);
      c.header("Cache-Control", NO_STORE);
      return c.json({ data: { ...created, key } }, 201);
    },
  )
  .post(
    "/:id/revoke",
    requireSiteOrigin,
    rateLimitAdmin,
    requireAdminSession,
    validate("param", apiKeyParam),
    async (c) => {
      const { id } = c.req.valid("param");
      if (!(await findApiKey(c.env.DB, id))) {
        throw new ApiError(404, "not_found", "API key not found");
      }
      await revokeApiKey(c.env.DB, id, new Date().toISOString());
      const revoked = await findApiKey(c.env.DB, id);
      c.header("Cache-Control", NO_STORE);
      return c.json({ data: revoked }, 200);
    },
  );
