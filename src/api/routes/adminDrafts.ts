import { Hono } from "hono";

import type { ApiEnv } from "../env";

import { listDrafts, readDraft } from "../db/speciesDrafts";
import { readSpeciesRecord } from "../db/speciesWrite";
import { NO_STORE } from "../lib/cache";
import { ApiError } from "../lib/errors";
import { revalidateSpeciesPage } from "../lib/revalidateSite";
import {
  approveSpeciesDraft,
  pendingSpeciesDraft,
  rejectSpeciesDraft,
} from "../lib/speciesDrafts";
import { validate } from "../lib/validate";
import { rateLimitAdmin } from "../middleware/rateLimitAdmin";
import { requireAdmin } from "../middleware/requireAdmin";
import { requireAdminSession } from "../middleware/requireAdminSession";
import { requireSiteOrigin } from "../middleware/requireSiteOrigin";
import { draftIdParam, draftListQuery } from "../schemas/speciesRecord";

const LIST_LIMIT = 200;

export const adminDrafts = new Hono<ApiEnv>()
  .get("/", requireAdmin, validate("query", draftListQuery), async (c) => {
    const data = await listDrafts(
      c.env.DB,
      c.req.valid("query").status,
      LIST_LIMIT,
    );
    c.header("Cache-Control", NO_STORE);
    return c.json({ data, total: data.length }, 200);
  })
  .get(
    "/:draftId",
    requireAdmin,
    validate("param", draftIdParam),
    async (c) => {
      const draft = await readDraft(c.env.DB, c.req.valid("param").draftId);
      if (!draft) throw new ApiError(404, "not_found", "Draft not found");
      const current = await readSpeciesRecord(c.env.DB, draft.speciesId);
      if (!current) throw new ApiError(404, "not_found", "Species not found");
      c.header("Cache-Control", NO_STORE);
      return c.json({ data: { current, draft } }, 200);
    },
  )
  .post(
    "/:draftId/merge",
    requireSiteOrigin,
    rateLimitAdmin,
    requireAdminSession,
    validate("param", draftIdParam),
    async (c) => {
      const draft = await pendingSpeciesDraft(
        c.env.DB,
        c.req.valid("param").draftId,
      );
      const data = await approveSpeciesDraft(
        c.env.DB,
        draft,
        c.var.user!.name,
      ).then(async (version) => ({
        revalidated: await revalidateSpeciesPage(c.env, draft.speciesId),
        speciesId: draft.speciesId,
        status: "approved" as const,
        version,
      }));
      c.header("Cache-Control", NO_STORE);
      return c.json({ data }, 200);
    },
  )
  .post(
    "/:draftId/reject",
    requireSiteOrigin,
    rateLimitAdmin,
    requireAdminSession,
    validate("param", draftIdParam),
    async (c) => {
      const { draftId } = c.req.valid("param");
      await pendingSpeciesDraft(c.env.DB, draftId);
      await rejectSpeciesDraft(c.env.DB, draftId, c.var.user!.name);
      c.header("Cache-Control", NO_STORE);
      return c.json({ data: { status: "rejected" as const } }, 200);
    },
  );
