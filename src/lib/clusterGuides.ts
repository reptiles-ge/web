import { getRegionSpecies, type Region } from "@/data/regions";
import type { Species } from "@/data/species";
import { getSpeciesAtlasMeta, isVenomousDanger } from "@/data/speciesAtlas";
import type { GroupHubId } from "@/lib/groupHubs";

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

export const LARGE_SNAKE_IDS = [
  "malpolon-insignitus",
  "macrovipera-lebetina",
  "dolichophis-schmidti",
  "natrix-tessellata",
  "natrix-natrix",
  "elaphe-urartica",
  "dolichophis-caspius",
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
  { a: "malpolon-insignitus", b: "macrovipera-lebetina" },
  { a: "pseudopus-apodus", b: "natrix-natrix" },
] as const;

const frogIdSet = new Set<string>(FROG_SPECIES_IDS);
const newtIdSet = new Set<string>(NEWT_SPECIES_IDS);
const largeSnakeIdSet = new Set<string>(LARGE_SNAKE_IDS);

export function isFrogSpecies(id: string) {
  return frogIdSet.has(id);
}

export function isNewtSpecies(id: string) {
  return newtIdSet.has(id);
}

export function isSnakeSpecies(species: Species) {
  return getSpeciesAtlasMeta(species.id).group === "snake";
}

export function isLizardSpecies(species: Species) {
  return getSpeciesAtlasMeta(species.id).group === "lizard";
}

export function isDarevskiaSpecies(species: Species) {
  return species.genus === "Darevskia";
}

export function getRegionSnakeSpecies(region: Region) {
  return getRegionSpecies(region).filter(isSnakeSpecies);
}

export function orderSpeciesByIds(species: Species[], ids: readonly string[]) {
  const map = new Map(species.map((item) => [item.id, item]));
  return ids
    .map((id) => map.get(id))
    .filter((item): item is Species => Boolean(item));
}

export type ClusterGuideId =
  | "amphibian-frogs"
  | "snake-index"
  | "snake-identify"
  | "snake-bite"
  | "snake-range"
  | "snake-largest"
  | "lizard-index"
  | "lizard-identify"
  | "lizard-glass";

export type ClusterGuidePath =
  | "/amphibians/bayayi"
  | "/snakes/saxeoebebi"
  | "/snakes/shxamiani-gvelis-amocnoba"
  | "/snakes/gvelis-nakbeni"
  | "/snakes/gavrtseleba"
  | "/snakes/didi-gvelebi"
  | "/lizards/saxeoebebi"
  | "/lizards/identifikacia"
  | "/lizards/xvlikis-da-gvelxokeras-gansxvaveba";

export type ClusterMessageKey =
  | "amphibianFrogs"
  | "snakeIndex"
  | "snakeIdentify"
  | "snakeBite"
  | "snakeRange"
  | "snakeLargest"
  | "lizardIndex"
  | "lizardIdentify"
  | "lizardCompare";

export type ClusterGuideConfig = {
  id: ClusterGuideId;
  pathname: ClusterGuidePath;
  parentHub: GroupHubId;
  messageKey: ClusterMessageKey;
  heroSpeciesId: string;
  matches: (species: Species) => boolean;
  faqCount: 4 | 5;
  schema: "collection" | "article";
  primaryCta: "hash" | "tel";
};

