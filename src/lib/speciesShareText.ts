import type { AnimalGroup } from "@/data/speciesAtlasMeta";
import type { DangerLevel } from "@/data/speciesTypes";
import type { AppLocale } from "@/i18n/routing";

import {
  groupHasVenomConcept,
  isVenomousDanger,
} from "@/data/speciesAtlasMeta";
import { localePath } from "@/lib/site";
import { speciesHref } from "@/lib/speciesRoutes";

const SHARE_ORIGIN = "https://reptiles.ge";

export function speciesShareVenomous(
  group: AnimalGroup,
  danger?: DangerLevel,
): boolean | null {
  if (!groupHasVenomConcept(group) || !danger) return null;
  return isVenomousDanger(danger);
}

export function speciesShareUrl(locale: AppLocale, id: string) {
  return `${SHARE_ORIGIN}${localePath(locale, speciesHref(id, locale))}`;
}

export function speciesShareText({
  commonName,
  detailsLabel,
  harmlessStatus,
  scientificName,
  url,
  venomous,
  venomousStatus,
}: {
  commonName: string;
  detailsLabel: string;
  harmlessStatus: string;
  scientificName: string;
  url: string;
  venomous: boolean | null;
  venomousStatus: string;
}) {
  const names = `${commonName} (${scientificName})`;
  const heading =
    venomous === null
      ? names
      : `${names} - ${venomous ? venomousStatus : harmlessStatus}`;
  return `${heading}\n\n🔗 ${detailsLabel}: ${url}`;
}
