import type { Context } from "hono";

import { Hono } from "hono";

import type { SpeciesRecord } from "../db/speciesRows";
import type { ApiEnv } from "../env";

import {
  decideDraftStatement,
  insertDraft,
  listPendingDrafts,
  readDraft,
} from "../db/speciesDrafts";
import {
  readSpeciesRecord,
  readSpeciesVersion,
  type SpeciesRevision,
  writeSpeciesRecord,
} from "../db/speciesWrite";
import { inBackground } from "../lib/background";
import { NO_STORE } from "../lib/cache";
import { ApiError } from "../lib/errors";
import { revalidateSpeciesPages } from "../lib/revalidateSite";
import {
  removePhoto,
  reorderPhotos,
  setCover,
  setPhotoCoordinates,
} from "../lib/speciesPhotos";
import { validate } from "../lib/validate";
import { requireToken } from "../middleware/requireToken";
import {
  draftCreateBody,
  draftDecisionBody,
  draftParam,
  photoCoordinatesBody,
  photoCoverBody,
  photoOrderBody,
  photoRemoveBody,
  speciesIdParam,
  speciesRecordSchema,
  speciesWriteBody,
} from "../schemas/speciesRecord";

export const adminSpecies = new Hono<ApiEnv>()
  .use(requireToken)
  .get("/:id", validate("param", speciesIdParam), async (c) => {
    const found = await readSpeciesRecord(c.env.DB, c.req.valid("param").id);
    if (!found) throw new ApiError(404, "not_found", "Species not found");
    c.header("Cache-Control", NO_STORE);
    return c.json({ data: found }, 200);
  })
  .put(
    "/:id",
    validate("param", speciesIdParam),
    validate("json", speciesWriteBody),
    async (c) => {
      const { id } = c.req.valid("param");
      const { actor, expectedVersion, record, source, summary } =
        c.req.valid("json");
      if (record.base.id !== id) {
        throw new ApiError(
          400,
          "invalid_request",
          "Body id does not match the URL",
        );
      }
      const current = await readSpeciesVersion(c.env.DB, id);
      if (current === null) {
        throw new ApiError(404, "not_found", "Species not found");
      }
      if (current !== expectedVersion) throw versionConflict(current);
      const version = await save(c, record, expectedVersion, {
        actor,
        source,
        summary,
      });
      c.header("Cache-Control", NO_STORE);
      return c.json({ data: { id, version } }, 200);
    },
  )
  .post(
    "/:id/photos/cover",
    validate("param", speciesIdParam),
    validate("json", photoCoverBody),
    async (c) => {
      const { actor, coverSrc, src, target } = c.req.valid("json");
      const { record, version } = await change(
        c,
        c.req.valid("param").id,
        actor,
        `Set ${target} cover`,
        (draft) => setCover(draft, target, src, coverSrc),
      );
      return c.json({ data: { ...covers(record), version } }, 200);
    },
  )
  .post(
    "/:id/photos/order",
    validate("param", speciesIdParam),
    validate("json", photoOrderBody),
    async (c) => {
      const { actor, srcs } = c.req.valid("json");
      const { version } = await change(
        c,
        c.req.valid("param").id,
        actor,
        "Reorder gallery",
        (draft) => reorderPhotos(draft, srcs),
      );
      return c.json({ data: { version } }, 200);
    },
  )
  .post(
    "/:id/photos/remove",
    validate("param", speciesIdParam),
    validate("json", photoRemoveBody),
    async (c) => {
      const { actor, src } = c.req.valid("json");
      const { record, result, version } = await change(
        c,
        c.req.valid("param").id,
        actor,
        "Remove gallery photo",
        (draft) => removePhoto(draft, src),
      );
      return c.json({ data: { ...result, ...covers(record), version } }, 200);
    },
  )
  .post(
    "/:id/photos/coordinates",
    validate("param", speciesIdParam),
    validate("json", photoCoordinatesBody),
    async (c) => {
      const { actor, coordinates, src } = c.req.valid("json");
      const { result, version } = await change(
        c,
        c.req.valid("param").id,
        actor,
        coordinates ? "Set photo coordinates" : "Clear photo coordinates",
        (draft) => setPhotoCoordinates(draft, src, coordinates),
      );
      return c.json({ data: { credit: result ?? {}, version } }, 200);
    },
  )
  .post(
    "/:id/drafts",
    validate("param", speciesIdParam),
    validate("json", draftCreateBody),
    async (c) => {
      const { id } = c.req.valid("param");
      const { actor, baseVersion, record, source, summary } =
        c.req.valid("json");
      if (record.base.id !== id) {
        throw new ApiError(
          400,
          "invalid_request",
          "Body id does not match the URL",
        );
      }
      const current = await readSpeciesVersion(c.env.DB, id);
      if (current === null) {
        throw new ApiError(404, "not_found", "Species not found");
      }
      if (current !== baseVersion) throw versionConflict(current);
      const draftId = await insertDraft(c.env.DB, {
        actor,
        baseVersion,
        record,
        source,
        summary,
      });
      c.header("Cache-Control", NO_STORE);
      return c.json({ data: { draftId } }, 201);
    },
  )
  .get("/:id/drafts", validate("param", speciesIdParam), async (c) => {
    const drafts = await listPendingDrafts(c.env.DB, c.req.valid("param").id);
    c.header("Cache-Control", NO_STORE);
    return c.json({ data: drafts }, 200);
  })
  .post(
    "/:id/drafts/:draftId/approve",
    validate("param", draftParam),
    validate("json", draftDecisionBody),
    async (c) => {
      const draft = await pendingDraft(c, c.req.valid("param"));
      const checked = speciesRecordSchema.safeParse(draft.record);
      if (!checked.success) {
        throw new ApiError(
          400,
          "invalid_request",
          "The draft breaks a content rule",
          checked.error.issues,
        );
      }
      const current = await readSpeciesVersion(c.env.DB, draft.speciesId);
      if (current !== draft.baseVersion) throw versionConflict(current ?? 0);
      const { actor } = c.req.valid("json");
      const version = await save(
        c,
        draft.record,
        draft.baseVersion,
        { actor, source: draft.source, summary: draft.summary },
        [decideDraftStatement(c.env.DB, draft.id, "approved", actor)],
      );
      c.header("Cache-Control", NO_STORE);
      return c.json({ data: { status: "approved" as const, version } }, 200);
    },
  )
  .post(
    "/:id/drafts/:draftId/reject",
    validate("param", draftParam),
    validate("json", draftDecisionBody),
    async (c) => {
      const draft = await pendingDraft(c, c.req.valid("param"));
      await decideDraftStatement(
        c.env.DB,
        draft.id,
        "rejected",
        c.req.valid("json").actor,
      ).run();
      c.header("Cache-Control", NO_STORE);
      return c.json({ data: { status: "rejected" as const } }, 200);
    },
  );

