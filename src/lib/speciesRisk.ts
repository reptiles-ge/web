import {
  getSpeciesAtlasMeta,
  groupHasVenomConcept,
  type AnimalGroup,
} from "@/data/speciesAtlas";
import type { DangerLevel, Species } from "@/data/species";

const HUMAN_RISK_STAT_LABELS = new Set([
  "ადამიანის რისკი",
  "Human risk",
]);

export function usesDangerScale(group: AnimalGroup) {
  return groupHasVenomConcept(group);
}

export function isHumanRiskStatLabel(label: string) {
  return HUMAN_RISK_STAT_LABELS.has(label);
}

export type SpeciesRiskChip =
  | { kind: "danger"; level: DangerLevel }
  | { kind: "interaction"; label: string; value: string };

export function getSpeciesRiskChip(
  species: Species,
  group: AnimalGroup = getSpeciesAtlasMeta(species.id).group,
): SpeciesRiskChip | null {
  if (usesDangerScale(group) && species.danger) {
    return { kind: "danger", level: species.danger };
  }

  const risk = species.stats.find(
    (stat) => isHumanRiskStatLabel(stat.label) && stat.value.trim(),
  );
  if (!risk) return null;
  return { kind: "interaction", label: risk.label, value: risk.value };
}
