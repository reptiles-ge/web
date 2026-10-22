import fs from "node:fs/promises";
import path from "node:path";

import { getGuideArticles } from "@/data/guideArticles";
import { getRegionById } from "@/data/mapRegions";
import { getPublishedNewsArticleBySlug } from "@/data/news";
import {
  assertInlineLinksPreserved,
  editorFields,
  type EditorRequest,
  type EditorResult,
  readSpeciesField,
  replaceSpeciesField,
  restoreInlineLinkTargets,
} from "@/lib/contentEditor";
import {
  readContentLiteral,
  replaceContentLiteral,
} from "@/lib/contentEditorLiterals";
import { readNewsBodyField, replaceNewsBodyField } from "@/lib/newsMdx";
import { toSiteDateTime } from "@/lib/siteTime";
import { kaToSlug } from "@/lib/slugify";

const locales = ["ka", "en", "ru", "tr"] as const;
const speciesField =
  /^(?:commonName|location|description|interaction|identification\.(?:summary|coloration)|identification\.traits\.\d+|faq\.\d+\.(?:question|answer)|stats\.\d+\.(?:label|value))$/;
const guideField =
  /^(?:title|intro|summary|sections\.\d+\.(?:heading|paragraphs\.\d+|list\.items\.\d+)|faq\.\d+\.(?:question|answer))$/;
const newsField =
  /^(?:title|dek|lead|sections\.\d+\.(?:heading|blocks\.\d+\.parts\.\d+(?:\.(?:label|name))?))$/;
const newsFrontmatterField = /^(?:title|dek|lead)$/;
const regionField =
  /^(?:name|description|overview|biome|habitats\.\d+|faq\.\d+\.(?:question|answer))$/;

export function draftReviewUrl(id: string, draftId: number) {
  return `/admin/${id}#draft-${draftId}`;
}

export function finalizeEditorValues(
  result: EditorResult,
  original: (locale: (typeof locales)[number]) => string,
) {
  const values = { ...result };
  for (const locale of locales) {
    const before = original(locale);
    if (locale !== "ka" && before) {
      values[locale] = restoreInlineLinkTargets(
        before,
        values[locale],
        values.ka,
      );
    } else {
      assertInlineLinksPreserved(before || values.ka, values[locale]);
    }
  }
  return values;
}

export function isSpeciesEditorField(field: string) {
  return (
    editorFields.some((candidate) => candidate === field) ||
    speciesField.test(field)
  );
}

