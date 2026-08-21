import assert from "node:assert/strict";
import { test } from "node:test";
import {
  getCatalogSpecies,
  unpublishedSpeciesIds,
} from "../data/species";
import { localizeSpecies } from "../i18n/localizeSpecies";
import { isSnakeSpecies } from "./clusterGuides";
import {
  generateSnakeQuiz,
  getSnakeQuizCatalog,
  pickSnakeDistractors,
  QUIZ_OPTION_COUNT,
} from "./snakeQuiz";

function rngFrom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function snakePool() {
  return getSnakeQuizCatalog(
    getCatalogSpecies().map((item) => localizeSpecies(item, "en")),
  );
}

test("getSnakeQuizCatalog only includes published snakes with photos", () => {
  const pool = snakePool();
  assert.ok(pool.length >= QUIZ_OPTION_COUNT);
  const ids = pool.map((item) => item.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(!ids.includes("dolichophis-caspius"));
  assert.ok(!ids.includes("pseudopus-apodus"));
  assert.ok(!ids.includes("vipera-ammodytes"));
  for (const id of unpublishedSpeciesIds) {
    assert.ok(!ids.includes(id));
  }
  const catalog = getCatalogSpecies().map((item) =>
    localizeSpecies(item, "en"),
  );
  const withLizard = getSnakeQuizCatalog([
    ...catalog,
    catalog.find((item) => item.id === "pseudopus-apodus") ?? catalog[0]!,
  ]);
  assert.ok(!withLizard.some((item) => item.id === "pseudopus-apodus"));
  assert.ok(catalog.some((item) => isSnakeSpecies(item)));
});

test("generateSnakeQuiz returns unique species, four options, correctId in options", () => {
  const pool = snakePool();
  const questions = generateSnakeQuiz(pool, { rng: rngFrom(42) });
  assert.equal(questions.length, 10);
  const speciesIds = questions.map((item) => item.speciesId);
  assert.equal(new Set(speciesIds).size, speciesIds.length);
  for (const question of questions) {
    assert.equal(question.optionIds.length, QUIZ_OPTION_COUNT);
    assert.equal(new Set(question.optionIds).size, QUIZ_OPTION_COUNT);
    assert.equal(question.correctId, question.speciesId);
    assert.ok(question.optionIds.includes(question.correctId));
  }
});

test("pickSnakeDistractors prefers same genus and lookalikes", () => {
  const pool = snakePool();
  const distractors = pickSnakeDistractors(
    "vipera-kaznakovi",
    pool,
    3,
    () => 0,
  );
  assert.equal(distractors.length, 3);
  assert.ok(!distractors.includes("vipera-kaznakovi"));
  const byId = new Map(pool.map((item) => [item.id, item]));
  const genera = distractors.map((id) => byId.get(id)?.genus);
  assert.ok(genera.includes("Vipera"));
  const preferred = new Set([
    "vipera-dinniki",
    "vipera-transcaucasiana",
    "natrix-natrix",
    "coronella-austriaca",
  ]);
  assert.ok(distractors.some((id) => preferred.has(id)));
});
