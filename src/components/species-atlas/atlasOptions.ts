import { regions } from "@/data/mapRegions";
import { type AnimalGroup, type HabitatTag } from "@/data/speciesAtlasMeta";

export const GROUP_OPTIONS = [
  "all",
  "snake",
  "lizard",
  "turtle",
  "amphibian",
  "bird",
  "mammal",
  "spider",
] as const satisfies readonly ("all" | AnimalGroup)[];

export const DANGER_OPTIONS = ["all", "venomous", "harmless"] as const;

export const HABITAT_OPTIONS = [
  "all",
  "forest",
  "mountain",
  "wetland",
  "grassland",
] as const satisfies readonly ("all" | HabitatTag)[];

export const REGION_OPTIONS = [
  "all",
  ...regions.map((region) => region.id),
] as readonly string[];