async function change<T>(
  c: Context<ApiEnv>,
  id: string,
  actor: string,
  summary: string,
  apply: (record: SpeciesRecord) => T,
) {
  const current = await readSpeciesRecord(c.env.DB, id);
  if (!current) throw new ApiError(404, "not_found", "Species not found");
  const record = structuredClone(current.record);
  const result = apply(record);
  const checked = speciesRecordSchema.safeParse(record);
  if (!checked.success) {
    throw new ApiError(
      400,
      "invalid_request",
      "The change breaks a content rule",
      checked.error.issues,
    );
  }
  const version = await save(c, record, current.version, {
    actor,
    source: "admin",
    summary,
  });
  c.header("Cache-Control", NO_STORE);
  return { record, result, version };
}

function covers(record: SpeciesRecord) {
  return {
    image: record.base.image,
    mobileImage: record.base.mobileImage ?? "",
  };
}

async function pendingDraft(
  c: Context<ApiEnv>,
  { draftId, id }: { draftId: number; id: string },
) {
  const draft = await readDraft(c.env.DB, draftId);
  if (!draft || draft.speciesId !== id) {
    throw new ApiError(404, "not_found", "Draft not found");
  }
  if (draft.status !== "pending") {
    throw new ApiError(
      400,
      "invalid_request",
      `Draft is already ${draft.status}`,
    );
  }
  return draft;
}

async function save(
  c: Context<ApiEnv>,
  record: SpeciesRecord,
  expectedVersion: number,
  revision: SpeciesRevision,
  alsoRun: Parameters<typeof writeSpeciesRecord>[4] = [],
) {
  const id = record.base.id;
  let version: number;
  try {
    version = await writeSpeciesRecord(
      c.env.DB,
      record,
      expectedVersion,
      revision,
      alsoRun,
    );
  } catch (error) {
    const now = await readSpeciesVersion(c.env.DB, id);
    if (now !== null && now !== expectedVersion) throw versionConflict(now);
    throw error;
  }
  inBackground(c, revalidateSpeciesPages(c.env, id));
  return version;
}

function versionConflict(currentVersion: number) {
  return new ApiError(
    409,
    "version_conflict",
    "Species changed since it was read",
    {
      currentVersion,
    },
  );
}
