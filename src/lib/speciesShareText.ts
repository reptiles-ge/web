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

const REAR_FANGED_SHARE_IDS = new Set(["telescopus-fallax"]);

export type SpeciesShareStatusKind =
  | "harmless"
  | "rearFanged"
  | "venomous";

export function speciesShareStatusKind(
  id: string,
  group: AnimalGroup,
  danger?: DangerLevel,
): null | SpeciesShareStatusKind {
  if (REAR_FANGED_SHARE_IDS.has(id)) return "rearFanged";
  if (!groupHasVenomConcept(group) || !danger) return null;
  return isVenomousDanger(danger) ? "venomous" : "harmless";
}

export function speciesShareText({
  commonName,
  detailsLabel,
  scientificName,
  status,
  url,
}: {
  commonName: string;
  detailsLabel: string;
  scientificName: string;
  status?: null | string;
  url: string;
}) {
  const names = `${commonName} (${scientificName})`;
  const heading = status ? `${names} - ${status}` : names;
  return `${heading}\n\n🔗 ${detailsLabel}: ${url}`;
}

export function speciesShareUrl(locale: AppLocale, id: string) {
  return `${SHARE_ORIGIN}${localePath(locale, speciesHref(id, locale))}`;
}

export function speciesShareVenomous(
  group: AnimalGroup,
  danger?: DangerLevel,
): boolean | null {
  if (!groupHasVenomConcept(group) || !danger) return null;
  return isVenomousDanger(danger);
}
