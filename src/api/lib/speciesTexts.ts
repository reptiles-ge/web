import type { z } from "zod";

import type { SpeciesRecord } from "../db/speciesRows";
import type { speciesTextsBody } from "../schemas/speciesRecord";

import { ApiError } from "./errors";

type SpeciesTexts = z.infer<typeof speciesTextsBody>["texts"];

type TextLocale = z.infer<typeof speciesTextsBody>["locale"];

const OPTIONAL_KEYS = ["faq", "interaction"] as const;

const REQUIRED_KEYS = [
  "behavior",
  "commonName",
  "conservation",
  "description",
  "diet",
  "facts",
  "habitat",
  "location",
  "overview",
  "stats",
] as const;

export function applySpeciesTexts(
  record: SpeciesRecord,
  locale: TextLocale,
  texts: SpeciesTexts,
) {
  const target: Record<string, unknown> =
    locale === "ka" ? record.base : record.translations[locale];
  const current = target as Pick<
    SpeciesRecord["base"],
    "facts" | "faq" | "identification" | "stats"
  >;
  const issues = [
    countIssue("facts", current.facts.length, texts.facts.length),
    countIssue("faq", current.faq?.length ?? 0, texts.faq?.length ?? 0),
    countIssue("stats", current.stats.length, texts.stats.length),
    countIssue(
      "identification.traits",
      current.identification?.traits.length ?? 0,
      texts.identification?.traits.length ?? 0,
    ),
  ].filter((issue) => issue !== null);
  if (Boolean(current.identification) !== Boolean(texts.identification)) {
    issues.push({
      message: "A text edit cannot add or remove identification",
      path: "identification",
    });
  }
  if (issues.length > 0) {
    throw new ApiError(
      400,
      "invalid_request",
      "A text edit cannot add or remove list items",
      issues,
    );
  }
  for (const key of REQUIRED_KEYS) target[key] = texts[key];
  for (const key of OPTIONAL_KEYS) {
    if (texts[key] === undefined) delete target[key];
    else target[key] = texts[key];
  }
  if (current.identification && texts.identification) {
    const { coloration, summary, traits } = texts.identification;
    const next = { ...current.identification, summary, traits };
    if (coloration === undefined) delete next.coloration;
    else next.coloration = coloration;
    current.identification = next;
  }
}

function countIssue(path: string, expected: number, actual: number) {
  return expected === actual
    ? null
    : { message: `Has ${actual} items, expected ${expected}`, path };
}
