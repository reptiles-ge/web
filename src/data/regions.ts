import type { RegionPathId } from "@/data/georgia-paths";
import type { AnimalGroup } from "@/data/speciesAtlasMeta";
import type { DangerLevel, SpeciesSummary } from "@/data/speciesTypes";
import type { AppLocale } from "@/i18n/routing";

import {
  REGION_ATLAS_GROUPS,
  type RegionAtlasGroup,
} from "@/data/regionAtlasGroups";
import { getRegionContent } from "@/data/regionContent";
import { speciesGroup } from "@/data/speciesAtlasMetaTable";
import { type CatalogCard, getSpeciesCatalog } from "@/lib/speciesCatalogApi";
import { speciesImage } from "@/lib/speciesContent";

import {
  getRegionById,
  getRegionsForSpecies,
  type LocalizedText,
  localizeRegionText,
  localizeRegionTextIfPresent,
  type Region,
  regions,
  type RegionTooltipSpecies,
} from "./mapRegions";

export {
  getRegionById,
  getRegionsForSpecies,
  type LocalizedText,
  localizeRegionText,
  localizeRegionTextIfPresent,
  type Region,
  regions,
};

export type RegionAtlasEntry = {
  biome: null | string;
  description: string;
  groupCounts: number[];
  id: RegionPathId;
  name: string;
  speciesCount: number;
  venomousCount: number;
};

export type RegionSpeciesCardItem = {
  commonName: string;
  danger?: DangerLevel;
  id: string;
  image: string;
  location: string;
  mobileImage?: string;
  scientificName: string;
};

export async function getCatalogRegionStats(locale: AppLocale) {
  const catalog = await getSpeciesCatalog(locale);
  const speciesIds = new Set<string>();
  let venomous = 0;
  for (const region of regions) {
    for (const item of getRegionSpecies(region, catalog)) {
      if (speciesIds.has(item.id)) continue;
      speciesIds.add(item.id);
      if (isVenomous(item)) venomous += 1;
    }
  }
  return {
    regionCount: regions.length,
    speciesCount: speciesIds.size,
    venomousCount: venomous,
  };
}

export async function getRegionAtlasEntries(
  locale: AppLocale,
): Promise<RegionAtlasEntry[]> {
  const catalog = await getSpeciesCatalog(locale);
  return regions.map((region) => {
    const species = getRegionSpecies(region, catalog);
    const groupCounts = REGION_ATLAS_GROUPS.map(() => 0);
    for (const item of species) {
      const index = REGION_ATLAS_GROUPS.indexOf(
        regionAtlasGroup(speciesGroup(item)),
      );
      groupCounts[index] = (groupCounts[index] ?? 0) + 1;
    }
    return {
      biome: localizeRegionTextIfPresent(
        getRegionContent(region.id).biome,
        locale,
      ),
      description: localizeRegionText(region.description, locale),
      groupCounts,
      id: region.id,
      name: localizeRegionText(region.name, locale),
      speciesCount: species.length,
      venomousCount: species.filter(isVenomous).length,
    };
  });
}

export function getRegionLabels(locale: AppLocale) {
  return regions.map((region) => ({
    id: region.id,
    label: localizeRegionText(region.name, locale),
  }));
}

export function getRegionSpecies<T extends Pick<CatalogCard, "id">>(
  region: Region,
  catalog: readonly T[],
): T[] {
  const byId = new Map(catalog.map((item) => [item.id, item]));
  return region.speciesIds.flatMap((id) => {
    const item = byId.get(id);
    return item ? [item] : [];
  });
}

export async function getRegionTooltipPreviews(locale: AppLocale) {
  const catalog = await getSpeciesCatalog(locale);
  const previews: Record<string, RegionTooltipSpecies[]> = {};
  for (const region of regions) {
    previews[region.id] = getRegionSpecies(region, catalog)
      .slice(0, 3)
      .map((item) => ({
        commonName: item.commonName,
        id: item.id,
        scientificName: item.scientificName,
      }));
  }
  return previews;
}

export function isRegionCardVenomous(item: RegionSpeciesCardItem) {
  return isVenomous(item);
}

export function toRegionSpeciesCard(
  species: Pick<
    SpeciesSummary,
    | "commonName"
    | "danger"
    | "id"
    | "image"
    | "location"
    | "mobileImage"
    | "scientificName"
  >,
): RegionSpeciesCardItem {
  return {
    commonName: species.commonName,
    id: species.id,
    image: speciesImage(species),
    location: species.location,
    scientificName: species.scientificName,
    ...(species.danger ? { danger: species.danger } : {}),
    ...(species.mobileImage ? { mobileImage: species.mobileImage } : {}),
  };
}

function isVenomous(item: { danger?: DangerLevel }) {
  return item.danger === "High" || item.danger === "Moderate";
}

function regionAtlasGroup(group: AnimalGroup): RegionAtlasGroup {
  if (group === "snake") return "snakes";
  if (group === "lizard" || group === "turtle") return "lizardsTurtles";
  if (group === "amphibian") return "amphibians";
  if (group === "bird") return "birds";
  return "other";
}
