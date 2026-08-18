import { getRegionsForSpecies } from "@/data/regions";
import {
  getCatalogSpecies,
  getSpeciesById,
  type Species,
} from "@/data/species";
import { getSpeciesAtlasMeta, isVenomousDanger } from "@/data/speciesAtlas";
import {
  RACER_CLUSTER_IDS,
  VENOMOUS_VIPER_IDS,
} from "@/lib/clusterGuides";
import { getSpeciesLookalikes } from "@/lib/speciesRoutes";

const viperClusterIds = new Set<string>(VENOMOUS_VIPER_IDS);
const racerClusterIds = new Set<string>(RACER_CLUSTER_IDS);

function relatedScore(base: Species, candidate: Species): number {
  let score = 0;
  if (getSpeciesLookalikes(base.id).includes(candidate.id)) score += 80;
  if (candidate.genus === base.genus) score += 100;
  if (candidate.family === base.family) score += 40;
  if (candidate.danger === base.danger) score += 10;

  const baseGroup = getSpeciesAtlasMeta(base.id).group;
  if (getSpeciesAtlasMeta(candidate.id).group === baseGroup) score += 15;

  const baseRegions = new Set(
    getRegionsForSpecies(base.id).map((region) => region.id),
  );
  if (baseRegions.size > 0) {
    const overlap = getRegionsForSpecies(candidate.id).some((region) =>
      baseRegions.has(region.id),
    );
    if (overlap) score += 20;
  }

  if (
    isVenomousDanger(base.danger) !== isVenomousDanger(candidate.danger) &&
    candidate.family === base.family
  ) {
    score += 15;
  }

  if (
    viperClusterIds.has(base.id) &&
    viperClusterIds.has(candidate.id)
  ) {
    score += 50;
  }

  if (
    racerClusterIds.has(base.id) &&
    racerClusterIds.has(candidate.id)
  ) {
    score += 50;
  }

  return score;
}

export function getRelatedSpecies(id: string, limit = 4): Species[] {
  const base = getSpeciesById(id);
  if (!base) return [];

  const scored = getCatalogSpecies()
    .filter((item) => item.id !== base.id)
    .map((item) => ({ item, score: relatedScore(base, item) }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.item.scientificName.localeCompare(b.item.scientificName);
    });

  const picked = scored.filter(({ score }) => score >= 40).slice(0, limit);
  if (picked.length >= limit) {
    return picked.map(({ item }) => item);
  }

  const have = new Set(picked.map(({ item }) => item.id));
  const baseGroup = getSpeciesAtlasMeta(base.id).group;
  for (const entry of scored) {
    if (picked.length >= limit) break;
    if (have.has(entry.item.id)) continue;
    if (getSpeciesAtlasMeta(entry.item.id).group !== baseGroup) continue;
    picked.push(entry);
    have.add(entry.item.id);
  }

  return picked.map(({ item }) => item);
}
