import { type PhotoCredit, type Species } from "@/data/species";
import { isLizardSpecies, isSnakeSpecies } from "@/lib/clusterGuides";
import { stripSpeciesInlineLinks } from "@/lib/speciesInlineLinks";
import { speciesImageAlt } from "@/lib/speciesMeta";
import { getRelatedSpecies } from "@/lib/speciesRelated";
import { getSpeciesLookalikes } from "@/lib/speciesRoutes";

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
  mobileImage?: string;
  scientificName: string;
};

export function scoreMessageKey(percent: number): ScoreMessageKey {
  const band = SCORE_BANDS.find((item) => percent >= item.minPercent);
  return band?.messageKey ?? "scoreKeepGoing";
}

export function scorePercent(correct: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((correct / total) * 100);
}

const QUIZ_IMAGE_OVERRIDES: Record<string, string> = {
  "vipera-kaznakovi": "https://cdn.reptiles.ge/vipera-kaznakovi-sandro-1.jpg",
  "vipera-transcaucasiana":
    "https://cdn.reptiles.ge/vipera-transcaucasiana-2.jpg",
  "zamenis-longissimus": "https://cdn.reptiles.ge/zamenis-longissimus-4.jpg",
};

const QUIZ_MOBILE_IMAGE_OVERRIDES: Record<string, string> = {
  "dolichophis-schmidti": "https://cdn.reptiles.ge/dolichophis-schmidti-3.webp",
  "eirenis-modestus": "https://cdn.reptiles.ge/eirenis-modestus-mobile.jpg",
  "elaphe-urartica": "https://cdn.reptiles.ge/elaphe-urartica-mobile.webp",
  "eryx-jaculus": "https://cdn.reptiles.ge/eryx-jaculus-ioane-1.jpg",
  "malpolon-insignitus": "https://cdn.reptiles.ge/malpolon-insignitus-2.jpg",
  "natrix-natrix": "https://cdn.reptiles.ge/natrix-natrix-mobile.jpg",
  "vipera-darevskii": "https://cdn.reptiles.ge/vipera-darevskii-mobile.jpg",
  "vipera-dinniki": "https://cdn.reptiles.ge/vipera-cover-on-mobile.webp",
  "vipera-renardi": "https://cdn.reptiles.ge/vipera-renardi-2.jpg",
  "vipera-transcaucasiana":
    "https://cdn.reptiles.ge/vipera-transcaucasiana-mobile.webp",
  "zamenis-hohenackeri": "https://cdn.reptiles.ge/zamenis-hohenackeri-2.jpg",
};

const QUIZ_HINT_TRAIT_INDEX: Record<string, number> = {
  "eirenis-collaris": 1,
  "eirenis-modestus": 1,
  "vipera-dinniki": 1,
};

export function buildQuizHint(species: Species) {
  const all = species.identification?.traits ?? [];
  const preferredIndex = QUIZ_HINT_TRAIT_INDEX[species.id];
  const preferred =
    preferredIndex != null
      ? stripSpeciesInlineLinks(all[preferredIndex]?.trim() ?? "")
      : undefined;
  if (preferred && !spoilsAnswer(preferred, species)) return preferred;

  const traits = all.filter(
    (trait) => trait.trim() && !spoilsAnswer(trait, species),
  );
  const picked = (traits.length > 0 ? traits : all)
    .slice(0, 1)
    .map((trait) => stripSpeciesInlineLinks(trait.trim()))
    .filter(Boolean);
  if (picked.length > 0) return picked.join(" ");

  const habitat = species.stats.find((stat) =>
    /ჰაბიტატი|habitat/i.test(stat.label),
  )?.value;
  if (habitat) return habitat;
  return species.location;
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
      idsForDifficulty(options.difficulty, pool),
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
        idsForDifficulty(difficulty, pool),
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

export function getSnakeQuizCatalog(species: Species[]): SnakeQuizSpecies[] {
  const catalog: SnakeQuizSpecies[] = [];
  for (const item of species) {
    if (isSnakeSpecies(item) && Boolean(item.image)) {
      catalog.push(toSnakeQuizSpecies(item));
    }
  }
  return catalog;
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
  const availableIds = new Set(available.map((item) => item.id));
  const related = new Set<string>();
  for (const item of getRelatedSpecies(correctId, 8)) {
    if (isSnakeSpecies(item) && availableIds.has(item.id)) {
      related.add(item.id);
    }
  }
  const correct = pool.find((entry) => entry.id === correctId);

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

export function toSnakeQuizSpecies(species: Species): SnakeQuizSpecies {
  const explanation = stripSpeciesInlineLinks(
    species.identification?.summary?.trim() ||
      species.facts[0]?.trim() ||
      species.description.trim(),
  );
  const overrideSrc = QUIZ_IMAGE_OVERRIDES[species.id];
  const overridePhoto = overrideSrc
    ? species.gallery.find((item) => item.src === overrideSrc)
    : undefined;
  const image = overridePhoto?.src ?? species.image;
  const mobileOverride = QUIZ_MOBILE_IMAGE_OVERRIDES[species.id];
  const mobileImage =
    mobileOverride && mobileOverride !== image ? mobileOverride : undefined;

  return {
    commonName: species.commonName,
    explanation,
    family: species.family,
    genus: species.genus,
    hint: buildQuizHint(species),
    id: species.id,
    image,
    imageAlt: speciesImageAlt(
      species.commonName,
      species.scientificName,
      species.location,
    ),
    imageCredit: overridePhoto?.credit ?? species.imageCredit,
    mobileImage,
    scientificName: species.scientificName,
  };
}

function catalogById(pool: SnakeQuizSpecies[]) {
  return new Map(pool.map((item) => [item.id, item]));
}

function idsForDifficulty(
  difficulty: QuizDifficulty,
  pool: SnakeQuizSpecies[],
) {
  const preferred = POOL_BY_DIFFICULTY[difficulty];
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

function spoilsAnswer(text: string, species: Species) {
  const haystack = stripSpeciesInlineLinks(text).toLowerCase();
  for (const item of [
    species.commonName,
    species.scientificName,
    ...species.scientificName.split(/\s+/),
  ]) {
    const needle = item.trim().toLowerCase();
    if (needle.length > 3 && haystack.includes(needle)) return true;
  }
  return false;
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
