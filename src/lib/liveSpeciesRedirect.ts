import type { AppLocale } from "@/i18n/routing";

import { pathnames } from "@/i18n/pathnames";
import { GROUP_HUB_LIST, type GroupHubId } from "@/lib/groupHubs";
import { getSpeciesSlugMaps, liveSpeciesPath } from "@/lib/speciesSlugRuntime";

const LEGACY_SPECIES_SEGMENT = "species";

const HUB_BY_SEGMENT: Readonly<Record<string, GroupHubId>> = Object.fromEntries(
  GROUP_HUB_LIST.flatMap((hub): Array<[string, GroupHubId]> =>
    Object.values(pathnames[`/${hub.id}/[slug]`]).map((pattern) => [
      pattern.split("/")[1] ?? "",
      hub.id,
    ]),
  ),
);

export async function liveSpeciesRedirectPath(
  locale: AppLocale,
  rest: readonly string[],
): Promise<null | string> {
  const [segment, slug, ...extra] = rest;
  if (!segment || !slug || extra.length > 0) return null;
  const hub = HUB_BY_SEGMENT[segment];
  if (!hub && segment !== LEGACY_SPECIES_SEGMENT) return null;
  const maps = await getSpeciesSlugMaps();
  const id = maps.idByAnySlug[slug];
  if (!id) return null;
  if (hub && maps.hubById[id] !== hub) return null;
  return liveSpeciesPath(maps, id, locale);
}
