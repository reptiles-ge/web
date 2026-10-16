import type { NewsMark, NewsSection } from "@/data/newsTypes";
import type { GroupHubId } from "@/lib/groupHubs";

type NewsBodySpan = { end: number; start: number; value: string };

const markTags = {
  CreditAuthor: "slug",
  Hub: "id",
  NewsIndex: undefined,
  Region: "id",
  Sci: undefined,
  Species: "id",
} as const;

type MarkTag = keyof typeof markTags;

const figureLine = /^<Figure src="([^"\s]+)" \/>$/;
const headingLine = /^## (.+)$/;

export function escapeNewsText(text: string) {
  if (/[\r\n]/.test(text))
    throw new Error("News text cannot contain a line break");
  return text.replace(/[\\<{}[\]]/g, "\\$&");
}

export function newsBodyStart(raw: string) {
  if (!raw.startsWith("---\n")) throw new Error("Missing news frontmatter");
  const closing = raw.indexOf("\n---\n", 3);
  if (closing < 0) throw new Error("Unclosed news frontmatter");
  return closing + 5;
}

export function parseNewsBody(body: string, offset = 0) {
  const sections: NewsSection[] = [];
  const spans = new Map<string, NewsBodySpan>();
  const lines = body.split("\n");
  let cursor = offset;
  let paragraph: undefined | { end: number; start: number };

  const flush = () => {
    if (!paragraph) return;
    const section = sections.at(-1);
    if (!section)
      throw new Error(
        `News text before the first heading at ${paragraph.start}`,
      );
    const field = `sections.${sections.length - 1}.blocks.${section.blocks.length}`;
    const raw = body.slice(paragraph.start - offset, paragraph.end - offset);
    section.blocks.push({
      parts: parseNewsInline(raw, paragraph.start, `${field}.parts`, spans),
      type: "p",
    });
    paragraph = undefined;
  };

  for (const line of lines) {
    const start = cursor;
    cursor += line.length + 1;
    if (!line.trim()) {
      flush();
      continue;
    }
    const heading = paragraph ? null : headingLine.exec(line);
    if (heading) {
      sections.push({ blocks: [], heading: heading[1] });
      spans.set(`sections.${sections.length - 1}.heading`, {
        end: start + line.length,
        start: start + 3,
        value: heading[1],
      });
      continue;
    }
    const figure = paragraph ? null : figureLine.exec(line);
    if (figure) {
      const section = sections.at(-1);
      if (!section) throw new Error("News figure before the first heading");
      section.blocks.push({ src: figure[1], type: "figure" });
      continue;
    }
    if (line.startsWith("#") || line.startsWith("<Figure"))
      throw new Error(`Unsupported news line: ${line}`);
    if (paragraph) paragraph.end = start + line.length;
    else paragraph = { end: start + line.length, start };
  }
  flush();
  return { sections, spans };
}

export function readNewsBodyField(raw: string, field: string) {
  const start = newsBodyStart(raw);
  const span = parseNewsBody(raw.slice(start), start).spans.get(field);
  if (!span) throw new Error("This content field is unavailable");
  return span.value;
}

export function replaceNewsBodyField(
  raw: string,
  field: string,
  value: string,
) {
  if (!value.trim()) throw new Error("Invalid replacement text");
  const start = newsBodyStart(raw);
  const span = parseNewsBody(raw.slice(start), start).spans.get(field);
  if (!span) throw new Error("This content field is unavailable");
  const text = field.endsWith(".heading")
    ? headingText(value)
    : escapeNewsText(value);
  const updated = raw.slice(0, span.start) + text + raw.slice(span.end);
  if (readNewsBodyField(updated, field) !== value)
    throw new Error("Content replacement failed validation");
  return updated;
}

export function serializeNewsBody(sections: readonly NewsSection[]) {
  const out: string[] = [];
  for (const section of sections) {
    if (section.heading !== section.heading.trim())
      throw new Error(`Unsupported news heading: ${section.heading}`);
    out.push(`## ${headingText(section.heading)}`);
    for (const block of section.blocks) {
      out.push(
        block.type === "figure"
          ? `<Figure src="${block.src}" />`
          : serializeNewsParts(block.parts),
      );
    }
  }
  return `${out.join("\n\n")}\n`;
}

