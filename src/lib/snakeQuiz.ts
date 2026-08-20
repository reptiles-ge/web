import { type PhotoCredit, type Species } from "@/data/species";
import { isSnakeSpecies } from "@/lib/clusterGuides";
import { getRelatedSpecies } from "@/lib/speciesRelated";
import { getSpeciesLookalikes } from "@/lib/speciesRoutes";

export type QuizDifficulty = "easy" | "medium" | "hard";
export type QuizMode = "default";

export const QUIZ_LENGTH = 10;
export const QUIZ_OPTION_COUNT = 4;

export const SCORE_BANDS = [
  { minPercent: 90, messageKey: "scoreExcellent" },
  { minPercent: 70, messageKey: "scoreGreat" },
  { minPercent: 50, messageKey: "scoreGood" },
  { minPercent: 0, messageKey: "scoreKeepGoing" },
] as const;

export type ScoreMessageKey = (typeof SCORE_BANDS)[number]["messageKey"];

export const DEFAULT_QUIZ_MIX: Record<QuizDifficulty, number> = {
  easy: 4,
  medium: 4,
  hard: 2,
};

export const EASY_SNAKE_IDS = [
  "macrovipera-lebetina",
  "natrix-natrix",
  "natrix-tessellata",
  "platyceps-najadum",
  "eryx-jaculus",
  "xerotyphlops-vermicularis",
  "malpolon-insignitus",
  "zamenis-longissimus",
] as const;

export const MEDIUM_SNAKE_IDS = [
  "coronella-austriaca",
  "elaphe-urartica",
  "elaphe-dione",
  "dolichophis-schmidti",
  "dolichophis-caspius",
  "telescopus-fallax",
  "hemorrhois-ravergieri",
  "zamenis-hohenackeri",
] as const;

export const HARD_SNAKE_IDS = [
  "vipera-kaznakovi",
  "vipera-dinniki",
  "vipera-darevskii",
  "vipera-transcaucasiana",
  "vipera-renardi",
  "eirenis-modestus",
  "eirenis-collaris",
] as const;

const POOL_BY_DIFFICULTY: Record<QuizDifficulty, readonly string[]> = {
  easy: EASY_SNAKE_IDS,
  medium: MEDIUM_SNAKE_IDS,
  hard: HARD_SNAKE_IDS,
};

export type SnakeQuizSpecies = {
  id: string;
  commonName: string;
  scientificName: string;
  location: string;
  image: string;
  imageCredit?: PhotoCredit;
  family: string;
  genus: string;
  explanation: string;
  hint: string;
};

export type SnakeQuizQuestion = {
  speciesId: string;
  image: string;
  imageCredit?: PhotoCredit;
  correctId: string;
  optionIds: string[];
  difficulty: QuizDifficulty;
  explanation: string;
};

export function scorePercent(correct: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((correct / total) * 100);
}

export function scoreMessageKey(percent: number): ScoreMessageKey {
  const band = SCORE_BANDS.find((item) => percent >= item.minPercent);
  return band?.messageKey ?? "scoreKeepGoing";
}

function spoilsAnswer(text: string, species: Species) {
  const haystack = text.toLowerCase();
  const needles = [
    species.commonName,
    species.scientificName,
    ...species.scientificName.split(/\s+/),
  ]
    .map((item) => item.trim().toLowerCase())
    .filter((item) => item.length > 3);
  return needles.some((needle) => haystack.includes(needle));
}

export function buildQuizHint(species: Species) {
  const traits = (species.identification?.traits ?? []).filter(
    (trait) => trait.trim() && !spoilsAnswer(trait, species),
  );
  const picked = (traits.length > 0 ? traits : species.identification?.traits ?? [])
    .slice(0, 1)
    .map((trait) => trait.trim())
    .filter(Boolean);
  if (picked.length > 0) return picked.join(" ");

  const habitat = species.stats.find(
    (stat) => /ჰაბიტატი|habitat/i.test(stat.label),
  )?.value;
  if (habitat) return habitat;
  return species.location;
}

export function toSnakeQuizSpecies(species: Species): SnakeQuizSpecies {
  const explanation =
    species.identification?.summary?.trim() ||
    species.facts[0]?.trim() ||
    species.description.trim();

  return {
    id: species.id,
    commonName: species.commonName,
    scientificName: species.scientificName,
    location: species.location,
    image: species.image,
    imageCredit: species.imageCredit,
    family: species.family,
    genus: species.genus,
    explanation,
    hint: buildQuizHint(species),
  };
}

