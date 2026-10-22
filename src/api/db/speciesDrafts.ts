import type { ApiDatabase } from "./database";
import type { SpeciesRecord } from "./speciesRows";
import type { SpeciesRevision } from "./speciesWrite";

export type SpeciesDraft = {
  actor: string;
  baseVersion: number;
  createdAt: string;
  id: number;
  record: SpeciesRecord;
  source: SpeciesRevision["source"];
  speciesId: string;
  status: "approved" | "pending" | "rejected";
  summary: string;
};

type DraftRow = {
  actor: string;
  base_version: number;
  created_at: string;
  id: number;
  record: string;
  source: SpeciesRevision["source"];
  species_id: string;
  status: SpeciesDraft["status"];
  summary: string;
};

const COLUMNS =
  "id, species_id, base_version, source, actor, summary, record, status, created_at";

export function decideDraftStatement(
  db: ApiDatabase,
  draftId: number,
  status: "approved" | "rejected",
  actor: string,
) {
  return db
    .prepare(
      "UPDATE species_drafts SET status = ?, decided_by = ?, decided_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ? AND status = 'pending'",
    )
    .bind(status, actor, draftId);
}

export async function insertDraft(
  db: ApiDatabase,
  draft: Omit<SpeciesDraft, "createdAt" | "id" | "speciesId" | "status">,
) {
  const row = await db
    .prepare(
      "INSERT INTO species_drafts (species_id, base_version, source, actor, summary, record) VALUES (?, ?, ?, ?, ?, ?) RETURNING id",
    )
    .bind(
      draft.record.base.id,
      draft.baseVersion,
      draft.source,
      draft.actor,
      draft.summary,
      JSON.stringify(draft.record),
    )
    .first<{ id: number }>();
  return row!.id;
}

export async function listPendingDrafts(db: ApiDatabase, speciesId: string) {
  const { results } = await db
    .prepare(
      `SELECT ${COLUMNS} FROM species_drafts WHERE species_id = ? AND status = 'pending' ORDER BY id`,
    )
    .bind(speciesId)
    .all<DraftRow>();
  return results.map(toDraft);
}

export async function readDraft(db: ApiDatabase, draftId: number) {
  const row = await db
    .prepare(`SELECT ${COLUMNS} FROM species_drafts WHERE id = ?`)
    .bind(draftId)
    .first<DraftRow>();
  return row ? toDraft(row) : null;
}

function toDraft(row: DraftRow): SpeciesDraft {
  return {
    actor: row.actor,
    baseVersion: row.base_version,
    createdAt: row.created_at,
    id: row.id,
    record: JSON.parse(row.record) as SpeciesRecord,
    source: row.source,
    speciesId: row.species_id,
    status: row.status,
    summary: row.summary,
  };
}
