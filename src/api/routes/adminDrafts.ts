import { Hono } from "hono";

import type { ApiDatabase } from "../db/database";
import type { ApiEnv } from "../env";

import { listDrafts, readDraft } from "../db/speciesDrafts";
import { readSpeciesRecord } from "../db/speciesWrite";
import { NO_STORE } from "../lib/cache";
import { ApiError, type ApiErrorCode } from "../lib/errors";
import {
  revalidateSpeciesPage,
  revalidateSpeciesSite,
} from "../lib/revalidateSite";
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
import {
  draftIdParam,
  draftListQuery,
  draftMergeBody,
} from "../schemas/speciesRecord";

export const adminDrafts = new Hono<ApiEnv>()
  .get("/", requireAdmin, validate("query", draftListQuery), async (c) => {
    const { limit, page, ...filters } = c.req.valid("query");
    const result = await listDrafts(c.env.DB, filters, { limit, page });
    c.header("Cache-Control", NO_STORE);
    return c.json(result, 200);
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
    "/merge",
    requireSiteOrigin,
    rateLimitAdmin,
    requireAdminSession,
    validate("json", draftMergeBody),
    async (c) => {
      const actor = c.var.user!.name;
      const results: MergeResult[] = [];
      for (const draftId of c.req.valid("json").draftIds) {
        results.push(await mergeOne(c.env.DB, draftId, actor));
      }
      const species = [
        ...new Set(
          results.flatMap((result) =>
            result.status === "approved" ? [result.speciesId] : [],
          ),
        ),
      ];
      const revalidated =
        species.length === 0 || (await revalidateSpeciesSite(c.env, species));
      c.header("Cache-Control", NO_STORE);
      return c.json({ data: { results, revalidated } }, 200);
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

type MergeResult =
  | { code: ApiErrorCode; draftId: number; message: string; status: "failed" }
  | { draftId: number; speciesId: string; status: "approved"; version: number };

async function mergeOne(
  db: ApiDatabase,
  draftId: number,
  actor: string,
): Promise<MergeResult> {
  try {
    const draft = await pendingSpeciesDraft(db, draftId);
    const version = await approveSpeciesDraft(db, draft, actor);
    return { draftId, speciesId: draft.speciesId, status: "approved", version };
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    return {
      code: error.code,
      draftId,
      message: error.message,
      status: "failed",
    };
  }
}
