import type { AppLocale } from "@/i18n/routing";

import {
  idByAnySlug,
  kaSlugById,
  speciesHubById,
} from "@/data/speciesSlugs.generated";
import { type GroupHubId, RESERVED_HUB_SLUGS } from "@/lib/groupHubs";

export function getSpeciesHubId(id: string): GroupHubId {
  return speciesHubById[id] ?? "snakes";
}

export function getSpeciesPublicSlug(id: string, locale: AppLocale) {
  if (locale !== "ka") return id;
  return kaSlugById[id] ?? id;
}

export function resolveSpeciesId(param: string): string | undefined {
  return idByAnySlug[param];
}

export function resolveSpeciesIdInHub(
  hubId: GroupHubId,
  slug: string,
): string | undefined {
  if (RESERVED_HUB_SLUGS[hubId].includes(slug)) return undefined;
  const id = resolveSpeciesId(slug);
  if (!id) return undefined;
  if (getSpeciesHubId(id) !== hubId) return undefined;
  return id;
}
