import type { AnimalGroup } from "@/data/speciesAtlasMeta";
import type { AppLocale } from "@/i18n/routing";

import { ANIMAL_GROUP_TO_HUB } from "@/lib/groupHubs";
import { type LocaleSpeciesHref, speciesHrefForHub } from "@/lib/localeSwitch";
import { getSpeciesHubId, getSpeciesPublicSlug } from "@/lib/speciesSlugTable";

export type SpeciesHref = LocaleSpeciesHref;

export { regionHref } from "@/lib/regionHref";

export { getSpeciesPublicSlug, resolveSpeciesId } from "@/lib/speciesSlugTable";

type SpeciesRouteSource = string | { group?: AnimalGroup; id: string };

export function speciesHref(
  species: SpeciesRouteSource,
  locale: AppLocale,
): SpeciesHref {
  const id = typeof species === "string" ? species : species.id;
  const group = typeof species === "string" ? undefined : species.group;
  const hub = group ? ANIMAL_GROUP_TO_HUB[group] : getSpeciesHubId(id);
  return speciesHrefForHub(hub, getSpeciesPublicSlug(id, locale));
}
