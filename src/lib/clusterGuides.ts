import { getRegionSpecies, type Region } from "@/data/regions";
import { getSpeciesById, type Species } from "@/data/species";
import { getSpeciesAtlasMeta, isVenomousDanger } from "@/data/speciesAtlas";
import { GROUP_HUB_LIST, type GroupHubId } from "@/lib/groupHubs";
import { isPlaceholderMedia } from "@/lib/speciesContent";

export const FROG_SPECIES_IDS = [
  "pelobates-syriacus",
  "pelodytes-caucasicus",
  "bufotes-viridis",
  "bufo-verrucosissimus",
  "hyla-orientalis",
  "hyla-savignyi",
  "rana-macrocnemis",
  "pelophylax-ridibundus",
] as const;

export const NEWT_SPECIES_IDS = [
  "mertensiella-caucasica",
  "lissotriton-lantzi",
  "ommatotriton-ophryticus",
  "triturus-karelinii",
] as const;

export const TURTLE_LAND_IDS = ["testudo-graeca"] as const;

export const TURTLE_WATER_IDS = [
  "emys-orbicularis",
  "mauremys-caspica",
  "trachemys-scripta",
] as const;

export const LARGE_SNAKE_IDS = [
  "malpolon-insignitus",
  "macrovipera-lebetina",
  "dolichophis-schmidti",
  "natrix-tessellata",
  "natrix-natrix",
  "elaphe-urartica",
  "zamenis-longissimus",
] as const;

export const VENOMOUS_VIPER_IDS = [
  "macrovipera-lebetina",
  "vipera-dinniki",
  "vipera-kaznakovi",
  "vipera-transcaucasiana",
  "vipera-darevskii",
  "vipera-renardi",
] as const;

export const RACER_CLUSTER_IDS = [
  "platyceps-najadum",
  "elaphe-dione",
  "telescopus-fallax",
  "zamenis-longissimus",
] as const;

export const LARGE_SNAKE_LIZARD_ID = "pseudopus-apodus";

export const LIZARD_LOOKALIKE_PAIRS = [
  { a: "paralaudakia-caucasia", b: "tenuidactylus-caspius" },
  { a: "paralaudakia-caucasia", b: "darevskia-portschinskii" },
  { a: "pseudopus-apodus", b: "anguis-colchica" },
  { a: "pseudopus-apodus", b: "natrix-natrix" },
] as const;

export const GLASS_LIZARD_COMPARE_IDS = [
  "pseudopus-apodus",
  "anguis-colchica",
  "natrix-natrix",
  "natrix-tessellata",
] as const;

export const SNAKE_LOOKALIKE_PAIRS = [
  { a: "natrix-natrix", b: "vipera-kaznakovi" },
  { a: "natrix-tessellata", b: "vipera-kaznakovi" },
  { a: "coronella-austriaca", b: "vipera-transcaucasiana" },
  { a: "coronella-austriaca", b: "vipera-dinniki" },
  { a: "malpolon-insignitus", b: "macrovipera-lebetina" },
  { a: "pseudopus-apodus", b: "natrix-natrix" },
] as const;

const frogIdSet = new Set<string>(FROG_SPECIES_IDS);
const newtIdSet = new Set<string>(NEWT_SPECIES_IDS);
const largeSnakeIdSet = new Set<string>(LARGE_SNAKE_IDS);
const turtleLandIdSet = new Set<string>(TURTLE_LAND_IDS);
const turtleWaterIdSet = new Set<string>(TURTLE_WATER_IDS);

export const HOUSE_LIZARD_IDS = [
  "tenuidactylus-caspius",
  "paralaudakia-caucasia",
] as const;

export const YARD_CANID_IDS = [
  "canis-aureus",
  "vulpes-vulpes",
  "canis-lupus",
] as const;

export const VENOMOUS_SPIDER_IDS = ["latrodectus-tredecimguttatus"] as const;

export type ClusterGuideConfig = {
  faqCount: 4 | 5 | 6 | 8 | 10;
  heroImage?: string;
  heroSpeciesId: string;
  id: ClusterGuideId;
  matches: (species: Species) => boolean;
  messageKey: ClusterMessageKey;
  parentHub: GroupHubId;
  pathname: ClusterGuidePath;
  primaryCta: "hash" | "tel";
  schema: "article" | "collection";
};

