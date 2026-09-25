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
  | "insects"
  | "lizards"
  | "mammals"
  | "scorpions"
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
  insects: {
    group: "insect",
    heroSpeciesId: "mantis-religiosa",
    id: "insects",
    messageKey: "insects",
    path: "/insects",
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
  scorpions: {
    group: "scorpion",
    heroSpeciesId: "mesobuthus-eupeus",
    id: "scorpions",
    messageKey: "scorpions",
    path: "/scorpions",
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
  amphibians: "/images/home/groups/amphibians.jpg",
  birds: "/images/home/groups/birds.jpg",
  insects: "/images/home/groups/insects.jpg",
  lizards: "/images/home/groups/lizards.jpg",
  mammals: "/images/home/groups/mammals.jpg",
  scorpions: "/images/home/groups/scorpions.jpg",
  snakes: "/images/home/groups/snakes.jpg",
  spiders: "/images/home/groups/spiders.jpg",
  turtles: "/images/home/groups/turtles.jpg",
};

export const ANIMAL_GROUP_TO_HUB: Record<AnimalGroup, GroupHubId> = {
  amphibian: "amphibians",
  bird: "birds",
  insect: "insects",
  lizard: "lizards",
  mammal: "mammals",
  scorpion: "scorpions",
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
  insects: [
    "saxeoebebi",
    "species",
    "krazanis-bude",
    "wasp-nest",
    "farosana-sakhlshi",
    "stink-bug-in-house",
    "chianchvelebi-sakhlshi",
    "ants-in-house",
  ],
  lizards: [
    "saxeoebebi",
    "identifikacia",
    "darevskia",
    "xvlikis-da-gvelxokeras-gansxvaveba",
    "species",
    "identify",
    "lizard-or-glass-lizard",
    "xvliki-sakhlshi",
    "xvliki-saxlshi",
    "in-the-house",
  ],
  mammals: [
    "saxeoebebi",
    "species",
    "tura-ezoshi",
    "datvi-shekhvedra",
    "ghamura-sakhlshi",
    "ghamura-saxlshi",
    "jackal-in-the-yard",
    "bear-encounter",
    "bat-in-the-house",
    "tagvi-sakhlshi",
    "mouse-in-house",
  ],
  scorpions: ["saxeoebebi", "species", "morielis-nakbeni", "scorpion-sting"],
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
