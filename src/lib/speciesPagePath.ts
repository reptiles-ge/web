import { defaultLocale, locales } from "@/i18n/locales";
import { pathnames } from "@/i18n/pathnames";
import { GROUP_HUBS, RESERVED_HUB_SLUGS } from "@/lib/groupHubs";

type LocalizedPath = Readonly<Record<string, string>> | string;

function localizedValues(value: LocalizedPath | undefined): string[] {
  if (!value) return [];
  return typeof value === "string" ? [value] : Object.values(value);
}

function segments(path: string): string[] {
  return path.split("/").filter(Boolean);
}

const localizedPathnames: Record<string, LocalizedPath> = pathnames;

const HUB_SEGMENTS_BY_HUB = Object.values(GROUP_HUBS).map((hub) => ({
  id: hub.id,
  segments: localizedValues(localizedPathnames[hub.path]).map(
    (path) => segments(path)[0],
  ),
}));

const HUB_SEGMENTS = new Set(
  HUB_SEGMENTS_BY_HUB.flatMap((hub) => hub.segments),
);

const NON_SPECIES_PATHS = new Set([
  ...Object.values(localizedPathnames)
    .flatMap(localizedValues)
    .map(segments)
    .filter(
      (parts) =>
        parts.length === 2 &&
        HUB_SEGMENTS.has(parts[0]) &&
        parts[1] !== "[slug]",
    )
    .map((parts) => parts.join("/")),
  ...HUB_SEGMENTS_BY_HUB.flatMap((hub) =>
    hub.segments.flatMap((segment) =>
      RESERVED_HUB_SLUGS[hub.id].map((slug) => `${segment}/${slug}`),
    ),
  ),
]);

const PREFIXED_LOCALES = new Set<string>(
  locales.filter((locale) => locale !== defaultLocale),
);

export function isSpeciesPagePath(pathname: string): boolean {
  const parts = segments(pathname);
  const path = PREFIXED_LOCALES.has(parts[0] ?? "") ? parts.slice(1) : parts;
  if (path.length !== 2) return false;
  const [hub, slug] = path;
  return HUB_SEGMENTS.has(hub) && !NON_SPECIES_PATHS.has(`${hub}/${slug}`);
}