export type ClusterGuideId =
  | "amphibian-frogs"
  | "amphibian-frogs-index"
  | "amphibian-index"
  | "amphibian-newts"
  | "bird-index"
  | "lizard-darevskia"
  | "lizard-glass"
  | "lizard-house"
  | "lizard-identify"
  | "lizard-index"
  | "mammal-bear"
  | "mammal-index"
  | "mammal-jackal-yard"
  | "snake-bite"
  | "snake-identify"
  | "snake-index"
  | "snake-largest"
  | "snake-range"
  | "turtle-identify"
  | "turtle-index"
  | "spider-bite"
  | "spider-venomous"
  | "turtle-land"
  | "turtle-water";

export type ClusterGuidePath =
  | "/amphibians/bayayi"
  | "/amphibians/bayayi/saxeoebebi"
  | "/amphibians/saxeoebebi"
  | "/amphibians/tritoni-salamandra"
  | "/birds"
  | "/birds/saxeoebebi"
  | "/lizards/darevskia"
  | "/lizards/identifikacia"
  | "/lizards/saxeoebebi"
  | "/lizards/xvliki-saxlshi"
  | "/lizards/xvlikis-da-gvelxokeras-gansxvaveba"
  | "/mammals"
  | "/mammals/datvi-shekhvedra"
  | "/mammals/saxeoebebi"
  | "/mammals/tura-ezoshi"
  | "/snakes/didi-gvelebi"
  | "/snakes/gavrtseleba"
  | "/snakes/gvelis-nakbeni"
  | "/snakes/saxeoebebi"
  | "/snakes/shxamiani-gvelis-amocnoba"
  | "/spiders"
  | "/spiders/obobis-nakbeni"
  | "/spiders/shxamiani-obobebi"
  | "/turtles/identifikacia"
  | "/turtles/saxeoebebi"
  | "/turtles/tsqlis-kuebi"
  | "/turtles/xmelis-kuebi";

export type ClusterMessageKey =
  | "amphibianFrogs"
  | "amphibianFrogsIndex"
  | "amphibianIndex"
  | "amphibianNewts"
  | "birdIndex"
  | "lizardCompare"
  | "lizardDarevskia"
  | "lizardHouse"
  | "lizardIdentify"
  | "lizardIndex"
  | "mammalBear"
  | "mammalIndex"
  | "mammalJackalYard"
  | "snakeBite"
  | "snakeIdentify"
  | "snakeIndex"
  | "snakeLargest"
  | "snakeRange"
  | "turtleIdentify"
  | "turtleIndex"
  | "spiderBite"
  | "spiderVenomous"
  | "turtleLand"
  | "turtleWater";

export function getRegionSnakeSpecies(region: Region) {
  return getRegionSpecies(region).filter(isSnakeSpecies);
}

export function isAmphibianSpecies(species: Species) {
  return getSpeciesAtlasMeta(species.id).group === "amphibian";
}

export function isBirdSpecies(species: Species) {
  return getSpeciesAtlasMeta(species.id).group === "bird";
}

export function isDarevskiaSpecies(species: Species) {
  return species.genus === "Darevskia";
}

export function isFrogSpecies(id: string) {
  return frogIdSet.has(id);
}

export function isLizardSpecies(species: Species) {
  return getSpeciesAtlasMeta(species.id).group === "lizard";
}

export function isMammalSpecies(species: Species) {
  return getSpeciesAtlasMeta(species.id).group === "mammal";
}

export function isNewtSpecies(id: string) {
  return newtIdSet.has(id);
}

export function isSnakeSpecies(species: Species) {
  return getSpeciesAtlasMeta(species.id).group === "snake";
}

export function isSpiderSpecies(species: Species) {
  return getSpeciesAtlasMeta(species.id).group === "spider";
}

export function isTurtleSpecies(species: Species) {
  return getSpeciesAtlasMeta(species.id).group === "turtle";
}

export function orderSpeciesByIds(species: Species[], ids: readonly string[]) {
  const map = new Map(species.map((item) => [item.id, item]));
  return ids
    .map((id) => map.get(id))
    .filter((item): item is Species => Boolean(item));
}

