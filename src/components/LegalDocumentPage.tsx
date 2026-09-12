import { readFileSync } from "node:fs";
import path from "node:path";

import type { AppLocale } from "@/i18n/routing";

export type LegalDocumentId = "privacy" | "terms";

type Block =
  | { items: string[]; type: "list" }
  | { level: number; text: string; type: "heading" }
  | { rows: string[][]; type: "table" }
  | { text: string; type: "paragraph" };

const documentFiles: Record<LegalDocumentId, string> = {
  privacy: "reptiles-ge-privacy-policy-ka.md",
  terms: "reptiles-ge-terms-of-use-ka.md",
};

export function LegalDocumentPage({
  documentId,
  locale,
  notice,
}: {
  documentId: LegalDocumentId;
  locale: AppLocale;
  notice: string;
}) {
  const blocks = parseMarkdown(readDocument(documentId));

  return (
    <main className="bg-background">
      <article
        className="mx-auto max-w-4xl px-6 pt-28 pb-16 text-foreground lg:px-10 lg:pt-32 lg:pb-20"
        lang="ka"
      >
        {locale !== "ka" ? (
          <p className="mb-8 rounded-md border border-border bg-card px-4 py-3 text-[14px] leading-relaxed text-muted-foreground">
            {notice}
          </p>
        ) : null}
        <div className="space-y-6">
          {blocks.map((block, index) => renderBlock(block, index))}
        </div>
      </article>
    </main>
  );
}

function InlineText({ text }: { text: string }) {
  return text.split(/(`[^`]+`)/g).map((part, index) =>
    part.startsWith("`") && part.endsWith("`") ? (
      <code
        className="rounded bg-card px-1.5 py-0.5 text-[0.92em] text-foreground"
        key={index}
      >
        {part.slice(1, -1)}
      </code>
    ) : (
      part
    ),
  );
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

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      blocks.push({
        level: heading[1].length,
        text: heading[2],
        type: "heading",
      });
      index += 1;
      continue;
    }

    if (line.startsWith("|")) {
      const rows: string[][] = [];
      while (index < lines.length && lines[index]?.trim().startsWith("|")) {
        const row = lines[index]?.trim() ?? "";
        if (!/^\|[\s:|-]+\|$/.test(row)) {
          rows.push(splitTableRow(row));
        }
        index += 1;
      }
      blocks.push({ rows, type: "table" });
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (index < lines.length && lines[index]?.trim().startsWith("- ")) {
        items.push((lines[index]?.trim() ?? "").slice(2));
        index += 1;
      }
      blocks.push({ items, type: "list" });
      continue;
    }

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
    blocks.push({ text: parts.join(" "), type: "paragraph" });
  }

  return blocks;
}

function readDocument(documentId: LegalDocumentId) {
  return readFileSync(
    path.join(process.cwd(), "docs/legal", documentFiles[documentId]),
    "utf8",
  );
}

function renderBlock(block: Block, index: number) {
  if (block.type === "heading") {
    const className =
      block.level === 1
        ? "text-3xl font-semibold tracking-normal text-foreground sm:text-4xl"
        : block.level === 2
          ? "pt-6 text-2xl font-semibold tracking-normal text-foreground"
          : "pt-3 text-xl font-semibold tracking-normal text-foreground";
    const Tag = `h${block.level}` as "h1" | "h2" | "h3";
    return (
      <Tag className={className} key={index}>
        <InlineText text={block.text} />
      </Tag>
    );
  }

  if (block.type === "list") {
    return (
      <ul
        className="ml-5 list-disc space-y-2 text-[15px] leading-7 text-foreground/82"
        key={index}
      >
        {block.items.map((item, itemIndex) => (
          <li key={itemIndex}>
            <InlineText text={item} />
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
        key={index}
      >
        <table className="min-w-full divide-y divide-border text-left text-[13px]">
          {head ? (
            <thead className="bg-card">
              <tr>
                {head.map((cell, cellIndex) => (
                  <th
                    className="px-4 py-3 font-semibold text-foreground"
                    key={cellIndex}
                    scope="col"
                  >
                    <InlineText text={cell} />
                  </th>
                ))}
              </tr>
            </thead>
          ) : null}
          <tbody className="divide-y divide-border">
            {body.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    className="px-4 py-3 align-top text-foreground/78"
                    key={cellIndex}
                  >
                    <InlineText text={cell} />
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
    <p className="text-[15px] leading-7 text-foreground/82" key={index}>
      <InlineText text={block.text} />
    </p>
  );
}

function splitTableRow(row: string) {
  return row
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}
