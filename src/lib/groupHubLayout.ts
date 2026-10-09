import type { GroupHubId } from "@/lib/groupHubs";

export type HubFeaturedGuide = {
  card: string;
  imageSpeciesId: string;
  rows: readonly string[];
};

export const HUB_FEATURED_GUIDE: Partial<Record<GroupHubId, HubFeaturedGuide>> =
  {
    snakes: {
      card: "venomous",
      imageSpeciesId: "macrovipera-lebetina",
      rows: ["identify", "bite", "gyurzaBite"],
    },
    spiders: {
      card: "spiderVenomous",
      imageSpeciesId: "latrodectus-tredecimguttatus",
      rows: ["spiderBite", "spiderIndex", "dangerousAnimals"],
    },
  };

export const HUB_EMERGENCY_GUIDES: Partial<
  Record<GroupHubId, readonly string[]>
> = {
  snakes: ["bite", "gyurzaBite", "yard"],
  spiders: ["spiderBite", "spiderVenomous"],
};

export const EMERGENCY_GUIDE_KEYS: ReadonlySet<string> = new Set([
  "bite",
  "spiderBite",
]);

export const HUB_QUIZ: Partial<
  Record<GroupHubId, { id: "lizard" | "snake"; namespace: string }>
> = {
  lizards: { id: "lizard", namespace: "lizardQuiz" },
  snakes: { id: "snake", namespace: "snakeQuiz" },
};

export const HUB_CATALOG_INITIAL = { desktop: 16, mobile: 8 } as const;

export const HUB_DISPLAY_ORDER: readonly GroupHubId[] = [
  "snakes",
  "lizards",
  "turtles",
  "amphibians",
  "birds",
  "mammals",
  "spiders",
  "scorpions",
  "insects",
];
