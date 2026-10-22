import matter from "gray-matter";
import ts from "typescript";

import type { SpeciesAnalysisContext } from "@/lib/speciesAnalysisInventory";

import { assertInlineLinksPreserved } from "@/lib/contentEditor";
import { toSiteDateTime } from "@/lib/siteTime";
import { SPECIES_COLORS } from "@/lib/speciesColors";
import {
  ANALYSIS_LOCALES,
  type SuperAnalysisResult,
  superAnalysisResultSchema,
  type SuperAnalysisStage,
} from "@/lib/speciesSuperAnalysisSchema";

import {
  kaFrontmatterSchema,
  translationFrontmatterSchema,
} from "../../scripts/speciesFrontmatter";

const editableField =
  /^(?:description|interaction|overview|habitat|diet|behavior|conservation|identification\.(?:summary|coloration|(?:traits|colors)\.\d+)|faq\.\d+\.(?:question|answer)|stats\.\d+\.value)$/;
const linkField =
  /^(?:interaction|overview|habitat|diet|behavior|conservation|identification\.(?:summary|coloration|traits\.\d+)|faq\.\d+\.answer)$/;
const links = (value: string) => [
  ...value.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g),
];
const plain = (value: string) =>
  value.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");

class AnalysisFieldError extends Error {
  constructor(readonly field: string) {
    super(`Unsupported field: ${field}`);
  }
}

export class AnalysisCoverageError extends Error {
  constructor(
    readonly stage: SuperAnalysisStage,
    readonly required: string[],
    readonly allowed: string[],
    readonly received: string[],
    readonly missing: string[],
    readonly unknown: string[],
  ) {
    const duplicates = [
      ...new Set(
        received.filter((id, index) => received.indexOf(id) !== index),
      ),
    ];
    super(
      [
        `Incomplete page surface coverage (stage ${stage})`,
        `missing ${missing.length}/${required.length}: ${missing.join(", ") || "none"}`,
        `unknown ${unknown.length}: ${unknown.map((id) => JSON.stringify(id)).join(", ") || "none"}`,
        `duplicates: ${duplicates.join(", ") || "none"}`,
        `received ${received.length}: ${received.map((id) => JSON.stringify(id)).join(", ") || "none"}`,
        `required: ${required.join(", ")}`,
        `allowed: ${allowed.join(", ")}`,
      ].join(" | "),
    );
  }
}

export class AnalysisEvidenceError extends Error {}

export class AnalysisNumberError extends Error {
  constructor(
    readonly field: string,
    locale: string,
    before: string,
    after: string,
  ) {
    super(
      `Text edit changed numbers in ${field} (${locale}): expected ${before || "none"}; received ${after || "none"}`,
    );
  }
}

export class AnalysisScientificNameError extends Error {
  constructor(
    readonly field: string,
    locale: string,
    before: string,
    after: string,
  ) {
    super(
      `Text edit changed scientific name in ${field} (${locale}): expected ${before || "none"}; received ${after || "none"}`,
    );
  }
}

export function analysisLookalikes(source: string, id: string) {
  const { registry } = lookalikeObject(source);
  const direct = registry[id] ?? [];
  const reverse = Object.entries(registry)
    .filter(([, peers]) => peers.includes(id))
    .map(([peer]) => peer);
  const directIds = new Set(direct);
  const reverseIds = new Set(reverse);
  return [...new Set([...direct, ...reverse])].map((peer) => ({
    direct: directIds.has(peer),
    id: peer,
    reverse: reverseIds.has(peer),
  }));
}

export function analysisNumbers(value: string) {
  return [
    ...new Set(
      (
        plain(value).match(
          /\d{1,3}(?:[ \u00a0,]\d{3})+(?![.,]?\d)|\d+(?:[.,]\d+)?/g,
        ) ?? []
      ).map((item) =>
        /^\d{1,3}(?:[ \u00a0,]\d{3})+$/.test(item)
          ? item.replace(/[ \u00a0,]/g, "")
          : item.replace(",", "."),
      ),
    ),
  ].sort();
}

