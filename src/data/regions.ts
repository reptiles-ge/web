import type { AppLocale } from "@/i18n/routing";

import { getSpeciesById, type Species } from "@/data/species";
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

export function getRegionSpecies(region: Region): Species[] {
  return region.speciesIds
    .map((id) => getSpeciesById(id))
    .filter((item): item is Species => Boolean(item));
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

export function getRegionVenomousSpecies(region: Region): Species[] {
  return getRegionSpecies(region).filter(
    (item) => item.danger === "High" || item.danger === "Moderate",
  );
}
