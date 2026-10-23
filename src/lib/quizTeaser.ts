import type { CatalogQuizSpecies } from "@/data/speciesCatalogTypes";
import type { PhotoCredit, SpeciesSummary } from "@/data/speciesTypes";
import type { AppLocale } from "@/i18n/routing";

import { isLizardSpecies, isSnakeSpecies } from "@/lib/clusterGuides";
import {
  getLizardQuizCatalog,
  getSnakeQuizCatalog,
  toSnakeQuizSpecies,
} from "@/lib/snakeQuiz";
import {
  pickSnakeDistractors,
  QUIZ_OPTION_COUNT,
  type SnakeQuizSpecies,
} from "@/lib/snakeQuizEngine";
import { getSpeciesCatalog } from "@/lib/speciesCatalogApi";
import { stableHash } from "@/lib/stableHash";

export type QuizTeaser = {
  correctId: string;
  explanation: string;
  image: string;
  imageAlt: string;
  imageCredit?: PhotoCredit;
  options: QuizTeaserOption[];
  quizId: QuizTeaserId;
};

export type QuizTeaserId = "lizard" | "snake";

export type QuizTeaserOption = {
  commonName: string;
  id: string;
  scientificName: string;
};

export function getQuizTeaserId(
  species: Pick<SpeciesSummary, "genus" | "id">,
): null | QuizTeaserId {
  if (isSnakeSpecies(species)) return "snake";
  if (isLizardSpecies(species)) return "lizard";
  return null;
}

export async function getSpeciesQuizTeaser(
  speciesId: string,
  locale: AppLocale,
): Promise<null | QuizTeaser> {
  const catalog = await getSpeciesCatalog(locale, "quiz");
  const byId = new Map(catalog.map((item) => [item.id, item]));
  const species = byId.get(speciesId);
  const quizId = species ? getQuizTeaserId(species) : null;
  if (!quizId) return null;

  const optionIds = quizTeaserOptionIds(speciesId, quizId, catalog);
  if (!optionIds) return null;

  const options: QuizTeaserOption[] = [];
  for (const id of optionIds.options) {
    const item = byId.get(id);
    if (!item) return null;
    options.push({
      commonName: item.commonName,
      id,
      scientificName: item.scientificName,
    });
  }

  const correctItem = byId.get(optionIds.correctId);
  if (!correctItem) return null;
  const correct = toSnakeQuizSpecies(correctItem, catalog);

  return {
    correctId: correct.id,
    explanation: correct.explanation,
    image: correct.image,
    imageAlt: correct.imageAlt,
    imageCredit: correct.imageCredit,
    options,
    quizId,
  };
}

export function quizTeaserOptionIds(
  speciesId: string,
  quizId: QuizTeaserId,
  catalog: readonly CatalogQuizSpecies[],
) {
  const pool = getQuizPool(quizId, catalog);
  if (pool.length < QUIZ_OPTION_COUNT) return null;

  const correctId = pickCorrectId(speciesId, pool);
  if (!correctId) return null;

  const inPool = pool.some((item) => item.id === speciesId);
  const fixed = inPool ? [correctId, speciesId] : [correctId];
  const rng = seededRandom(speciesId);
  const distractors = pickSnakeDistractors(
    correctId,
    pool.filter((item) => item.id !== speciesId),
    QUIZ_OPTION_COUNT - fixed.length,
    rng,
  );
  const options = [...fixed, ...distractors];
  if (options.length !== QUIZ_OPTION_COUNT) return null;

  return {
    correctId,
    options: options
      .map((id) => ({ id, order: stableHash(`${speciesId}:${id}`) }))
      .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
      .map((item) => item.id),
  };
}

const quizPools = new WeakMap<
  readonly CatalogQuizSpecies[],
  Map<QuizTeaserId, SnakeQuizSpecies[]>
>();

function getQuizPool(
  quizId: QuizTeaserId,
  catalog: readonly CatalogQuizSpecies[],
) {
  let pools = quizPools.get(catalog);
  if (!pools) {
    pools = new Map();
    quizPools.set(catalog, pools);
  }
  const cached = pools.get(quizId);
  if (cached) return cached;
  const pool =
    quizId === "snake"
      ? getSnakeQuizCatalog(catalog)
      : getLizardQuizCatalog(catalog);
  pools.set(quizId, pool);
  return pool;
}

function pickCorrectId(speciesId: string, pool: SnakeQuizSpecies[]) {
  const poolIds = new Set(pool.map((item) => item.id));
  const current = pool.find((item) => item.id === speciesId);
  const lookalikes = current?.lookalikeIds ?? [];
  const lookalikeIds = new Set(lookalikes);
  const related = (current?.relatedIds ?? []).filter(
    (id) => !lookalikeIds.has(id),
  );
  const preferred = [...related, ...lookalikes].find(
    (id) => id !== speciesId && poolIds.has(id),
  );
  if (preferred) return preferred;

  const others = pool.filter((item) => item.id !== speciesId);
  if (others.length === 0) return null;
  return others[stableHash(speciesId) % others.length].id;
}

function seededRandom(seed: string) {
  let state = stableHash(seed) || 1;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let next = Math.imul(state ^ (state >>> 15), 1 | state);
    next = (next + Math.imul(next ^ (next >>> 7), 61 | next)) ^ next;
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}
