import type { ApiDatabase } from "./database";
import type { SpeciesRecord } from "./speciesRows";
import type { SpeciesRevision } from "./speciesWrite";

export type DraftStatus = "approved" | "pending" | "rejected";

export type SpeciesDraft = {
  actor: string;
  baseRecord: null | SpeciesRecord;
  baseVersion: number;
  createdAt: string;
  decidedAt: null | string;
  decidedBy: null | string;
  id: number;
  record: SpeciesRecord;
  source: SpeciesRevision["source"];
  speciesId: string;
  status: DraftStatus;
  summary: string;
};

type DraftListRow = Omit<DraftRow, "base_record" | "record"> & {
  common_name_ka: string;
  scientific_name: string;
  species_version: number;
};

type DraftRow = {
  actor: string;
  base_record: null | string;
  base_version: number;
  created_at: string;
  decided_at: null | string;
  decided_by: null | string;
  id: number;
  record: string;
  source: SpeciesRevision["source"];
  species_id: string;
  status: DraftStatus;
  summary: string;
};

const COLUMNS =
  "id, species_id, base_version, base_record, source, actor, summary, record, status, created_at, decided_at, decided_by";

export function decideDraftStatement(
  db: ApiDatabase,
  draftId: number,
  status: "approved" | "rejected",
  actor: string,
  baseRecord: null | SpeciesRecord = null,
) {
  return db
    .prepare(
      "UPDATE species_drafts SET status = ?, decided_by = CASE WHEN status = 'pending' THEN ? END, decided_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), base_record = COALESCE(base_record, ?) WHERE id = ?",
    )
    .bind(
      status,
      actor,
      baseRecord ? JSON.stringify(baseRecord) : null,
      draftId,
    );
}

export async function insertDraft(
  db: ApiDatabase,
  draft: Omit<
    SpeciesDraft,
    "createdAt" | "decidedAt" | "decidedBy" | "id" | "speciesId" | "status"
  >,
) {
  const row = await db
    .prepare(
      "INSERT INTO species_drafts (species_id, base_version, base_record, source, actor, summary, record) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id",
    )
    .bind(
      draft.record.base.id,
      draft.baseVersion,
      draft.baseRecord ? JSON.stringify(draft.baseRecord) : null,
      draft.source,
      draft.actor,
      draft.summary,
      JSON.stringify(draft.record),
    )
    .first<{ id: number }>();
  return row!.id;
}

export async function listDrafts(
  db: ApiDatabase,
  status: DraftStatus,
  limit: number,
) {
  const { results } = await db
    .prepare(
      "SELECT d.id, d.species_id, d.base_version, d.source, d.actor, d.summary, d.status, d.created_at, d.decided_at, d.decided_by, s.version AS species_version, s.scientific_name, k.common_name AS common_name_ka FROM species_drafts d JOIN species s ON s.id = d.species_id JOIN species_texts k ON k.species_id = d.species_id AND k.locale = 'ka' WHERE d.status = ? ORDER BY d.id DESC LIMIT ?",
    )
    .bind(status, limit)
    .all<DraftListRow>();
  return results.map((row) => ({
    actor: row.actor,
    baseVersion: row.base_version,
    commonName: row.common_name_ka,
    createdAt: row.created_at,
    decidedAt: row.decided_at,
    decidedBy: row.decided_by,
    id: row.id,
    scientificName: row.scientific_name,
    source: row.source,
    speciesId: row.species_id,
    speciesVersion: row.species_version,
    status: row.status,
    summary: row.summary,
  }));
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
    baseRecord: row.base_record
      ? (JSON.parse(row.base_record) as SpeciesRecord)
      : null,
    baseVersion: row.base_version,
    createdAt: row.created_at,
    decidedAt: row.decided_at,
    decidedBy: row.decided_by,
    id: row.id,
    record: JSON.parse(row.record) as SpeciesRecord,
    source: row.source,
    speciesId: row.species_id,
    status: row.status,
    summary: row.summary,
  };
}
