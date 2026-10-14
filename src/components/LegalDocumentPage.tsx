import type { ReactNode } from "react";

import type { AppLocale } from "@/i18n/routing";

import { type LegalDocumentId, legalDocuments } from "@/content/legalDocuments";
import { Link } from "@/i18n/navigation";

type Block =
  | {
      id?: string;
      key: string;
      level: number;
      text: string;
      type: "heading";
    }
  | { items: TextPart[]; key: string; type: "list" }
  | { key: string; rows: TableRow[]; type: "table" }
  | { key: string; text: string; type: "paragraph" };

export type { LegalDocumentId } from "@/content/legalDocuments";

type LegalLinkHref = "/photo-use";

type TableRow = {
  cells: TextPart[];
  key: string;
};

type TextPart = {
  key: string;
  text: string;
};

export function LegalDocumentPage({
  documentId,
  locale,
}: {
  documentId: LegalDocumentId;
  locale: AppLocale;
}) {
  const blocks = parseMarkdown(legalDocuments[documentId][locale]);

  return (
    <div className="bg-background">
      <article
        className="mx-auto max-w-4xl px-6 pt-28 pb-16 text-foreground lg:px-10 lg:pt-32 lg:pb-20"
        lang={locale}
      >
        <div className="space-y-6">
          {blocks.map((block) => renderBlock(block))}
        </div>
      </article>
    </div>
  );
}

function InlineText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const inlinePattern = /`([^`]+)`|\[([^\]]+)\]\((\/[^)\s]*)\)/g;
  let cursor = 0;
  let match: null | RegExpExecArray;

  while ((match = inlinePattern.exec(text))) {
    if (match.index > cursor) {
      parts.push(text.slice(cursor, match.index));
    }
    parts.push(
      match[1] ? (
        <code
          className="rounded bg-card px-1.5 py-0.5 text-[0.92em] text-foreground"
          key={sourceKey("code", match.index + 1, match[1])}
        >
          {match[1]}
        </code>
      ) : (
        <Link
          className="font-medium text-primary underline underline-offset-4"
          href={match[3] as LegalLinkHref}
          key={sourceKey("link", match.index + 1, match[2])}
        >
          {match[2]}
        </Link>
      ),
    );
    cursor = match.index + match[0].length;
  }

  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return parts;
}

function parseMarkdown(markdown: string) {
  const lines = markdown.split(/\r?\n/);
  const blocks: Block[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index]?.trim() ?? "";

    if (!line) {
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+?)(?:\s+\{#([a-z0-9-]+)\})?$/);
    if (heading) {
      blocks.push({
        id: heading[3],
        key: sourceKey("heading", index + 1, heading[2]),
        level: heading[1].length,
        text: heading[2],
        type: "heading",
      });
      index += 1;
      continue;
    }

    if (line.startsWith("|")) {
      const rows: TableRow[] = [];
      const startLine = index + 1;
      while (index < lines.length && lines[index]?.trim().startsWith("|")) {
        const row = lines[index]?.trim() ?? "";
        if (!/^\|[\s:|-]+\|$/.test(row)) {
          const rowLine = index + 1;
          const cells = splitTableRow(row).map((cell, cellIndex) => ({
            key: sourceKey("cell", rowLine, `${cellIndex}-${cell}`),
            text: cell,
          }));
          rows.push({
            cells,
            key: sourceKey("row", rowLine, row),
          });
        }
        index += 1;
      }
      blocks.push({ key: sourceKey("table", startLine), rows, type: "table" });
      continue;
    }

    if (line.startsWith("- ")) {
      const items: TextPart[] = [];
      const startLine = index + 1;
      while (index < lines.length && lines[index]?.trim().startsWith("- ")) {
        const item = (lines[index]?.trim() ?? "").slice(2);
        items.push({
          key: sourceKey("item", index + 1, item),
          text: item,
        });
        index += 1;
      }
      blocks.push({ items, key: sourceKey("list", startLine), type: "list" });
      continue;
    }

    const startLine = index + 1;
    const parts: string[] = [line];
    index += 1;
    while (index < lines.length) {
      const next = lines[index]?.trim() ?? "";
      if (
        !next ||
        next.startsWith("#") ||
        next.startsWith("|") ||
        next.startsWith("- ")
      ) {
        break;
      }
      parts.push(next);
      index += 1;
    }
    blocks.push({
      key: sourceKey("paragraph", startLine, line),
      text: parts.join(" "),
      type: "paragraph",
    });
  }

  return blocks;
}

function renderBlock(block: Block) {
  if (block.type === "heading") {
    const className =
      block.level === 1
        ? "text-3xl font-semibold tracking-normal text-foreground sm:text-4xl"
        : block.level === 2
          ? "pt-6 text-2xl font-semibold tracking-normal text-foreground"
          : "pt-3 text-xl font-semibold tracking-normal text-foreground";
    const Tag = `h${block.level}` as "h1" | "h2" | "h3";
    return (
      <Tag
        className={block.id ? `${className} scroll-mt-28` : className}
        id={block.id}
        key={block.key}
      >
        <InlineText text={block.text} />
      </Tag>
    );
  }

  if (block.type === "list") {
    return (
      <ul
        className="ml-5 list-disc space-y-2 text-[15px] leading-7 text-foreground/82"
        key={block.key}
      >
        {block.items.map((item) => (
          <li key={item.key}>
            <InlineText text={item.text} />
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === "table") {
    const [head, ...body] = block.rows;
    return (
      <div
        className="overflow-x-auto rounded-md border border-border"
        key={block.key}
      >
        <table className="min-w-full divide-y divide-border text-left text-[13px]">
          {head ? (
            <thead className="bg-card">
              <tr>
                {head.cells.map((cell) => (
                  <th
                    className="px-4 py-3 font-semibold text-foreground"
                    key={cell.key}
                    scope="col"
                  >
                    <InlineText text={cell.text} />
                  </th>
                ))}
              </tr>
            </thead>
          ) : null}
          <tbody className="divide-y divide-border">
            {body.map((row) => (
              <tr key={row.key}>
                {row.cells.map((cell) => (
                  <td
                    className="px-4 py-3 align-top text-foreground/78"
                    key={cell.key}
                  >
                    <InlineText text={cell.text} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <p className="text-[15px] leading-7 text-foreground/82" key={block.key}>
      <InlineText text={block.text} />
    </p>
  );
}

function sourceKey(prefix: string, line: number, text = "") {
  return `${prefix}-${line}-${text}`;
}

function splitTableRow(row: string) {
  return row
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}
