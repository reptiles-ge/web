import type { AdminSpeciesRecord } from "@/lib/adminSpeciesApi";

export type RecordLocale = "en" | "ka" | "ru" | "tr";

export function readRecordField(
  record: AdminSpeciesRecord,
  locale: RecordLocale,
  field: string,
) {
  let value: unknown = localeRoot(record, locale);
  for (const segment of field.split(".")) {
    if (value === null || typeof value !== "object") return "";
    value = (value as Record<string, unknown>)[segment];
  }
  return typeof value === "string" ? value : "";
}

export function writeRecordField(
  record: AdminSpeciesRecord,
  locale: RecordLocale,
  field: string,
  text: string,
) {
  const segments = field.split(".");
  const last = segments.pop()!;
  let target = localeRoot(record, locale) as Record<string, unknown>;
  for (const segment of segments) {
    const next = target[segment];
    if (next === null || typeof next !== "object") {
      throw new Error(`Cannot write ${field} for ${locale}`);
    }
    target = next as Record<string, unknown>;
  }
  target[last] = text;
}

function localeRoot(record: AdminSpeciesRecord, locale: RecordLocale) {
  return locale === "ka" ? record.base : record.translations[locale];
}
