import {
  getSpeciesAtlasMeta,
  groupHasVenomConcept,
  type AnimalGroup,
} from "@/data/speciesAtlas";
import type { DangerLevel, Species } from "@/data/species";

export function usesDangerScale(group: AnimalGroup) {
  return groupHasVenomConcept(group);
}

export type SpeciesRiskChip = {
  kind: "danger";
  level: DangerLevel;
};

export function getSpeciesRiskChip(
  species: Species,
  group: AnimalGroup = getSpeciesAtlasMeta(species.id).group,
): SpeciesRiskChip | null {
  if (usesDangerScale(group) && species.danger) {
    return { kind: "danger", level: species.danger };
  }
  return null;
}
