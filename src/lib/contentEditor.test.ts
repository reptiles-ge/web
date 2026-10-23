import { describe, expect, it } from "vitest";

import {
  assertInlineLinksPreserved,
  editorRequestSchema,
  editorResultSchema,
  readSpeciesField,
  replaceSpeciesField,
  restoreInlineLinkTargets,
  validateEditorResult,
  verifyEditorSelection,
} from "@/lib/contentEditor";
import { readContentLiteral } from "@/lib/contentEditorLiterals";
import { resolveEditorTarget } from "@/lib/contentEditorTarget";
import { readNewsBodyField } from "@/lib/newsMdx";

const id = "test-species";
const files = {
  ka: `---
id: test-species
commonName: ტესტური ხვლიკი
datePublished: "2025-01-01T10:00:00+04:00"
dateModified: "2025-01-02T10:00:00+04:00"
overview: >-
  ტესტური ხვლიკი ცხოვრობს კლდოვან ფერდობებზე. ის ნაწილობრივ
  [სხვა სახეობას](macrovipera-lebetina) ჰგავს.
interaction: >-
  ადამიანისთვის საფრთხეს არ წარმოადგენს.
identification:
  summary: >-
    პატარა მურა ხვლიკი.
  traits:
    - მუქი ზოლი გვერდზე.
faq:
  - question: საშიშია?
    answer: >-
      არა, ის უვნებელია.
stats:
  - label: სიგრძე
    value: 20 სმ-მდე
---
`,
} as const;
const source = readSpeciesField(files.ka, "overview");
const request = {
  end: 1,
  field: "overview" as const,
  id,
  kind: "species" as const,
  renderedText: source,
  start: 0,
};

