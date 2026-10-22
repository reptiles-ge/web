import type { GroupHubId } from "@/lib/groupHubs";

import { getCatalogSpecies } from "@/data/species";
import { type AppLocale, routing } from "@/i18n/routing";
import { getSpeciesHubId, getSpeciesPublicSlug } from "@/lib/speciesSlugTable";

export function speciesStaticParams(hubId: GroupHubId) {
  const params: Array<{ locale: AppLocale; slug: string }> = [];
  for (const item of getCatalogSpecies()) {
    if (getSpeciesHubId(item.id) !== hubId) continue;
    for (const locale of routing.locales) {
      params.push({
        locale,
        slug: getSpeciesPublicSlug(item.id, locale),
      });
    }
  }
  return params;
}
