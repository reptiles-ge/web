import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type {
  SnakeQuizQuestion,
  SnakeQuizSpecies,
} from "@/lib/snakeQuizEngine";

import {
  draftKey,
  isRestorableDraft,
  type QuizDraft,
  useQuizDraft,
} from "@/lib/quizDraft";

const ids = ["a", "b", "c", "d"];
const byId = new Map(
  ids.map((id) => [id, { id } as unknown as SnakeQuizSpecies]),
);

function draft(overrides: Partial<QuizDraft> = {}): QuizDraft {
  return {
    answers: [],
    hintOpen: false,
    index: 0,
    questions: [question(), question({ correctId: "b", speciesId: "b" })],
    selectedId: null,
    ...overrides,
  };
}

function question(overrides: Partial<SnakeQuizQuestion> = {}) {
  return {
    correctId: "a",
    difficulty: "easy",
    explanation: "",
    image: "",
    optionIds: ids,
    speciesId: "a",
    ...overrides,
  } as SnakeQuizQuestion;
}

const idle = {
  answers: [],
  complete: false,
  hintOpen: false,
  index: 0,
  playing: false,
  questions: null,
  selectedId: null,
};

describe("isRestorableDraft", () => {
  it("accepts a draft that fits the current pool", () => {
    expect(isRestorableDraft(draft({ index: 1, selectedId: "c" }), byId)).toBe(
      true,
    );
  });

  it.each([
    ["no questions", draft({ questions: [] })],
    ["an index past the end", draft({ index: 2 })],
    ["a negative index", draft({ index: -1 })],
    ["a fractional index", draft({ index: 0.5 })],
    [
      "more answers than questions",
      draft({
        answers: [0, 1, 2].map(() => ({ correct: true, selectedId: "a" })),
      }),
    ],
    [
      "a removed correct species",
      draft({ questions: [question({ correctId: "x" })] }),
    ],
    [
      "a removed option",
      draft({ questions: [question({ optionIds: ["a", "b", "c", "x"] })] }),
    ],
    [
      "options without the answer",
      draft({
        questions: [question({ correctId: "a", optionIds: ["b", "c", "d"] })],
      }),
    ],
    ["a selection outside the options", draft({ selectedId: "x" })],
  ])("rejects %s", (_, value) => {
    expect(isRestorableDraft(value, byId)).toBe(false);
  });
});

describe("useQuizDraft", () => {
  beforeEach(() => sessionStorage.clear());

  it("restores a valid draft", async () => {
    const saved = draft({ index: 1 });
    sessionStorage.setItem(draftKey("snake"), JSON.stringify(saved));
    const dispatch = vi.fn();
    renderHook(() => useQuizDraft("snake", byId, dispatch, idle));
    await waitFor(() =>
      expect(dispatch).toHaveBeenCalledWith({ draft: saved, type: "restore" }),
    );
  });

  it("discards a stale draft instead of restoring it", async () => {
    sessionStorage.setItem(
      draftKey("snake"),
      JSON.stringify(draft({ questions: [question({ correctId: "gone" })] })),
    );
    const dispatch = vi.fn();
    renderHook(() => useQuizDraft("snake", byId, dispatch, idle));
    await waitFor(() =>
      expect(sessionStorage.getItem(draftKey("snake"))).toBeNull(),
    );
    expect(dispatch).not.toHaveBeenCalled();
  });

  it("saves the session while a round is in progress", async () => {
    const session = { ...idle, playing: true, questions: draft().questions };
    renderHook(() => useQuizDraft("lizard", byId, vi.fn(), session));
    await waitFor(() =>
      expect(
        JSON.parse(sessionStorage.getItem(draftKey("lizard")) ?? "null"),
      ).toEqual(draft()),
    );
  });
});
