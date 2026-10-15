import matter from "gray-matter";
import fs from "node:fs/promises";
import path from "node:path";

import {
  type EditorResult,
  readSpeciesField,
  validateEditorResult,
} from "@/lib/contentEditor";
import { transformWithAgent } from "@/lib/contentEditorAgent";
import {
  assertSpeciesTextSourceCurrent,
  createSpeciesTextsPullRequest,
} from "@/lib/contentEditorPullRequest";
import { resolveEditorTarget } from "@/lib/contentEditorTarget";
import { lockSpeciesAnalysis } from "@/lib/speciesAnalysisLock";
import { analysisNumbers } from "@/lib/speciesAnalysisValidation";
import {
  formatStyleIssues,
  lintFieldStyle,
  lintHedgeLoss,
  type StyleLocale,
} from "@/lib/writingStyleLint";

export function getSpeciesTextFields(raw: string) {
  const data = matter(raw).data;
  const traits = data.identification?.traits;
  const faq = data.faq;
  const fields = [
    "description",
    "interaction",
    "overview",
    "identification.summary",
    "identification.coloration",
    ...(Array.isArray(traits)
      ? traits.map(
          (_: unknown, index: number) => `identification.traits.${index}`,
        )
      : []),
    "habitat",
    "diet",
    "behavior",
    "conservation",
    ...(Array.isArray(faq)
      ? faq.map((_: unknown, index: number) => `faq.${index}.answer`)
      : []),
  ];
  return fields.filter((field) => readSpeciesField(raw, field, true).trim());
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

export async function processSpeciesTexts(id: string, operationId: string) {
  const unlock = lockSpeciesAnalysis(id);
  try {
    await assertSpeciesTextSourceCurrent(id);
    const { notes, updates } = await rewriteSpeciesTexts(id);
    const pullRequestUrl = await createSpeciesTextsPullRequest(
      id,
      updates,
      operationId,
    );
    return { pullRequestUrl, report: speciesTextsReport(updates, notes) };
  } finally {
    unlock();
  }
}

export async function rewriteSpeciesTexts(id: string, cwd = process.cwd()) {
  const raws = Object.fromEntries(
    await Promise.all(
      TEXT_LOCALES.map(async (locale) => [
        locale,
        await fs.readFile(
          path.join(cwd, "src/content/species", id, `${locale}.mdx`),
          "utf8",
        ),
      ]),
    ),
  ) as Record<StyleLocale, string>;
  const fields = getSpeciesTextFields(raws.ka);
  if (!fields.length) throw new Error("No page texts to process");
  const data = matter(raws.ka).data;
  const commonName =
    typeof data.commonName === "string" ? data.commonName : undefined;
  const originals = Object.fromEntries(
    await Promise.all(
      fields.map(async (field) => [
        field,
        {
          ...Object.fromEntries(
            TEXT_LOCALES.map((locale) => [
              locale,
              readSpeciesField(raws[locale], field, true),
            ]),
          ),
          ka: (await resolveEditorTarget({ field, id, kind: "species" }, cwd))
            .source,
        } as EditorResult,
      ]),
    ),
  ) as Record<string, EditorResult>;
  const speciesNames = await linkedSpeciesNames(
    cwd,
    id,
    fields.map((field) => originals[field].ka),
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
        latinName:
          typeof data.scientificName === "string"
            ? data.scientificName
            : undefined,
        otherFields: Object.fromEntries(
          fields
            .filter((other) => other !== field)
            .map((other) => [
              other,
              (results.get(other) ?? originals[other]).ka,
            ]),
        ),
        riskLevel: RISK_LEVELS.find((level) => level === data.danger),
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

export function speciesTextsReport(
  updates: Array<{ field: string; result: EditorResult }>,
  notes: string[],
) {
  return [
    ...updates.map(({ field, result }) => `${field}\n${result.ka}`),
    ...(notes.length ? [`შენიშვნები:\n${notes.join("\n")}`] : []),
  ].join("\n\n");
}

async function linkedSpeciesNames(cwd: string, id: string, texts: string[]) {
  const ids = [
    ...new Set(
      texts.flatMap((text) =>
        [...text.matchAll(/\]\(([a-z]+(?:-[a-z]+)+)\)/g)].map(
          (match) => match[1],
        ),
      ),
    ),
  ].filter((other) => other !== id);
  const names = await Promise.all(
    ids.map(async (other) => {
      try {
        const entries = await Promise.all(
          TEXT_LOCALES.map(async (locale) => {
            const { commonName } = matter(
              await fs.readFile(
                path.join(cwd, "src/content/species", other, `${locale}.mdx`),
                "utf8",
              ),
            ).data;
            return [locale, typeof commonName === "string" ? commonName : ""];
          }),
        );
        return entries.every(([, name]) => name)
          ? (Object.fromEntries(entries) as Record<StyleLocale, string>)
          : undefined;
      } catch {
        return undefined;
      }
    }),
  );
  return names.filter((name) => name !== undefined);
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
