import type { SpeciesListItem } from "@/data/speciesListItem";

import { getRegionsForSpecies } from "@/data/mapRegions";
import {
  type AnimalGroup,
  getSpeciesAtlasMeta,
  groupHasVenomConcept,
  type HabitatTag,
  isVenomousDanger,
} from "@/data/speciesAtlasMeta";

export type AtlasFilters = {
  danger: AtlasDangerFilter;
  group: "all" | AnimalGroup;
  habitat: "all" | HabitatTag;
  query: string;
  region: "all" | string;
};

type AtlasDangerFilter = "all" | "harmless" | "venomous";

export const defaultAtlasFilters: AtlasFilters = {
  danger: "all",
  group: "all",
  habitat: "all",
  query: "",
  region: "all",
};

export function countAtlasFacets(filters: AtlasFilters) {
  let count = 0;
  if (filters.group !== "all") count += 1;
  if (filters.danger !== "all") count += 1;
  if (filters.habitat !== "all") count += 1;
  if (filters.region !== "all") count += 1;
  return count;
}

export function filterAtlasSpecies(
  catalog: SpeciesListItem[],
  filters: AtlasFilters,
): SpeciesListItem[] {
  const q = filters.query.trim().toLowerCase();

  return catalog.filter((item) => {
    const meta = getSpeciesAtlasMeta(item.id);

    if (filters.group !== "all" && meta.group !== filters.group) {
      return false;
    }

    if (filters.danger !== "all") {
      if (!groupHasVenomConcept(meta.group)) {
        return false;
      }
      if (filters.danger === "venomous" && !isVenomousDanger(item.danger)) {
        return false;
      }
      if (filters.danger === "harmless" && isVenomousDanger(item.danger)) {
        return false;
      }
    }

    if (filters.habitat !== "all" && !meta.habitats.includes(filters.habitat)) {
      return false;
    }

    if (filters.region !== "all") {
      const inRegion = getRegionsForSpecies(item.id).some(
        (region) => region.id === filters.region,
      );
      if (!inRegion) return false;
    }

    if (q && !item.searchText.includes(q)) {
      return false;
    }

    return true;
  });
}