export const CLUSTER_GUIDES: Record<ClusterGuideId, ClusterGuideConfig> = {
  "amphibian-frogs": {
    id: "amphibian-frogs",
    pathname: "/amphibians/bayayi",
    parentHub: "amphibians",
    messageKey: "amphibianFrogs",
    heroSpeciesId: "pelophylax-ridibundus",
    matches: (species) => isFrogSpecies(species.id),
    faqCount: 4,
    schema: "collection",
    primaryCta: "hash",
  },
  "snake-index": {
    id: "snake-index",
    pathname: "/snakes/saxeoebebi",
    parentHub: "snakes",
    messageKey: "snakeIndex",
    heroSpeciesId: "macrovipera-lebetina",
    matches: isSnakeSpecies,
    faqCount: 4,
    schema: "collection",
    primaryCta: "hash",
  },
  "snake-identify": {
    id: "snake-identify",
    pathname: "/snakes/shxamiani-gvelis-amocnoba",
    parentHub: "snakes",
    messageKey: "snakeIdentify",
    heroSpeciesId: "vipera-kaznakovi",
    matches: (species) =>
      isSnakeSpecies(species) || species.id === LARGE_SNAKE_LIZARD_ID,
    faqCount: 4,
    schema: "article",
    primaryCta: "hash",
  },
  "snake-bite": {
    id: "snake-bite",
    pathname: "/snakes/gvelis-nakbeni",
    parentHub: "snakes",
    messageKey: "snakeBite",
    heroSpeciesId: "macrovipera-lebetina",
    matches: (species) =>
      isSnakeSpecies(species) && isVenomousDanger(species.danger),
    faqCount: 4,
    schema: "article",
    primaryCta: "tel",
  },
  "snake-range": {
    id: "snake-range",
    pathname: "/snakes/gavrtseleba",
    parentHub: "snakes",
    messageKey: "snakeRange",
    heroSpeciesId: "natrix-natrix",
    matches: isSnakeSpecies,
    faqCount: 4,
    schema: "article",
    primaryCta: "hash",
  },
  "snake-largest": {
    id: "snake-largest",
    pathname: "/snakes/didi-gvelebi",
    parentHub: "snakes",
    messageKey: "snakeLargest",
    heroSpeciesId: "macrovipera-lebetina",
    matches: (species) =>
      largeSnakeIdSet.has(species.id) || species.id === LARGE_SNAKE_LIZARD_ID,
    faqCount: 4,
    schema: "article",
    primaryCta: "hash",
  },
  "lizard-index": {
    id: "lizard-index",
    pathname: "/lizards/saxeoebebi",
    parentHub: "lizards",
    messageKey: "lizardIndex",
    heroSpeciesId: "pseudopus-apodus",
    matches: isLizardSpecies,
    faqCount: 4,
    schema: "collection",
    primaryCta: "hash",
  },
  "lizard-identify": {
    id: "lizard-identify",
    pathname: "/lizards/identifikacia",
    parentHub: "lizards",
    messageKey: "lizardIdentify",
    heroSpeciesId: "paralaudakia-caucasia",
    matches: (species) =>
      isLizardSpecies(species) ||
      species.id === "natrix-natrix" ||
      species.id === "natrix-tessellata",
    faqCount: 4,
    schema: "article",
    primaryCta: "hash",
  },
  "lizard-glass": {
    id: "lizard-glass",
    pathname: "/lizards/xvlikis-da-gvelxokeras-gansxvaveba",
    parentHub: "lizards",
    messageKey: "lizardCompare",
    heroSpeciesId: "pseudopus-apodus",
    matches: (species) =>
      (GLASS_LIZARD_COMPARE_IDS as readonly string[]).includes(species.id),
    faqCount: 4,
    schema: "article",
    primaryCta: "hash",
  },
};

export const CLUSTER_GUIDE_LIST = Object.values(CLUSTER_GUIDES);

export type ClusterGuideViewProps = {
  guideId: ClusterGuideId;
  species: Species[];
  heroSrc: string;
};

export type HubClusterCard =
  | {
      kind: "page";
      href:
        | "/venomous-snakes"
        | "/snakes-in-the-yard"
        | "/amphibians/bayayi"
        | "/snakes/saxeoebebi"
        | "/snakes/shxamiani-gvelis-amocnoba"
        | "/snakes/gvelis-nakbeni"
        | "/snakes/gavrtseleba"
        | "/snakes/didi-gvelebi"
        | "/lizards/saxeoebebi"
        | "/lizards/identifikacia"
        | "/lizards/xvlikis-da-gvelxokeras-gansxvaveba";
      key:
        | "venomous"
        | "yard"
        | "frogs"
        | "index"
        | "identify"
        | "bite"
        | "range"
        | "largest"
        | "lizardIndex"
        | "lizardIdentify"
        | "glassLizard";
    }
  | {
      kind: "species";
      id: string;
      key: "giurza" | "jojo" | "gvelxokera" | "slider" | "tortoise";
    };

