import type { AppLocale } from "@/i18n/routing";

import { regions } from "@/data/mapRegions";
import {
  type AnimalGroup,
  groupHasVenomConcept,
  type HabitatTag,
  isVenomousDanger,
} from "@/data/speciesAtlasMeta";
import { type DangerLevel } from "@/data/speciesTypes";
import { ANIMAL_GROUPS } from "@/lib/animalGroups";

import { HABITATS } from "../schemas/speciesRecord";

export type CatalogFilters = {
  danger?: CatalogDangerFilter;
  group?: AnimalGroup;
  habitat?: HabitatTag;
  q?: string;
  region?: string;
};

export type CatalogIndexEntry = {
  commonName: string;
  danger?: DangerLevel;
  group: AnimalGroup;
  habitats: HabitatTag[];
  hasPhoto: boolean;
  id: string;
  photoCount: number;
  regionIds: string[];
  searchText: string;
  updatedAt?: string;
};

export type CatalogSort = "az" | "catalog" | "featured" | "range" | "updated";

type CatalogDangerFilter = "harmless" | "venomous";

type FacetKey = Exclude<keyof CatalogFilters, "q">;

const DANGER_FILTERS = ["harmless", "venomous"] as const;

export const REGION_IDS = regions.map((region) => region.id);

const regionIdsBySpecies = new Map<string, string[]>();
for (const region of regions) {
  for (const id of region.speciesIds) {
    regionIdsBySpecies.set(id, [
      ...(regionIdsBySpecies.get(id) ?? []),
      region.id,
    ]);
  }
}

export function catalogFacets(
  entries: readonly CatalogIndexEntry[],
  filters: CatalogFilters,
) {
  const facet = <K extends FacetKey>(
    key: K,
    values: ReadonlyArray<NonNullable<CatalogFilters[K]>>,
  ) => {
    const rest = filterCatalog(entries, { ...filters, [key]: undefined });
    const counts: Record<string, number> = { all: rest.length };
    for (const value of values) {
      counts[value] = filterCatalog(rest, { [key]: value }).length;
    }
    return counts;
  };
  return {
    danger: facet("danger", DANGER_FILTERS),
    group: facet("group", ANIMAL_GROUPS),
    habitat: facet("habitat", HABITATS),
    region: facet("region", REGION_IDS),
  };
}

export function catalogStats(entries: readonly CatalogIndexEntry[]) {
  let latest: CatalogIndexEntry | undefined;
  let photos = 0;
  let venomous = 0;
  for (const entry of entries) {
    photos += entry.photoCount;
    if (isVenomousDanger(entry.danger)) venomous += 1;
    if (
      entry.updatedAt &&
      (!latest || updatedTime(entry) > updatedTime(latest))
    )
      latest = entry;
  }
  return { lastUpdated: latest?.updatedAt ?? null, photos, venomous };
}

export function filterCatalog<T extends CatalogIndexEntry>(
  entries: readonly T[],
  filters: CatalogFilters,
): T[] {
  const q = filters.q?.trim().toLowerCase() ?? "";
  return entries.filter((entry) => {
    if (filters.group && entry.group !== filters.group) return false;
    if (filters.danger) {
      if (!groupHasVenomConcept(entry.group)) return false;
      if (isVenomousDanger(entry.danger) !== (filters.danger === "venomous")) {
        return false;
      }
    }
    if (filters.habitat && !entry.habitats.includes(filters.habitat)) {
      return false;
    }
    if (filters.region && !entry.regionIds.includes(filters.region)) {
      return false;
    }
    return !q || entry.searchText.includes(q);
  });
}

export function hasCatalogPhoto(item: {
  image?: string;
  mobileImage?: string;
}) {
  return [item.mobileImage, item.image].some(
    (src) => Boolean(src) && !src!.includes("species-placeholder"),
  );
}

export function sortCatalog<T extends CatalogIndexEntry>(
  entries: readonly T[],
  sort: CatalogSort,
  locale: AppLocale,
): T[] {
  const indexed = entries.map((entry, index) => ({ entry, index }));
  const compare = {
    az: (a: T, b: T) => a.commonName.localeCompare(b.commonName, locale),
    catalog: () => 0,
    featured: (a: T, b: T) => Number(b.hasPhoto) - Number(a.hasPhoto),
    range: (a: T, b: T) => b.regionIds.length - a.regionIds.length,
    updated: (a: T, b: T) => updatedTime(b) - updatedTime(a),
  }[sort];
  indexed.sort((a, b) => compare(a.entry, b.entry) || a.index - b.index);
  return indexed.map(({ entry }) => entry);
}

export function speciesRegionIds(id: string) {
  return regionIdsBySpecies.get(id) ?? [];
}

function updatedTime(entry: CatalogIndexEntry) {
  return entry.updatedAt ? Date.parse(entry.updatedAt) : 0;
}
