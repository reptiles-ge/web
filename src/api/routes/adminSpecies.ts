import type { Context } from "hono";

import { Hono } from "hono";

import type { SpeciesRecord } from "../db/speciesRows";
import type { ApiEnv } from "../env";

import { readFieldRecords } from "../db/fieldRecords";
import { upsertOptimizedImageStatement } from "../db/optimizedImages";
import { listAdminSpecies } from "../db/species";
import { insertDraft, listPendingDrafts } from "../db/speciesDrafts";
import { readSpeciesRecord, readSpeciesVersion } from "../db/speciesWrite";
import { bunnyStorage } from "../lib/bunnyStorage";
import { NO_STORE } from "../lib/cache";
import { ApiError } from "../lib/errors";
import {
  addGalleryPhoto,
  checkPhotoFiles,
  optimizedImage,
  photoCredits,
  storePhoto,
} from "../lib/photoUpload";
import {
  ensureSiteRevalidated,
  revalidateSpeciesPage,
} from "../lib/revalidateSite";
import {
  approveSpeciesDraft,
  pendingSpeciesDraft,
  rejectSpeciesDraft,
  saveSpeciesRecord,
  versionConflict,
} from "../lib/speciesDrafts";
import {
  removePhoto,
  reorderPhotos,
  setCover,
  setPhotoCoordinates,
} from "../lib/speciesPhotos";
import { validate } from "../lib/validate";
import { rateLimitAdmin } from "../middleware/rateLimitAdmin";
import { rateLimitUpload } from "../middleware/rateLimitUpload";
import { requireAdmin } from "../middleware/requireAdmin";
import { requireAdminSession } from "../middleware/requireAdminSession";
import { requireSiteOrigin } from "../middleware/requireSiteOrigin";
import { requireToken } from "../middleware/requireToken";
import { photoUploadForm } from "../schemas/photoUpload";
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
  .get("/", requireAdmin, async (c) => {
    const data = await listAdminSpecies(c.env.DB);
    c.header("Cache-Control", NO_STORE);
    return c.json({ data, total: data.length }, 200);
  })
  .get("/:id", requireAdmin, validate("param", speciesIdParam), async (c) => {
    const found = await readSpeciesRecord(c.env.DB, c.req.valid("param").id);
    if (!found) throw new ApiError(404, "not_found", "Species not found");
    c.header("Cache-Control", NO_STORE);
    return c.json({ data: found }, 200);
  })
  .get(
    "/:id/field-records",
    requireAdmin,
    validate("param", speciesIdParam),
    async (c) => {
      const { id } = c.req.valid("param");
      if ((await readSpeciesVersion(c.env.DB, id)) === null) {
        throw new ApiError(404, "not_found", "Species not found");
      }
      const data = await readFieldRecords(c.env.DB, id);
      c.header("Cache-Control", NO_STORE);
      return c.json({ data, id, total: data.length }, 200);
    },
  )
  .post(
    "/:id/revalidate",
    requireSiteOrigin,
    rateLimitAdmin,
    requireAdminSession,
    validate("param", speciesIdParam),
    async (c) => {
      const { id } = c.req.valid("param");
      if ((await readSpeciesVersion(c.env.DB, id)) === null) {
        throw new ApiError(404, "not_found", "Species not found");
      }
      await ensureSiteRevalidated(revalidateSpeciesPage(c.env, id));
      c.header("Cache-Control", NO_STORE);
      return c.json({ data: { id } }, 200);
    },
  )
  .post(
    "/:id/photos",
    requireSiteOrigin,
    rateLimitUpload,
    requireAdminSession,
    validate("param", speciesIdParam),
    validate("form", photoUploadForm),
    async (c) => {
      const { id } = c.req.valid("param");
      const { derivatives, georgiaField, original, ...credit } =
        c.req.valid("form");
      const current = await readSpeciesRecord(c.env.DB, id);
      if (!current) throw new ApiError(404, "not_found", "Species not found");
      const storage = bunnyStorage(c.env);
      const credits = photoCredits({
        ...credit,
        georgiaField: georgiaField === "1",
      });
      const photo = await checkPhotoFiles(original, derivatives);
      const key = await storePhoto(
        storage,
        photo,
        current.record,
        credit.photographer,
      );
      const src = storage.urlFor(key);
      const optimized = optimizedImage(photo, key, storage);
      const { result, version } = await change(
        c,
        id,
        c.var.user!.email,
        "Add gallery photo",
        (record) => addGalleryPhoto(record, src, credits),
        optimized
          ? [
              upsertOptimizedImageStatement(
                c.env.DB,
                optimized,
                new Date().toISOString(),
              ),
            ]
          : [],
        current,
      );
      return c.json(
        { data: { optimized: optimized !== null, photo: result, version } },
        201,
      );
    },
  )
  .use(requireToken)
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
      const version = await saveSpeciesRecord(
        c.env.DB,
        record,
        expectedVersion,
        {
          actor,
          source,
          summary,
        },
      );
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
      const { draftId, id } = c.req.valid("param");
      const draft = await pendingSpeciesDraft(c.env.DB, draftId, id);
      const version = await approveSpeciesDraft(
        c.env.DB,
        draft,
        c.req.valid("json").actor,
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
      const { draftId, id } = c.req.valid("param");
      await pendingSpeciesDraft(c.env.DB, draftId, id);
      await rejectSpeciesDraft(c.env.DB, draftId, c.req.valid("json").actor);
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
  alsoRun: Parameters<typeof saveSpeciesRecord>[4] = [],
  read?: Awaited<ReturnType<typeof readSpeciesRecord>>,
) {
  const current = read ?? (await readSpeciesRecord(c.env.DB, id));
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
  const version = await saveSpeciesRecord(
    c.env.DB,
    record,
    current.version,
    { actor, source: "admin", summary },
    alsoRun,
  );
  c.header("Cache-Control", NO_STORE);
  return { record, result, version };
}

function covers(record: SpeciesRecord) {
  return {
    image: record.base.image,
    mobileImage: record.base.mobileImage ?? "",
  };
}
