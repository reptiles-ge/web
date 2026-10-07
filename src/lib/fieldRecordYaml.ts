import type { SpeciesFieldRecord } from "@/data/speciesTypes";

import { yamlScalar } from "@/lib/yamlScalar";

type FieldRecordEntryFilter = (key: string, value: string) => boolean;

export function formatFieldRecordYaml(
  record: SpeciesFieldRecord,
  include: FieldRecordEntryFilter = () => true,
): string {
  const lines = [`  - locality: ${yamlScalar(record.locality)}`];
  lines.push(`    lat: ${record.lat}`);
  lines.push(`    lng: ${record.lng}`);
  for (const [key, value] of fieldRecordEntries(record)) {
    if (!include(key, value)) continue;
    lines.push(
      `    ${key === "url" ? `url: ${JSON.stringify(value)}` : `${key}: ${yamlScalar(value)}`}`,
    );
  }
  return `${lines.join("\n")}\n`;
}

function fieldRecordEntries(
  record: SpeciesFieldRecord,
): Array<[string, string]> {
  const entries: Array<[string, string]> = [];
  if (record.date) entries.push(["date", record.date]);
  if (record.observer) entries.push(["observer", record.observer]);
  if (record.observerName) entries.push(["observerName", record.observerName]);
  if (record.source) entries.push(["source", record.source]);
  if (record.url) entries.push(["url", record.url]);
  if (record.note) entries.push(["note", record.note]);
  if (record.evidence) entries.push(["evidence", record.evidence]);
  return entries;
}