export const CLUSTER_GUIDES: Record<ClusterGuideId, ClusterGuideConfig> = {
  "amphibian-frogs": {
    faqCount: 4,
    heroSpeciesId: "pelophylax-ridibundus",
    id: "amphibian-frogs",
    matches: (species) => isFrogSpecies(species.id),
    messageKey: "amphibianFrogs",
    parentHub: "amphibians",
    pathname: "/amphibians/bayayi",
    primaryCta: "hash",
    schema: "collection",
  },
  "amphibian-frogs-index": {
    faqCount: 4,
    heroSpeciesId: "pelophylax-ridibundus",
    id: "amphibian-frogs-index",
    matches: (species) => isFrogSpecies(species.id),
    messageKey: "amphibianFrogsIndex",
    parentHub: "amphibians",
    pathname: "/amphibians/bayayi/saxeoebebi",
    primaryCta: "hash",
    schema: "collection",
  },
  "amphibian-index": {
    faqCount: 4,
    heroSpeciesId: "mertensiella-caucasica",
    id: "amphibian-index",
    matches: isAmphibianSpecies,
    messageKey: "amphibianIndex",
    parentHub: "amphibians",
    pathname: "/amphibians/saxeoebebi",
    primaryCta: "hash",
    schema: "collection",
  },
  "amphibian-newts": {
    faqCount: 4,
    heroSpeciesId: "mertensiella-caucasica",
    id: "amphibian-newts",
    matches: (species) => isNewtSpecies(species.id),
    messageKey: "amphibianNewts",
    parentHub: "amphibians",
    pathname: "/amphibians/tritoni-salamandra",
    primaryCta: "hash",
    schema: "collection",
  },
  "bird-index": {
    faqCount: 4,
    heroSpeciesId: "emberiza-citrinella",
    id: "bird-index",
    matches: isBirdSpecies,
    messageKey: "birdIndex",
    parentHub: "birds",
    pathname: "/birds/saxeoebebi",
    primaryCta: "hash",
    schema: "collection",
  },
  "lizard-darevskia": {
    faqCount: 4,
    heroSpeciesId: "darevskia-derjugini",
    id: "lizard-darevskia",
    matches: isDarevskiaSpecies,
    messageKey: "lizardDarevskia",
    parentHub: "lizards",
    pathname: "/lizards/darevskia",
    primaryCta: "hash",
    schema: "collection",
  },
  "lizard-glass": {
    faqCount: 4,
    heroSpeciesId: "pseudopus-apodus",
    id: "lizard-glass",
    matches: (species) =>
      (GLASS_LIZARD_COMPARE_IDS as readonly string[]).includes(species.id),
    messageKey: "lizardCompare",
    parentHub: "lizards",
    pathname: "/lizards/xvlikis-da-gvelxokeras-gansxvaveba",
    primaryCta: "hash",
    schema: "article",
  },
  "lizard-house": {
    faqCount: 6,
    heroSpeciesId: "tenuidactylus-caspius",
    id: "lizard-house",
    matches: (species) =>
      (HOUSE_LIZARD_IDS as readonly string[]).includes(species.id),
    messageKey: "lizardHouse",
    parentHub: "lizards",
    pathname: "/lizards/xvliki-saxlshi",
    primaryCta: "hash",
    schema: "article",
  },
  "lizard-identify": {
    faqCount: 4,
    heroSpeciesId: "paralaudakia-caucasia",
    id: "lizard-identify",
    matches: (species) =>
      isLizardSpecies(species) ||
      species.id === "natrix-natrix" ||
      species.id === "natrix-tessellata",
    messageKey: "lizardIdentify",
    parentHub: "lizards",
    pathname: "/lizards/identifikacia",
    primaryCta: "hash",
    schema: "article",
  },
  "lizard-index": {
    faqCount: 4,
    heroSpeciesId: "pseudopus-apodus",
    id: "lizard-index",
    matches: isLizardSpecies,
    messageKey: "lizardIndex",
    parentHub: "lizards",
    pathname: "/lizards/saxeoebebi",
    primaryCta: "hash",
    schema: "collection",
  },
  "mammal-bear": {
    faqCount: 6,
    heroSpeciesId: "ursus-arctos",
    id: "mammal-bear",
    matches: (species) => species.id === "ursus-arctos",
    messageKey: "mammalBear",
    parentHub: "mammals",
    pathname: "/mammals/datvi-shekhvedra",
    primaryCta: "tel",
    schema: "article",
  },
  "mammal-index": {
    faqCount: 4,
    heroSpeciesId: "vulpes-vulpes",
    id: "mammal-index",
    matches: isMammalSpecies,
    messageKey: "mammalIndex",
    parentHub: "mammals",
    pathname: "/mammals/saxeoebebi",
    primaryCta: "hash",
    schema: "collection",
  },
  "mammal-jackal-yard": {
    faqCount: 6,
    heroSpeciesId: "canis-aureus",
    id: "mammal-jackal-yard",
    matches: (species) =>
      (YARD_CANID_IDS as readonly string[]).includes(species.id),
    messageKey: "mammalJackalYard",
    parentHub: "mammals",
    pathname: "/mammals/tura-ezoshi",
    primaryCta: "hash",
    schema: "article",
  },
  "snake-bite": {
    faqCount: 8,
    heroImage: "/images/guides/snake-bite-cover.png",
    heroSpeciesId: "macrovipera-lebetina",
    id: "snake-bite",
    matches: (species) =>
      isSnakeSpecies(species) && isVenomousDanger(species.danger),
    messageKey: "snakeBite",
    parentHub: "snakes",
    pathname: "/snakes/gvelis-nakbeni",
    primaryCta: "tel",
    schema: "article",
  },
  "snake-identify": {
    faqCount: 4,
    heroImage: "/images/guides/identify-venomous-cover.png",
    heroSpeciesId: "vipera-kaznakovi",
    id: "snake-identify",
    matches: (species) =>
      isSnakeSpecies(species) || species.id === LARGE_SNAKE_LIZARD_ID,
    messageKey: "snakeIdentify",
    parentHub: "snakes",
    pathname: "/snakes/shxamiani-gvelis-amocnoba",
    primaryCta: "hash",
    schema: "article",
  },
  "snake-index": {
    faqCount: 4,
    heroImage: "/images/guides/snake-species-cover.png",
    heroSpeciesId: "macrovipera-lebetina",
    id: "snake-index",
    matches: isSnakeSpecies,
    messageKey: "snakeIndex",
    parentHub: "snakes",
    pathname: "/snakes/saxeoebebi",
    primaryCta: "hash",
    schema: "collection",
  },
  "snake-largest": {
    faqCount: 4,
    heroImage: "/images/guides/largest-snakes-cover.png",
    heroSpeciesId: "dolichophis-schmidti",
    id: "snake-largest",
    matches: (species) =>
      largeSnakeIdSet.has(species.id) || species.id === LARGE_SNAKE_LIZARD_ID,
    messageKey: "snakeLargest",
    parentHub: "snakes",
    pathname: "/snakes/didi-gvelebi",
    primaryCta: "hash",
    schema: "article",
  },
  "snake-range": {
    faqCount: 4,
    heroImage: "/images/guides/snake-range-cover.png",
    heroSpeciesId: "coronella-austriaca",
    id: "snake-range",
    matches: isSnakeSpecies,
    messageKey: "snakeRange",
    parentHub: "snakes",
    pathname: "/snakes/gavrtseleba",
    primaryCta: "hash",
    schema: "article",
  },
  "spider-bite": {
    faqCount: 8,
    heroSpeciesId: "latrodectus-tredecimguttatus",
    id: "spider-bite",
    matches: (species) =>
      isSpiderSpecies(species) && isVenomousDanger(species.danger),
    messageKey: "spiderBite",
    parentHub: "spiders",
    pathname: "/spiders/obobis-nakbeni",
    primaryCta: "tel",
    schema: "article",
  },
  "spider-venomous": {
    faqCount: 6,
    heroSpeciesId: "latrodectus-tredecimguttatus",
    id: "spider-venomous",
    matches: isSpiderSpecies,
    messageKey: "spiderVenomous",
    parentHub: "spiders",
    pathname: "/spiders/shxamiani-obobebi",
    primaryCta: "hash",
    schema: "collection",
  },
  "turtle-identify": {
    faqCount: 4,
    heroSpeciesId: "testudo-graeca",
    id: "turtle-identify",
    matches: isTurtleSpecies,
    messageKey: "turtleIdentify",
    parentHub: "turtles",
    pathname: "/turtles/identifikacia",
    primaryCta: "hash",
    schema: "article",
  },
  "turtle-index": {
    faqCount: 4,
    heroSpeciesId: "testudo-graeca",
    id: "turtle-index",
    matches: isTurtleSpecies,
    messageKey: "turtleIndex",
    parentHub: "turtles",
    pathname: "/turtles/saxeoebebi",
    primaryCta: "hash",
    schema: "collection",
  },
  "turtle-land": {
    faqCount: 4,
    heroSpeciesId: "testudo-graeca",
    id: "turtle-land",
    matches: (species) => turtleLandIdSet.has(species.id),
    messageKey: "turtleLand",
    parentHub: "turtles",
    pathname: "/turtles/xmelis-kuebi",
    primaryCta: "hash",
    schema: "collection",
  },
  "turtle-water": {
    faqCount: 4,
    heroSpeciesId: "emys-orbicularis",
    id: "turtle-water",
    matches: (species) => turtleWaterIdSet.has(species.id),
    messageKey: "turtleWater",
    parentHub: "turtles",
    pathname: "/turtles/tsqlis-kuebi",
    primaryCta: "hash",
    schema: "collection",
  },
};

