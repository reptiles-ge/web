import { Hono } from "hono";

import type { ApiEnv } from "../env";

import { readSpeciesIdsRevisedSince } from "../db/species";
import { NO_STORE } from "../lib/cache";
import { ApiError } from "../lib/errors";
import { revalidateSpeciesSite } from "../lib/revalidateSite";
import { rateLimitAdmin } from "../middleware/rateLimitAdmin";
import { requireAdminSession } from "../middleware/requireAdminSession";
import { requireSiteOrigin } from "../middleware/requireSiteOrigin";

const REVISED_WINDOW_MS = 24 * 60 * 60 * 1000;

export const adminSite = new Hono<ApiEnv>().post(
  "/revalidate",
  requireSiteOrigin,
  rateLimitAdmin,
  requireAdminSession,
  async (c) => {
    const since = new Date(Date.now() - REVISED_WINDOW_MS).toISOString();
    const species = await readSpeciesIdsRevisedSince(c.env.DB, since);
    if (!(await revalidateSpeciesSite(c.env, species))) {
      throw new ApiError(
        502,
        "site_unavailable",
        "The site could not be revalidated",
      );
    }
    c.header("Cache-Control", NO_STORE);
    return c.json({ data: { species } }, 200);
  },
);
