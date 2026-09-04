import { getRegionsForSpecies, regions } from "@/data/regions";
import {
  type DangerLevel,
  getCatalogSpecies,
  type Species,
} from "@/data/species";
import {
  type AnimalGroup,
  groupHasVenomConcept,
  type HabitatTag,
  type SpeciesAtlasMeta,
  speciesAtlasMeta,
} from "@/data/speciesAtlasMeta";

export type AtlasDangerFilter = "all" | "harmless" | "venomous";

export type {
  AnimalGroup,
  HabitatTag,
  SpeciesAtlasMeta,
} from "@/data/speciesAtlasMeta";
export {
  groupHasVenomConcept,
  speciesAtlasMeta,
} from "@/data/speciesAtlasMeta";

export function getSpeciesAtlasMeta(id: string): SpeciesAtlasMeta {
  return (
    speciesAtlasMeta[id] ?? {
      group: "snake",
      habitats: ["forest"],
    }
  );
}

export function isVenomousDanger(danger?: DangerLevel) {
  return danger === "High" || danger === "Moderate";
}

const venomousDangerOrder: Record<DangerLevel, number> = {
  Harmless: 2,
  High: 0,
  Moderate: 1,
};

export type AtlasFilters = {
  danger: AtlasDangerFilter;
  group: "all" | AnimalGroup;
  habitat: "all" | HabitatTag;
  query: string;
  region: "all" | string;
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

export function getAtlasStats(catalog: Species[] = getCatalogSpecies()) {
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
  catalog: Array<Species & { searchText?: string }>,
  filters: AtlasFilters,
): Species[] {
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

    if (q) {
      const haystack =
        item.searchText ??
        [
          item.commonName,
          item.scientificName,
          item.genus,
          item.family,
          item.location,
          item.description,
        ]
          .join(" ")
          .toLowerCase();
      if (!haystack.includes(q)) return false;
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
