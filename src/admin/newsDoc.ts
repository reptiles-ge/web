import type { JSONContent } from "@tiptap/core";

import type { NewsMark, NewsSection } from "@/data/newsTypes";
import type { GroupHubId } from "@/lib/groupHubs";

export type NewsLinkAttrs = { kind: NewsLinkKind; target: string };

export type NewsLinkKind =
  "credit-author" | "external" | "hub" | "news-index" | "region" | "species";

type InlineMark = { attrs: NewsLinkAttrs; type: "newsLink" } | { type: "sci" };

export function newsDocFigures(doc: JSONContent) {
  return (doc.content ?? []).flatMap((section) =>
    (section.content ?? []).flatMap((block) =>
      block.type === "figure" ? [String(block.attrs?.src ?? "")] : [],
    ),
  );
}

export function newsDocToSections(doc: JSONContent): NewsSection[] {
  return (doc.content ?? []).map((section) => {
    const [heading, ...blocks] = section.content ?? [];
    return {
      blocks: blocks.flatMap((block): NewsSection["blocks"][number][] => {
        if (block.type === "figure") {
          return [{ src: String(block.attrs?.src ?? ""), type: "figure" }];
        }
        const parts = markParts(block.content ?? []);
        return parts.length > 0 ? [{ parts, type: "p" }] : [];
      }),
      heading: plainText(heading?.content ?? []).trim(),
    };
  });
}

export function newsSectionIssues(sections: readonly NewsSection[]) {
  return sections.flatMap((section, index) => [
    ...(section.heading ? [] : [`Section ${index + 1} needs a heading.`]),
    ...(section.blocks.length > 0
      ? []
      : [`Section ${index + 1} needs at least one paragraph or photo.`]),
  ]);
}

export function newsSectionsToDoc(
  sections: readonly NewsSection[],
): JSONContent {
  return {
    content: sections.map((section) => ({
      content: [
        {
          type: "sectionHeading",
          ...(section.heading
            ? { content: [{ text: section.heading, type: "text" }] }
            : {}),
        },
        ...section.blocks.map((block) =>
          block.type === "figure"
            ? { attrs: { src: block.src }, type: "figure" }
            : paragraph(block.parts),
        ),
      ],
      type: "section",
    })),
    type: "doc",
  };
}

function linkAttrs(part: Exclude<NewsMark, string | { type: "sci" }>) {
  switch (part.type) {
    case "credit-author":
      return { kind: part.type, target: part.slug };
    case "external":
      return { kind: part.type, target: part.href };
    case "news-index":
      return { kind: part.type, target: "" };
    default:
      return { kind: part.type, target: part.id };
  }
}

function markParts(nodes: readonly JSONContent[]): NewsMark[] {
  const runs: Array<{ mark: InlineMark | undefined; text: string }> = [];
  for (const node of nodes) {
    if (node.type !== "text" || !node.text) continue;
    const mark = node.marks?.[0] as InlineMark | undefined;
    const last = runs.at(-1);
    if (last && sameMark(last.mark, mark)) last.text += node.text;
    else runs.push({ mark, text: node.text });
  }
  return runs.map(({ mark, text }) => toMark(mark, text));
}

function paragraph(parts: readonly NewsMark[]): JSONContent {
  return {
    content: parts.map((part): JSONContent => {
      if (typeof part === "string") return { text: part, type: "text" };
      if (part.type === "sci") {
        return { marks: [{ type: "sci" }], text: part.name, type: "text" };
      }
      return {
        marks: [{ attrs: linkAttrs(part), type: "newsLink" }],
        text: part.label,
        type: "text",
      };
    }),
    type: "paragraph",
  };
}

function plainText(nodes: readonly JSONContent[]) {
  return nodes.map((node) => node.text ?? "").join("");
}

function sameMark(left: InlineMark | undefined, right: InlineMark | undefined) {
  if (!left || !right) return left === right;
  if (left.type === "sci" || right.type === "sci") {
    return left.type === right.type;
  }
  return (
    left.attrs.kind === right.attrs.kind &&
    left.attrs.target === right.attrs.target
  );
}

function toMark(mark: InlineMark | undefined, text: string): NewsMark {
  if (!mark || !text.trim()) return text;
  if (mark.type === "sci") return { name: text, type: "sci" };
  const { kind, target } = mark.attrs;
  switch (kind) {
    case "credit-author":
      return { label: text, slug: target, type: kind };
    case "external":
      return { href: target, label: text, type: kind };
    case "hub":
      return { id: target as GroupHubId, label: text, type: kind };
    case "news-index":
      return { label: text, type: kind };
    default:
      return { id: target, label: text, type: kind };
  }
}
