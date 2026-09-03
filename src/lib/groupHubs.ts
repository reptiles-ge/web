import type { AnimalGroup } from "@/data/speciesAtlas";

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
    "xvlikis-da-gvelxokeras-gansxvaveba",
    "species",
    "identify",
    "lizard-or-glass-lizard",
  ],
  mammals: ["saxeoebebi", "species"],
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
  spiders: ["saxeoebebi", "species"],
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
