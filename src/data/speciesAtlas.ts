import { regions } from "@/data/mapRegions";
import {
  type DangerLevel,
  getCatalogSpecies,
  type Species,
} from "@/data/species";
import {
  type AnimalGroup,
  getSpeciesAtlasMeta,
  isVenomousDanger,
} from "@/data/speciesAtlasMeta";

export type {
  AnimalGroup,
  HabitatTag,
  SpeciesAtlasMeta,
} from "@/data/speciesAtlasMeta";
export {
  getSpeciesAtlasMeta,
  groupHasVenomConcept,
  isVenomousDanger,
  speciesAtlasMeta,
} from "@/data/speciesAtlasMeta";

const venomousDangerOrder: Record<DangerLevel, number> = {
  Harmless: 2,
  High: 0,
  Moderate: 1,
};

export type AtlasStats = {
  amphibians: number;
  birds: number;
  lastUpdated: null | string;
  lizards: number;
  mammals: number;
  photos: number;
  regions: number;
  snakes: number;
  spiders: number;
  total: number;
  turtles: number;
  venomous: number;
};

export function getAtlasPhotoCount(catalog: Species[] = getCatalogSpecies()) {
  const urls = new Set<string>();
  for (const item of catalog) {
    if (item.image) urls.add(item.image);
    if (item.mobileImage) urls.add(item.mobileImage);
    for (const photo of item.gallery) {
      urls.add(photo.src);
    }
  }
  return urls.size;
}

export function getAtlasStats(
  catalog: Species[] = getCatalogSpecies(),
): AtlasStats {
  const byGroup: Record<AnimalGroup, number> = {
    amphibian: 0,
    bird: 0,
    lizard: 0,
    mammal: 0,
    snake: 0,
    spider: 0,
    turtle: 0,
  };

  for (const item of catalog) {
    byGroup[getSpeciesAtlasMeta(item.id).group] += 1;
  }

  const updatedDates: string[] = [];
  for (const item of catalog) {
    if (item.updatedAt) updatedDates.push(item.updatedAt);
  }
  updatedDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  return {
    amphibians: byGroup.amphibian,
    birds: byGroup.bird,
    lastUpdated: updatedDates.at(-1) ?? null,
    lizards: byGroup.lizard,
    mammals: byGroup.mammal,
    photos: getAtlasPhotoCount(catalog),
    regions: regions.length,
    snakes: byGroup.snake,
    spiders: byGroup.spider,
    total: catalog.length,
    turtles: byGroup.turtle,
    venomous: catalog.filter((item) => isVenomousDanger(item.danger)).length,
  };
}

export function getCatalogByDanger(
  catalog: Species[] = getCatalogSpecies(),
): Record<DangerLevel, Species[]> {
  const groups: Record<DangerLevel, Species[]> = {
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

export function getCatalogSpeciesByGroup(
  group: AnimalGroup,
  catalog: Species[] = getCatalogSpecies(),
) {
  return catalog
    .filter((item) => getSpeciesAtlasMeta(item.id).group === group)
    .sort((a, b) => a.scientificName.localeCompare(b.scientificName));
}

export function getRecentlyUpdatedSpecies(limit = 4) {
  return [...getCatalogSpecies()]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, limit);
}

export function getVenomousCatalogSpecies(
  catalog: Species[] = getCatalogSpecies(),
) {
  return catalog
    .filter(
      (item) =>
        isVenomousDanger(item.danger) &&
        getSpeciesAtlasMeta(item.id).group === "snake",
    )
    .sort(
      (a, b) =>
        venomousDangerOrder[a.danger ?? "Harmless"] -
          venomousDangerOrder[b.danger ?? "Harmless"] ||
        a.scientificName.localeCompare(b.scientificName),
    );
}

function familyRank(species: Species) {
  return species.family === "Viperidae" ? 0 : 1;
}
