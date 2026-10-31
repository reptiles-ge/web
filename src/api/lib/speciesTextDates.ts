import { toSiteDateTime } from "@/lib/siteTime";

import type { SpeciesRecord } from "../db/speciesRows";

import { TRANSLATION_LOCALES } from "../db/speciesRows";
import { stableJson } from "./stableJson";

const TEXT_KEYS = [
  "behavior",
  "commonName",
  "conservation",
  "description",
  "diet",
  "facts",
  "faq",
  "habitat",
  "identification",
  "interaction",
  "location",
  "overview",
  "stats",
] as const;

export function stampSpeciesTextDates(
  record: SpeciesRecord,
  live: null | SpeciesRecord,
  now: Date = new Date(),
) {
  const stamp = toSiteDateTime(now);
  record.base.updatedAt =
    live && sameText(record.base, live.base) ? live.base.updatedAt : stamp;
  for (const locale of TRANSLATION_LOCALES) {
    const translation = record.translations[locale];
    const before = live?.translations[locale];
    if (!before || !sameText(translation, before)) {
      translation.updatedAt = stamp;
    } else if (before.updatedAt) {
      translation.updatedAt = before.updatedAt;
    } else {
      delete translation.updatedAt;
    }
  }
}

function sameText(next: object, before: object) {
  return textKey(next) === textKey(before);
}

function textKey(fields: object) {
  const source = fields as Record<string, unknown>;
  return stableJson(TEXT_KEYS.map((key) => source[key] ?? null));
}
