import type { SpeciesSummary } from "@/data/speciesTypes";

import { regions } from "@/data/mapRegions";
import { isVenomousDanger } from "@/data/speciesAtlasMeta";
import { speciesGroup, speciesHabitats } from "@/data/speciesAtlasMetaTable";
import { RACER_CLUSTER_IDS, VENOMOUS_VIPER_IDS } from "@/lib/clusterGuides";
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

type RelatedCandidate = Pick<
  SpeciesSummary,
  "danger" | "family" | "genus" | "id" | "scientificName"
> & { lookalikes: readonly string[] };

type RelatedContext = {
  groups: Map<string, string>;
  regions: Map<string, ReadonlySet<string>>;
};

const scientificNameOrder = new Intl.Collator();

const RELATED_INDEX_CACHE_SIZE = 4;

const profileRelatedIndexesByContent = new Map<string, Map<string, string[]>>();

const profileRelatedIndexes = new WeakMap<
  readonly RelatedCandidate[],
  Map<string, string[]>
>();

export function getLookalikeSpecies<T extends RelatedCandidate>(
  id: string,
  catalog: readonly T[],
): T[] {
  return pickByIds(
    catalog.find((item) => item.id === id)?.lookalikes ?? [],
    catalog,
  );
}

export function getProfileRelatedSpecies<T extends RelatedCandidate>(
  id: string,
  catalog: readonly T[],
): T[] {
  let index = profileRelatedIndexes.get(catalog);
  if (!index) {
    const key = relatedFingerprint(catalog);
    index = profileRelatedIndexesByContent.get(key);
    if (index) {
      profileRelatedIndexesByContent.delete(key);
    } else {
      index = buildProfileRelatedIndex(catalog);
    }
    profileRelatedIndexesByContent.set(key, index);
    for (const stale of profileRelatedIndexesByContent.keys()) {
      if (profileRelatedIndexesByContent.size <= RELATED_INDEX_CACHE_SIZE) {
        break;
      }
      profileRelatedIndexesByContent.delete(stale);
    }
    profileRelatedIndexes.set(catalog, index);
  }
  return pickByIds(index.get(id) ?? [], catalog);
}

export function getRelatedSpecies<T extends RelatedCandidate>(
  id: string,
  catalog: readonly T[],
  limit = 4,
): T[] {
  const base = catalog.find((item) => item.id === id);
  if (!base) return [];
  return rankRelatedSpecies(base, catalog, limit, relatedContext(catalog)).map(
    ({ item }) => item,
  );
}

function buildProfileRelatedIndex(catalog: readonly RelatedCandidate[]) {
  const context = relatedContext(catalog);
  const index = new Map<string, string[]>();
  const inbound = new Map<string, number>();
  const count = (id: string) => inbound.set(id, (inbound.get(id) ?? 0) + 1);
  const open: RelatedCandidate[] = [];

  for (const base of catalog) {
    const lookalikes = new Set(base.lookalikes);
    for (const id of lookalikes) count(id);
    const fixed = PROFILE_RELATED_OVERRIDES[base.id];
    if (fixed) {
      for (const id of fixed) count(id);
      index.set(base.id, [...fixed]);
      continue;
    }
    const ranked = rankRelatedSpecies(base, catalog, 8, context).filter(
      ({ item }) => !lookalikes.has(item.id),
    );
    const kept = ranked.slice(0, PROFILE_RELATED_LIMIT);
    const last = kept.at(-1);
    const weakLast =
      kept.length === PROFILE_RELATED_LIMIT &&
      last !== undefined &&
      last.score < STRONG_RELATED_SCORE;
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
      ...base.lookalikes,
    ]);
    const group = context.groups.get(base.id);
    const habitats = new Set(speciesHabitats(base));
    const candidates = catalog
      .filter(
        (item) => !taken.has(item.id) && context.groups.get(item.id) === group,
      )
      .map((item) => ({
        id: item.id,
        inbound: inbound.get(item.id) ?? 0,
        score: relatedScore(base, item, context),
        shared: speciesHabitats(item).some((tag) => habitats.has(tag)) ? 1 : 0,
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

function pickByIds<T extends RelatedCandidate>(
  ids: readonly string[],
  catalog: readonly T[],
): T[] {
  const byId = new Map(catalog.map((item) => [item.id, item]));
  return ids.flatMap((id) => {
    const item = byId.get(id);
    return item ? [item] : [];
  });
}

function rankRelatedSpecies<T extends RelatedCandidate>(
  base: RelatedCandidate,
  catalog: readonly T[],
  limit: number,
  context: RelatedContext,
) {
  const scored: Array<{ item: T; score: number }> = [];
  for (const item of catalog) {
    if (item.id === base.id) continue;
    scored.push({ item, score: relatedScore(base, item, context) });
  }
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return scientificNameOrder.compare(
      a.item.scientificName,
      b.item.scientificName,
    );
  });

  const picked = scored
    .filter(({ score }) => score >= STRONG_RELATED_SCORE)
    .slice(0, limit);
  if (picked.length >= limit) return picked;

  const have = new Set(picked.map(({ item }) => item.id));
  const baseGroup = context.groups.get(base.id);
  for (const entry of scored) {
    const id = entry.item.id;
    if (picked.length >= limit) break;
    if (have.has(id)) continue;
    if (context.groups.get(id) !== baseGroup) continue;
    picked.push(entry);
    have.add(id);
  }

  return picked;
}

function relatedContext(catalog: readonly RelatedCandidate[]): RelatedContext {
  const regionIds = new Map<string, Set<string>>();
  for (const region of regions) {
    for (const id of region.speciesIds) {
      regionIds.set(id, (regionIds.get(id) ?? new Set()).add(region.id));
    }
  }
  return {
    groups: new Map(catalog.map((item) => [item.id, speciesGroup(item)])),
    regions: regionIds,
  };
}

function relatedFingerprint(catalog: readonly RelatedCandidate[]) {
  return JSON.stringify(
    catalog.map((item) => [
      item.id,
      item.scientificName,
      item.genus,
      item.family,
      item.danger,
      item.lookalikes,
      speciesGroup(item),
      speciesHabitats(item),
    ]),
  );
}

function relatedScore(
  base: RelatedCandidate,
  candidate: RelatedCandidate,
  context: RelatedContext,
): number {
  let score = 0;
  if (base.lookalikes.includes(candidate.id)) score += 80;
  if (candidate.genus === base.genus) score += 100;
  if (candidate.family === base.family) score += 40;
  if (candidate.danger === base.danger) score += 10;

  if (context.groups.get(candidate.id) === context.groups.get(base.id)) {
    score += 15;
  }

  const baseRegions = context.regions.get(base.id);
  if (baseRegions) {
    const candidateRegions = context.regions.get(candidate.id);
    if (
      candidateRegions &&
      [...candidateRegions].some((id) => baseRegions.has(id))
    ) {
      score += 20;
    }
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
