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
