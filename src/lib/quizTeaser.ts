import type { PhotoCredit } from "@/data/speciesTypes";
import type { AppLocale } from "@/i18n/routing";

import { getCatalogSpecies, getSpeciesById } from "@/data/species";
import { localizeSpecies } from "@/i18n/localizeSpecies";
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

export function getQuizTeaserId(speciesId: string): null | QuizTeaserId {
  const species = getSpeciesById(speciesId);
  if (!species) return null;
  if (isSnakeSpecies(species)) return "snake";
  if (isLizardSpecies(species)) return "lizard";
  return null;
}

export function getSpeciesQuizTeaser(
  speciesId: string,
  locale: AppLocale,
): null | QuizTeaser {
  const quizId = getQuizTeaserId(speciesId);
  if (!quizId) return null;

  const optionIds = quizTeaserOptionIds(speciesId, quizId);
  if (!optionIds) return null;

  const options: QuizTeaserOption[] = [];
  for (const id of optionIds.options) {
    const raw = getSpeciesById(id);
    if (!raw) return null;
    const item = localizeSpecies(raw, locale);
    options.push({
      commonName: item.commonName,
      id,
      scientificName: item.scientificName,
    });
  }

  const correctRaw = getSpeciesById(optionIds.correctId);
  if (!correctRaw) return null;
  const correct = toSnakeQuizSpecies(localizeSpecies(correctRaw, locale));

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

export function quizTeaserOptionIds(speciesId: string, quizId: QuizTeaserId) {
  const catalog = getCatalogSpecies();
  const pool =
    quizId === "snake"
      ? getSnakeQuizCatalog(catalog)
      : getLizardQuizCatalog(catalog);
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
      .map((id) => ({ id, order: hashString(`${speciesId}:${id}`) }))
      .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
      .map((item) => item.id),
  };
}

function hashString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function pickCorrectId(speciesId: string, pool: SnakeQuizSpecies[]) {
  const poolIds = new Set(pool.map((item) => item.id));
  const current = pool.find((item) => item.id === speciesId);
  const lookalikes = current?.lookalikeIds ?? [];
  const related = (current?.relatedIds ?? []).filter(
    (id) => !lookalikes.includes(id),
  );
  const preferred = [...related, ...lookalikes].find(
    (id) => id !== speciesId && poolIds.has(id),
  );
  if (preferred) return preferred;

  const others = pool.filter((item) => item.id !== speciesId);
  if (others.length === 0) return null;
  return others[hashString(speciesId) % others.length].id;
}

function seededRandom(seed: string) {
  let state = hashString(seed) || 1;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let next = Math.imul(state ^ (state >>> 15), 1 | state);
    next = (next + Math.imul(next ^ (next >>> 7), 61 | next)) ^ next;
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}
