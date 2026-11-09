import type { AnimalGroup } from "@/data/speciesAtlasMeta";
import type { ContentViewInput } from "@/lib/contentViewInput";

import { pathnames } from "@/i18n/pathnames";
import { parseNewsArchivePage } from "@/lib/newsArchivePages";
import { SPECIES_HUB_BY_PAGE } from "@/lib/speciesHubs";

export type PageViewTarget =
  | { group: AnimalGroup; id: string; kind: "species" }
  | { id: string; kind: "author" | "news" | "quiz" | "region" }
  | { kind: "newsPage"; page: number }
  | { kind: "static" };

export const PAGE_PATH_SEGMENT = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const TARGET_BY_TEMPLATE: Record<
  string,
  "author" | "news" | "quiz" | "region"
> = {
  "/authors/[slug]": "author",
  "/news/[slug]": "news",
  "/quiz/[slug]": "quiz",
  "/regions/[id]": "region",
};

const DYNAMIC_SEGMENT = /^\[[a-z]+\]$/;

const TEMPLATES = Object.keys(pathnames).map((template) => ({
  parts: template === "/" ? [] : template.split("/").slice(1),
  template,
}));

export function contentViewForPath(path: string): ContentViewInput | undefined {
  const target = pageViewTarget(path);
  if (target?.kind === "species" || target?.kind === "news") {
    return { id: target.id, kind: target.kind };
  }
  return undefined;
}

export function pageViewTarget(path: string): PageViewTarget | undefined {
  const template = pageViewTemplate(path);
  if (!template) return undefined;
  if (!template.includes("[")) return { kind: "static" };
  const id = path.slice(path.lastIndexOf("/") + 1);
  const hub = SPECIES_HUB_BY_PAGE.get(template);
  if (hub) return { group: hub.group, id, kind: "species" };
  if (template === "/news/page/[page]") {
    const page = parseNewsArchivePage(id);
    return page ? { kind: "newsPage", page } : undefined;
  }
  const kind = TARGET_BY_TEMPLATE[template];
  return kind ? { id, kind } : undefined;
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
