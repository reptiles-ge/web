import {
  type AdminSpeciesRecord,
  proposeAdminSpeciesDraft,
  readAdminSpecies,
} from "@/lib/adminSpeciesApi";
import { type EditorResult, validateEditorResult } from "@/lib/contentEditor";
import { transformWithAgent } from "@/lib/contentEditorAgent";
import {
  draftReviewUrl,
  finalizeEditorValues,
} from "@/lib/contentEditorTarget";
import { toSiteDateTime } from "@/lib/siteTime";
import { lockSpeciesAnalysis } from "@/lib/speciesAnalysisLock";
import { readRecordField, writeRecordField } from "@/lib/speciesRecordFields";
import {
  formatStyleIssues,
  lintFieldStyle,
  lintHedgeLoss,
  type StyleLocale,
} from "@/lib/writingStyleLint";

export type SpeciesTextSource = {
  commonName?: string;
  danger?: unknown;
  fields: string[];
  id: string;
  read: (locale: StyleLocale, field: string) => string;
  scientificName?: string;
  speciesNames: (ids: string[]) => Promise<Array<Record<StyleLocale, string>>>;
};

function speciesTextFields(
  read: (field: string) => string,
  traits: number,
  faq: number,
) {
  const fields = [
    "description",
    "interaction",
    "overview",
    "identification.summary",
    "identification.coloration",
    ...Array.from(
      { length: traits },
      (_, index) => `identification.traits.${index}`,
    ),
    "habitat",
    "diet",
    "behavior",
    "conservation",
    ...Array.from({ length: faq }, (_, index) => `faq.${index}.answer`),
  ];
  return fields.filter((field) => read(field).trim());
}

const TEXT_LOCALES = ["ka", "en", "ru", "tr"] as const;
const RISK_LEVELS = ["Harmless", "High", "Moderate"] as const;
const LEAD_FIELDS = ["identification.summary", "overview"];
const TEXT_PHASES: Array<(field: string) => boolean> = [
  (field) =>
    field !== "description" &&
    !LEAD_FIELDS.includes(field) &&
    !field.startsWith("faq."),
  (field) => field.startsWith("faq."),
  (field) => LEAD_FIELDS.includes(field),
  (field) => field === "description",
];

export async function processSpeciesTexts(id: string) {
  const unlock = lockSpeciesAnalysis(id);
  try {
    const { record, version } = await readAdminSpecies(id);
    const { notes, updates } = await rewriteSpeciesTexts(
      recordSpeciesTextSource(record),
    );
    if (!updates.length) throw new Error("No page texts changed");
    const draft = structuredClone(record);
    for (const { field, result } of updates) {
      const values = finalizeEditorValues(result, (locale) =>
        readRecordField(record, locale, field),
      );
      for (const locale of TEXT_LOCALES) {
        if (values[locale] !== readRecordField(record, locale, field)) {
          writeRecordField(draft, locale, field, values[locale]);
        }
      }
    }
    draft.base.updatedAt = toSiteDateTime(new Date());
    const { draftId } = await proposeAdminSpeciesDraft(id, {
      baseVersion: version,
      record: draft,
      summary: `Rewrite ${updates.length} page texts`,
    });
    return {
      report: speciesTextsReport(updates, notes),
      reviewUrl: draftReviewUrl(id, draftId),
    };
  } finally {
    unlock();
  }
}

