import type { AnimalGroup } from "@/data/speciesAtlasMeta";
import type { AppLocale } from "@/i18n/routing";

import { ANIMAL_GROUP_TO_HUB } from "@/lib/groupHubs";
import { type LocaleSpeciesHref, speciesHrefForHub } from "@/lib/localeSwitch";
import { getSpeciesHubId, getSpeciesPublicSlug } from "@/lib/speciesSlugTable";

export type SpeciesHref = LocaleSpeciesHref;

export { regionHref } from "@/lib/regionHref";

export { getSpeciesPublicSlug, resolveSpeciesId } from "@/lib/speciesSlugTable";

export function catalogSpeciesHref(
  species: { group: AnimalGroup; id: string; slug: string },
  locale: AppLocale,
): SpeciesHref {
  return speciesHrefForHub(
    ANIMAL_GROUP_TO_HUB[species.group],
    locale === "ka" ? species.slug : species.id,
  );
}

export function speciesHref(id: string, locale: AppLocale): SpeciesHref {
  const hub = getSpeciesHubId(id);
  const slug = getSpeciesPublicSlug(id, locale);
  return speciesHrefForHub(hub, slug);
}