export const CLUSTER_GUIDE_LIST = Object.values(CLUSTER_GUIDES);

export type ClusterGuideViewProps = {
  guideId: ClusterGuideId;
  heroSrc: string;
  species: Species[];
};

export type HubClusterCard =
  | {
      href:
        | "/birds"
        | "/lizards"
        | "/mammals"
        | "/snakes"
        | "/snakes-in-the-yard"
        | "/spiders"
        | "/venomous-snakes"
        | ClusterGuidePath;
      key:
        | "amphibianIndex"
        | "birdIndex"
        | "birdsHub"
        | "bite"
        | "frogs"
        | "frogsIndex"
        | "glassLizard"
        | "identify"
        | "index"
        | "largest"
        | "lizardDarevskia"
        | "lizardHouse"
        | "lizardIdentify"
        | "lizardIndex"
        | "lizardQuiz"
        | "lizardsHub"
        | "jackalYard"
        | "bearEncounter"
        | "mammalIndex"
        | "mammalsHub"
        | "newts"
        | "range"
        | "snakesHub"
        | "spiderBite"
        | "spiderVenomous"
        | "spidersHub"
        | "turtleIdentify"
        | "turtleIndex"
        | "turtleLand"
        | "turtleWater"
        | "venomous"
        | "yard";
      kind: "page";
    }
  | {
      id: "lizard" | "snake";
      key: "lizardQuiz" | "quiz";
      kind: "quiz";
    }
  | {
      id: string;
      key: "giurza" | "gvelxokera" | "jojo" | "najadum" | "slider" | "tortoise";
      kind: "species";
    };

