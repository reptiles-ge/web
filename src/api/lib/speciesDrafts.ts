import type { ApiDatabase } from "../db/database";
import type { SpeciesRecord } from "../db/speciesRows";

import { decideDraftStatement, readDraft } from "../db/speciesDrafts";
import {
  readSpeciesRecord,
  readSpeciesVersion,
  type SpeciesRevision,
  writeSpeciesRecord,
} from "../db/speciesWrite";
import { speciesRecordSchema } from "../schemas/speciesRecord";
import { ApiError } from "./errors";
import { stampSpeciesTextDates } from "./speciesTextDates";

type Draft = NonNullable<Awaited<ReturnType<typeof readDraft>>>;

export async function approveSpeciesDraft(
  db: ApiDatabase,
  draft: Draft,
  actor: string,
) {
  const current = await readSpeciesVersion(db, draft.speciesId);
  if (current !== draft.baseVersion) throw versionConflict(current ?? 0);
  const live = (await readSpeciesRecord(db, draft.speciesId))?.record ?? null;
  const saved: Partial<SpeciesRecord> = draft.record;
  const record: SpeciesRecord = {
    ...draft.record,
    fieldRecords: saved.fieldRecords ?? live?.fieldRecords ?? [],
    rangeMap:
      saved.rangeMap === undefined ? (live?.rangeMap ?? null) : saved.rangeMap,
  };
  const checked = speciesRecordSchema.safeParse(record);
  if (!checked.success) {
    throw new ApiError(
      400,
      "invalid_request",
      "The draft breaks a content rule",
      checked.error.issues,
    );
  }
  try {
    return await saveSpeciesRecord(
      db,
      record,
      draft.baseVersion,
      { actor, source: draft.source, summary: draft.summary },
      [
        decideDraftStatement(
          db,
          draft.id,
          "approved",
          actor,
          draft.baseRecord ?? live,
        ),
      ],
    );
  } catch (error) {
    await ensureStillPending(db, draft.id);
    throw error;
  }
}

export async function pendingSpeciesDraft(
  db: ApiDatabase,
  draftId: number,
  speciesId?: string,
) {
  const draft = await readDraft(db, draftId);
  if (!draft || (speciesId !== undefined && draft.speciesId !== speciesId)) {
    throw new ApiError(404, "not_found", "Draft not found");
  }
  if (draft.status !== "pending") throw alreadyDecided(draft.status);
  return draft;
}

export async function rejectSpeciesDraft(
  db: ApiDatabase,
  draftId: number,
  actor: string,
) {
  try {
    await decideDraftStatement(db, draftId, "rejected", actor).run();
  } catch (error) {
    await ensureStillPending(db, draftId);
    throw error;
  }
}

export async function saveSpeciesRecord(
  db: ApiDatabase,
  record: SpeciesRecord,
  expectedVersion: number,
  revision: SpeciesRevision,
  alsoRun: Parameters<typeof writeSpeciesRecord>[4] = [],
) {
  const live = (await readSpeciesRecord(db, record.base.id))?.record ?? null;
  stampSpeciesTextDates(record, live);
  try {
    return await writeSpeciesRecord(
      db,
      record,
      expectedVersion,
      revision,
      alsoRun,
    );
  } catch (error) {
    const now = await readSpeciesVersion(db, record.base.id);
    if (now !== null && now !== expectedVersion) throw versionConflict(now);
    throw error;
  }
}

export function versionConflict(currentVersion: number) {
  return new ApiError(
    409,
    "version_conflict",
    "Species changed since it was read",
    {
      currentVersion,
    },
  );
}

function alreadyDecided(status: string) {
  return new ApiError(400, "invalid_request", `Draft is already ${status}`);
}

async function ensureStillPending(db: ApiDatabase, draftId: number) {
  const now = await readDraft(db, draftId);
  if (now && now.status !== "pending") throw alreadyDecided(now.status);
}
