import { pathnames } from "@/i18n/pathnames";
import { SPECIES_HUB_BY_PAGE } from "@/lib/speciesHubs";

export type InternalLinkTarget =
  | { href: InternalRouteHref; type: "route" }
  | { slug: string; type: "species" };

type DynamicPathname = {
  key: PathnameKey;
  patterns: readonly string[][];
};

type InternalRouteHref =
  PathnameKey | { params: Record<string, string>; pathname: PathnameKey };

type PathnameKey = keyof typeof pathnames;

const PATHNAME_KEYS = Object.keys(pathnames) as PathnameKey[];

function localizedForms(key: PathnameKey): string[] {
  const value: Record<string, string> | string = pathnames[key];
  const forms = typeof value === "string" ? [value] : Object.values(value);
  return [...new Set([key, ...forms])];
}

const STATIC_PATHNAMES: ReadonlyMap<string, PathnameKey> = (() => {
  const map = new Map<string, PathnameKey>();
  const staticKeys = PATHNAME_KEYS.filter((key) => !key.includes("["));
  for (const key of staticKeys) map.set(key, key);
  for (const key of staticKeys) {
    for (const form of localizedForms(key)) {
      if (!map.has(form)) map.set(form, key);
    }
  }
  return map;
})();

const DYNAMIC_PATHNAMES: readonly DynamicPathname[] = PATHNAME_KEYS.filter(
  (key) => key.includes("["),
).map((key) => ({
  key,
  patterns: localizedForms(key).map((form) => form.split("/")),
}));

export function resolveInternalLinkTarget(
  target: string,
): InternalLinkTarget | null {
  if (!target.startsWith("/") || /[?#\s]/.test(target)) return null;
  const path =
    target.length > 1 && target.endsWith("/") ? target.slice(0, -1) : target;

  const staticKey = STATIC_PATHNAMES.get(path);
  if (staticKey) return { href: staticKey, type: "route" };

  const segments = path.split("/");
  for (const { key, patterns } of DYNAMIC_PATHNAMES) {
    for (const pattern of patterns) {
      const params = matchPattern(pattern, segments);
      if (!params) continue;
      if (SPECIES_HUB_BY_PAGE.has(key) && params.slug) {
        return { slug: params.slug, type: "species" };
      }
      return { href: { params, pathname: key }, type: "route" };
    }
  }

  return null;
}

function matchPattern(pattern: readonly string[], segments: readonly string[]) {
  if (pattern.length !== segments.length) return null;
  const params: Record<string, string> = {};
  for (const [index, part] of pattern.entries()) {
    const segment = segments[index];
    const param = /^\[(\w+)\]$/.exec(part)?.[1];
    if (param) {
      if (!segment) return null;
      params[param] = decodeURIComponent(segment);
    } else if (part !== segment) {
      return null;
    }
  }
  return params;
}
