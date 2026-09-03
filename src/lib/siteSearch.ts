import type { AppPathnames } from "@/i18n/routing";

import { type QuizHref } from "@/lib/quizzes";
import { type SpeciesHref } from "@/lib/speciesRoutes";

export type ScoredDocument = SearchDocument & { score: number };
export type SearchDocument = {
  featured?: boolean;
  href: SearchHref;
  icon: SearchIcon;
  id: string;
  image?: string;
  key: string;
  kind: SearchKind;
  rank?: number;
  scoreTitles: string[];
  searchText: string;
  subtitle: string;
  suggested?: boolean;
  title: string;
};
export type SearchFilter = "all" | SearchKind;

export type SearchGroup = {
  items: ScoredDocument[];
  kind: SearchKind;
};

export type SearchHref =
  | QuizHref
  | SearchPageHref
  | SpeciesHref
  | { params: { id: string }; pathname: "/regions/[id]" }
  | { params: { slug: string }; pathname: "/news/[slug]" };

export type SearchIcon =
  | "atlas"
  | "contact"
  | "guide"
  | "hub"
  | "identify"
  | "info"
  | "map"
  | "news"
  | "safety"
  | "yard";

export type SearchKind = "page" | "region" | "species";

export type SearchPageHref = Exclude<
  AppPathnames,
  | "/amphibians/[slug]"
  | "/birds/[slug]"
  | "/lizards/[slug]"
  | "/mammals/[slug]"
  | "/news/[slug]"
  | "/quiz/[slug]"
  | "/regions/[id]"
  | "/snakes/[slug]"
  | "/species/[id]"
  | "/spiders/[slug]"
  | "/turtles/[slug]"
>;

export type RecentRef = { id: string; kind: SearchKind };

const LIMITS: Record<SearchKind, number> = {
  page: 5,
  region: 4,
  species: 6,
};

export function flattenGroups(groups: SearchGroup[]) {
  return groups.flatMap((group) => group.items);
}

export function scoreDocument(query: string, doc: SearchDocument) {
  const q = normalize(query);
  if (!q) return 0;
  const text = doc.searchText;
  const tokens = q.split(" ").filter(Boolean);
  if (tokens.some((token) => !text.includes(token))) return 0;

  const titleScore = Math.max(
    ...doc.scoreTitles.map((title) => fieldScore(q, normalize(title), 100)),
    0,
  );
  const tokenTitle = tokens.reduce(
    (sum, token) =>
      sum +
      Math.max(
        ...doc.scoreTitles.map((title) =>
          fieldScore(token, normalize(title), 34),
        ),
        0,
      ),
    0,
  );
  let score = Math.max(titleScore, tokenTitle);
  score += Math.min(16, q.length);
  if (doc.kind === "page" && titleScore >= 48) score += 10;
  if (doc.kind === "region" && titleScore >= 70) score += 6;
  return score;
}

export function searchIndex(
  index: SearchDocument[],
  query: string,
  filter: SearchFilter,
): { groups: SearchGroup[]; totals: Record<SearchKind, number> } {
  const trimmed = query.trim();
  const scoped = index.filter(
    (item) => filter === "all" || item.kind === filter,
  );

  const totals: Record<SearchKind, number> = {
    page: 0,
    region: 0,
    species: 0,
  };

  if (!trimmed) {
    const idle = scoped
      .filter((item) => {
        if (filter === "species")
          return item.kind === "species" && item.featured;
        if (filter === "region") return item.kind === "region";
        if (filter === "page") return item.kind === "page";
        return (
          (item.kind === "page" && item.suggested) ||
          (item.kind === "species" && item.featured)
        );
      })
      .sort((a, b) => (a.rank ?? 50) - (b.rank ?? 50));

    const groups = groupDocuments(
      idle.map((item) => ({ ...item, score: 0 })),
      filter === "all"
        ? { page: 6, region: 0, species: 5 }
        : { page: 12, region: 12, species: 8 },
    );
    for (const group of groups) totals[group.kind] = group.items.length;
    return { groups, totals };
  }

  const scored: ScoredDocument[] = [];
  for (const item of scoped) {
    const score = scoreDocument(trimmed, item);
    if (score <= 0) continue;
    totals[item.kind] += 1;
    scored.push({ ...item, score });
  }

  scored.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

  const limits =
    filter === "all" ? LIMITS : { page: 12, region: 12, species: 12 };

  return { groups: groupDocuments(scored, limits), totals };
}

export const SEARCH_RECENT_KEY = "reptiles.search.recent";

export function readRecent(): RecentRef[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SEARCH_RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentRef[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        item &&
        (item.kind === "page" ||
          item.kind === "species" ||
          item.kind === "region") &&
        typeof item.id === "string",
    );
  } catch {
    return [];
  }
}

export function resolveRecent(index: SearchDocument[], recent: RecentRef[]) {
  return recent
    .map((item) =>
      index.find((doc) => doc.kind === item.kind && doc.id === item.id),
    )
    .filter((item): item is SearchDocument => Boolean(item));
}

export function writeRecent(entry: RecentRef) {
  const next = [
    entry,
    ...readRecent().filter(
      (item) => !(item.kind === entry.kind && item.id === entry.id),
    ),
  ].slice(0, 5);
  window.localStorage.setItem(SEARCH_RECENT_KEY, JSON.stringify(next));
  return next;
}

function fieldScore(query: string, field: string, weight: number) {
  if (!field) return 0;
  if (field === query) return weight;
  if (field.startsWith(query)) return Math.round(weight * 0.92);
  const tokens = field.split(/[\s,./():+_|–—-]+/);
  if (tokens.some((token) => token.startsWith(query))) {
    return Math.round(weight * 0.78);
  }
  if (field.includes(query)) return Math.round(weight * 0.48);
  return 0;
}

function groupDocuments(
  items: ScoredDocument[],
  limits: Record<SearchKind, number>,
): SearchGroup[] {
  const buckets: Record<SearchKind, ScoredDocument[]> = {
    page: [],
    region: [],
    species: [],
  };
  for (const item of items) {
    if (buckets[item.kind].length >= limits[item.kind]) continue;
    buckets[item.kind].push(item);
  }

  const groups: Array<{ items: typeof buckets.page; kind: SearchKind }> = [];
  for (const kind of Object.keys(buckets) as SearchKind[]) {
    const itemsForKind = buckets[kind];
    if (itemsForKind.length > 0)
      groups.push({ items: itemsForKind, kind });
  }

  return groups;
}

function normalize(value: string) {
  return value.normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim();
}
