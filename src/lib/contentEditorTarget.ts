import fs from "node:fs/promises";
import path from "node:path";

import { getGuideArticles } from "@/data/guideArticles";
import { getRegionById } from "@/data/mapRegions";
import { getPublishedNewsArticleBySlug } from "@/data/news";
import {
  editorFields,
  type EditorRequest,
  type EditorResult,
  readSpeciesField,
  replaceSpeciesField,
} from "@/lib/contentEditor";
import {
  readContentLiteral,
  replaceContentLiteral,
} from "@/lib/contentEditorLiterals";
import { kaToSlug } from "@/lib/slugify";

const locales = ["ka", "en", "ru", "tr"] as const;
const speciesField =
  /^(?:commonName|location|description|interaction|identification\.summary|identification\.traits\.\d+|faq\.\d+\.(?:question|answer)|stats\.\d+\.(?:label|value))$/;
const guideField =
  /^(?:title|intro|summary|sections\.\d+\.(?:heading|paragraphs\.\d+|list\.items\.\d+)|faq\.\d+\.(?:question|answer))$/;
const newsField =
  /^(?:title|dek|lead|sections\.\d+\.(?:heading|blocks\.\d+\.parts\.\d+(?:\.(?:label|name))?))$/;
const regionField =
  /^(?:name|description|overview|biome|habitats\.\d+|faq\.\d+\.(?:question|answer))$/;

export async function resolveEditorTarget(
  input: EditorRequest,
  cwd = process.cwd(),
) {
  let files: string[];
  let field = input.field;
  if (input.kind === "species") {
    if (
      !editorFields.some((candidate) => candidate === field) &&
      !speciesField.test(field)
    )
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
    files = [`src/content/news/${input.id}.ts`];
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
  const read = (raw: string, locale: (typeof locales)[number]) => {
    if (input.kind === "species") return readSpeciesField(raw, field);
    if (input.kind === "guide")
      return readContentLiteral(raw, "guide", input.id, [locale, ...segments]);
    if (input.kind === "news")
      return readContentLiteral(raw, "news", input.id, [
        "copy",
        locale,
        ...segments,
      ]);
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
      originals[
        input.kind === "guide" ||
        input.kind === "news" ||
        input.kind === "region"
          ? 0
          : index
      ],
      locale,
    );
    if (!value.trim()) throw new Error(`Missing ${locale} content`);
    if (/\[[^\]]+\]\([^)]+\)/.test(value))
      throw new Error("Fields with inline links are not supported yet");
  }
  return {
    field,
    files,
    originals,
    source,
    updated(result: EditorResult) {
      if (input.kind === "species") {
        if (
          field === "commonName" &&
          kaToSlug(result.ka) !== kaToSlug(source)
        ) {
          throw new Error("Species name edit would change its public URL");
        }
        return locales.map((locale, index) =>
          replaceSpeciesField(originals[index], field, result[locale]),
        );
      }
      if (input.kind === "guide" || input.kind === "news") {
        let raw = originals[0];
        for (const locale of locales) {
          raw = replaceContentLiteral(
            raw,
            input.kind,
            input.id,
            input.kind === "guide"
              ? [locale, ...segments]
              : ["copy", locale, ...segments],
            result[locale],
          );
        }
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
            result[locale],
          );
        return [raw];
      }
      return locales.map((locale, index) =>
        replaceContentLiteral(
          originals[index],
          "message",
          input.id,
          segments,
          result[locale],
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