export async function resolveEditorTarget(
  input: Partial<Pick<EditorRequest, "end" | "renderedText" | "start">> &
    Pick<EditorRequest, "field" | "id" | "kind">,
  cwd = process.cwd(),
) {
  let files: string[];
  let field = input.field;
  if (input.kind === "species") {
    if (!isSpeciesEditorField(field))
      throw new Error("Unsupported species field");
    files = locales.map(
      (locale) => `src/content/species/${input.id}/${locale}.mdx`,
    );
  } else if (input.kind === "guide") {
    if (
      !guideField.test(field) ||
      !getGuideArticles().some((article) => article.id === input.id)
    ) {
      throw new Error("Unknown guide field");
    }
    const filename = input.id.replace(/-([a-z])/g, (_, letter: string) =>
      letter.toUpperCase(),
    );
    files = [`src/content/guides/${filename}.ts`];
  } else if (input.kind === "news") {
    if (!newsField.test(field) || !getPublishedNewsArticleBySlug(input.id))
      throw new Error("Unknown news field");
    files = locales.map(
      (locale) => `src/content/news/${input.id}/${locale}.mdx`,
    );
  } else if (input.kind === "region") {
    if (!regionField.test(field) || !getRegionById(input.id))
      throw new Error("Unknown region field");
    files = [
      field === "name" || field === "description"
        ? "src/data/mapRegions.ts"
        : "src/data/regionContent.ts",
    ];
  } else {
    if (input.id !== "messages") throw new Error("Invalid message target");
    if (field === "auto") {
      if (!input.renderedText) throw new Error("Missing message text");
      const ka = JSON.parse(
        await fs.readFile(path.join(cwd, "messages/ka.json"), "utf8"),
      ) as unknown;
      const matches = messageMatches(ka, input.renderedText);
      if (matches.length !== 1)
        throw new Error("Message text is missing or ambiguous");
      field = matches[0].join(".");
    }
    files = locales.map((locale) => `messages/${locale}.json`);
  }
  const originals = await Promise.all(
    files.map((file) => fs.readFile(path.join(cwd, file), "utf8")),
  );
  const segments = field.split(".");
  const allowMissingSpeciesTranslation =
    input.kind === "species" &&
    editorFields.some((candidate) => candidate === field);
  const read = (raw: string, locale: (typeof locales)[number]) => {
    if (input.kind === "species")
      return readSpeciesField(
        raw,
        field,
        allowMissingSpeciesTranslation && locale !== "ka",
      );
    if (input.kind === "guide")
      return readContentLiteral(raw, "guide", input.id, [locale, ...segments]);
    if (input.kind === "news")
      return newsFrontmatterField.test(field)
        ? readSpeciesField(raw, field)
        : readNewsBodyField(raw, field);
    if (input.kind === "region")
      return readContentLiteral(
        raw,
        field === "name" || field === "description"
          ? "regionMap"
          : "regionContent",
        input.id,
        [...segments, locale],
      );
    return readContentLiteral(raw, "message", input.id, segments);
  };
  const source = read(originals[0], "ka");
  for (const [index, locale] of locales.entries()) {
    const value = read(
      originals[input.kind === "guide" || input.kind === "region" ? 0 : index],
      locale,
    );
    if (!value.trim() && !(allowMissingSpeciesTranslation && locale !== "ka"))
      throw new Error(`Missing ${locale} content`);
  }
  return {
    field,
    files,
    originals,
    source,
    updated(result: EditorResult) {
      const values = finalizeEditorValues(result, (locale) =>
        read(
          originals[
            input.kind === "guide" || input.kind === "region"
              ? 0
              : locales.indexOf(locale)
          ],
          locale,
        ),
      );
      if (input.kind === "species") {
        if (
          field === "commonName" &&
          kaToSlug(values.ka) !== kaToSlug(source)
        ) {
          throw new Error("Species name edit would change its public URL");
        }
        const updated = locales.map((locale, index) =>
          read(originals[index], locale) === values[locale]
            ? originals[index]
            : replaceSpeciesField(originals[index], field, values[locale]),
        );
        if (updated.some((raw, index) => raw !== originals[index])) {
          updated[0] = replaceSpeciesField(
            updated[0],
            "dateModified",
            toSiteDateTime(new Date()),
          );
        }
        return updated;
      }
      if (input.kind === "news")
        return locales.map((locale, index) =>
          read(originals[index], locale) === values[locale]
            ? originals[index]
            : newsFrontmatterField.test(field)
              ? replaceSpeciesField(originals[index], field, values[locale])
              : replaceNewsBodyField(originals[index], field, values[locale]),
        );
      if (input.kind === "guide") {
        let raw = originals[0];
        for (const locale of locales)
          raw = replaceContentLiteral(
            raw,
            "guide",
            input.id,
            [locale, ...segments],
            values[locale],
          );
        return [raw];
      }
      if (input.kind === "region") {
        let raw = originals[0];
        for (const locale of locales)
          raw = replaceContentLiteral(
            raw,
            field === "name" || field === "description"
              ? "regionMap"
              : "regionContent",
            input.id,
            [...segments, locale],
            values[locale],
          );
        return [raw];
      }
      return locales.map((locale, index) =>
        replaceContentLiteral(
          originals[index],
          "message",
          input.id,
          segments,
          values[locale],
        ),
      );
    },
  };
}

function messageMatches(
  value: unknown,
  text: string,
  segments: string[] = [],
): string[][] {
  if (typeof value === "string") return value === text ? [segments] : [];
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, child]) =>
    messageMatches(child, text, [...segments, key]),
  );
}