export function applyAnalysisEdits(
  raw: string,
  locale: (typeof ANALYSIS_LOCALES)[number],
  result: SuperAnalysisResult,
) {
  const parsed = matter(raw);
  const data = structuredClone(parsed.data);
  for (const edit of result.edits) {
    if (analysisField(data, edit.field) !== edit.before[locale])
      throw new Error("Content changed during analysis");
    setField(data, edit.field, edit.after[locale]);
  }
  if (locale === "ka" && result.sources.length) {
    const sources = (data.sources ?? []) as Array<{
      name: string;
      url?: string;
    }>;
    data.sources = [
      ...sources,
      ...result.sources
        .filter(
          (source) => !sources.some((existing) => existing.url === source.url),
        )
        .map(({ name, url }) => ({ name, url })),
    ];
  }
  if (JSON.stringify(data) === JSON.stringify(parsed.data)) return raw;
  if (locale === "ka") data.dateModified = toSiteDateTime(new Date());
  (locale === "ka"
    ? kaFrontmatterSchema.partial({ family: true, genus: true })
    : translationFrontmatterSchema
  ).parse(data);
  const updated = `${matter.stringify("", data).trimEnd()}\n${parsed.content}`;
  if (JSON.stringify(matter(updated).data) !== JSON.stringify(data))
    throw new Error("Content did not round-trip through YAML");
  return updated;
}

export function applyAnalysisLookalikes(
  source: string,
  id: string,
  decisions: SuperAnalysisResult["lookalikes"],
) {
  const { end, registry, start } = lookalikeObject(source);
  const before = JSON.stringify(registry);
  const existing = analysisLookalikes(source, id);
  if (
    existing.some(
      (pair) => !decisions.some((decision) => decision.id === pair.id),
    )
  )
    throw new Error("Existing lookalike was not reviewed");
  for (const decision of decisions) {
    const exists = existing.some((pair) => pair.id === decision.id);
    if ((decision.action === "remove" || decision.action === "keep") && !exists)
      throw new Error("Lookalike action does not match the registry");
    if (decision.action === "remove") {
      registry[id] = (registry[id] ?? []).filter(
        (peer) => peer !== decision.id,
      );
      if (registry[decision.id])
        registry[decision.id] = registry[decision.id].filter(
          (peer) => peer !== id,
        );
    } else if (decision.action === "add" && !exists) {
      registry[id] = [...(registry[id] ?? []), decision.id];
    }
  }
  return before === JSON.stringify(registry)
    ? source
    : source.slice(0, start) +
        JSON.stringify(
          Object.fromEntries(
            Object.entries(registry).sort(([a], [b]) => a.localeCompare(b)),
          ),
          null,
          2,
        ) +
        source.slice(end);
}

export function requiredAnalysisCoverage(
  stage: SuperAnalysisStage,
  context: Pick<SpeciesAnalysisContext, "surfaces">,
): string[] {
  if (stage === "analysis" || stage === "texts")
    return context.surfaces.map((surface) => surface.id);
  if (stage === "lookalikes") return ["identification", "related", "quiz"];
  return [
    "hero",
    "interaction",
    "overview",
    "identification",
    "biology",
    "range",
    "faq",
    "sources",
    "related",
    "quiz",
  ];
}

