import { getRegionsForSpecies } from "@/data/regions";
import {
  getCatalogSpecies,
  getSpeciesById,
  type Species,
} from "@/data/species";
import { isVenomousDanger } from "@/data/speciesAtlas";
import { getSpeciesLookalikes } from "@/lib/speciesRoutes";

function relatedScore(base: Species, candidate: Species): number {
  let score = 0;
  if (getSpeciesLookalikes(base.id).includes(candidate.id)) score += 80;
  if (candidate.genus === base.genus) score += 100;
  if (candidate.family === base.family) score += 40;
  if (candidate.danger === base.danger) score += 10;

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

  return score;
}

export function getRelatedSpecies(id: string, limit = 3): Species[] {
  const base = getSpeciesById(id);
  if (!base) return [];

  return getCatalogSpecies()
    .filter((item) => item.id !== base.id)
    .map((item) => ({ item, score: relatedScore(base, item) }))
    .filter(({ score }) => score >= 40)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.item.scientificName.localeCompare(b.item.scientificName);
    })
    .slice(0, limit)
    .map(({ item }) => item);
}