export const HUB_CLUSTER_CARDS: Record<GroupHubId, HubClusterCard[]> = {
  amphibians: [
    { href: "/amphibians/saxeoebebi", key: "amphibianIndex", kind: "page" },
    { href: "/amphibians/bayayi", key: "frogs", kind: "page" },
    { href: "/amphibians/bayayi/saxeoebebi", key: "frogsIndex", kind: "page" },
    { href: "/amphibians/tritoni-salamandra", key: "newts", kind: "page" },
  ],
  birds: [{ href: "/birds/saxeoebebi", key: "birdIndex", kind: "page" }],
  lizards: [
    { href: "/lizards/saxeoebebi", key: "lizardIndex", kind: "page" },
    { id: "lizard", key: "lizardQuiz", kind: "quiz" },
    { href: "/lizards/identifikacia", key: "lizardIdentify", kind: "page" },
    { href: "/lizards/xvliki-saxlshi", key: "lizardHouse", kind: "page" },
    { href: "/lizards/darevskia", key: "lizardDarevskia", kind: "page" },
    {
      href: "/lizards/xvlikis-da-gvelxokeras-gansxvaveba",
      key: "glassLizard",
      kind: "page",
    },
    { id: "paralaudakia-caucasia", key: "jojo", kind: "species" },
    { id: "pseudopus-apodus", key: "gvelxokera", kind: "species" },
  ],
  mammals: [
    { href: "/mammals/saxeoebebi", key: "mammalIndex", kind: "page" },
    { href: "/mammals/tura-ezoshi", key: "jackalYard", kind: "page" },
    { href: "/mammals/datvi-shekhvedra", key: "bearEncounter", kind: "page" },
  ],
  snakes: [
    { href: "/snakes/saxeoebebi", key: "index", kind: "page" },
    { href: "/venomous-snakes", key: "venomous", kind: "page" },
    { id: "snake", key: "quiz", kind: "quiz" },
    {
      href: "/snakes/shxamiani-gvelis-amocnoba",
      key: "identify",
      kind: "page",
    },
    { href: "/snakes/gvelis-nakbeni", key: "bite", kind: "page" },
    { href: "/snakes/gavrtseleba", key: "range", kind: "page" },
    { href: "/snakes/didi-gvelebi", key: "largest", kind: "page" },
    { href: "/snakes-in-the-yard", key: "yard", kind: "page" },
    { id: "macrovipera-lebetina", key: "giurza", kind: "species" },
  ],
  spiders: [
    {
      href: "/spiders/shxamiani-obobebi",
      key: "spiderVenomous",
      kind: "page",
    },
    { href: "/spiders/obobis-nakbeni", key: "spiderBite", kind: "page" },
  ],
  turtles: [
    { href: "/turtles/saxeoebebi", key: "turtleIndex", kind: "page" },
    { href: "/turtles/identifikacia", key: "turtleIdentify", kind: "page" },
    { href: "/turtles/xmelis-kuebi", key: "turtleLand", kind: "page" },
    { href: "/turtles/tsqlis-kuebi", key: "turtleWater", kind: "page" },
    { id: "testudo-graeca", key: "tortoise", kind: "species" },
    { id: "trachemys-scripta", key: "slider", kind: "species" },
  ],
};

