import type { AnimalGroup } from "@/data/speciesAtlasMeta";

export type GroupHubConfig = {
  group: AnimalGroup;
  heroSpeciesId: string;
  id: GroupHubId;
  messageKey: GroupHubId;
  path: `/${GroupHubId}`;
};

export type GroupHubId =
  | "amphibians"
  | "birds"
  | "lizards"
  | "mammals"
  | "snakes"
  | "spiders"
  | "turtles";

export const GROUP_HUBS: Record<GroupHubId, GroupHubConfig> = {
  amphibians: {
    group: "amphibian",
    heroSpeciesId: "mertensiella-caucasica",
    id: "amphibians",
    messageKey: "amphibians",
    path: "/amphibians",
  },
  birds: {
    group: "bird",
    heroSpeciesId: "emberiza-citrinella",
    id: "birds",
    messageKey: "birds",
    path: "/birds",
  },
  lizards: {
    group: "lizard",
    heroSpeciesId: "pseudopus-apodus",
    id: "lizards",
    messageKey: "lizards",
    path: "/lizards",
  },
  mammals: {
    group: "mammal",
    heroSpeciesId: "vulpes-vulpes",
    id: "mammals",
    messageKey: "mammals",
    path: "/mammals",
  },
  snakes: {
    group: "snake",
    heroSpeciesId: "vipera-dinniki",
    id: "snakes",
    messageKey: "snakes",
    path: "/snakes",
  },
  spiders: {
    group: "spider",
    heroSpeciesId: "argiope-bruennichi",
    id: "spiders",
    messageKey: "spiders",
    path: "/spiders",
  },
  turtles: {
    group: "turtle",
    heroSpeciesId: "testudo-graeca",
    id: "turtles",
    messageKey: "turtles",
    path: "/turtles",
  },
};

export const GROUP_HUB_LIST = Object.values(GROUP_HUBS);

export const GROUP_HUB_ILLUSTRATIONS: Record<GroupHubId, string> = {
  amphibians: "https://cdn.reptiles.ge/mertensiella-caucasica-armen-3.jpg",
  birds: "https://cdn.reptiles.ge/emberiza-citrinella-sharp-1.jpg",
  lizards: "https://cdn.reptiles.ge/pseudopus-apodus-mobile.webp",
  mammals: "https://cdn.reptiles.ge/vulpes-vulpes-portrait-1.jpg",
  snakes: "https://cdn.reptiles.ge/hero-img.webp",
  spiders: "https://cdn.reptiles.ge/argiope-bruennichi-zauri-1.jpg",
  turtles: "https://cdn.reptiles.ge/testudo-graeca-3.jpg",
};

export const ANIMAL_GROUP_TO_HUB: Record<AnimalGroup, GroupHubId> = {
  amphibian: "amphibians",
  bird: "birds",
  lizard: "lizards",
  mammal: "mammals",
  snake: "snakes",
  spider: "spiders",
  turtle: "turtles",
};

export const RESERVED_HUB_SLUGS: Record<GroupHubId, readonly string[]> = {
  amphibians: [
    "saxeoebebi",
    "bayayi",
    "tritoni-salamandra",
    "species",
    "frogs",
    "newts",
  ],
  birds: ["saxeoebebi", "species"],
  lizards: [
    "saxeoebebi",
    "identifikacia",
    "darevskia",
    "xvlikis-da-gvelxokeras-gansxvaveba",
    "species",
    "identify",
    "lizard-or-glass-lizard",
    "xvliki-saxlshi",
    "in-the-house",
  ],
  mammals: [
    "saxeoebebi",
    "species",
    "tura-ezoshi",
    "datvi-shekhvedra",
    "jackal-in-the-yard",
    "bear-encounter",
  ],
  snakes: [
    "shxamiani-gvelebi",
    "gveli-ezoshi",
    "saxeoebebi",
    "sakartvelos-gvelebi",
    "shxamiani-gvelis-amocnoba",
    "gvelis-nakbeni",
    "gavrtseleba",
    "didi-gvelebi",
    "species",
    "identify-venomous",
    "bite",
    "range",
    "largest",
  ],
  spiders: [
    "saxeoebebi",
    "species",
    "shxamiani-obobebi",
    "obobis-nakbeni",
    "venomous",
    "bite",
  ],
  turtles: [
    "saxeoebebi",
    "xmelis-kuebi",
    "tsqlis-kuebi",
    "identifikacia",
    "species",
    "land",
    "freshwater",
    "identify",
  ],
};
