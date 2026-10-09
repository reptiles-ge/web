import matter from "gray-matter";
import ts from "typescript";

import type { SpeciesAnalysisContext } from "@/lib/speciesAnalysisInventory";

import { assertInlineLinksPreserved } from "@/lib/contentEditor";
import { toSiteDateTime } from "@/lib/siteTime";
import {
  ANALYSIS_LOCALES,
  type SuperAnalysisResult,
  superAnalysisResultSchema,
  type SuperAnalysisStage,
} from "@/lib/speciesSuperAnalysisSchema";

import { kaFrontmatterSchema } from "../../scripts/speciesFrontmatter";

const editableField =
  /^(?:description|interaction|overview|habitat|diet|behavior|conservation|identification\.(?:summary|traits\.\d+)|faq\.\d+\.(?:question|answer)|stats\.\d+\.value)$/;
const linkField =
  /^(?:interaction|overview|habitat|diet|behavior|conservation|identification\.(?:summary|traits\.\d+)|faq\.\d+\.answer)$/;
const links = (value: string) => [
  ...value.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g),
];
const plain = (value: string) =>
  value.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");

export class AnalysisEvidenceError extends Error {}

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
  kaFrontmatterSchema.omit({ family: true, genus: true }).parse(data);
  const updated = matter.stringify(parsed.content, data);
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
        JSON.stringify(registry, null, 2) +
        source.slice(end);
}

export function validateSuperAnalysisResult(
  input: unknown,
  stage: SuperAnalysisStage,
  context: SpeciesAnalysisContext,
  previous: SuperAnalysisResult[],
) {
  const result = superAnalysisResultSchema.parse(input);
  if (result.stage !== stage) throw new Error("Wrong analysis stage");
  const required =
    stage === "analysis" || stage === "texts"
      ? context.surfaces.map((surface) => surface.id)
      : stage === "lookalikes"
        ? ["identification", "related", "quiz"]
        : [
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
  const surfaceIds = new Set(
    context.surfaces.map((surface) => surface.id as string),
  );
  const covered = new Set(result.coverage);
  if (
    required.some((id) => !covered.has(id)) ||
    result.coverage.some((id) => !surfaceIds.has(id))
  )
    throw new Error("Incomplete page surface coverage");
  if (result.findings.some((finding) => !surfaceIds.has(finding.surface)))
    throw new Error("Unknown finding surface");
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
  const byId = new Map(evidence.map((item) => [item.id, item]));
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
  for (const finding of result.findings) {
    if (finding.evidenceIds.some((id) => !byId.has(id)))
      throw new Error("Unknown finding evidence");
  }
  const namePattern = new RegExp(
    context.catalog
      .map((item) => item.scientificName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|"),
    "g",
  );
  const scientificNames = (value: string) =>
    [...new Set(plain(value).match(namePattern) ?? [])].sort().join("|");
  const targetIds = new Set(context.catalog.map((item) => item.id));
  const internalPaths = new Set(context.internalPaths);
  const seenFields = new Set<string>();
  const ka = context.content.ka as Record<string, unknown>;
  for (const edit of result.edits) {
    if (!editableField.test(edit.field) || seenFields.has(edit.field))
      throw new Error(`Unsupported or duplicate field: ${edit.field}`);
    if (
      edit.field
        .split(".")
        .some((segment) => /^\d+$/.test(segment) && Number(segment) > 100)
    )
      throw new Error("Field index is too large");
    seenFields.add(edit.field);
    if (stage === "analysis" || stage === "lookalikes")
      requireEvidence(edit.evidenceIds, `field ${edit.field}`);
    else if (edit.evidenceIds.some((id) => byId.get(id)?.status !== "verified"))
      throw new Error("Unknown edit evidence");
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
        const numbers = (value: string) =>
          [...new Set(plain(value).match(/\d+(?:[.,]\d+)?/g) ?? [])]
            .map((value) => value.replace(",", "."))
            .sort()
            .join("|");
        if (numbers(before) !== numbers(after))
          throw new Error(`Text edit changed numbers in ${edit.field}`);
        if (scientificNames(before) !== scientificNames(after))
          throw new Error(`Text edit changed scientific name in ${edit.field}`);
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
  }
  for (const source of result.sources) {
    requireEvidence(source.evidenceIds, `source ${source.url}`);
    if (!source.evidenceIds.some((id) => byId.get(id)?.url === source.url))
      throw new Error("Source URL does not match evidence");
  }
  for (const edit of result.edits) {
    for (const id of edit.evidenceIds) {
      const item = byId.get(id);
      if (!item || !["analysis", "lookalikes"].includes(stage)) continue;
      const sources = [
        ...((ka.sources ?? []) as Array<{ url?: string }>),
        ...result.sources,
      ];
      if (!sources.some((source) => source.url === item.url))
        throw new Error("Factual change lacks a profile reference");
    }
  }
  const seenPeers = new Set<string>();
  for (const pair of result.lookalikes) {
    if (
      !targetIds.has(pair.id) ||
      pair.id === context.id ||
      seenPeers.has(pair.id)
    )
      throw new Error("Invalid lookalike candidate");
    if (pair.evidenceIds.some((id) => !byId.has(id)))
      throw new Error("Unknown lookalike evidence");
    seenPeers.add(pair.id);
    if (pair.action === "add" || pair.action === "remove")
      requireEvidence(pair.evidenceIds, `lookalike ${pair.id}: ${pair.action}`);
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

function lookalikeObject(source: string) {
  const file = ts.createSourceFile(
    "speciesRoutes.ts",
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

function setField(data: Record<string, unknown>, field: string, value: string) {
  const keys = field.split(".");
  let current: Record<string, unknown> = data;
  for (const [index, key] of keys.slice(0, -1).entries()) {
    current[key] ??= /^\d+$/.test(keys[index + 1]) ? [] : {};
    current = current[key] as Record<string, unknown>;
  }
  current[keys.at(-1)!] = value;
}
