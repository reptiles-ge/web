import { getRegionsForSpecies } from "@/data/regions";
import {
  getCatalogSpecies,
  getSpeciesById,
  type Species,
} from "@/data/species";
import { getSpeciesAtlasMeta, isVenomousDanger } from "@/data/speciesAtlas";
import { RACER_CLUSTER_IDS, VENOMOUS_VIPER_IDS } from "@/lib/clusterGuides";
import { getSpeciesLookalikes } from "@/lib/speciesLookalikes";
import { stableHash } from "@/lib/stableHash";

const PROFILE_RELATED_LIMIT = 4;
const STRONG_RELATED_SCORE = 40;
const PROFILE_RELATED_OVERRIDES: Record<string, readonly string[]> = {
  "alectoris-chukar": [],
  "macrovipera-lebetina": [
    "vipera-transcaucasiana",
    "vipera-dinniki",
    "vipera-kaznakovi",
    "vipera-renardi",
  ],
};

const viperClusterIds = new Set<string>(VENOMOUS_VIPER_IDS);
const racerClusterIds = new Set<string>(RACER_CLUSTER_IDS);

let profileRelatedIndex: Map<string, string[]> | undefined;

export function getLookalikeSpecies(id: string): Species[] {
  const items: Species[] = [];
  for (const lookalikeId of getSpeciesLookalikes(id)) {
    const item = getSpeciesById(lookalikeId);
    if (item) items.push(item);
  }
  return items;
}

export function getProfileRelatedSpecies(id: string): Species[] {
  profileRelatedIndex ??= buildProfileRelatedIndex();
  return (profileRelatedIndex.get(id) ?? []).flatMap((relatedId) => {
    const item = getSpeciesById(relatedId);
    return item ? [item] : [];
  });
}

export function getRelatedSpecies(id: string, limit = 4): Species[] {
  return rankRelatedSpecies(id, limit).map(({ item }) => item);
}

function buildProfileRelatedIndex() {
  const catalog = getCatalogSpecies();
  const index = new Map<string, string[]>();
  const inbound = new Map<string, number>();
  const count = (id: string) => inbound.set(id, (inbound.get(id) ?? 0) + 1);
  const open: Species[] = [];

  for (const base of catalog) {
    const lookalikes = new Set(getSpeciesLookalikes(base.id));
    for (const id of lookalikes) count(id);
    const fixed = PROFILE_RELATED_OVERRIDES[base.id];
    if (fixed) {
      for (const id of fixed) count(id);
      index.set(base.id, [...fixed]);
      continue;
    }
    const ranked = rankRelatedSpecies(base.id, 8).filter(
      ({ item }) => !lookalikes.has(item.id),
    );
    const kept = ranked.slice(0, PROFILE_RELATED_LIMIT);
    const weakLast =
      kept.length === PROFILE_RELATED_LIMIT &&
      kept[PROFILE_RELATED_LIMIT - 1].score < STRONG_RELATED_SCORE;
    const ids = (weakLast ? kept.slice(0, -1) : kept).map(
      ({ item }) => item.id,
    );
    for (const id of ids) count(id);
    index.set(base.id, ids);
    if (weakLast) open.push(base);
  }

  for (const base of open) {
    const taken = new Set([
      base.id,
      ...(index.get(base.id) ?? []),
      ...getSpeciesLookalikes(base.id),
    ]);
    const group = getSpeciesAtlasMeta(base.id).group;
    const habitats = new Set(getSpeciesAtlasMeta(base.id).habitats);
    const candidates = catalog
      .filter(
        (item) =>
          !taken.has(item.id) && getSpeciesAtlasMeta(item.id).group === group,
      )
      .map((item) => ({
        id: item.id,
        inbound: inbound.get(item.id) ?? 0,
        score: relatedScore(base, item),
        shared: getSpeciesAtlasMeta(item.id).habitats.some((tag) =>
          habitats.has(tag),
        )
          ? 1
          : 0,
        tie: stableHash(`${base.id}:${item.id}`),
      }))
      .sort(
        (a, b) =>
          b.shared - a.shared ||
          a.inbound - b.inbound ||
          b.score - a.score ||
          a.tie - b.tie,
      );
    const pick = candidates[0];
    if (!pick) continue;
    index.get(base.id)?.push(pick.id);
    count(pick.id);
  }

  return index;
}

function rankRelatedSpecies(id: string, limit: number) {
  const base = getSpeciesById(id);
  if (!base) return [];

  const scored: Array<{ item: Species; score: number }> = [];
  for (const item of getCatalogSpecies()) {
    if (item.id === base.id) continue;
    scored.push({ item, score: relatedScore(base, item) });
  }
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.item.scientificName.localeCompare(b.item.scientificName);
  });

  const picked = scored
    .filter(({ score }) => score >= STRONG_RELATED_SCORE)
    .slice(0, limit);
  if (picked.length >= limit) return picked;

  const have = new Set(picked.map(({ item }) => item.id));
  const baseGroup = getSpeciesAtlasMeta(base.id).group;
  for (const entry of scored) {
    const id = entry.item.id;
    if (picked.length >= limit) break;
    if (have.has(id)) continue;
    if (getSpeciesAtlasMeta(id).group !== baseGroup) continue;
    picked.push(entry);
    have.add(id);
  }

  return picked;
}

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

  if (viperClusterIds.has(base.id) && viperClusterIds.has(candidate.id)) {
    score += 50;
  }

  if (racerClusterIds.has(base.id) && racerClusterIds.has(candidate.id)) {
    score += 50;
  }

  return score;
}