export async function rewriteSpeciesTexts(source: SpeciesTextSource) {
  const { commonName, fields } = source;
  if (!fields.length) throw new Error("No page texts to process");
  const originals = Object.fromEntries(
    fields.map((field) => [
      field,
      Object.fromEntries(
        TEXT_LOCALES.map((locale) => [locale, source.read(locale, field)]),
      ) as EditorResult,
    ]),
  ) as Record<string, EditorResult>;
  const speciesNames = await source.speciesNames(
    linkedSpeciesIds(fields.map((field) => originals[field].ka)).filter(
      (other) => other !== source.id,
    ),
  );
  const results = new Map<string, EditorResult>();
  const rewrite = async (
    field: string,
    styleRepair?: { issues: string; previous: string },
  ) => {
    const selection = { after: "", before: "", selected: originals[field].ka };
    const { en, ru, tr } = originals[field];
    return validateEditorResult(
      await transformWithAgent({
        ...selection,
        commonName,
        existingTranslations: { en, ru, tr },
        field,
        latinName: source.scientificName,
        otherFields: Object.fromEntries(
          fields
            .filter((other) => other !== field)
            .map((other) => [
              other,
              (results.get(other) ?? originals[other]).ka,
            ]),
        ),
        riskLevel: RISK_LEVELS.find((level) => level === source.danger),
        speciesNames,
        styleRepair,
      }),
      selection,
    );
  };
  const styleIssues = (field: string, result: EditorResult) =>
    TEXT_LOCALES.flatMap((locale) => [
      ...lintFieldStyle(result[locale], field, locale, commonName),
      ...lintHedgeLoss(originals[field][locale], result[locale], field, locale),
    ]);
  const ordered = TEXT_PHASES.map((phase) => fields.filter(phase));
  for (const phase of ordered)
    for (let index = 0; index < phase.length; index += 3) {
      const batch = await Promise.all(
        phase.slice(index, index + 3).map(async (field) => {
          const first = await rewrite(field);
          const issues = styleIssues(field, first);
          const result = issues.length
            ? await rewrite(field, {
                issues: formatStyleIssues(issues),
                previous: first.ka,
              }).catch(() => first)
            : first;
          return [field, result] as const;
        }),
      );
      for (const [field, result] of batch) results.set(field, result);
    }
  const rejected = numberLosses(fields, originals, results);
  const kept = fields.filter((field) => !rejected.has(field));
  return {
    notes: [
      ...[...rejected].map(
        (field) => `${field}: რიცხვი დაიკარგა ან შეიცვალა, ველი უცვლელად დარჩა`,
      ),
      ...kept.flatMap((field) =>
        styleIssues(field, results.get(field)!).map(
          (issue) =>
            `${field} [${issue.rule}, ${issue.locale}]: ${issue.message}`,
        ),
      ),
    ],
    updates: kept.map((field) => ({
      field,
      result: results.get(field)!,
      source: originals[field].ka,
    })),
  };
}

function analysisNumbers(value: string) {
  return [
    ...new Set(
      (
        value
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
          .match(/\d{1,3}(?:[ \u00a0,]\d{3})+(?![.,]?\d)|\d+(?:[.,]\d+)?/g) ??
        []
      ).map((item) =>
        /^\d{1,3}(?:[ \u00a0,]\d{3})+$/.test(item)
          ? item.replace(/[ \u00a0,]/g, "")
          : item.replace(",", "."),
      ),
    ),
  ].sort();
}

function linkedSpeciesIds(texts: string[]) {
  return [
    ...new Set(
      texts.flatMap((text) =>
        [...text.matchAll(/\]\(([a-z]+(?:-[a-z]+)+)\)/g)].map(
          (match) => match[1]!,
        ),
      ),
    ),
  ];
}

function numberLosses(
  fields: string[],
  originals: Record<string, EditorResult>,
  results: Map<string, EditorResult>,
) {
  const rejected = new Set<string>();
  for (let size = -1; size !== rejected.size;) {
    size = rejected.size;
    for (const locale of TEXT_LOCALES) {
      const text = (field: string) =>
        rejected.has(field)
          ? originals[field][locale]
          : results.get(field)![locale];
      const page = new Set(
        fields.flatMap((field) => analysisNumbers(text(field))),
      );
      const original = new Set(
        fields.flatMap((field) => analysisNumbers(originals[field][locale])),
      );
      for (const field of fields) {
        if (rejected.has(field)) continue;
        const before = analysisNumbers(originals[field][locale]);
        const beforeSet = new Set(before);
        const after = analysisNumbers(text(field));
        if (
          after.some(
            (value) => !beforeSet.has(value) && !original.has(value),
          ) ||
          before.some((value) => !page.has(value))
        )
          rejected.add(field);
      }
    }
  }
  return rejected;
}

function recordSpeciesTextSource(
  record: AdminSpeciesRecord,
): SpeciesTextSource {
  const { base } = record;
  return {
    commonName: base.commonName,
    danger: base.danger,
    fields: speciesTextFields(
      (field) => readRecordField(record, "ka", field),
      base.identification?.traits.length ?? 0,
      base.faq?.length ?? 0,
    ),
    id: base.id,
    read: (locale, field) => readRecordField(record, locale, field),
    scientificName: base.scientificName,
    speciesNames: async (ids) =>
      (
        await Promise.all(
          ids.map(async (other) => {
            try {
              const { record: peer } = await readAdminSpecies(other);
              const names = Object.fromEntries(
                TEXT_LOCALES.map((locale) => [
                  locale,
                  readRecordField(peer, locale, "commonName"),
                ]),
              ) as Record<StyleLocale, string>;
              return Object.values(names).every(Boolean) ? names : undefined;
            } catch {
              return undefined;
            }
          }),
        )
      ).filter((names) => names !== undefined),
  };
}

function speciesTextsReport(
  updates: Array<{ field: string; result: EditorResult }>,
  notes: string[],
) {
  return [
    ...updates.map(({ field, result }) => `${field}\n${result.ka}`),
    ...(notes.length ? [`შენიშვნები:\n${notes.join("\n")}`] : []),
  ].join("\n\n");
}
