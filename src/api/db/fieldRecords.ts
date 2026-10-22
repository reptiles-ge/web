import type { SpeciesFieldRecord } from "@/data/speciesTypes";

import type { ApiDatabase } from "./database";

import { renderLiteralInserts } from "./sqlRender";

type FieldRecordRow = {
  date: null | string;
  evidence: null | SpeciesFieldRecord["evidence"];
  lat: number;
  lng: number;
  locality: string;
  note: null | string;
  observer: null | string;
  observer_name: null | string;
  source: null | string;
  url: null | string;
};

const COLUMNS = [
  "species_id",
  "position",
  "locality",
  "lat",
  "lng",
  "evidence",
  "date",
  "note",
  "observer",
  "observer_name",
  "source",
  "url",
] as const;

export const FIELD_RECORDS_IMPORT_GUARD =
  "INSERT INTO species_import_runs (ran_at) SELECT CASE WHEN EXISTS (SELECT 1 FROM species_field_records) THEN NULL ELSE strftime('%Y-%m-%dT%H:%M:%fZ', 'now') END;";

export function buildFieldRecordsImport(
  recordsById: Record<string, SpeciesFieldRecord[]>,
) {
  const rows = Object.entries(recordsById).flatMap(([id, records]) =>
    records.map((record, position) => [
      id,
      position,
      record.locality,
      record.lat,
      record.lng,
      record.evidence ?? null,
      record.date ?? null,
      record.note ?? null,
      record.observer ?? null,
      record.observerName ?? null,
      record.source ?? null,
      record.url ?? null,
    ]),
  );
  return [
    FIELD_RECORDS_IMPORT_GUARD,
    ...renderLiteralInserts("species_field_records", COLUMNS, rows),
  ];
}

export async function readFieldRecords(db: ApiDatabase, speciesId: string) {
  const { results } = await db
    .prepare(
      "SELECT locality, lat, lng, evidence, date, note, observer, observer_name, source, url FROM species_field_records WHERE species_id = ? ORDER BY position",
    )
    .bind(speciesId)
    .all<FieldRecordRow>();
  return results.map((row) => {
    const record: SpeciesFieldRecord = {
      lat: row.lat,
      lng: row.lng,
      locality: row.locality,
    };
    if (row.date !== null) record.date = row.date;
    if (row.evidence !== null) record.evidence = row.evidence;
    if (row.note !== null) record.note = row.note;
    if (row.observer !== null) record.observer = row.observer;
    if (row.observer_name !== null) record.observerName = row.observer_name;
    if (row.source !== null) record.source = row.source;
    if (row.url !== null) record.url = row.url;
    return record;
  });
}
