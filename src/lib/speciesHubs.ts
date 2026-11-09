import type { AnimalGroup } from "@/data/speciesAtlasMeta";

export const SPECIES_HUBS = [
  { group: "amphibian", id: "amphibians" },
  { group: "bird", id: "birds" },
  { group: "insect", id: "insects" },
  { group: "lizard", id: "lizards" },
  { group: "mammal", id: "mammals" },
  { group: "scorpion", id: "scorpions" },
  { group: "snake", id: "snakes" },
  { group: "spider", id: "spiders" },
  { group: "turtle", id: "turtles" },
] as const satisfies ReadonlyArray<{ group: AnimalGroup; id: string }>;

export type SpeciesHub = (typeof SPECIES_HUBS)[number];

export type SpeciesHubId = SpeciesHub["id"];

export const SPECIES_HUB_BY_PAGE: ReadonlyMap<string, SpeciesHub> = new Map(
  SPECIES_HUBS.map((hub) => [`/${hub.id}/[slug]`, hub]),
);
