import type { AppLocale } from "@/i18n/routing";

import { getSpeciesById, type Species } from "@/data/species";
import type { DangerLevel } from "@/data/speciesTypes";
import { localizeSpecies } from "@/i18n/localizeSpecies";

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

export function getCatalogRegionStats() {
  const speciesIds = new Set<string>();
  let venomous = 0;
  for (const region of regions) {
    for (const id of region.speciesIds) {
      if (speciesIds.has(id)) continue;
      speciesIds.add(id);
      const species = getSpeciesById(id);
      if (
        species &&
        (species.danger === "High" || species.danger === "Moderate")
      ) {
        venomous += 1;
      }
    }
  }
  return {
    regionCount: regions.length,
    speciesCount: speciesIds.size,
    venomousCount: venomous,
  };
}

export type RegionSpeciesCardItem = {
  commonName: string;
  danger?: DangerLevel;
  id: string;
  image: string;
  location: string;
  mobileImage?: string;
  scientificName: string;
};

export function getRegionSpecies(region: Region): Species[] {
  return region.speciesIds
    .map((id) => getSpeciesById(id))
    .filter((item): item is Species => Boolean(item));
}

export function toRegionSpeciesCard(
  species: Species,
  locale: AppLocale,
): RegionSpeciesCardItem {
  const localized = localizeSpecies(species, locale);
  return {
    commonName: localized.commonName,
    id: species.id,
    image: species.image,
    location: localized.location,
    scientificName: species.scientificName,
    ...(species.danger ? { danger: species.danger } : {}),
    ...(species.mobileImage ? { mobileImage: species.mobileImage } : {}),
  };
}

export function getRegionTooltipPreviews(locale: AppLocale) {
  const previews: Record<string, RegionTooltipSpecies[]> = {};
  for (const region of regions) {
    previews[region.id] = getRegionSpecies(region)
      .map((item) => localizeSpecies(item, locale))
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
  return item.danger === "High" || item.danger === "Moderate";
}