function attribute(value: string) {
  if (/["\s)]/.test(value)) throw new Error(`Unsupported attribute: ${value}`);
  return value;
}

function headingText(value: string) {
  if (/[\r\n]/.test(value))
    throw new Error("News text cannot contain a line break");
  return value;
}

function parseNewsInline(
  raw: string,
  offset: number,
  field: string,
  spans: Map<string, NewsBodySpan>,
) {
  const parts: NewsMark[] = [];
  let text = "";
  let textStart = 0;
  let index = 0;

  const fail = (message: string): never => {
    throw new Error(
      `${message} at ${offset + index}: ${raw.slice(index, index + 40)}`,
    );
  };
  const pushText = () => {
    if (!text) return;
    spans.set(`${field}.${parts.length}`, {
      end: offset + index,
      start: offset + textStart,
      value: text,
    });
    parts.push(text);
    text = "";
  };
  const readText = (stop: string) => {
    let value = "";
    const start = index;
    while (index < raw.length && !raw.startsWith(stop, index)) {
      const char = raw[index];
      if (char === "\\") {
        if (index + 1 >= raw.length) fail("Dangling escape");
        value += raw[index + 1];
        index += 2;
        continue;
      }
      if ("<{}[]".includes(char)) fail(`Unescaped ${char}`);
      value += char;
      index += 1;
    }
    if (index >= raw.length) fail(`Missing ${stop}`);
    if (!value) fail("Empty label");
    return { end: index, start, value };
  };

  while (index < raw.length) {
    const char = raw[index];
    if (char === "\\") {
      if (!text) textStart = index;
      if (index + 1 >= raw.length) fail("Dangling escape");
      text += raw[index + 1];
      index += 2;
      continue;
    }
    if (char === "<") {
      pushText();
      const open = /^<([A-Za-z]+)(?: ([a-z]+)="([^"]*)")?>/.exec(
        raw.slice(index),
      );
      if (!open || !Object.hasOwn(markTags, open[1])) fail("Unknown tag");
      const tag = open![1] as MarkTag;
      if ((open![2] ?? undefined) !== markTags[tag])
        fail(`Wrong attribute on <${tag}>`);
      index += open![0].length;
      const inner = readText(`</${tag}>`);
      index += tag.length + 3;
      const suffix = tag === "Sci" ? "name" : "label";
      spans.set(`${field}.${parts.length}.${suffix}`, {
        end: offset + inner.end,
        start: offset + inner.start,
        value: inner.value,
      });
      parts.push(toMark(tag, open![3], inner.value));
      continue;
    }
    if (char === "[") {
      pushText();
      index += 1;
      const label = readText("](");
      index += 2;
      const close = raw.indexOf(")", index);
      if (close < 0) fail("Missing )");
      const href = raw.slice(index, close);
      if (!/^https?:\/\/\S+$/.test(href)) fail("Unsupported link");
      index = close + 1;
      spans.set(`${field}.${parts.length}.label`, {
        end: offset + label.end,
        start: offset + label.start,
        value: label.value,
      });
      parts.push({ href, label: label.value, type: "external" });
      continue;
    }
    if ("{}]".includes(char)) fail(`Unescaped ${char}`);
    if (!text) textStart = index;
    text += char;
    index += 1;
  }
  pushText();
  return parts;
}

function serializeNewsParts(parts: readonly NewsMark[]) {
  let out = "";
  for (const [index, part] of parts.entries()) {
    if (typeof part === "string") {
      if (!part || typeof parts[index - 1] === "string")
        throw new Error(`Unsupported text run: ${JSON.stringify(part)}`);
      out += escapeNewsText(part);
      continue;
    }
    if (part.type === "sci") out += `<Sci>${escapeNewsText(part.name)}</Sci>`;
    else if (part.type === "external")
      out += `[${escapeNewsText(part.label)}](${attribute(part.href)})`;
    else if (part.type === "news-index")
      out += `<NewsIndex>${escapeNewsText(part.label)}</NewsIndex>`;
    else if (part.type === "credit-author")
      out += `<CreditAuthor slug="${attribute(part.slug)}">${escapeNewsText(part.label)}</CreditAuthor>`;
    else {
      const tag =
        part.type === "hub"
          ? "Hub"
          : part.type === "region"
            ? "Region"
            : "Species";
      out += `<${tag} id="${attribute(part.id)}">${escapeNewsText(part.label)}</${tag}>`;
    }
  }
  if (/^\s|\s$/.test(out) || out.startsWith("#"))
    throw new Error(`Unsupported paragraph edge: ${out.slice(0, 40)}`);
  return out;
}

function toMark(
  tag: MarkTag,
  attr: string | undefined,
  value: string,
): NewsMark {
  if (tag === "Sci") return { name: value, type: "sci" };
  if (tag === "NewsIndex") return { label: value, type: "news-index" };
  if (!attr) throw new Error(`Missing attribute on <${tag}>`);
  if (tag === "CreditAuthor")
    return { label: value, slug: attr, type: "credit-author" };
  if (tag === "Hub")
    return { id: attr as GroupHubId, label: value, type: "hub" };
  if (tag === "Region") return { id: attr, label: value, type: "region" };
  return { id: attr, label: value, type: "species" };
}
