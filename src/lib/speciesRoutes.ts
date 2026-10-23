import type { AppLocale } from "@/i18n/routing";

import { type LocaleSpeciesHref, speciesHrefForHub } from "@/lib/localeSwitch";
import { getSpeciesHubId, getSpeciesPublicSlug } from "@/lib/speciesSlugTable";

export type SpeciesHref = LocaleSpeciesHref;

export { regionHref } from "@/lib/regionHref";

export { getSpeciesPublicSlug, resolveSpeciesId } from "@/lib/speciesSlugTable";

export function speciesHref(id: string, locale: AppLocale): SpeciesHref {
  const hub = getSpeciesHubId(id);
  const slug = getSpeciesPublicSlug(id, locale);
  return speciesHrefForHub(hub, slug);
}
