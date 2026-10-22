import type { DangerLevel, SpeciesSummary } from "@/data/speciesTypes";
import type { AppLocale } from "@/i18n/routing";

import { type CatalogCard, getSpeciesCatalog } from "@/lib/speciesCatalogApi";

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
      if (item.danger === "High" || item.danger === "Moderate") venomous += 1;
    }
  }
  return {
    regionCount: regions.length,
    speciesCount: speciesIds.size,
    venomousCount: venomous,
  };
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
  return item.danger === "High" || item.danger === "Moderate";
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
    image: species.image,
    location: species.location,
    scientificName: species.scientificName,
    ...(species.danger ? { danger: species.danger } : {}),
    ...(species.mobileImage ? { mobileImage: species.mobileImage } : {}),
  };
}
