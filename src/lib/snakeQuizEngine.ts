import type { PhotoCredit } from "@/data/speciesTypes";

export type QuizDifficulty = "easy" | "hard" | "medium";
export type QuizMode = "default";

export const QUIZ_LENGTH = 10;
export const QUIZ_OPTION_COUNT = 4;

export const SCORE_BANDS = [
  { messageKey: "scoreExcellent", minPercent: 90 },
  { messageKey: "scoreGreat", minPercent: 70 },
  { messageKey: "scoreGood", minPercent: 50 },
  { messageKey: "scoreKeepGoing", minPercent: 0 },
] as const;

export type ScoreMessageKey = (typeof SCORE_BANDS)[number]["messageKey"];

export const DEFAULT_QUIZ_MIX: Record<QuizDifficulty, number> = {
  easy: 4,
  hard: 2,
  medium: 4,
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
  hard: HARD_SNAKE_IDS,
  medium: MEDIUM_SNAKE_IDS,
};

export const EASY_LIZARD_IDS = [
  "ablepharus-pannonicus",
  "anguis-colchica",
  "eumeces-schneiderii",
  "lacerta-agilis",
  "lacerta-strigata",
  "paralaudakia-caucasia",
  "pseudopus-apodus",
  "tenuidactylus-caspius",
] as const;

export const MEDIUM_LIZARD_IDS = [
  "eremias-arguta",
  "eremias-velox",
  "lacerta-media",
  "ophisops-elegans",
  "phoenicolacerta-laevis",
] as const;

export const HARD_LIZARD_IDS = [
  "darevskia-adjarica",
  "darevskia-alpina",
  "darevskia-armeniaca",
  "darevskia-brauneri",
  "darevskia-caucasica",
  "darevskia-clarkorum",
  "darevskia-daghestanica",
  "darevskia-dahli",
  "darevskia-derjugini",
  "darevskia-mixta",
  "darevskia-obscura",
  "darevskia-pontica",
  "darevskia-portschinskii",
  "darevskia-praticola",
  "darevskia-raddei",
  "darevskia-valentini",
] as const;

const LIZARD_POOL_BY_DIFFICULTY: Record<QuizDifficulty, readonly string[]> = {
  easy: EASY_LIZARD_IDS,
  hard: HARD_LIZARD_IDS,
  medium: MEDIUM_LIZARD_IDS,
};

export type SnakeQuizQuestion = {
  correctId: string;
  difficulty: QuizDifficulty;
  explanation: string;
  image: string;
  imageCredit?: PhotoCredit;
  mobileImage?: string;
  optionIds: string[];
  speciesId: string;
};

export type SnakeQuizSpecies = {
  commonName: string;
  explanation: string;
  family: string;
  genus: string;
  hint: string;
  id: string;
  image: string;
  imageAlt: string;
  imageCredit?: PhotoCredit;
  lookalikeIds: string[];
  mobileImage?: string;
  relatedIds: string[];
  scientificName: string;
};

export function generateLizardQuiz(
  pool: SnakeQuizSpecies[],
  options?: {
    difficulty?: QuizDifficulty;
    length?: number;
    mode?: QuizMode;
    rng?: () => number;
  },
) {
  return generateSnakeQuiz(pool, {
    ...options,
    pools: LIZARD_POOL_BY_DIFFICULTY,
  });
}

export function generateSnakeQuiz(
  pool: SnakeQuizSpecies[],
  options?: {
    difficulty?: QuizDifficulty;
    length?: number;
    mode?: QuizMode;
    pools?: Record<QuizDifficulty, readonly string[]>;
    rng?: () => number;
  },
): SnakeQuizQuestion[] {
  const rng = options?.rng ?? Math.random;
  const length = options?.length ?? QUIZ_LENGTH;
  const difficultyPools = options?.pools ?? POOL_BY_DIFFICULTY;
  const byId = catalogById(pool);
  if (pool.length < QUIZ_OPTION_COUNT) return [];

  const used = new Set<string>();
  const selected: Array<{ difficulty: QuizDifficulty; id: string }> = [];

  if (options?.difficulty) {
    const ids = takeUnique(
      idsForDifficulty(options.difficulty, pool, difficultyPools),
      length,
      used,
      rng,
    );
    for (const id of ids) {
      selected.push({ difficulty: options.difficulty, id });
    }
  } else {
    const mix = DEFAULT_QUIZ_MIX;
    (Object.keys(mix) as QuizDifficulty[]).forEach((difficulty) => {
      const ids = takeUnique(
        idsForDifficulty(difficulty, pool, difficultyPools),
        mix[difficulty],
        used,
        rng,
      );
      for (const id of ids) selected.push({ difficulty, id });
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
      selected.push({ difficulty: options?.difficulty ?? "medium", id });
    }
  }

  return shuffle(selected, rng)
    .slice(0, length)
    .flatMap(({ difficulty, id }) => {
      const species = byId.get(id);
      if (!species) return [];
      const distractors = pickSnakeDistractors(
        id,
        pool,
        QUIZ_OPTION_COUNT - 1,
        rng,
      );
      if (distractors.length < QUIZ_OPTION_COUNT - 1) return [];
      const optionIds = shuffle([id, ...distractors], rng);
      return [
        {
          correctId: id,
          difficulty,
          explanation: species.explanation,
          image: species.image,
          imageCredit: species.imageCredit,
          mobileImage: species.mobileImage,
          optionIds,
          speciesId: id,
        },
      ];
    });
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

  const availableIds = new Set(available.map((item) => item.id));
  const correct = pool.find((entry) => entry.id === correctId);
  const lookalikes = new Set(correct?.lookalikeIds ?? []);
  const related = new Set(
    (correct?.relatedIds ?? []).filter((id) => availableIds.has(id)),
  );

  const ranked = available
    .map((item) => {
      let score = 0;
      if (lookalikes.has(item.id)) score += 80;
      if (related.has(item.id)) score += 40;
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

export function scoreMessageKey(percent: number): ScoreMessageKey {
  const band = SCORE_BANDS.find((item) => percent >= item.minPercent);
  return band?.messageKey ?? "scoreKeepGoing";
}

export function scorePercent(correct: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((correct / total) * 100);
}

function catalogById(pool: SnakeQuizSpecies[]) {
  return new Map(pool.map((item) => [item.id, item]));
}

function idsForDifficulty(
  difficulty: QuizDifficulty,
  pool: SnakeQuizSpecies[],
  pools: Record<QuizDifficulty, readonly string[]> = POOL_BY_DIFFICULTY,
) {
  const preferred = pools[difficulty];
  const fromPool = preferred.filter((id) =>
    pool.some((item) => item.id === id),
  );
  if (fromPool.length >= 2) return fromPool;
  return pool.map((item) => item.id);
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
