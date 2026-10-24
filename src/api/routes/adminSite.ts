import { Hono } from "hono";

import { findSitePageGroup, SITE_PAGE_GROUPS } from "@/lib/sitePageGroups";

import type { ApiEnv } from "../env";

import { readSpeciesIdsRevisedSince } from "../db/species";
import { NO_STORE } from "../lib/cache";
import { ApiError } from "../lib/errors";
import {
  ensureSiteRevalidated,
  revalidatePageGroup,
  revalidateSpeciesSite,
} from "../lib/revalidateSite";
import { validate } from "../lib/validate";
import { rateLimitAdmin } from "../middleware/rateLimitAdmin";
import { requireAdmin } from "../middleware/requireAdmin";
import { requireAdminSession } from "../middleware/requireAdminSession";
import { requireSiteOrigin } from "../middleware/requireSiteOrigin";
import { sitePageGroupParam } from "../schemas/common";

const REVISED_WINDOW_MS = 24 * 60 * 60 * 1000;

export const adminSite = new Hono<ApiEnv>()
  .get("/pages", requireAdmin, (c) => {
    c.header("Cache-Control", NO_STORE);
    return c.json(
      { data: SITE_PAGE_GROUPS, total: SITE_PAGE_GROUPS.length },
      200,
    );
  })
  .post(
    "/pages/:id/revalidate",
    requireSiteOrigin,
    rateLimitAdmin,
    requireAdminSession,
    validate("param", sitePageGroupParam),
    async (c) => {
      const { id } = c.req.valid("param");
      if (!findSitePageGroup(id)) {
        throw new ApiError(404, "not_found", "Page group not found");
      }
      await ensureSiteRevalidated(revalidatePageGroup(c.env, id));
      c.header("Cache-Control", NO_STORE);
      return c.json({ data: { id } }, 200);
    },
  )
  .post(
    "/revalidate",
    requireSiteOrigin,
    rateLimitAdmin,
    requireAdminSession,
    async (c) => {
      const since = new Date(Date.now() - REVISED_WINDOW_MS).toISOString();
      const species = await readSpeciesIdsRevisedSince(c.env.DB, since);
      await ensureSiteRevalidated(revalidateSpeciesSite(c.env, species));
      c.header("Cache-Control", NO_STORE);
      return c.json({ data: { species } }, 200);
    },
  );