export const HUB_INDEX_PATH: Record<GroupHubId, ClusterGuidePath> = {
  amphibians: "/amphibians/saxeoebebi",
  birds: "/birds/saxeoebebi",
  lizards: "/lizards/saxeoebebi",
  mammals: "/mammals/saxeoebebi",
  snakes: "/snakes/saxeoebebi",
  spiders: "/spiders",
  turtles: "/turtles/saxeoebebi",
};

export type SpeciesSection = {
  items: Species[];
  key: string;
};

export function getHubIndexTitleKey(hubId: GroupHubId) {
  switch (hubId) {
    case "birds":
      return "cluster.birdIndex.title" as const;
    case "lizards":
      return "cluster.lizardIndex.title" as const;
    case "mammals":
      return "cluster.mammalIndex.title" as const;
    case "snakes":
      return "cluster.index.title" as const;
    case "spiders":
      return "hubs.spiders" as const;
    case "turtles":
      return "cluster.turtleIndex.title" as const;
    default:
      return "cluster.amphibianIndex.title" as const;
  }
}

export function getRearFangedSpecies(species: Species[]) {
  return species.filter(
    (item) => isVenomousDanger(item.danger) && item.family !== "Viperidae",
  );
}

export function getViperSpecies(species: Species[]) {
  return species.filter((item) => item.family === "Viperidae");
}

