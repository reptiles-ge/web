import type { DangerLevel } from "@/data/speciesTypes";
import type { AppLocale } from "@/i18n/routing";

import { regions } from "@/data/mapRegions";
import { type AnimalGroup, isVenomousDanger } from "@/data/speciesAtlasMeta";
import {
  type CatalogCard,
  getCatalogMatches,
  getSpeciesCatalog,
} from "@/lib/speciesCatalogApi";

export type { AnimalGroup } from "@/data/speciesAtlasMeta";
export {
  getSpeciesAtlasMeta,
  groupHasVenomConcept,
  isVenomousDanger,
} from "@/data/speciesAtlasMeta";

const venomousDangerOrder: Record<DangerLevel, number> = {
  Harmless: 2,
  High: 0,
  Moderate: 1,
};

export type AtlasStats = {
  amphibians: number;
  birds: number;
  insects: number;
  lastUpdated: null | string;
  lizards: number;
  mammals: number;
  photos: number;
  regions: number;
  scorpions: number;
  snakes: number;
  spiders: number;
  total: number;
  turtles: number;
  venomous: number;
};

type DangerRanked = Pick<CatalogCard, "danger" | "family" | "scientificName">;

export async function getAtlasStats(locale: AppLocale): Promise<AtlasStats> {
  const { facets, stats, total } = await getCatalogMatches(locale, {
    limit: 1,
  });
  return {
    amphibians: facets.group.amphibian,
    birds: facets.group.bird,
    insects: facets.group.insect,
    lastUpdated: stats.lastUpdated,
    lizards: facets.group.lizard,
    mammals: facets.group.mammal,
    photos: stats.photos,
    regions: regions.length,
    scorpions: facets.group.scorpion,
    snakes: facets.group.snake,
    spiders: facets.group.spider,
    total,
    turtles: facets.group.turtle,
    venomous: stats.venomous,
  };
}

export function getCatalogByDanger<T extends DangerRanked>(
  catalog: T[],
): Record<DangerLevel, T[]> {
  const groups: Record<DangerLevel, T[]> = {
    Harmless: [],
    High: [],
    Moderate: [],
  };

  for (const item of catalog) {
    if (!item.danger) continue;
    groups[item.danger].push(item);
  }

  for (const level of Object.keys(groups) as DangerLevel[]) {
    groups[level].sort(
      (a, b) =>
        familyRank(a) - familyRank(b) ||
        a.scientificName.localeCompare(b.scientificName),
    );
  }

  return groups;
}

export async function getCatalogSpeciesByGroup(
  group: AnimalGroup,
  locale: AppLocale,
) {
  return (await getSpeciesCatalog(locale))
    .filter((item) => item.group === group)
    .sort((a, b) => a.scientificName.localeCompare(b.scientificName));
}

export async function getRecentlyUpdatedSpecies(locale: AppLocale, limit = 4) {
  return [...(await getSpeciesCatalog(locale))]
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
    .slice(0, limit);
}

export async function getVenomousCatalogSpecies(locale: AppLocale) {
  return pickVenomousSnakes(await getSpeciesCatalog(locale));
}

export function pickVenomousSnakes(catalog: readonly CatalogCard[]) {
  return catalog
    .filter((item) => isVenomousDanger(item.danger) && item.group === "snake")
    .sort(
      (a, b) =>
        venomousDangerOrder[a.danger ?? "Harmless"] -
          venomousDangerOrder[b.danger ?? "Harmless"] ||
        a.scientificName.localeCompare(b.scientificName),
    );
}

export function summarizeAtlas(catalog: readonly CatalogCard[]): AtlasStats {
  const byGroup: Record<AnimalGroup, number> = {
    amphibian: 0,
    bird: 0,
    insect: 0,
    lizard: 0,
    mammal: 0,
    scorpion: 0,
    snake: 0,
    spider: 0,
    turtle: 0,
  };
  let photos = 0;
  let lastUpdated: null | string = null;
  for (const item of catalog) {
    byGroup[item.group] += 1;
    photos += item.photoCount;
    if (
      item.updatedAt &&
      (!lastUpdated || Date.parse(item.updatedAt) > Date.parse(lastUpdated))
    ) {
      lastUpdated = item.updatedAt;
    }
  }

  return {
    amphibians: byGroup.amphibian,
    birds: byGroup.bird,
    insects: byGroup.insect,
    lastUpdated,
    lizards: byGroup.lizard,
    mammals: byGroup.mammal,
    photos,
    regions: regions.length,
    scorpions: byGroup.scorpion,
    snakes: byGroup.snake,
    spiders: byGroup.spider,
    total: catalog.length,
    turtles: byGroup.turtle,
    venomous: catalog.filter((item) => isVenomousDanger(item.danger)).length,
  };
}

function familyRank(species: Pick<CatalogCard, "family">) {
  return species.family === "Viperidae" ? 0 : 1;
}