export function getSnakeQuizCatalog(species: Species[]): SnakeQuizSpecies[] {
  return species
    .filter((item) => isSnakeSpecies(item) && Boolean(item.image))
    .map(toSnakeQuizSpecies);
}

function shuffle<T>(items: T[], rng: () => number): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const current = next[i];
    next[i] = next[j]!;
    next[j] = current!;
  }
  return next;
}

function catalogById(pool: SnakeQuizSpecies[]) {
  return new Map(pool.map((item) => [item.id, item]));
}

export function pickSnakeDistractors(
  correctId: string,
  pool: SnakeQuizSpecies[],
  count = QUIZ_OPTION_COUNT - 1,
  rng: () => number = Math.random,
): string[] {
  const available = pool.filter((item) => item.id !== correctId);
  if (available.length <= count) {
    return available.map((item) => item.id);
  }

  const lookalikes = new Set(getSpeciesLookalikes(correctId));
  const related = getRelatedSpecies(correctId, 8)
    .filter(isSnakeSpecies)
    .map((item) => item.id)
    .filter((id) => available.some((item) => item.id === id));

  const ranked = available
    .map((item) => {
      let score = 0;
      if (lookalikes.has(item.id)) score += 80;
      if (related.includes(item.id)) score += 40;
      const correct = pool.find((entry) => entry.id === correctId);
      if (correct) {
        if (item.genus === correct.genus) score += 100;
        if (item.family === correct.family) score += 35;
      }
      return { id: item.id, score };
    })
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));

  const top = ranked.slice(0, Math.min(ranked.length, Math.max(count + 3, 6)));
  return shuffle(top, rng)
    .slice(0, count)
    .map((item) => item.id);
}

function idsForDifficulty(
  difficulty: QuizDifficulty,
  pool: SnakeQuizSpecies[],
) {
  const preferred = POOL_BY_DIFFICULTY[difficulty];
  const fromPool = preferred.filter((id) => pool.some((item) => item.id === id));
  if (fromPool.length >= 2) return fromPool;
  return pool.map((item) => item.id);
}

function takeUnique(
  source: string[],
  count: number,
  used: Set<string>,
  rng: () => number,
) {
  const picked: string[] = [];
  for (const id of shuffle(source, rng)) {
    if (used.has(id)) continue;
    picked.push(id);
    used.add(id);
    if (picked.length >= count) break;
  }
  return picked;
}

export function generateSnakeQuiz(
  pool: SnakeQuizSpecies[],
  options?: {
    mode?: QuizMode;
    difficulty?: QuizDifficulty;
    length?: number;
    rng?: () => number;
  },
): SnakeQuizQuestion[] {
  const rng = options?.rng ?? Math.random;
  const length = options?.length ?? QUIZ_LENGTH;
  const byId = catalogById(pool);
  if (pool.length < QUIZ_OPTION_COUNT) return [];

  const used = new Set<string>();
  const selected: Array<{ id: string; difficulty: QuizDifficulty }> = [];

  if (options?.difficulty) {
    const ids = takeUnique(
      idsForDifficulty(options.difficulty, pool),
      length,
      used,
      rng,
    );
    for (const id of ids) {
      selected.push({ id, difficulty: options.difficulty });
    }
  } else {
    const mix = DEFAULT_QUIZ_MIX;
    (Object.keys(mix) as QuizDifficulty[]).forEach((difficulty) => {
      const ids = takeUnique(
        idsForDifficulty(difficulty, pool),
        mix[difficulty],
        used,
        rng,
      );
      for (const id of ids) selected.push({ id, difficulty });
    });
  }

  if (selected.length < length) {
    const fallback = takeUnique(
      pool.map((item) => item.id),
      length - selected.length,
      used,
      rng,
    );
    for (const id of fallback) {
      selected.push({ id, difficulty: options?.difficulty ?? "medium" });
    }
  }

  return shuffle(selected, rng)
    .slice(0, length)
    .flatMap(({ id, difficulty }) => {
      const species = byId.get(id);
      if (!species) return [];
      const distractors = pickSnakeDistractors(id, pool, QUIZ_OPTION_COUNT - 1, rng);
      if (distractors.length < QUIZ_OPTION_COUNT - 1) return [];
      const optionIds = shuffle([id, ...distractors], rng);
      return [
        {
          speciesId: id,
          image: species.image,
          imageCredit: species.imageCredit,
          correctId: id,
          optionIds,
          difficulty,
          explanation: species.explanation,
        },
      ];
    });
}
