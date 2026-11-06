import type { DangerLevel, Species } from "@/data/speciesTypes";

import {
  type AnimalGroup,
  groupHasVenomConcept,
} from "@/data/speciesAtlasMeta";
import { speciesGroup } from "@/data/speciesAtlasMetaTable";

export type SpeciesRiskChip = {
  kind: "danger";
  level: DangerLevel;
};

export function getSpeciesRiskChip(
  species: Pick<Species, "danger" | "id">,
  group: AnimalGroup = speciesGroup(species),
): null | SpeciesRiskChip {
  if (usesDangerScale(group) && species.danger) {
    return { kind: "danger", level: species.danger };
  }
  return null;
}

export function usesDangerScale(group: AnimalGroup) {
  return groupHasVenomConcept(group);
}
