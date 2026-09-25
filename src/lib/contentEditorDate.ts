import fs from "node:fs/promises";
import path from "node:path";

import { getGuideArticles } from "@/data/guideArticles";
import {
  SITEMAP_AUTHOR_LAST_MODIFIED,
  SITEMAP_PATH_LAST_MODIFIED,
  SITEMAP_QUIZ_LAST_MODIFIED,
  SITEMAP_REGION_LAST_MODIFIED,
} from "@/data/pageLastModified";
import type { EditorRequest } from "@/lib/contentEditor";
import { getSpeciesHubId, resolveSpeciesId } from "@/lib/speciesSlugTable";
import { QUIZ_INDEX } from "@/lib/quizzes";

type DateInput = Pick<EditorRequest, "id" | "kind" | "pathname">;

export async function editorDateChange(
  input: DateInput,
  cwd: string,
  now = new Date(),
) {
  const timestamp = `${new Date(now.getTime() + 4 * 60 * 60_000).toISOString().slice(0, 19)}+04:00`;
  let kind = input.kind;
  let id = input.id;
  let section = "";
  let key = "";
  if (kind === "message") {
    const pathname = input.pathname;
    if (!pathname) throw new Error("Missing edited page pathname");
    if (Object.hasOwn(SITEMAP_PATH_LAST_MODIFIED, pathname)) {
      kind = "guide";
      section = "SITEMAP_PATH_LAST_MODIFIED";
      key = pathname;
    } else if (pathname.startsWith("/news/")) {
      kind = "news";
      id = pathname.slice(6);
    } else if (pathname.startsWith("/regions/")) {
      kind = "region";
      id = pathname.slice(9);
    } else if (pathname.startsWith("/authors/")) {
      section = "SITEMAP_AUTHOR_LAST_MODIFIED";
      key = pathname.slice(9);
      if (!Object.hasOwn(SITEMAP_AUTHOR_LAST_MODIFIED, key))
        throw new Error("Unknown author date");
    } else if (pathname.startsWith("/quiz/")) {
      section = "SITEMAP_QUIZ_LAST_MODIFIED";
      const slug = pathname.slice(6);
      key = QUIZ_INDEX.find((quiz) =>
        quiz.slugs && Object.values(quiz.slugs).some((value) => value === slug),
      )?.id ?? "";
      if (!Object.hasOwn(SITEMAP_QUIZ_LAST_MODIFIED, key))
        throw new Error("Unknown quiz date");
    } else {
      const [, hub, slug] = /^\/([^/]+)\/([^/]+)$/.exec(pathname) ?? [];
      const speciesId = slug ? resolveSpeciesId(slug) : undefined;
      if (!speciesId || getSpeciesHubId(speciesId) !== hub)
        throw new Error("Edited page dateModified source unavailable");
      kind = "species";
      id = speciesId;
    }
  }
  if (kind === "guide" && !section) {
    section = "SITEMAP_PATH_LAST_MODIFIED";
    key = getGuideArticles().find((article) => article.id === id)?.pathname ?? "";
    if (!key) throw new Error("Unknown guide date");
  }
  if (kind === "region") {
    section = "SITEMAP_REGION_LAST_MODIFIED";
    key = id;
    if (!Object.hasOwn(SITEMAP_REGION_LAST_MODIFIED, key))
      throw new Error("Unknown region date");
  }
  const file =
    kind === "species"
      ? `src/content/species/${id}/ka.mdx`
      : kind === "news"
        ? `src/content/news/${id}.ts`
        : "src/data/pageLastModified.ts";
  const raw = await fs.readFile(path.join(cwd, file), "utf8");
  let updated: string;
  if (kind === "species") {
    updated = replaceUnique(raw, /^dateModified: "[^"]+"$/gm, `dateModified: "${timestamp}"`);
  } else if (kind === "news") {
    const pattern = /^  updatedAt: "[^"]+",?$/gm;
    updated = /^  updatedAt: "[^"]+",?$/m.test(raw)
      ? replaceUnique(raw, pattern, `  updatedAt: "${timestamp}",`)
      : raw.replace(/\n};\s*$/, `\n  updatedAt: "${timestamp}",\n};\n`);
    if (updated === raw) throw new Error("News dateModified source unavailable");
  } else {
    updated = replaceDateMap(raw, section, key, timestamp);
  }
  return { file, updated };
}

function replaceDateMap(raw: string, section: string, key: string, date: string) {
  const start = raw.indexOf(`export const ${section}: Record<string, string> = {`);
  if (start < 0) throw new Error(`Missing date section: ${section}`);
  const end = raw.indexOf("\n};", start);
  if (end < 0) throw new Error(`Invalid date section: ${section}`);
  const source = raw.slice(start, end);
  const label = /^[a-z]+$/.test(key) ? key : JSON.stringify(key);
  const prefix = `  ${label}: `;
  const offset = source.indexOf(`\n${prefix}`);
  if (offset < 0) throw new Error(`Missing dateModified: ${key}`);
  const lineStart = offset + 1;
  const lineEnd = source.indexOf("\n", lineStart);
  const original = source.slice(lineStart, lineEnd < 0 ? undefined : lineEnd);
  const updated = original.replace(/: "[^"]+"(,?)$/, `: "${date}"$1`);
  if (updated === original) throw new Error(`Invalid dateModified: ${key}`);
  return raw.slice(0, start + lineStart) + updated + raw.slice(start + lineStart + original.length);
}

function replaceUnique(raw: string, pattern: RegExp, value: string) {
  if ([...raw.matchAll(pattern)].length !== 1)
    throw new Error("Expected exactly one dateModified field");
  return raw.replace(pattern, value);
}
