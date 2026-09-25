import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  editorRequestSchema,
  editorResultSchema,
  readSpeciesField,
  replaceSpeciesField,
  validateEditorResult,
  verifyEditorSelection,
} from "@/lib/contentEditor";
import { readContentLiteral } from "@/lib/contentEditorLiterals";
import { resolveEditorTarget } from "@/lib/contentEditorTarget";

const id = "darevskia-clarkorum";
const files = Object.fromEntries(
  ["ka", "en", "ru", "tr"].map((locale) => [
    locale,
    fs.readFileSync(
      path.join(process.cwd(), "src/content/species", id, `${locale}.mdx`),
      "utf8",
    ),
  ]),
) as Record<"en" | "ka" | "ru" | "tr", string>;
const source = readSpeciesField(files.ka, "overview");
const first = source.indexOf("უშხამო");
const request = {
  end: first + "უშხამო".length,
  field: "overview" as const,
  id,
  kind: "species" as const,
  renderedText: source,
  start: first,
};

describe("selection content editor", () => {
  it("maps a selected occurrence by field and offsets even when the word repeats", () => {
    const selection = verifyEditorSelection(source, request);
    expect(selection.selected).toBe("უშხამო");
    const changed = `${selection.before}უსაფრთხო${selection.after}`;
    expect(
      validateEditorResult(
        { en: "English", ka: changed, ru: "Русский", tr: "Türkçe" },
        selection,
      ).ka,
    ).toBe(changed);
    const input = { ...request, end: 4, renderedText: "ერთი ერთი", start: 0 };
    const match = verifyEditorSelection("ერთი ერთი", input);
    expect(`${match.before}სხვა${match.after}`).toBe("სხვა ერთი");
  });

  it("rejects invalid ids, ranges crossing fields, malformed output and missing locales", () => {
    expect(
      editorRequestSchema.safeParse({ ...request, id: "../secret" }).success,
    ).toBe(false);
    expect(() =>
      verifyEditorSelection(source, { ...request, end: source.length + 1 }),
    ).toThrow();
    expect(() =>
      verifyEditorSelection(source, {
        ...request,
        renderedText: `${source}extra`,
      }),
    ).toThrow();
    expect(
      editorResultSchema.safeParse({ en: "b", ka: "a", ru: "c" }).success,
    ).toBe(false);
    expect(
      editorResultSchema.safeParse({
        en: "b",
        extra: "e",
        ka: "a",
        ru: "c",
        tr: "d",
      }).success,
    ).toBe(false);
    expect(() =>
      validateEditorResult(
        { en: "b", ka: "other", ru: "c", tr: "d" },
        verifyEditorSelection(source, request),
      ),
    ).toThrow();
  });

  it("updates only the chosen field in all four locale files", async () => {
    const selection = verifyEditorSelection(source, request);
    const values = {
      en: "New English overview.",
      ka: `${selection.before}უსაფრთხო${selection.after}`,
      ru: "Новое описание.",
      tr: "Yeni açıklama.",
    };
    const target = await resolveEditorTarget(request);
    const updated = target.updated(values);
    for (const [index, locale] of (
      ["ka", "en", "ru", "tr"] as const
    ).entries()) {
      expect(readSpeciesField(updated[index], "overview")).toBe(values[locale]);
      expect(
        updated[index].replace(/^overview: >-\n(?:^  .*\n|^\n)*/m, ""),
      ).toBe(files[locale].replace(/^overview: >-\n(?:^  .*\n|^\n)*/m, ""));
    }
  });

  it("refuses unsupported field formatting and invalid targets", async () => {
    expect(() =>
      replaceSpeciesField(
        files.ka.replace("overview: >-", "overview: {}"),
        "overview",
        "new text",
      ),
    ).toThrow();
    await expect(
      resolveEditorTarget({ ...request, id: "unknown-species" }),
    ).rejects.toThrow();
  });

  it("updates nested species fields without touching another field", () => {
    for (const field of [
      "identification.summary",
      "identification.traits.0",
      "faq.0.question",
      "faq.0.answer",
      "stats.0.label",
      "stats.0.value",
    ]) {
      const original = readSpeciesField(files.ka, field);
      const replacement = original.includes("\n")
        ? original.replace(/\S/, "ა")
        : "განახლებული ტექსტი";
      const updated = replaceSpeciesField(files.ka, field, replacement);
      expect(readSpeciesField(updated, field)).toBe(replacement);
      expect(updated).not.toBe(files.ka);
      expect(readSpeciesField(updated, "commonName")).toBe(
        readSpeciesField(files.ka, "commonName"),
      );
    }
  });

  it("prevents a species name edit from changing its public slug", async () => {
    const target = await resolveEditorTarget({
      end: 1,
      field: "commonName",
      id,
      kind: "species",
      renderedText: readSpeciesField(files.ka, "commonName"),
      start: 0,
    });
    expect(() =>
      target.updated({
        en: "Other name",
        ka: "სხვა სახელი",
        ru: "Другое имя",
        tr: "Başka ad",
      }),
    ).toThrow("public URL");
  });

  it("resolves guide, news and message fields to their exact source", async () => {
    const examples = [
      { field: "title", id: "bat-in-house", kind: "guide" },
      {
        field: "title",
        id: "georgian-snakes-area-of-occupancy-2026",
        kind: "news",
      },
      { field: "auto", id: "messages", kind: "message" },
    ] as const;
    for (const example of examples) {
      const renderedText =
        example.kind === "message" ? "გიდები რეალური კითხვებისთვის" : "test";
      if (example.kind === "message") {
        const target = await resolveEditorTarget({
          ...example,
          end: 1,
          renderedText,
          start: 0,
        });
        expect(target.field).toBe("home.knowledge.title");
        const updated = target.updated({
          en: "Other title",
          ka: "სხვა სათაური",
          ru: "Другой заголовок",
          tr: "Başka başlık",
        });
        expect(updated).toHaveLength(4);
      } else {
        const target = await resolveEditorTarget({
          ...example,
          end: 1,
          renderedText,
          start: 0,
        });
        expect(target.source.length).toBeGreaterThan(0);
        const result = {
          en: "English",
          ka: "ქართული",
          ru: "Русский",
          tr: "Türkçe",
        };
        const updated = target.updated(result);
        expect(updated).toHaveLength(1);
        expect(updated[0]).not.toBe(target.originals[0]);
        for (const locale of ["ka", "en", "ru", "tr"] as const) {
          expect(
            readContentLiteral(
              updated[0],
              example.kind,
              example.id,
              example.kind === "guide"
                ? [locale, "title"]
                : ["copy", locale, "title"],
            ),
          ).toBe(result[locale]);
        }
      }
    }
    await expect(
      resolveEditorTarget({
        end: 1,
        field: "auto",
        id: "messages",
        kind: "message",
        renderedText: "მთავარზე დაბრუნება",
        start: 0,
      }),
    ).rejects.toThrow("ambiguous");
  });

  it("resolves region copy in both existing content files", async () => {
    for (const field of ["description", "overview"]) {
      const target = await resolveEditorTarget({
        end: 1,
        field,
        id: "abkhazia",
        kind: "region",
        renderedText: "test",
        start: 0,
      });
      const result = { en: "English", ka: "ქართული", ru: "Русский", tr: "Türkçe" };
      const updated = target.updated(result);
      expect(updated).toHaveLength(1);
      const root = field === "description" ? "regionMap" : "regionContent";
      for (const locale of ["ka", "en", "ru", "tr"] as const) {
        expect(readContentLiteral(updated[0], root, "abkhazia", [field, locale])).toBe(result[locale]);
      }
    }
  });
});
