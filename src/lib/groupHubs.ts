import type { AnimalGroup } from "@/data/speciesAtlas";

export type GroupHubId = "snakes" | "lizards" | "turtles" | "amphibians";

export type GroupHubConfig = {
  id: GroupHubId;
  path: `/${GroupHubId}`;
  group: AnimalGroup;
  heroSpeciesId: string;
  messageKey: GroupHubId;
};

export const GROUP_HUBS: Record<GroupHubId, GroupHubConfig> = {
  snakes: {
    id: "snakes",
    path: "/snakes",
    group: "snake",
    heroSpeciesId: "vipera-dinniki",
    messageKey: "snakes",
  },
  lizards: {
    id: "lizards",
    path: "/lizards",
    group: "lizard",
    heroSpeciesId: "pseudopus-apodus",
    messageKey: "lizards",
  },
  turtles: {
    id: "turtles",
    path: "/turtles",
    group: "turtle",
    heroSpeciesId: "testudo-graeca",
    messageKey: "turtles",
  },
  amphibians: {
    id: "amphibians",
    path: "/amphibians",
    group: "amphibian",
    heroSpeciesId: "mertensiella-caucasica",
    messageKey: "amphibians",
  },
};

export const GROUP_HUB_LIST = Object.values(GROUP_HUBS);