export function splitHubSpecies(
  hubId: GroupHubId,
  species: Species[],
): SpeciesSection[] {
  if (hubId === "snakes") {
    const racerIds = new Set<string>(RACER_CLUSTER_IDS);
    return [
      {
        items: species.filter((item) => isVenomousDanger(item.danger)),
        key: "venomous",
      },
      {
        items: species.filter((item) => racerIds.has(item.id)),
        key: "racers",
      },
      {
        items: species.filter(
          (item) => !isVenomousDanger(item.danger) && !racerIds.has(item.id),
        ),
        key: "harmless",
      },
    ].filter((section) => section.items.length > 0);
  }

  if (hubId === "lizards") {
    return [
      {
        items: species.filter(
          (item) =>
            item.id === "paralaudakia-caucasia" ||
            item.id === "pseudopus-apodus",
        ),
        key: "featured",
      },
      {
        items: species.filter((item) => item.genus === "Darevskia"),
        key: "darevskia",
      },
      {
        items: species.filter(
          (item) =>
            item.genus !== "Darevskia" &&
            item.id !== "paralaudakia-caucasia" &&
            item.id !== "pseudopus-apodus",
        ),
        key: "other",
      },
    ].filter((section) => section.items.length > 0);
  }

  if (hubId === "turtles") {
    return [
      {
        items: species.filter((item) => item.id !== "trachemys-scripta"),
        key: "native",
      },
      {
        items: species.filter((item) => item.id === "trachemys-scripta"),
        key: "introduced",
      },
    ].filter((section) => section.items.length > 0);
  }

  if (hubId === "birds" || hubId === "mammals" || hubId === "spiders") {
    return [{ items: species, key: "all" }].filter(
      (section) => section.items.length > 0,
    );
  }

  return [
    {
      items: species.filter((item) => isFrogSpecies(item.id)),
      key: "frogs",
    },
    {
      items: species.filter((item) => isNewtSpecies(item.id)),
      key: "newts",
    },
  ].filter((section) => section.items.length > 0);
}

const houseLizardIdSet = new Set<string>(HOUSE_LIZARD_IDS);
const yardCanidIdSet = new Set<string>(YARD_CANID_IDS);
const glassCompareIdSet = new Set<string>(GLASS_LIZARD_COMPARE_IDS);
const racerClusterIdSet = new Set<string>(RACER_CLUSTER_IDS);

const PAGE_CARD_IMAGES: Partial<
  Record<Extract<HubClusterCard, { kind: "page" }>["href"], string>
> = {
  "/snakes-in-the-yard": "/images/guides/snakes-in-the-yard-cover.jpg",
  "/venomous-snakes": "/images/guides/identify-venomous-cover.png",
};

export function getHubClusterCardImage(card: HubClusterCard) {
  if (card.kind === "species") {
    return speciesCardImage(card.id);
  }

  if (card.kind === "quiz") {
    return card.id === "lizard"
      ? "/images/home/groups/lizards.jpg"
      : "/images/guides/snake-quiz-og.jpg";
  }

  const override = PAGE_CARD_IMAGES[card.href];
  if (override) return override;

  const guide = CLUSTER_GUIDE_LIST.find(
    (entry) => entry.pathname === card.href,
  );
  if (guide) {
    if (guide.heroImage) return guide.heroImage;
    return speciesCardImage(guide.heroSpeciesId);
  }

  const hub = GROUP_HUB_LIST.find((entry) => entry.path === card.href);
  if (hub) return speciesCardImage(hub.heroSpeciesId);

  return undefined;
}

export function getHubPageRelatedGuides(
  hubId: GroupHubId,
  excludeHref: Extract<HubClusterCard, { kind: "page" }>["href"],
): HubClusterCard[] {
  return HUB_CLUSTER_CARDS[hubId].filter(
    (card) =>
      card.kind === "quiz" ||
      (card.kind === "page" && card.href !== excludeHref),
  );
}

export function getRelatedGuideCards(
  guideId: ClusterGuideId,
): HubClusterCard[] {
  const guide = CLUSTER_GUIDES[guideId];
  return HUB_CLUSTER_CARDS[guide.parentHub].filter(
    (card) =>
      card.kind === "quiz" ||
      (card.kind === "page" && card.href !== guide.pathname),
  );
}