export const HUB_CLUSTER_CARDS: Record<GroupHubId, HubClusterCard[]> = {
  snakes: [
    { kind: "page", href: "/snakes/saxeoebebi", key: "index" },
    { kind: "page", href: "/venomous-snakes", key: "venomous" },
    { kind: "page", href: "/snakes/shxamiani-gvelis-amocnoba", key: "identify" },
    { kind: "page", href: "/snakes/gvelis-nakbeni", key: "bite" },
    { kind: "page", href: "/snakes/gavrtseleba", key: "range" },
    { kind: "page", href: "/snakes/didi-gvelebi", key: "largest" },
    { kind: "page", href: "/snakes-in-the-yard", key: "yard" },
    { kind: "species", id: "macrovipera-lebetina", key: "giurza" },
  ],
  lizards: [
    { kind: "page", href: "/lizards/saxeoebebi", key: "lizardIndex" },
    { kind: "page", href: "/lizards/identifikacia", key: "lizardIdentify" },
    {
      kind: "page",
      href: "/lizards/xvlikis-da-gvelxokeras-gansxvaveba",
      key: "glassLizard",
    },
    { kind: "species", id: "paralaudakia-caucasia", key: "jojo" },
    { kind: "species", id: "pseudopus-apodus", key: "gvelxokera" },
  ],
  turtles: [
    { kind: "species", id: "testudo-graeca", key: "tortoise" },
    { kind: "species", id: "trachemys-scripta", key: "slider" },
  ],
  amphibians: [{ kind: "page", href: "/amphibians/bayayi", key: "frogs" }],
};

export type SpeciesSection = {
  key: string;
  items: Species[];
};

export function splitHubSpecies(
  hubId: GroupHubId,
  species: Species[],
): SpeciesSection[] {
  if (hubId === "snakes") {
    return [
      {
        key: "venomous",
        items: species.filter((item) => isVenomousDanger(item.danger)),
      },
      {
        key: "harmless",
        items: species.filter((item) => !isVenomousDanger(item.danger)),
      },
    ].filter((section) => section.items.length > 0);
  }

  if (hubId === "lizards") {
    return [
      {
        key: "featured",
        items: species.filter(
          (item) =>
            item.id === "paralaudakia-caucasia" ||
            item.id === "pseudopus-apodus",
        ),
      },
      {
        key: "darevskia",
        items: species.filter((item) => item.genus === "Darevskia"),
      },
      {
        key: "other",
        items: species.filter(
          (item) =>
            item.genus !== "Darevskia" &&
            item.id !== "paralaudakia-caucasia" &&
            item.id !== "pseudopus-apodus",
        ),
      },
    ].filter((section) => section.items.length > 0);
  }

  if (hubId === "turtles") {
    return [
      {
        key: "native",
        items: species.filter((item) => item.id !== "trachemys-scripta"),
      },
      {
        key: "introduced",
        items: species.filter((item) => item.id === "trachemys-scripta"),
      },
    ].filter((section) => section.items.length > 0);
  }

  return [
    {
      key: "frogs",
      items: species.filter((item) => isFrogSpecies(item.id)),
    },
    {
      key: "newts",
      items: species.filter((item) => isNewtSpecies(item.id)),
    },
  ].filter((section) => section.items.length > 0);
}

export function getViperSpecies(species: Species[]) {
  return species.filter((item) => item.family === "Viperidae");
}

export function getRearFangedSpecies(species: Species[]) {
  return species.filter(
    (item) => isVenomousDanger(item.danger) && item.family !== "Viperidae",
  );
}

const glassCompareIdSet = new Set<string>(GLASS_LIZARD_COMPARE_IDS);

export function getSpeciesGuideLinks(id: string) {
  if (!glassCompareIdSet.has(id)) return [];
  return [
    {
      href: "/lizards/xvlikis-da-gvelxokeras-gansxvaveba" as const,
    },
  ];
}
