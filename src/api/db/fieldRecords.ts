import type { SpeciesFieldRecord } from "@/data/speciesTypes";

import type { ApiDatabase } from "./database";

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

export function fieldRecordStatements(
  db: ApiDatabase,
  speciesId: string,
  records: SpeciesFieldRecord[],
) {
  return [
    db
      .prepare("DELETE FROM species_field_records WHERE species_id = ?")
      .bind(speciesId),
    db
      .prepare(
        "INSERT INTO species_field_records (species_id, position, locality, lat, lng, evidence, date, note, observer, observer_name, source, url) SELECT ?, key, json_extract(value, '$.locality'), json_extract(value, '$.lat'), json_extract(value, '$.lng'), json_extract(value, '$.evidence'), json_extract(value, '$.date'), json_extract(value, '$.note'), json_extract(value, '$.observer'), json_extract(value, '$.observerName'), json_extract(value, '$.source'), json_extract(value, '$.url') FROM json_each(?)",
      )
      .bind(speciesId, JSON.stringify(records)),
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