export function salvageSuperAnalysisResult(
  input: unknown,
  stage: SuperAnalysisStage,
  context: SpeciesAnalysisContext,
  previous: SuperAnalysisResult[],
  existingLookalikes: string[],
) {
  const result = superAnalysisResultSchema.parse(input);
  result.stage = stage;
  const surfaceIds = new Set(
    context.surfaces.map((surface) => surface.id as string),
  );
  const fallbackSurface = context.surfaces[0].id;
  const surfaceFor = (field: string) =>
    context.surfaces.find((surface) =>
      surface.fields.some(
        (owned) => field === owned || field.startsWith(`${owned}.`),
      ),
    )?.id ?? fallbackSurface;
  const notes: SuperAnalysisResult["findings"] = [];
  const note = (surface: string, message: string) =>
    notes.push({
      evidenceIds: [],
      message: message.slice(0, 20000),
      severity: "review",
      surface,
    });
  const errorText = (error: unknown) =>
    error instanceof Error ? error.message : String(error);

  const required = requiredAnalysisCoverage(stage, context);
  const covered = new Set(result.coverage);
  const uninspected = required.filter((id) => !covered.has(id));
  result.coverage = [
    ...new Set([
      ...result.coverage.filter((id) => surfaceIds.has(id)),
      ...required,
    ]),
  ];
  for (const surface of uninspected)
    note(surface, "ავტომატურმა ანალიზმა ეს ნაწილი არ შეამოწმა.");

  if (stage === "links" || stage === "texts") {
    result.evidence = [];
    result.sources = [];
  }
  if (stage !== "lookalikes") result.lookalikes = [];
  const known = new Set(
    previous.flatMap((item) => item.evidence.map((e) => e.id)),
  );
  result.evidence = result.evidence.filter((item) => {
    if (known.has(item.id)) return false;
    known.add(item.id);
    return true;
  });

  const findings: SuperAnalysisResult["findings"] = [];
  for (const finding of result.findings) {
    const surface = surfaceIds.has(finding.surface)
      ? finding.surface
      : surfaceIds.has(finding.surface.split(".")[0])
        ? finding.surface.split(".")[0]
        : fallbackSurface;
    findings.push({
      ...finding,
      evidenceIds: finding.evidenceIds.filter((id) => known.has(id)),
      message:
        surface === finding.surface
          ? finding.message
          : `${finding.surface}: ${finding.message}`,
      severity: finding.severity === "blocking" ? "review" : finding.severity,
      surface,
    });
  }
  result.findings = findings;

  const checks = analysisItemChecks(result, stage, context, previous);
  result.sources = result.sources.filter((source) => {
    try {
      checks.source(source);
      return true;
    } catch (error) {
      note("sources", `${source.url}: წყარო არ დაემატა. ${errorText(error)}`);
      return false;
    }
  });
  if (stage === "links" || stage === "texts")
    for (const edit of result.edits)
      edit.evidenceIds = edit.evidenceIds.filter(
        (id) => checks.evidence.get(id)?.status === "verified",
      );
  const seenFields = new Set<string>();
  result.edits = result.edits.filter((edit) => {
    try {
      if (seenFields.has(edit.field))
        throw new Error(`Duplicate field: ${edit.field}`);
      checks.edit(edit);
      const missing = checks.missingReferences(edit);
      if (missing.length)
        throw new AnalysisEvidenceError(
          `Factual change lacks a profile reference: ${missing.join(", ")}`,
        );
      seenFields.add(edit.field);
      return true;
    } catch (error) {
      note(
        surfaceFor(edit.field),
        `${edit.field}: ${rejectedEditReason(error)}; ოთხივე ენაზე შენარჩუნებულია ველის წინა ტექსტი. ${errorText(error)}`,
      );
      return false;
    }
  });

  const existingPeers = new Set(existingLookalikes);
  const seenPeers = new Set<string>();
  const lookalikes: SuperAnalysisResult["lookalikes"] = [];
  for (const pair of result.lookalikes) {
    if (seenPeers.has(pair.id)) continue;
    const exists = existingPeers.has(pair.id);
    try {
      if ((pair.action === "keep" || pair.action === "remove") && !exists)
        throw new Error("Lookalike action does not match the registry");
      checks.lookalike(pair);
      lookalikes.push(pair);
      seenPeers.add(pair.id);
    } catch (error) {
      note(
        "related",
        `${pair.id} (${pair.action}): მსგავსი სახეობის ცვლილება არ შესრულდა. ${errorText(error)}`,
      );
      if (exists && context.catalog.some((item) => item.id === pair.id)) {
        lookalikes.push({
          ...pair,
          action: "review",
          evidenceIds: pair.evidenceIds.filter((id) => known.has(id)),
        });
        seenPeers.add(pair.id);
      }
    }
  }
  if (stage === "lookalikes")
    for (const peer of existingLookalikes)
      if (!seenPeers.has(peer))
        lookalikes.push({
          action: "review",
          difference: "ავტომატურმა ანალიზმა ეს წყვილი არ შეაფასა.",
          evidenceIds: [],
          id: peer,
          scenario: "არსებული წყვილი შენარჩუნებულია.",
        });
  result.lookalikes = lookalikes;
  result.findings = [...result.findings, ...notes];
  return validateSuperAnalysisResult(result, stage, context, previous);
}

