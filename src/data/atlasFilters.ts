import type { AtlasPhoto } from "@/data/speciesListItem";

import { type AnimalGroup, type HabitatTag } from "@/data/speciesAtlasMeta";

export type AtlasFacets = {
  danger: Record<AtlasDangerFilter, number>;
  group: Record<"all" | AnimalGroup, number>;
  habitat: Record<"all" | HabitatTag, number>;
  region: Record<string, number>;
};

export type AtlasFilters = {
  danger: AtlasDangerFilter;
  group: "all" | AnimalGroup;
  habitat: "all" | HabitatTag;
  query: string;
  region: "all" | string;
};

export type AtlasRegionLabel = { id: string; label: string };

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

export const ATLAS_SORT_OPTIONS = ["featured", "az", "range"] as const;

export type AtlasSort = (typeof ATLAS_SORT_OPTIONS)[number];

export type AtlasView = "grid" | "list";

export function atlasFacetCount<K extends keyof AtlasFacets>(
  facets: AtlasFacets,
  key: K,
  value: string,
): number {
  return (facets[key] as Record<string, number>)[value] ?? 0;
}

export function atlasSpeciesImage(item: AtlasPhoto): string {
  const candidates = [item.mobileImage, item.image];
  for (const src of candidates) {
    if (src && !src.includes("species-placeholder")) return src;
  }
  return "";
}