export function getSpeciesGuideLinks(id: string): HubClusterCard[] {
  const species = getSpeciesById(id);
  if (!species) return [];

  const group = getSpeciesAtlasMeta(id).group;
  const links: HubClusterCard[] = [];

  if (group === "snake") {
    if (isVenomousDanger(species.danger)) {
      links.push({ href: "/venomous-snakes", key: "venomous", kind: "page" });
    }
    if (racerClusterIdSet.has(id)) {
      links.push({ href: "/snakes", key: "snakesHub", kind: "page" });
    }
    links.push({ href: "/snakes/saxeoebebi", key: "index", kind: "page" });
    links.push({ id: "snake", key: "quiz", kind: "quiz" });
    if (isVenomousDanger(species.danger)) {
      links.push({
        href: "/snakes/shxamiani-gvelis-amocnoba",
        key: "identify",
        kind: "page",
      });
      links.push({
        href: "/snakes/gvelis-nakbeni",
        key: "bite",
        kind: "page",
      });
    } else {
      links.push({
        href: "/snakes/shxamiani-gvelis-amocnoba",
        key: "identify",
        kind: "page",
      });
      links.push({
        href: "/snakes-in-the-yard",
        key: "yard",
        kind: "page",
      });
      links.push({
        href: "/snakes/gavrtseleba",
        key: "range",
        kind: "page",
      });
    }
    if (largeSnakeIdSet.has(id)) {
      links.push({
        href: "/snakes/didi-gvelebi",
        key: "largest",
        kind: "page",
      });
    }
  } else if (group === "lizard") {
    if (id === "pseudopus-apodus") {
      links.push({ href: "/lizards", key: "lizardsHub", kind: "page" });
    }
    links.push({
      href: "/lizards/saxeoebebi",
      key: "lizardIndex",
      kind: "page",
    });
    links.push({ id: "lizard", key: "lizardQuiz", kind: "quiz" });
    if (species.genus === "Darevskia") {
      links.push({
        href: "/lizards/darevskia",
        key: "lizardDarevskia",
        kind: "page",
      });
    }
    links.push({
      href: "/lizards/identifikacia",
      key: "lizardIdentify",
      kind: "page",
    });
    if (houseLizardIdSet.has(id)) {
      links.push({
        href: "/lizards/xvliki-saxlshi",
        key: "lizardHouse",
        kind: "page",
      });
    }
    if (glassCompareIdSet.has(id)) {
      links.push({
        href: "/lizards/xvlikis-da-gvelxokeras-gansxvaveba",
        key: "glassLizard",
        kind: "page",
      });
    }
  } else if (group === "turtle") {
    links.push({
      href: "/turtles/saxeoebebi",
      key: "turtleIndex",
      kind: "page",
    });
    if (turtleLandIdSet.has(id)) {
      links.push({
        href: "/turtles/xmelis-kuebi",
        key: "turtleLand",
        kind: "page",
      });
    } else {
      links.push({
        href: "/turtles/tsqlis-kuebi",
        key: "turtleWater",
        kind: "page",
      });
    }
    links.push({
      href: "/turtles/identifikacia",
      key: "turtleIdentify",
      kind: "page",
    });
  } else if (group === "bird") {
    links.push({ href: "/birds/saxeoebebi", key: "birdIndex", kind: "page" });
  } else if (group === "mammal") {
    links.push({
      href: "/mammals/saxeoebebi",
      key: "mammalIndex",
      kind: "page",
    });
    if (yardCanidIdSet.has(id)) {
      links.push({
        href: "/mammals/tura-ezoshi",
        key: "jackalYard",
        kind: "page",
      });
    }
    if (id === "ursus-arctos") {
      links.push({
        href: "/mammals/datvi-shekhvedra",
        key: "bearEncounter",
        kind: "page",
      });
    }
  } else if (group === "spider") {
    links.push({ href: "/spiders", key: "spidersHub", kind: "page" });
    links.push({
      href: "/spiders/shxamiani-obobebi",
      key: "spiderVenomous",
      kind: "page",
    });
    if (isVenomousDanger(species.danger)) {
      links.push({
        href: "/spiders/obobis-nakbeni",
        key: "spiderBite",
        kind: "page",
      });
    }
  } else {
    links.push({
      href: "/amphibians/saxeoebebi",
      key: "amphibianIndex",
      kind: "page",
    });
    if (isFrogSpecies(id)) {
      links.push({ href: "/amphibians/bayayi", key: "frogs", kind: "page" });
      links.push({
        href: "/amphibians/bayayi/saxeoebebi",
        key: "frogsIndex",
        kind: "page",
      });
    } else {
      links.push({
        href: "/amphibians/tritoni-salamandra",
        key: "newts",
        kind: "page",
      });
    }
  }

  const seen = new Set<string>();
  return links
    .filter((link) => {
      const key = link.kind === "page" ? link.href : `${link.kind}:${link.id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 4);
}

function speciesCardImage(id: string) {
  const item = getSpeciesById(id);
  const src = item?.image;
  if (!src || isPlaceholderMedia(src)) return undefined;
  return src;
}
