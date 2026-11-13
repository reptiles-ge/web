import type { AnimalGroup } from "@/data/speciesAtlasMeta";
import type { AppLocale } from "@/i18n/routing";

import { ANIMAL_GROUP_TO_HUB } from "@/lib/groupHubs";
import { type LocaleSpeciesHref, speciesHrefForHub } from "@/lib/localeSwitch";
import { getSpeciesHubId, getSpeciesPublicSlug } from "@/lib/speciesSlugTable";

export type SpeciesHref = LocaleSpeciesHref;

export { regionHref } from "@/lib/regionHref";

export { getSpeciesPublicSlug, resolveSpeciesId } from "@/lib/speciesSlugTable";

export type SpeciesRouteSource =
  string | { group?: AnimalGroup; id: string; slug?: string };

export function speciesHref(
  species: SpeciesRouteSource,
  locale: AppLocale,
): SpeciesHref {
  const id = typeof species === "string" ? species : species.id;
  const group = typeof species === "string" ? undefined : species.group;
  const slug = typeof species === "string" ? undefined : species.slug;
  const hub = group ? ANIMAL_GROUP_TO_HUB[group] : getSpeciesHubId(id);
  const publicSlug =
    locale === "ka" && slug && slug !== id
      ? slug
      : getSpeciesPublicSlug(id, locale);
  return speciesHrefForHub(hub, publicSlug);
}
