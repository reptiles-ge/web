import { regions, getRegionsForSpecies } from "@/data/regions";
import {
  getCatalogSpecies,
  type DangerLevel,
  type Species,
} from "@/data/species";

export type AnimalGroup =
  | "snake"
  | "lizard"
  | "turtle"
  | "amphibian"
  | "bird"
  | "mammal"
  | "spider";

export type HabitatTag = "forest" | "mountain" | "wetland" | "grassland";

export type AtlasDangerFilter = "all" | "venomous" | "harmless";

export type SpeciesAtlasMeta = {
  group: AnimalGroup;
  habitats: HabitatTag[];
};

export const speciesAtlasMeta: Record<string, SpeciesAtlasMeta> = {
  "mertensiella-caucasica": {
    group: "amphibian",
    habitats: ["wetland", "forest"],
  },
  "lissotriton-lantzi": {
    group: "amphibian",
    habitats: ["wetland", "forest"],
  },
  "ommatotriton-ophryticus": {
    group: "amphibian",
    habitats: ["wetland", "forest", "mountain"],
  },
  "triturus-karelinii": {
    group: "amphibian",
    habitats: ["wetland", "forest"],
  },
  "pelobates-syriacus": {
    group: "amphibian",
    habitats: ["grassland", "wetland"],
  },
  "pelodytes-caucasicus": {
    group: "amphibian",
    habitats: ["wetland", "forest", "mountain"],
  },
  "bufotes-viridis": {
    group: "amphibian",
    habitats: ["grassland", "wetland"],
  },
  "bufo-verrucosissimus": {
    group: "amphibian",
    habitats: ["wetland", "forest"],
  },
  "hyla-orientalis": {
    group: "amphibian",
    habitats: ["wetland", "forest"],
  },
  "hyla-savignyi": {
    group: "amphibian",
    habitats: ["grassland", "wetland"],
  },
  "rana-macrocnemis": {
    group: "amphibian",
    habitats: ["wetland", "forest"],
  },
  "pelophylax-ridibundus": {
    group: "amphibian",
    habitats: ["wetland"],
  },
  "testudo-graeca": {
    group: "turtle",
    habitats: ["grassland"],
  },
  "emys-orbicularis": {
    group: "turtle",
    habitats: ["wetland"],
  },
  "trachemys-scripta": {
    group: "turtle",
    habitats: ["wetland"],
  },
  "mauremys-caspica": {
    group: "turtle",
    habitats: ["wetland"],
  },
  "tenuidactylus-caspius": {
    group: "lizard",
    habitats: ["grassland", "mountain"],
  },
  "anguis-colchica": {
    group: "lizard",
    habitats: ["grassland", "forest", "mountain"],
  },
  "pseudopus-apodus": {
    group: "lizard",
    habitats: ["grassland", "forest", "mountain"],
  },
  "paralaudakia-caucasia": {
    group: "lizard",
    habitats: ["grassland", "mountain"],
  },
  "eumeces-schneiderii": {
    group: "lizard",
    habitats: ["grassland", "mountain"],
  },
  "ablepharus-pannonicus": {
    group: "lizard",
    habitats: ["grassland", "mountain"],
  },
  "eremias-velox": {
    group: "lizard",
    habitats: ["grassland", "forest"],
  },
  "eremias-arguta": {
    group: "lizard",
    habitats: ["grassland"],
  },
  "ophisops-elegans": {
    group: "lizard",
    habitats: ["grassland", "forest"],
  },
  "lacerta-agilis": {
    group: "lizard",
    habitats: ["grassland", "forest"],
  },
  "lacerta-strigata": {
    group: "lizard",
    habitats: ["grassland"],
  },
  "lacerta-media": {
    group: "lizard",
    habitats: ["grassland", "forest"],
  },
  "phoenicolacerta-laevis": {
    group: "lizard",
    habitats: ["grassland", "forest"],
  },
  "darevskia-adjarica": {
    group: "lizard",
    habitats: ["mountain", "forest"],
  },
  "darevskia-alpina": {
    group: "lizard",
    habitats: ["mountain", "forest"],
  },
  "darevskia-armeniaca": {
    group: "lizard",
    habitats: ["mountain", "forest"],
  },
  "darevskia-brauneri": {
    group: "lizard",
    habitats: ["mountain", "forest"],
  },
  "darevskia-caucasica": {
    group: "lizard",
    habitats: ["mountain", "forest"],
  },
  "darevskia-clarkorum": {
    group: "lizard",
    habitats: ["mountain", "forest"],
  },
  "darevskia-daghestanica": {
    group: "lizard",
    habitats: ["mountain", "forest"],
  },
  "darevskia-dahli": {
    group: "lizard",
    habitats: ["mountain", "forest"],
  },
  "darevskia-derjugini": {
    group: "lizard",
    habitats: ["mountain", "forest"],
  },
  "darevskia-mixta": {
    group: "lizard",
    habitats: ["mountain", "forest"],
  },
  "darevskia-portschinskii": {
    group: "lizard",
    habitats: ["mountain", "forest"],
  },
  "darevskia-praticola": {
    group: "lizard",
    habitats: ["forest", "grassland"],
  },
  "darevskia-pontica": {
    group: "lizard",
    habitats: ["forest", "grassland"],
  },
  "darevskia-obscura": {
    group: "lizard",
    habitats: ["mountain", "forest"],
  },
  "darevskia-raddei": {
    group: "lizard",
    habitats: ["mountain", "forest"],
  },
  "darevskia-valentini": {
    group: "lizard",
    habitats: ["mountain", "grassland"],
  },
  "xerotyphlops-vermicularis": {
    group: "snake",
    habitats: ["grassland"],
  },
  "eryx-jaculus": {
    group: "snake",
    habitats: ["grassland"],
  },
  "natrix-natrix": {
    group: "snake",
    habitats: ["wetland", "forest"],
  },
  "natrix-tessellata": {
    group: "snake",
    habitats: ["wetland"],
  },
  "coronella-austriaca": {
    group: "snake",
    habitats: ["forest", "mountain", "grassland"],
  },
  "elaphe-urartica": {
    group: "snake",
    habitats: ["grassland", "forest"],
  },
  "elaphe-dione": {
    group: "snake",
    habitats: ["grassland", "mountain"],
  },
  "zamenis-longissimus": {
    group: "snake",
    habitats: ["forest", "mountain"],
  },
  "zamenis-hohenackeri": {
    group: "snake",
    habitats: ["grassland", "mountain"],
  },
  "dolichophis-schmidti": {
    group: "snake",
    habitats: ["grassland", "mountain"],
  },
  "dolichophis-caspius": {
    group: "snake",
    habitats: ["grassland", "mountain"],
  },
  "hemorrhois-ravergieri": {
    group: "snake",
    habitats: ["grassland", "mountain"],
  },
  "platyceps-najadum": {
    group: "snake",
    habitats: ["grassland", "mountain"],
  },
  "eirenis-modestus": {
    group: "snake",
    habitats: ["grassland", "mountain"],
  },
  "eirenis-collaris": {
    group: "snake",
    habitats: ["grassland", "mountain"],
  },
  "telescopus-fallax": {
    group: "snake",
    habitats: ["mountain", "grassland"],
  },
  "malpolon-insignitus": {
    group: "snake",
    habitats: ["grassland"],
  },
  "macrovipera-lebetina": {
    group: "snake",
    habitats: ["grassland", "mountain"],
  },
  "vipera-renardi": {
    group: "snake",
    habitats: ["grassland", "mountain"],
  },
  "vipera-kaznakovi": {
    group: "snake",
    habitats: ["forest", "mountain", "wetland"],
  },
  "vipera-dinniki": {
    group: "snake",
    habitats: ["mountain", "forest"],
  },
  "vipera-darevskii": {
    group: "snake",
    habitats: ["mountain", "grassland"],
  },
  "vipera-transcaucasiana": {
    group: "snake",
    habitats: ["mountain", "grassland"],
  },
  "vipera-ammodytes": {
    group: "snake",
    habitats: ["mountain", "grassland"],
  },
  "emberiza-citrinella": {
    group: "bird",
    habitats: ["grassland"],
  },
  "picus-viridis": {
    group: "bird",
    habitats: ["forest", "grassland"],
  },
  "dendrocopos-major": {
    group: "bird",
    habitats: ["forest"],
  },
  "jynx-torquilla": {
    group: "bird",
    habitats: ["forest", "grassland"],
  },
  "cuculus-canorus": {
    group: "bird",
    habitats: ["forest", "grassland"],
  },
  "upupa-epops": {
    group: "bird",
    habitats: ["grassland", "forest"],
  },
  "apus-apus": {
    group: "bird",
    habitats: ["grassland", "mountain"],
  },
  "strix-aluco": {
    group: "bird",
    habitats: ["forest"],
  },
  "otus-scops": {
    group: "bird",
    habitats: ["forest", "grassland"],
  },
  "aegolius-funereus": {
    group: "bird",
    habitats: ["forest", "mountain"],
  },
  "tyto-alba": {
    group: "bird",
    habitats: ["grassland"],
  },
  "athene-noctua": {
    group: "bird",
    habitats: ["grassland"],
  },
  "bubo-bubo": {
    group: "bird",
    habitats: ["mountain", "forest", "grassland"],
  },
  "ficedula-hypoleuca": {
    group: "bird",
    habitats: ["forest"],
  },
  "ficedula-semitorquata": {
    group: "bird",
    habitats: ["forest"],
  },
  "erithacus-rubecula": {
    group: "bird",
    habitats: ["forest", "grassland"],
  },
  "luscinia-megarhynchos": {
    group: "bird",
    habitats: ["forest"],
  },
  "buteo-buteo": {
    group: "bird",
    habitats: ["forest", "grassland", "mountain"],
  },
  "pernis-apivorus": {
    group: "bird",
    habitats: ["forest", "mountain"],
  },
  "accipiter-nisus": {
    group: "bird",
    habitats: ["forest", "grassland"],
  },
  "accipiter-gentilis": {
    group: "bird",
    habitats: ["forest", "mountain"],
  },
  "falco-peregrinus": {
    group: "bird",
    habitats: ["mountain", "grassland", "wetland"],
  },
  "glareola-pratincola": {
    group: "bird",
    habitats: ["wetland", "grassland"],
  },
  "larus-fuscus": {
    group: "bird",
    habitats: ["wetland"],
  },
  "turdus-merula": {
    group: "bird",
    habitats: ["forest", "grassland"],
  },
  "motacilla-alba": {
    group: "bird",
    habitats: ["grassland", "wetland"],
  },
  "streptopelia-turtur": {
    group: "bird",
    habitats: ["grassland", "forest"],
  },
  "columba-palumbus": {
    group: "bird",
    habitats: ["forest", "grassland"],
  },
  "ciconia-ciconia": {
    group: "bird",
    habitats: ["wetland", "grassland"],
  },
  "anas-platyrhynchos": {
    group: "bird",
    habitats: ["wetland"],
  },
  "phasianus-colchicus": {
    group: "bird",
    habitats: ["grassland", "forest"],
  },
  "coturnix-coturnix": {
    group: "bird",
    habitats: ["grassland"],
  },
  "aquila-chrysaetos": {
    group: "bird",
    habitats: ["mountain", "forest", "grassland"],
  },
  "aegypius-monachus": {
    group: "bird",
    habitats: ["grassland"],
  },
  "gyps-fulvus": {
    group: "bird",
    habitats: ["mountain", "grassland"],
  },
  "milvus-migrans": {
    group: "bird",
    habitats: ["wetland", "forest", "grassland"],
  },
  "corvus-corax": {
    group: "bird",
    habitats: ["mountain", "grassland", "forest"],
  },
  "pica-pica": {
    group: "bird",
    habitats: ["grassland", "forest"],
  },
  "garrulus-glandarius": {
    group: "bird",
    habitats: ["forest"],
  },
  "vulpes-vulpes": {
    group: "mammal",
    habitats: ["forest", "grassland", "mountain"],
  },
  "canis-aureus": {
    group: "mammal",
    habitats: ["grassland", "forest", "wetland"],
  },
  "canis-lupus": {
    group: "mammal",
    habitats: ["mountain", "forest", "grassland"],
  },
  "mustela-nivalis": {
    group: "mammal",
    habitats: ["grassland", "forest", "mountain"],
  },
  "lutra-lutra": {
    group: "mammal",
    habitats: ["wetland", "forest", "mountain"],
  },
  "meles-canescens": {
    group: "mammal",
    habitats: ["forest", "grassland", "mountain"],
  },
  "sciurus-anomalus": {
    group: "mammal",
    habitats: ["forest"],
  },
  "capreolus-capreolus": {
    group: "mammal",
    habitats: ["forest", "grassland", "mountain"],
  },
  "ursus-arctos": {
    group: "mammal",
    habitats: ["forest", "mountain", "grassland"],
  },
  "erinaceus-concolor": {
    group: "mammal",
    habitats: ["forest", "grassland"],
  },
  "sus-scrofa": {
    group: "mammal",
    habitats: ["forest", "grassland", "mountain"],
  },
  "panthera-pardus": {
    group: "mammal",
    habitats: ["mountain", "forest", "grassland"],
  },
  "lynx-lynx": {
    group: "mammal",
    habitats: ["forest", "mountain", "grassland"],
  },
  "procyon-lotor": {
    group: "mammal",
    habitats: ["forest", "wetland", "grassland"],
  },
  "capra-aegagrus": {
    group: "mammal",
    habitats: ["mountain", "forest"],
  },
  "argiope-bruennichi": {
    group: "spider",
    habitats: ["grassland", "wetland"],
  },
  "argiope-lobata": {
    group: "spider",
    habitats: ["grassland"],
  },
  "steatoda-paykulliana": {
    group: "spider",
    habitats: ["grassland"],
  },
  "latrodectus-tredecimguttatus": {
    group: "spider",
    habitats: ["grassland"],
  },
};

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

