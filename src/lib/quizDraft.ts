"use client";

import { type Dispatch, useEffect, useState } from "react";

import type { SnakeQuizQuestion } from "@/lib/snakeQuiz";

export type QuizDraft = {
  answers: Answered[];
  hintOpen: boolean;
  index: number;
  questions: SnakeQuizQuestion[];
  selectedId: null | string;
};

type Answered = {
  correct: boolean;
  selectedId: string;
};

type RestoreAction = { draft: QuizDraft; type: "restore" };

export function draftKey(quizId: string) {
  return `reptiles.quiz.draft.${quizId}`;
}

export function useQuizDraft(
  quizId: string,
  dispatch: Dispatch<RestoreAction>,
  session: {
    answers: Answered[];
    complete: boolean;
    hintOpen: boolean;
    index: number;
    playing: boolean;
    questions: null | SnakeQuizQuestion[];
    selectedId: null | string;
  },
) {
  const [draftReady, setDraftReady] = useState(false);
  const { answers, complete, hintOpen, index, playing, questions, selectedId } =
    session;

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(draftKey(quizId));
      if (!raw) return;
      const draft = JSON.parse(raw) as QuizDraft;
      if (!Array.isArray(draft.questions) || draft.questions.length === 0) {
        return;
      }
      dispatch({ draft, type: "restore" });
    } catch {
      return;
    } finally {
      setDraftReady(true);
    }
  }, [dispatch, quizId]);

  useEffect(() => {
    if (!draftReady) return;
    if (!playing || complete || !questions) {
      sessionStorage.removeItem(draftKey(quizId));
      return;
    }
    const draft: QuizDraft = {
      answers,
      hintOpen,
      index,
      questions,
      selectedId,
    };
    sessionStorage.setItem(draftKey(quizId), JSON.stringify(draft));
  }, [
    answers,
    complete,
    draftReady,
    hintOpen,
    index,
    playing,
    questions,
    quizId,
    selectedId,
  ]);
}
