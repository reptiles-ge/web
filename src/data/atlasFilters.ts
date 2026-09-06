import type { SpeciesListItem } from "@/data/speciesListItem";

import { getRegionsForSpecies, regions } from "@/data/mapRegions";
import {
  type AnimalGroup,
  getSpeciesAtlasMeta,
  groupHasVenomConcept,
  type HabitatTag,
  isVenomousDanger,
} from "@/data/speciesAtlasMeta";

export type AtlasDangerFilter = "all" | "harmless" | "venomous";

export type AtlasFilters = {
  danger: AtlasDangerFilter;
  group: "all" | AnimalGroup;
  habitat: "all" | HabitatTag;
  query: string;
  region: "all" | string;
};

export const defaultAtlasFilters: AtlasFilters = {
  danger: "all",
  group: "all",
  habitat: "all",
  query: "",
  region: "all",
};

export function atlasFiltersToSearchParams(filters: AtlasFilters) {
  const params = new URLSearchParams();
  if (filters.group !== "all") params.set("type", filters.group);
  if (filters.danger !== "all") params.set("danger", filters.danger);
  if (filters.habitat !== "all") params.set("habitat", filters.habitat);
  if (filters.region !== "all") params.set("region", filters.region);
  if (filters.query.trim()) params.set("q", filters.query.trim());
  return params;
}

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

export function hasActiveAtlasFilters(filters: AtlasFilters) {
  return atlasFiltersToSearchParams(filters).toString().length > 0;
}

export function parseAtlasFilters(
  input: Record<string, string | string[] | undefined>,
): AtlasFilters {
  const read = (key: string) => {
    const value = input[key];
    return typeof value === "string"
      ? value
      : Array.isArray(value)
        ? value[0]
        : undefined;
  };

  const group = read("type");
  const danger = read("danger");
  const habitat = read("habitat");
  const region = read("region");
  const query = read("q") ?? "";

  const groups: Array<"all" | AnimalGroup> = [
    "all",
    "snake",
    "lizard",
    "turtle",
    "amphibian",
    "bird",
    "mammal",
    "spider",
  ];
  const dangers: AtlasDangerFilter[] = ["all", "venomous", "harmless"];
  const habitats: Array<"all" | HabitatTag> = [
    "all",
    "forest",
    "mountain",
    "wetland",
    "grassland",
  ];

  return {
    danger: dangers.includes(danger as AtlasDangerFilter)
      ? (danger as AtlasDangerFilter)
      : "all",
    group: groups.includes(group as "all" | AnimalGroup)
      ? (group as "all" | AnimalGroup)
      : "all",
    habitat: habitats.includes(habitat as "all" | HabitatTag)
      ? (habitat as "all" | HabitatTag)
      : "all",
    query,
    region:
      region && (region === "all" || regions.some((item) => item.id === region))
        ? region
        : "all",
  };
}
