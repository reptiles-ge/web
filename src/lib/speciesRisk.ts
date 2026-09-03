import type { DangerLevel, Species } from "@/data/species";

import {
  type AnimalGroup,
  getSpeciesAtlasMeta,
  groupHasVenomConcept,
} from "@/data/speciesAtlas";

export type SpeciesRiskChip = {
  kind: "danger";
  level: DangerLevel;
};

export function getSpeciesRiskChip(
  species: Species,
  group: AnimalGroup = getSpeciesAtlasMeta(species.id).group,
): null | SpeciesRiskChip {
  if (usesDangerScale(group) && species.danger) {
    return { kind: "danger", level: species.danger };
  }
  return null;
}

export function usesDangerScale(group: AnimalGroup) {
  return groupHasVenomConcept(group);
}
