import { locales } from "@/i18n/locales";
import { pathnames } from "@/i18n/pathnames";
import { SPECIES_HUB_BY_PAGE, type SpeciesHubId } from "@/lib/speciesHubs";

export type InternalLinkTarget =
  | { href: InternalRouteHref; type: "route" }
  | { hub: SpeciesHubId; slug: string; type: "species" };

export type UnresolvedInternalLink = { label: string; match: string };

type DynamicPathname = {
  key: PathnameKey;
  patterns: readonly string[][];
};

type InternalRouteHref =
  | PathnameKey
  | {
      hash?: string;
      params?: Record<string, string>;
      pathname: PathnameKey;
      query?: Record<string, string>;
    };

type PathnameKey = keyof typeof pathnames;

const PATHNAME_KEYS = Object.keys(pathnames) as PathnameKey[];

const LOCALE_PREFIX = new RegExp(`^/(?:${locales.join("|")})(?=/|$)`);

const INTERNAL_LINK_TARGET = /\]\((\/[^)\s]*)\)/g;

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

export function findUnresolvedInternalLinks(
  text: string,
): UnresolvedInternalLink[] {
  return [...text.matchAll(INTERNAL_LINK_TARGET)].flatMap(([, target]) =>
    target !== undefined && !resolveInternalLinkTarget(target)
      ? [{ label: "unresolved link", match: target }]
      : [],
  );
}

export function resolveInternalLinkTarget(
  target: string,
): InternalLinkTarget | null {
  if (!target.startsWith("/") || target.startsWith("//")) return null;
  if (/\s/.test(target)) return null;
  const [, rawPath = "", search = "", fragment = ""] =
    /^([^?#]*)(?:\?([^#]*))?(?:#(.*))?$/.exec(target) ?? [];
  const path = normalizePath(rawPath.replace(LOCALE_PREFIX, "") || "/");
  const route = resolvePath(path);
  if (!route) return null;
  if (route.type === "species") return search || fragment ? null : route;
  if (!search && !fragment) return route;
  const query = Object.fromEntries(new URLSearchParams(search));
  const base =
    typeof route.href === "string" ? { pathname: route.href } : route.href;
  return {
    href: {
      ...base,
      ...(Object.keys(query).length > 0 ? { query } : {}),
      ...(fragment ? { hash: fragment } : {}),
    },
    type: "route",
  };
}

function decodeSegment(segment: string) {
  try {
    return decodeURIComponent(segment);
  } catch {
    return null;
  }
}

function matchPattern(pattern: readonly string[], segments: readonly string[]) {
  if (pattern.length !== segments.length) return null;
  const params: Record<string, string> = {};
  for (const [index, part] of pattern.entries()) {
    const segment = segments[index];
    const param = /^\[(\w+)\]$/.exec(part)?.[1];
    if (param) {
      const value = segment ? decodeSegment(segment) : null;
      if (!value) return null;
      params[param] = value;
    } else if (part !== segment) {
      return null;
    }
  }
  return params;
}

function normalizePath(path: string) {
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

function resolvePath(path: string): InternalLinkTarget | null {
  const staticKey = STATIC_PATHNAMES.get(path);
  if (staticKey) return { href: staticKey, type: "route" };

  const segments = path.split("/");
  for (const { key, patterns } of DYNAMIC_PATHNAMES) {
    for (const pattern of patterns) {
      const params = matchPattern(pattern, segments);
      if (!params) continue;
      const hub = SPECIES_HUB_BY_PAGE.get(key);
      if (hub && params.slug) {
        return { hub: hub.id, slug: params.slug, type: "species" };
      }
      return { href: { params, pathname: key }, type: "route" };
    }
  }

  return null;
}