export function validateSuperAnalysisResult(
  input: unknown,
  stage: SuperAnalysisStage,
  context: SpeciesAnalysisContext,
  previous: SuperAnalysisResult[],
) {
  const result = superAnalysisResultSchema.parse(input);
  if (result.stage !== stage) throw new Error("Wrong analysis stage");
  const required = requiredAnalysisCoverage(stage, context);
  const surfaceIds = new Set(
    context.surfaces.map((surface) => surface.id as string),
  );
  const covered = new Set(result.coverage);
  const missing = required.filter((id) => !covered.has(id));
  const unknown = [
    ...new Set(result.coverage.filter((id) => !surfaceIds.has(id))),
  ];
  if (missing.length || unknown.length)
    throw new AnalysisCoverageError(
      stage,
      required,
      [...surfaceIds],
      result.coverage,
      missing,
      unknown,
    );
  const unknownFindings = result.findings.filter(
    (finding) => !surfaceIds.has(finding.surface),
  );
  if (unknownFindings.length)
    throw new Error(
      `Unknown finding surface (stage ${stage}): ${unknownFindings
        .map(
          (finding) =>
            `"${finding.surface}" [${finding.severity}] ${finding.message.slice(0, 160)}`,
        )
        .join("; ")}; allowed: ${[...surfaceIds].join(", ")}`,
    );
  if (result.findings.some((finding) => finding.severity === "blocking"))
    throw new Error(
      `Blocking findings: ${result.findings
        .filter((finding) => finding.severity === "blocking")
        .map((finding) => finding.message)
        .join("; ")}`,
    );
  if (
    stage === "texts" &&
    previous.map((item) => item.stage).join(",") !== "analysis,lookalikes,links"
  )
    throw new Error("Text editing requires three validated stages");
  if (
    (stage === "links" || stage === "texts") &&
    (result.evidence.length || result.sources.length)
  )
    throw new Error("This stage cannot introduce facts or sources");
  if (stage !== "lookalikes" && result.lookalikes.length)
    throw new Error("Lookalikes belong to their own stage");
  const evidence = [
    ...previous.flatMap((item) => item.evidence),
    ...result.evidence,
  ];
  if (new Set(evidence.map((item) => item.id)).size !== evidence.length)
    throw new Error("Duplicate evidence ids");
  const checks = analysisItemChecks(result, stage, context, previous);
  for (const finding of result.findings) {
    if (finding.evidenceIds.some((id) => !checks.evidence.has(id)))
      throw new Error("Unknown finding evidence");
  }
  const seenFields = new Set<string>();
  for (const edit of result.edits) {
    if (seenFields.has(edit.field))
      throw new Error(`Duplicate field: ${edit.field}`);
    seenFields.add(edit.field);
    checks.edit(edit);
  }
  for (const source of result.sources) checks.source(source);
  const missingReferences = result.edits.flatMap(checks.missingReferences);
  if (missingReferences.length)
    throw new AnalysisEvidenceError(
      `Factual change lacks a profile reference: ${missingReferences.join(", ")}`,
    );
  const seenPeers = new Set<string>();
  for (const pair of result.lookalikes) {
    if (seenPeers.has(pair.id)) throw new Error("Invalid lookalike candidate");
    seenPeers.add(pair.id);
    checks.lookalike(pair);
  }
  return result;
}

function analysisField(data: Record<string, unknown>, field: string): string {
  const value = field
    .split(".")
    .reduce<unknown>(
      (parent, key) =>
        parent && typeof parent === "object"
          ? (parent as Record<string, unknown>)[key]
          : undefined,
      data,
    );
  if (value == null) return "";
  if (typeof value !== "string") throw new Error(`Not a text field: ${field}`);
  return value;
}

