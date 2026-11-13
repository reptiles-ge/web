import type { NewsMark, NewsSection } from "@/data/newsTypes";
import type { GroupHubId } from "@/lib/groupHubs";

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

export function newsBodyStart(raw: string) {
  if (!raw.startsWith("---\n")) throw new Error("Missing news frontmatter");
  const closing = raw.indexOf("\n---\n", 3);
  if (closing < 0) throw new Error("Unclosed news frontmatter");
  return closing + 5;
}

export function parseNewsBody(body: string, offset = 0) {
  const sections: NewsSection[] = [];
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
    const raw = body.slice(paragraph.start - offset, paragraph.end - offset);
    section.blocks.push({
      parts: parseNewsInline(raw, paragraph.start),
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
    const heading = paragraph ? undefined : headingLine.exec(line)?.[1];
    if (heading !== undefined) {
      sections.push({ blocks: [], heading });
      continue;
    }
    const figure = paragraph ? undefined : figureLine.exec(line)?.[1];
    if (figure !== undefined) {
      const section = sections.at(-1);
      if (!section) throw new Error("News figure before the first heading");
      section.blocks.push({ src: figure, type: "figure" });
      continue;
    }
    if (line.startsWith("#") || line.startsWith("<Figure"))
      throw new Error(`Unsupported news line: ${line}`);
    if (paragraph) paragraph.end = start + line.length;
    else paragraph = { end: start + line.length, start };
  }
  flush();
  return { sections };
}

function parseNewsInline(raw: string, offset: number) {
  const parts: NewsMark[] = [];
  let text = "";
  let index = 0;

  const fail = (message: string): never => {
    throw new Error(
      `${message} at ${offset + index}: ${raw.slice(index, index + 40)}`,
    );
  };
  const pushText = () => {
    if (!text) return;
    parts.push(text);
    text = "";
  };
  const readText = (stop: string) => {
    let value = "";
    while (index < raw.length && !raw.startsWith(stop, index)) {
      const char = raw.charAt(index);
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
    return value;
  };

  while (index < raw.length) {
    const char = raw.charAt(index);
    if (char === "\\") {
      if (index + 1 >= raw.length) fail("Dangling escape");
      text += raw[index + 1];
      index += 2;
      continue;
    }
    if (char === "<") {
      pushText();
      const name = /^<([A-Za-z]+)/.exec(raw.slice(index))?.[1];
      if (!name || !Object.hasOwn(markTags, name)) fail("Unknown tag");
      const tag = name as MarkTag;
      index += tag.length + 1;
      const attrName = markTags[tag];
      let attr: string | undefined;
      if (attrName) {
        const prefix = ` ${attrName}="`;
        if (!raw.startsWith(prefix, index)) fail(`Wrong attribute on <${tag}>`);
        index += prefix.length;
        const close = raw.indexOf('"', index);
        if (close < 0) fail(`Wrong attribute on <${tag}>`);
        attr = raw.slice(index, close);
        index = close + 1;
      }
      if (raw[index] !== ">") fail(`Wrong attribute on <${tag}>`);
      index += 1;
      const inner = readText(`</${tag}>`);
      index += tag.length + 3;
      parts.push(toMark(tag, attr, inner));
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
      parts.push({ href, label, type: "external" });
      continue;
    }
    if ("{}]".includes(char)) fail(`Unescaped ${char}`);
    text += char;
    index += 1;
  }
  pushText();
  return parts;
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
