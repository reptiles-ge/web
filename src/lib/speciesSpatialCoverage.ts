import type { AppLocale } from "@/i18n/routing";

import {
  getRegionsForSpecies,
  localizeRegionText,
} from "@/data/mapRegions";
import { georgiaPlaceName } from "@/i18n/localeMeta";
import { regionHref } from "@/lib/regionHref";
import { absoluteUrl, localePath } from "@/lib/site";

export function speciesArticleSpatialCoverage(
  speciesId: string,
  locale: AppLocale,
) {
  const georgia = {
    "@type": "Country" as const,
    name: georgiaPlaceName(locale),
  };
  const regions = getRegionsForSpecies(speciesId).map((region) => ({
    "@type": "AdministrativeArea" as const,
    containedInPlace: georgia,
    name: localizeRegionText(region.name, locale),
    url: absoluteUrl(localePath(locale, regionHref(region.id))),
  }));
  return regions.length > 0 ? [georgia, ...regions] : [georgia];
}
