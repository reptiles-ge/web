import matter from "gray-matter";
import { z } from "zod";

export const editorFields = [
  "overview",
  "habitat",
  "diet",
  "behavior",
  "conservation",
] as const;

export const editorRequestSchema = z
  .object({
    end: z.number().int().nonnegative(),
    field: z
      .string()
      .regex(/^[A-Za-z][A-Za-z0-9]*(?:\.\d+|\.[A-Za-z][A-Za-z0-9]*)*$/)
      .max(120),
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    kind: z
      .enum(["species", "guide", "news", "message", "region"])
      .default("species"),
    renderedText: z.string().min(1).max(20000),
    start: z.number().int().nonnegative(),
  })
  .strict();

export const editorResultSchema = z
  .object({
    en: z.string().trim().min(1).max(20000),
    ka: z.string().trim().min(1).max(20000),
    ru: z.string().trim().min(1).max(20000),
    tr: z.string().trim().min(1).max(20000),
  })
  .strict();

export type EditorRequest = z.infer<typeof editorRequestSchema>;
export type EditorResult = z.infer<typeof editorResultSchema>;

const inlineLink = /\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)]+|[a-z0-9-]+)\)/g;

export function assertInlineLinksPreserved(original: string, updated: string) {
  const targets = (value: string) =>
    [...value.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map((match) => match[1]);
  if (JSON.stringify(targets(original)) !== JSON.stringify(targets(updated)))
    throw new Error("Content edit changed inline links");
}

export function readSpeciesField(raw: string, field: string) {
  return speciesValue(raw, field);
}

export function replaceSpeciesField(raw: string, field: string, value: string) {
  speciesValue(raw, field);
  if (!value.trim() || value.includes("\r"))
    throw new Error("Invalid replacement text");
  const lines = raw.split("\n");
  if (lines[0] !== "---") throw new Error("Unsupported frontmatter format");
  const closing = lines.findIndex((line, index) => index > 0 && line === "---");
  if (closing < 0) throw new Error("Unsupported frontmatter format");
  const stack: Array<{ indent: number; path: string }> = [];
  const counts = new Map<string, number>();
  let matchIndex = -1;
  let matchIndent = 0;
  for (let index = 1; index < closing; index++) {
    const line = lines[index];
    if (!line.trim()) continue;
    const indent = line.length - line.trimStart().length;
    while (stack.length && stack[stack.length - 1].indent >= indent)
      stack.pop();
    const parent = stack.at(-1)?.path ?? "";
    const item = line.trimStart().startsWith("- ");
    let content = line.trimStart();
    let current = parent;
    if (item) {
      const countKey = `${parent}:${indent}`;
      const next = counts.get(countKey) ?? 0;
      counts.set(countKey, next + 1);
      current = parent ? `${parent}.${next}` : String(next);
      stack.push({ indent, path: current });
      content = content.slice(2);
    }
    const key = /^([A-Za-z][A-Za-z0-9]*):(?:\s*(.*))?$/.exec(content);
    if (key) {
      current = current ? `${current}.${key[1]}` : key[1];
      if (!item) stack.push({ indent, path: current });
    } else if (!item) continue;
    if (current === field) {
      if (matchIndex >= 0) throw new Error("Ambiguous content field");
      matchIndex = index;
      matchIndent = indent;
    }
  }
  if (matchIndex < 0) throw new Error("Content field format is unavailable");
  const line = lines[matchIndex];
  const marker = line.trimStart().startsWith("- ") ? "- " : "";
  const key = field.split(".").at(-1);
  const prefix = /^\d+$/.test(key ?? "") ? marker : `${marker}${key}:`;
  const currentScalar = line.trimStart().slice(prefix.length).trim();
  if (
    currentScalar === ">-" ||
    currentScalar === "|" ||
    currentScalar === "|-"
  ) {
    let end = matchIndex + 1;
    while (
      end < closing &&
      (!lines[end].trim() ||
        lines[end].length - lines[end].trimStart().length > matchIndent)
    )
      end++;
    const block = value
      .split("\n")
      .map((part) => (part ? `${" ".repeat(matchIndent + 2)}${part}` : ""));
    if (value.includes("\n") || currentScalar === "|" || currentScalar === "|-")
      lines[matchIndex] = `${" ".repeat(matchIndent)}${prefix} |-`;
    lines.splice(matchIndex + 1, end - matchIndex - 1, ...block);
  } else {
    if (value.includes("\n"))
      throw new Error("Multiline text requires a block scalar");
    lines[matchIndex] =
      `${" ".repeat(matchIndent)}${prefix} ${JSON.stringify(value)}`;
  }
  const updated = lines.join("\n");
  if (speciesValue(updated, field) !== value)
    throw new Error("Replacement did not round-trip through YAML");
  return updated;
}

export function validateEditorResult(
  value: unknown,
  selection: ReturnType<typeof verifyEditorSelection>,
) {
  const result = editorResultSchema.parse(value);
  if (
    !result.ka.startsWith(selection.before) ||
    !result.ka.endsWith(selection.after)
  ) {
    throw new Error("Codex changed text outside the selection");
  }
  if (result.ka.length <= selection.before.length + selection.after.length) {
    throw new Error("Codex returned an empty selection");
  }
  return result;
}

export function verifyEditorSelection(
  source: string,
  input: Pick<EditorRequest, "end" | "renderedText" | "start">,
) {
  const rendered = source.replace(inlineLink, "$1");
  if (rendered !== input.renderedText)
    throw new Error("Content changed; reload and select text again");
  if (
    input.end <= input.start ||
    input.end > rendered.length ||
    !rendered.slice(input.start, input.end).trim()
  ) {
    throw new Error("Select text inside one content field");
  }
  const start = sourceOffset(source, input.start, "start");
  const end = sourceOffset(source, input.end, "end");
  return {
    after: source.slice(end),
    before: source.slice(0, start),
    selected: source.slice(start, end),
  };
}

function sourceOffset(source: string, offset: number, edge: "end" | "start") {
  let sourceCursor = 0;
  let renderedCursor = 0;
  for (const match of source.matchAll(inlineLink)) {
    const gap = match.index - sourceCursor;
    if (
      offset < renderedCursor + gap ||
      (edge === "end" && offset === renderedCursor + gap)
    )
      return sourceCursor + offset - renderedCursor;
    renderedCursor += gap;
    if (offset < renderedCursor + match[1].length)
      return (
        match.index +
        (offset === renderedCursor && edge === "start"
          ? 0
          : 1 + offset - renderedCursor)
      );
    renderedCursor += match[1].length;
    sourceCursor = match.index + match[0].length;
    if (offset === renderedCursor) return sourceCursor;
  }
  return sourceCursor + offset - renderedCursor;
}

function speciesValue(raw: string, field: string): string {
  const value = field.split(".").reduce<unknown>((current, segment) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[segment];
  }, matter(raw).data);
  if (typeof value !== "string" || !value.trim())
    throw new Error("This content field is unavailable");
  return value;
}