describe("selection content editor", () => {
  it("maps a selected occurrence by field and offsets even when the word repeats", () => {
    const input = { ...request, end: 4, renderedText: "ერთი ერთი", start: 0 };
    const match = verifyEditorSelection("ერთი ერთი", input);
    expect(`${match.before}სხვა${match.after}`).toBe("სხვა ერთი");
    expect(
      validateEditorResult(
        { en: "English", ka: "სხვა ერთი", ru: "Русский", tr: "Türkçe" },
        match,
      ).ka,
    ).toBe("სხვა ერთი");
  });

  it("includes the full word when a selection ends inside Georgian text", () => {
    const renderedText = "ეს პართენოგენეტიკური ფორმაა";
    const selection = verifyEditorSelection(renderedText, {
      end: "ეს პართენ".length,
      renderedText,
      start: 0,
    });
    expect(selection.selected).toBe("ეს პართენოგენეტიკური");
    expect(selection.after).toBe(" ფორმაა");
  });

  it("maps rendered selections through inline links and keeps their destinations", () => {
    const raw =
      "წინ [გიურზა](macrovipera-lebetina) და [გიდი](/snakes/bite) შემდეგ";
    const renderedText = "წინ გიურზა და გიდი შემდეგ";
    const whole = verifyEditorSelection(raw, {
      end: renderedText.indexOf(" შემდეგ"),
      renderedText,
      start: renderedText.indexOf("გიურზა"),
    });
    expect(whole.selected).toBe(
      "[გიურზა](macrovipera-lebetina) და [გიდი](/snakes/bite)",
    );
    const following = verifyEditorSelection(raw, {
      end: renderedText.length,
      renderedText,
      start: renderedText.indexOf("შემდეგ"),
    });
    expect(following.selected).toBe("შემდეგ");
    expect(following.before).toBe(
      "წინ [გიურზა](macrovipera-lebetina) და [გიდი](/snakes/bite) ",
    );
    const partial = verifyEditorSelection(raw, {
      end: renderedText.indexOf("გიურზა") + 3,
      renderedText,
      start: renderedText.indexOf("გიურზა") + 1,
    });
    expect(partial.selected).toBe("[გიურზა](macrovipera-lebetina)");
    expect(partial.before).toBe("წინ ");
    expect(partial.after).toBe(" და [გიდი](/snakes/bite) შემდეგ");
    expect(() =>
      assertInlineLinksPreserved(
        raw,
        raw.replace("/snakes/bite", "/snakes/range"),
      ),
    ).toThrow();
    expect(() =>
      assertInlineLinksPreserved(raw, raw.replace("გიდი", "სახელმძღვანელო")),
    ).not.toThrow();
  });

  it("accepts a translation link that Georgian already has and the translation lacked", () => {
    const source = "[დასავლური მახრჩობელა](eryx-jaculus) უფრო მსხვილია.";
    const original = "Песчаный удавчик უფრო მსხვილია.";
    expect(
      restoreInlineLinkTargets(
        original,
        "[Песчаный удавчик](eryx-jaculus) უფრო მსხვილია.",
        source,
      ),
    ).toBe("[Песчаный удавчик](eryx-jaculus) უფრო მსხვილია.");
    expect(() =>
      restoreInlineLinkTargets(
        original,
        "[Песчаный удавчик](https://evil.example) უფრო მსხვილია.",
        source,
      ),
    ).toThrow("inline links");
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

  it("refuses unsupported field formatting and invalid targets", async () => {
    expect(() =>
      replaceSpeciesField(
        files.ka.replace("overview: >-", "overview: {}"),
        "overview",
        "new text",
      ),
    ).toThrow();
    await expect(resolveEditorTarget(request)).rejects.toThrow(
      "Species edits are drafts on the species API",
    );
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

  it("preserves line breaks when replacing a folded species field", () => {
    const replacement = "პირველი ხაზი\nმეორე ხაზი\n\nმეორე აბზაცი";
    const updated = replaceSpeciesField(files.ka, "interaction", replacement);
    expect(readSpeciesField(updated, "interaction")).toBe(replacement);
    expect(readSpeciesField(updated, "overview")).toBe(source);
    expect(
      readSpeciesField(
        replaceSpeciesField(updated, "interaction", replacement),
        "interaction",
      ),
    ).toBe(replacement);
  });

  it("resolves guide, news and message fields to their exact source", async () => {
    const examples = [
      { field: "title", id: "bat-in-house", kind: "guide" },
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
            readContentLiteral(updated[0], example.kind, example.id, [
              locale,
              "title",
            ]),
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
    const explicit = await resolveEditorTarget({
      end: 1,
      field: "home.knowledge.title",
      id: "messages",
      kind: "message",
      renderedText: "გიდები რეალური კითხვებისთვის",
      start: 0,
    });
    expect(explicit.source).toBe("გიდები რეალური კითხვებისთვის");
  });

  it("edits news copy in each locale's MDX file", async () => {
    const result = {
      en: "English text",
      ka: "ქართული ტექსტი",
      ru: "Русский текст",
      tr: "Türkçe metin",
    };
    for (const field of [
      "title",
      "sections.0.heading",
      "sections.0.blocks.0.parts.0",
    ]) {
      const target = await resolveEditorTarget({
        end: 1,
        field,
        id: "georgian-snakes-area-of-occupancy-2026",
        kind: "news",
        renderedText: "test",
        start: 0,
      });
      expect(target.files).toEqual(
        ["ka", "en", "ru", "tr"].map(
          (locale) =>
            `src/content/news/georgian-snakes-area-of-occupancy-2026/${locale}.mdx`,
        ),
      );
      const updated = target.updated(result);
      expect(updated).toHaveLength(4);
      for (const [index, locale] of (
        ["ka", "en", "ru", "tr"] as const
      ).entries()) {
        expect(
          field === "title"
            ? readSpeciesField(updated[index], field)
            : readNewsBodyField(updated[index], field),
        ).toBe(result[locale]);
      }
    }
    await expect(
      resolveEditorTarget({
        end: 1,
        field: "metaTitle",
        id: "georgian-snakes-area-of-occupancy-2026",
        kind: "news",
        renderedText: "test",
        start: 0,
      }),
    ).rejects.toThrow("Unknown news field");
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
      const result = {
        en: "English",
        ka: "ქართული",
        ru: "Русский",
        tr: "Türkçe",
      };
      const updated = target.updated(result);
      expect(updated).toHaveLength(1);
      const root = field === "description" ? "regionMap" : "regionContent";
      for (const locale of ["ka", "en", "ru", "tr"] as const) {
        expect(
          readContentLiteral(updated[0], root, "abkhazia", [field, locale]),
        ).toBe(result[locale]);
      }
    }
  });

  it("resolves nested text blocks across content types", async () => {
    for (const target of [
      { field: "sections.0.paragraphs.0", id: "bat-in-house", kind: "guide" },
      {
        field: "sections.0.blocks.0.parts.0",
        id: "georgian-snakes-area-of-occupancy-2026",
        kind: "news",
      },
      { field: "habitats.0", id: "abkhazia", kind: "region" },
      { field: "faq.0.answer", id: "abkhazia", kind: "region" },
    ] as const) {
      const resolved = await resolveEditorTarget({
        ...target,
        end: 1,
        renderedText: "test",
        start: 0,
      });
      expect(resolved.source.trim().length).toBeGreaterThan(0);
    }
  });
});