export function groupHasVenomConcept(group: AnimalGroup) {
  return (
    group === "snake" ||
    group === "lizard" ||
    group === "turtle" ||
    group === "amphibian" ||
    group === "spider"
  );
}

const venomousDangerOrder: Record<DangerLevel, number> = {
  High: 0,
  Moderate: 1,
  Harmless: 2,
};

export function getVenomousCatalogSpecies(
  catalog: Species[] = getCatalogSpecies(),
) {
  return catalog
    .filter((item) => isVenomousDanger(item.danger))
    .filter((item) => getSpeciesAtlasMeta(item.id).group === "snake")
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

export function getCatalogByDanger(
  catalog: Species[] = getCatalogSpecies(),
): Record<DangerLevel, Species[]> {
  const groups: Record<DangerLevel, Species[]> = {
    High: [],
    Moderate: [],
    Harmless: [],
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
    snake: 0,
    lizard: 0,
    turtle: 0,
    amphibian: 0,
    bird: 0,
    mammal: 0,
    spider: 0,
  };

  for (const item of catalog) {
    byGroup[getSpeciesAtlasMeta(item.id).group] += 1;
  }

  const updatedDates = catalog
    .map((item) => item.updatedAt)
    .filter(Boolean)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  return {
    total: catalog.length,
    snakes: byGroup.snake,
    lizards: byGroup.lizard,
    turtles: byGroup.turtle,
    amphibians: byGroup.amphibian,
    birds: byGroup.bird,
    mammals: byGroup.mammal,
    spiders: byGroup.spider,
    regions: regions.length,
    photos: getAtlasPhotoCount(catalog),
    venomous: catalog.filter((item) => isVenomousDanger(item.danger)).length,
    lastUpdated: updatedDates.at(-1) ?? null,
  };
}

export function getRecentlyUpdatedSpecies(limit = 4) {
  return [...getCatalogSpecies()]
    .sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, limit);
}

