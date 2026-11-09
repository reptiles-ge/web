import type { ContentViewInput } from "@/lib/contentViewInput";

import { pathnames } from "@/i18n/pathnames";

export const PAGE_PATH_SEGMENT = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const SPECIES_PAGE_TEMPLATES: ReadonlySet<string> = new Set([
  "/amphibians/[slug]",
  "/birds/[slug]",
  "/insects/[slug]",
  "/lizards/[slug]",
  "/mammals/[slug]",
  "/scorpions/[slug]",
  "/snakes/[slug]",
  "/spiders/[slug]",
  "/turtles/[slug]",
]);

const NEWS_ARTICLE_TEMPLATE = "/news/[slug]";

const DYNAMIC_SEGMENT = /^\[[a-z]+\]$/;

const TEMPLATES = Object.keys(pathnames).map((template) => ({
  parts: template === "/" ? [] : template.split("/").slice(1),
  template,
}));

export function contentViewForPath(path: string): ContentViewInput | undefined {
  const template = pageViewTemplate(path);
  if (!template) return undefined;
  const id = path.slice(path.lastIndexOf("/") + 1);
  if (SPECIES_PAGE_TEMPLATES.has(template)) return { id, kind: "species" };
  if (template === NEWS_ARTICLE_TEMPLATE) return { id, kind: "news" };
  return undefined;
}

export function pageViewTemplate(path: string): string | undefined {
  const segments = path === "/" ? [] : path.split("/").slice(1);
  if (!path.startsWith("/")) return undefined;
  if (segments.some((segment) => !PAGE_PATH_SEGMENT.test(segment))) {
    return undefined;
  }
  let dynamic: string | undefined;
  for (const { parts, template } of TEMPLATES) {
    if (parts.length !== segments.length) continue;
    if (parts.every((part, index) => part === segments[index])) {
      return template;
    }
    if (
      dynamic === undefined &&
      parts.every(
        (part, index) => part === segments[index] || DYNAMIC_SEGMENT.test(part),
      )
    ) {
      dynamic = template;
    }
  }
  return dynamic;
}