function analysisItemChecks(
  result: SuperAnalysisResult,
  stage: SuperAnalysisStage,
  context: SpeciesAnalysisContext,
  previous: SuperAnalysisResult[],
) {
  const byId = new Map(
    [...previous.flatMap((item) => item.evidence), ...result.evidence].map(
      (item) => [item.id, item],
    ),
  );
  const requireEvidence = (ids: string[], owner: string) => {
    const invalid = ids.filter((id) => byId.get(id)?.status !== "verified");
    if (!ids.length || invalid.length)
      throw new AnalysisEvidenceError(
        `Change lacks verified source evidence (${owner}): ${
          !ids.length
            ? "missing evidenceIds"
            : invalid
                .map((id) => `${id}=${byId.get(id)?.status ?? "unknown"}`)
                .join(", ")
        }`,
      );
  };
  const namePattern = new RegExp(
    context.catalog
      .map((item) => item.scientificName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|"),
    "g",
  );
  const scientificNames = (value: string) =>
    [
      ...new Set(
        plain(value)
          .normalize("NFC")
          .replace(/\s+/gu, " ")
          .match(namePattern) ?? [],
      ),
    ]
      .sort()
      .join("|");
  const targetIds = new Set(context.catalog.map((item) => item.id));
  const internalPaths = new Set(context.internalPaths);
  const ka = context.content.ka as Record<string, unknown>;
  const profileSources = [
    ...((ka.sources ?? []) as Array<{ url?: string }>),
    ...result.sources,
  ];

  const edit = (edit: SuperAnalysisResult["edits"][number]) => {
    if (!editableField.test(edit.field))
      throw new AnalysisFieldError(edit.field);
    if (
      edit.field
        .split(".")
        .some((segment) => /^\d+$/.test(segment) && Number(segment) > 100)
    )
      throw new Error("Field index is too large");
    if (stage === "analysis" || stage === "lookalikes")
      requireEvidence(edit.evidenceIds, `field ${edit.field}`);
    else if (edit.evidenceIds.some((id) => byId.get(id)?.status !== "verified"))
      throw new Error("Unknown edit evidence");
    if (edit.field.startsWith("identification.colors.")) {
      if (stage !== "analysis")
        throw new Error("Color palette changes belong to factual analysis");
      const tones = ANALYSIS_LOCALES.map((locale) => edit.after[locale]);
      if (
        new Set(tones).size !== 1 ||
        !SPECIES_COLORS.some((color) => color === tones[0])
      )
        throw new Error("Unsupported or inconsistent color palette code");
    }
    for (const locale of ANALYSIS_LOCALES) {
      const data = context.content[locale] as Record<string, unknown>;
      if (analysisField(data, edit.field) !== edit.before[locale])
        throw new Error(`Stale ${locale} field: ${edit.field}`);
      const before = edit.before[locale];
      const after = edit.after[locale];
      if (
        stage === "links" &&
        (!linkField.test(edit.field) || plain(before) !== plain(after))
      )
        throw new Error("Link stage changed prose or a non-link field");
      if (stage === "texts") {
        assertInlineLinksPreserved(before, after);
        const beforeNumbers = analysisNumbers(before);
        const afterNumbers = analysisNumbers(after);
        const elsewhere = new Set(
          context.editableFields
            .filter((field) => field !== edit.field)
            .flatMap((field) =>
              analysisNumbers(
                result.edits.find((item) => item.field === field)?.after[
                  locale
                ] ?? analysisField(data, field),
              ),
            ),
        );
        const page = new Set(
          context.editableFields
            .filter((field) => field !== edit.field)
            .flatMap((field) => analysisNumbers(analysisField(data, field))),
        );
        const beforeSet = new Set(beforeNumbers);
        const afterSet = new Set(afterNumbers);
        if (
          afterNumbers.some(
            (value) => !beforeSet.has(value) && !page.has(value),
          ) ||
          beforeNumbers.some(
            (value) => !afterSet.has(value) && !elsewhere.has(value),
          )
        )
          throw new AnalysisNumberError(
            edit.field,
            locale,
            beforeNumbers.join("|"),
            afterNumbers.join("|"),
          );
        if (scientificNames(before) !== scientificNames(after))
          throw new AnalysisScientificNameError(
            edit.field,
            locale,
            scientificNames(before),
            scientificNames(after),
          );
        if (
          edit.field.startsWith("stats.") &&
          /^(LC|NT|VU|EN|CR|DD|NE)$/.test(before.trim()) &&
          before !== after
        )
          throw new Error("Text edit changed a conservation code");
        if (
          context.id === "macrovipera-lebetina" &&
          edit.field === "behavior" &&
          before.split(/\n+/).length !== after.split(/\n+/).length
        )
          throw new Error("Text edit changed reproduction paragraph mapping");
      }
      const beforeTargets = new Set(links(before).map((match) => match[2]));
      for (const match of links(after)) {
        const target = match[2];
        if (beforeTargets.has(target)) continue;
        if (!linkField.test(edit.field))
          throw new Error(`Links are not rendered in ${edit.field}`);
        if (
          target === context.id ||
          !(targetIds.has(target) || internalPaths.has(target))
        )
          throw new Error(`Unknown, external or self link: ${target}`);
      }
    }
    const targets = ANALYSIS_LOCALES.map((locale) =>
      links(edit.after[locale])
        .map((match) => match[2])
        .sort()
        .join("|"),
    );
    if (new Set(targets).size !== 1)
      throw new Error("Link targets differ between locales");
  };

  const source = (source: SuperAnalysisResult["sources"][number]) => {
    requireEvidence(source.evidenceIds, `source ${source.url}`);
    if (!source.evidenceIds.some((id) => byId.get(id)?.url === source.url))
      throw new Error("Source URL does not match evidence");
  };

  const missingReferences = (edit: SuperAnalysisResult["edits"][number]) =>
    stage === "analysis" || stage === "lookalikes"
      ? edit.evidenceIds.flatMap((id) => {
          const item = byId.get(id);
          return item &&
            !profileSources.some((source) => source.url === item.url)
            ? [`${id} (${item.url})`]
            : [];
        })
      : [];

  const lookalike = (pair: SuperAnalysisResult["lookalikes"][number]) => {
    if (!targetIds.has(pair.id) || pair.id === context.id)
      throw new Error("Invalid lookalike candidate");
    if (pair.evidenceIds.some((id) => !byId.has(id)))
      throw new Error("Unknown lookalike evidence");
    if (pair.action === "add" || pair.action === "remove")
      requireEvidence(pair.evidenceIds, `lookalike ${pair.id}: ${pair.action}`);
  };

  return { edit, evidence: byId, lookalike, missingReferences, source };
}

function lookalikeObject(source: string) {
  const file = ts.createSourceFile(
    "speciesLookalikes.ts",
    source,
    ts.ScriptTarget.Latest,
    true,
  );
  let object: ts.ObjectLiteralExpression | undefined;
  file.forEachChild((node) => {
    if (!ts.isVariableStatement(node)) return;
    for (const declaration of node.declarationList.declarations) {
      if (
        declaration.name.getText(file) === "LOOKALIKES" &&
        declaration.initializer &&
        ts.isObjectLiteralExpression(declaration.initializer)
      )
        object = declaration.initializer;
    }
  });
  if (!object) throw new Error("Lookalike registry is unavailable");
  const registry: Record<string, string[]> = {};
  for (const property of object.properties) {
    if (
      !ts.isPropertyAssignment(property) ||
      !ts.isStringLiteral(property.name) ||
      !ts.isArrayLiteralExpression(property.initializer)
    )
      throw new Error("Unsupported lookalike registry");
    registry[property.name.text] = property.initializer.elements.map((item) => {
      if (!ts.isStringLiteral(item))
        throw new Error("Unsupported lookalike candidate");
      return item.text;
    });
  }
  return { end: object.end, registry, start: object.getStart(file) };
}

function rejectedEditReason(error: unknown) {
  if (error instanceof AnalysisFieldError)
    return "ეს ველი ავტომატურად არ რედაქტირდება";
  if (error instanceof AnalysisNumberError)
    return "რიცხვების ცვლილება უარყოფილია";
  if (error instanceof AnalysisScientificNameError)
    return "სამეცნიერო სახელის ცვლილება უარყოფილია";
  if (error instanceof AnalysisEvidenceError)
    return "ცვლილებას დადასტურებული წყარო არ აქვს";
  return "ცვლილება უარყოფილია";
}

function setField(data: Record<string, unknown>, field: string, value: string) {
  const keys = field.split(".");
  let current: Record<string, unknown> = data;
  for (const [index, key] of keys.slice(0, -1).entries()) {
    current[key] ??= /^\d+$/.test(keys[index + 1]) ? [] : {};
    current = current[key] as Record<string, unknown>;
  }
  current[keys.at(-1)!] = value;
}
