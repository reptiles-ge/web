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

export function isTurtleSpecies(species: Species) {
  return getSpeciesAtlasMeta(species.id).group === "turtle";
}

export function isAmphibianSpecies(species: Species) {
  return getSpeciesAtlasMeta(species.id).group === "amphibian";
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
  | "lizard-glass"
  | "turtle-index"
  | "turtle-land"
  | "turtle-water"
  | "turtle-identify"
  | "amphibian-index"
  | "amphibian-frogs-index"
  | "amphibian-newts";

export type ClusterGuidePath =
  | "/amphibians/bayayi"
  | "/snakes/saxeoebebi"
  | "/snakes/shxamiani-gvelis-amocnoba"
  | "/snakes/gvelis-nakbeni"
  | "/snakes/gavrtseleba"
  | "/snakes/didi-gvelebi"
  | "/lizards/saxeoebebi"
  | "/lizards/identifikacia"
  | "/lizards/xvlikis-da-gvelxokeras-gansxvaveba"
  | "/turtles/saxeoebebi"
  | "/turtles/xmelis-kuebi"
  | "/turtles/tsqlis-kuebi"
  | "/turtles/identifikacia"
  | "/amphibians/saxeoebebi"
  | "/amphibians/bayayi/saxeoebebi"
  | "/amphibians/tritoni-salamandra"
  | "/birds"
  | "/mammals";

export type ClusterMessageKey =
  | "amphibianFrogs"
  | "snakeIndex"
  | "snakeIdentify"
  | "snakeBite"
  | "snakeRange"
  | "snakeLargest"
  | "lizardIndex"
  | "lizardIdentify"
  | "lizardCompare"
  | "turtleIndex"
  | "turtleLand"
  | "turtleWater"
  | "turtleIdentify"
  | "amphibianIndex"
  | "amphibianFrogsIndex"
  | "amphibianNewts";

export type ClusterGuideConfig = {
  id: ClusterGuideId;
  pathname: ClusterGuidePath;
  parentHub: GroupHubId;
  messageKey: ClusterMessageKey;
  heroSpeciesId: string;
  heroImage?: string;
  matches: (species: Species) => boolean;
  faqCount: 4 | 5 | 8;
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
    heroImage: "/images/guides/snake-species-cover.png",
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
    heroImage: "/images/guides/identify-venomous-cover.png",
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
    heroImage: "/images/guides/snake-bite-cover.png",
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
    heroSpeciesId: "coronella-austriaca",
    heroImage: "/images/guides/snake-range-cover.png",
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
    heroSpeciesId: "dolichophis-schmidti",
    heroImage: "/images/guides/largest-snakes-cover.png",
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
  "turtle-index": {
    id: "turtle-index",
    pathname: "/turtles/saxeoebebi",
    parentHub: "turtles",
    messageKey: "turtleIndex",
    heroSpeciesId: "testudo-graeca",
    matches: isTurtleSpecies,
    faqCount: 4,
    schema: "collection",
    primaryCta: "hash",
  },
  "turtle-land": {
    id: "turtle-land",
    pathname: "/turtles/xmelis-kuebi",
    parentHub: "turtles",
    messageKey: "turtleLand",
    heroSpeciesId: "testudo-graeca",
    matches: (species) => turtleLandIdSet.has(species.id),
    faqCount: 4,
    schema: "collection",
    primaryCta: "hash",
  },
  "turtle-water": {
    id: "turtle-water",
    pathname: "/turtles/tsqlis-kuebi",
    parentHub: "turtles",
    messageKey: "turtleWater",
    heroSpeciesId: "emys-orbicularis",
    matches: (species) => turtleWaterIdSet.has(species.id),
    faqCount: 4,
    schema: "collection",
    primaryCta: "hash",
  },
  "turtle-identify": {
    id: "turtle-identify",
    pathname: "/turtles/identifikacia",
    parentHub: "turtles",
    messageKey: "turtleIdentify",
    heroSpeciesId: "testudo-graeca",
    matches: isTurtleSpecies,
    faqCount: 4,
    schema: "article",
    primaryCta: "hash",
  },
  "amphibian-index": {
    id: "amphibian-index",
    pathname: "/amphibians/saxeoebebi",
    parentHub: "amphibians",
    messageKey: "amphibianIndex",
    heroSpeciesId: "mertensiella-caucasica",
    matches: isAmphibianSpecies,
    faqCount: 4,
    schema: "collection",
    primaryCta: "hash",
  },
  "amphibian-frogs-index": {
    id: "amphibian-frogs-index",
    pathname: "/amphibians/bayayi/saxeoebebi",
    parentHub: "amphibians",
    messageKey: "amphibianFrogsIndex",
    heroSpeciesId: "pelophylax-ridibundus",
    matches: (species) => isFrogSpecies(species.id),
    faqCount: 4,
    schema: "collection",
    primaryCta: "hash",
  },
  "amphibian-newts": {
    id: "amphibian-newts",
    pathname: "/amphibians/tritoni-salamandra",
    parentHub: "amphibians",
    messageKey: "amphibianNewts",
    heroSpeciesId: "mertensiella-caucasica",
    matches: (species) => isNewtSpecies(species.id),
    faqCount: 4,
    schema: "collection",
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
        | "/snakes"
        | "/lizards"
        | "/birds"
        | "/mammals"
        | ClusterGuidePath;
      key:
        | "snakesHub"
        | "lizardsHub"
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
        | "glassLizard"
        | "turtleIndex"
        | "turtleLand"
        | "turtleWater"
        | "turtleIdentify"
        | "amphibianIndex"
        | "frogsIndex"
        | "newts"
        | "birdsHub"
        | "mammalsHub";
    }
  | {
      kind: "quiz";
      id: "snake";
      key: "quiz";
    }
  | {
      kind: "species";
      id: string;
      key:
        | "giurza"
        | "najadum"
        | "jojo"
        | "gvelxokera"
        | "slider"
        | "tortoise";
    };

export const HUB_CLUSTER_CARDS: Record<GroupHubId, HubClusterCard[]> = {
  snakes: [
    { kind: "page", href: "/snakes/saxeoebebi", key: "index" },
    { kind: "page", href: "/venomous-snakes", key: "venomous" },
    { kind: "quiz", id: "snake", key: "quiz" },
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
    { kind: "page", href: "/turtles/saxeoebebi", key: "turtleIndex" },
    { kind: "page", href: "/turtles/identifikacia", key: "turtleIdentify" },
    { kind: "page", href: "/turtles/xmelis-kuebi", key: "turtleLand" },
    { kind: "page", href: "/turtles/tsqlis-kuebi", key: "turtleWater" },
    { kind: "species", id: "testudo-graeca", key: "tortoise" },
    { kind: "species", id: "trachemys-scripta", key: "slider" },
  ],
  amphibians: [
    { kind: "page", href: "/amphibians/saxeoebebi", key: "amphibianIndex" },
    { kind: "page", href: "/amphibians/bayayi", key: "frogs" },
    { kind: "page", href: "/amphibians/bayayi/saxeoebebi", key: "frogsIndex" },
    { kind: "page", href: "/amphibians/tritoni-salamandra", key: "newts" },
  ],
  birds: [],
  mammals: [],
};

export const HUB_INDEX_PATH: Record<GroupHubId, ClusterGuidePath> = {
  snakes: "/snakes/saxeoebebi",
  lizards: "/lizards/saxeoebebi",
  turtles: "/turtles/saxeoebebi",
  amphibians: "/amphibians/saxeoebebi",
  birds: "/birds",
  mammals: "/mammals",
};

export function getHubIndexTitleKey(hubId: GroupHubId) {
  switch (hubId) {
    case "snakes":
      return "cluster.index.title" as const;
    case "lizards":
      return "cluster.lizardIndex.title" as const;
    case "turtles":
      return "cluster.turtleIndex.title" as const;
    case "birds":
      return "hubs.birds" as const;
    case "mammals":
      return "hubs.mammals" as const;
    default:
      return "cluster.amphibianIndex.title" as const;
  }
}

export type SpeciesSection = {
  key: string;
  items: Species[];
};

export function splitHubSpecies(
  hubId: GroupHubId,
  species: Species[],
): SpeciesSection[] {
  if (hubId === "snakes") {
    const racerIds = new Set<string>(RACER_CLUSTER_IDS);
    return [
      {
        key: "venomous",
        items: species.filter((item) => isVenomousDanger(item.danger)),
      },
      {
        key: "racers",
        items: species.filter((item) => racerIds.has(item.id)),
      },
      {
        key: "harmless",
        items: species.filter(
          (item) => !isVenomousDanger(item.danger) && !racerIds.has(item.id),
        ),
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

  if (hubId === "birds" || hubId === "mammals") {
    return [{ key: "all", items: species }].filter(
      (section) => section.items.length > 0,
    );
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
const racerClusterIdSet = new Set<string>(RACER_CLUSTER_IDS);

const PAGE_CARD_IMAGES: Partial<
  Record<Extract<HubClusterCard, { kind: "page" }>["href"], string>
> = {
  "/venomous-snakes": "/images/guides/identify-venomous-cover.png",
  "/snakes-in-the-yard": "/images/guides/snakes-in-the-yard-cover.jpg",
};

function speciesCardImage(id: string) {
  const item = getSpeciesById(id);
  const src = item?.image;
  if (!src || isPlaceholderMedia(src)) return undefined;
  return src;
}

export function getHubClusterCardImage(card: HubClusterCard) {
  if (card.kind === "species") {
    return speciesCardImage(card.id);
  }

  if (card.kind === "quiz") {
    return "/images/guides/snake-quiz-og.jpg";
  }

  const override = PAGE_CARD_IMAGES[card.href];
  if (override) return override;

  const guide = CLUSTER_GUIDE_LIST.find((entry) => entry.pathname === card.href);
  if (guide) {
    if (guide.heroImage) return guide.heroImage;
    return speciesCardImage(guide.heroSpeciesId);
  }

  const hub = GROUP_HUB_LIST.find((entry) => entry.path === card.href);
  if (hub) return speciesCardImage(hub.heroSpeciesId);

  return undefined;
}

export function getRelatedGuideCards(guideId: ClusterGuideId): HubClusterCard[] {
  const guide = CLUSTER_GUIDES[guideId];
  return HUB_CLUSTER_CARDS[guide.parentHub].filter(
    (card) =>
      card.kind === "quiz" ||
      (card.kind === "page" && card.href !== guide.pathname),
  );
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

export function getSpeciesGuideLinks(id: string): HubClusterCard[] {
  const species = getSpeciesById(id);
  if (!species) return [];

  const group = getSpeciesAtlasMeta(id).group;
  const links: HubClusterCard[] = [];

  if (group === "snake") {
    if (isVenomousDanger(species.danger)) {
      links.push({ kind: "page", href: "/venomous-snakes", key: "venomous" });
    }
    if (racerClusterIdSet.has(id)) {
      links.push({ kind: "page", href: "/snakes", key: "snakesHub" });
    }
    links.push({ kind: "page", href: "/snakes/saxeoebebi", key: "index" });
    links.push({ kind: "quiz", id: "snake", key: "quiz" });
    if (isVenomousDanger(species.danger)) {
      links.push({
        kind: "page",
        href: "/snakes/shxamiani-gvelis-amocnoba",
        key: "identify",
      });
      links.push({
        kind: "page",
        href: "/snakes/gvelis-nakbeni",
        key: "bite",
      });
    } else {
      links.push({
        kind: "page",
        href: "/snakes/shxamiani-gvelis-amocnoba",
        key: "identify",
      });
      links.push({
        kind: "page",
        href: "/snakes-in-the-yard",
        key: "yard",
      });
      links.push({
        kind: "page",
        href: "/snakes/gavrtseleba",
        key: "range",
      });
    }
    if (largeSnakeIdSet.has(id)) {
      links.push({
        kind: "page",
        href: "/snakes/didi-gvelebi",
        key: "largest",
      });
    }
  } else if (group === "lizard") {
    if (id === "pseudopus-apodus") {
      links.push({ kind: "page", href: "/lizards", key: "lizardsHub" });
    }
    links.push({
      kind: "page",
      href: "/lizards/saxeoebebi",
      key: "lizardIndex",
    });
    links.push({
      kind: "page",
      href: "/lizards/identifikacia",
      key: "lizardIdentify",
    });
    if (glassCompareIdSet.has(id)) {
      links.push({
        kind: "page",
        href: "/lizards/xvlikis-da-gvelxokeras-gansxvaveba",
        key: "glassLizard",
      });
    }
  } else if (group === "turtle") {
    links.push({
      kind: "page",
      href: "/turtles/saxeoebebi",
      key: "turtleIndex",
    });
    if (turtleLandIdSet.has(id)) {
      links.push({
        kind: "page",
        href: "/turtles/xmelis-kuebi",
        key: "turtleLand",
      });
    } else {
      links.push({
        kind: "page",
        href: "/turtles/tsqlis-kuebi",
        key: "turtleWater",
      });
    }
    links.push({
      kind: "page",
      href: "/turtles/identifikacia",
      key: "turtleIdentify",
    });
  } else if (group === "bird") {
    links.push({ kind: "page", href: "/birds", key: "birdsHub" });
  } else if (group === "mammal") {
    links.push({ kind: "page", href: "/mammals", key: "mammalsHub" });
  } else {
    links.push({
      kind: "page",
      href: "/amphibians/saxeoebebi",
      key: "amphibianIndex",
    });
    if (isFrogSpecies(id)) {
      links.push({ kind: "page", href: "/amphibians/bayayi", key: "frogs" });
      links.push({
        kind: "page",
        href: "/amphibians/bayayi/saxeoebebi",
        key: "frogsIndex",
      });
    } else {
      links.push({
        kind: "page",
        href: "/amphibians/tritoni-salamandra",
        key: "newts",
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
