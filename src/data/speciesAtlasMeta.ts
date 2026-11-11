import type { DangerLevel } from "./speciesTypes";

export type AnimalGroup =
  | "amphibian"
  | "bird"
  | "insect"
  | "lizard"
  | "mammal"
  | "scorpion"
  | "snake"
  | "spider"
  | "turtle";

export type HabitatTag = "forest" | "grassland" | "mountain" | "wetland";

export type SpeciesAtlasMeta = {
  group: AnimalGroup;
  habitats: HabitatTag[];
};

export type SpeciesGroup = "fish" | AnimalGroup;

export function groupHasVenomConcept(group: SpeciesGroup) {
  return (
    group === "snake" ||
    group === "lizard" ||
    group === "turtle" ||
    group === "amphibian" ||
    group === "scorpion" ||
    group === "spider"
  );
}

export function isVenomousDanger(danger?: DangerLevel) {
  return danger === "High" || danger === "Moderate";
}