export type AtlasFilters = {
  group: AnimalGroup | "all";
  danger: AtlasDangerFilter;
  habitat: HabitatTag | "all";
  region: string | "all";
  query: string;
};

export const defaultAtlasFilters: AtlasFilters = {
  group: "all",
  danger: "all",
  habitat: "all",
  region: "all",
  query: "",
};

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

  const groups: Array<AnimalGroup | "all"> = [
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
  const habitats: Array<HabitatTag | "all"> = [
    "all",
    "forest",
    "mountain",
    "wetland",
    "grassland",
  ];

  return {
    group: groups.includes(group as AnimalGroup | "all")
      ? (group as AnimalGroup | "all")
      : "all",
    danger: dangers.includes(danger as AtlasDangerFilter)
      ? (danger as AtlasDangerFilter)
      : "all",
    habitat: habitats.includes(habitat as HabitatTag | "all")
      ? (habitat as HabitatTag | "all")
      : "all",
    region:
      region && (region === "all" || regions.some((item) => item.id === region))
        ? region
        : "all",
    query,
  };
}

export function atlasFiltersToSearchParams(filters: AtlasFilters) {
  const params = new URLSearchParams();
  if (filters.group !== "all") params.set("type", filters.group);
  if (filters.danger !== "all") params.set("danger", filters.danger);
  if (filters.habitat !== "all") params.set("habitat", filters.habitat);
  if (filters.region !== "all") params.set("region", filters.region);
  if (filters.query.trim()) params.set("q", filters.query.trim());
  return params;
}

export function hasActiveAtlasFilters(filters: AtlasFilters) {
  return atlasFiltersToSearchParams(filters).toString().length > 0;
}
