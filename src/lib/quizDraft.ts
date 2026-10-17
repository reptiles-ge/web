"use client";

import { type Dispatch, useEffect, useRef, useState } from "react";

import type {
  SnakeQuizQuestion,
  SnakeQuizSpecies,
} from "@/lib/snakeQuizEngine";

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

export function isRestorableDraft(
  draft: QuizDraft,
  byId: Map<string, SnakeQuizSpecies>,
) {
  const { answers, index, questions, selectedId } = draft;
  if (!Array.isArray(questions) || questions.length === 0) return false;
  if (!Number.isInteger(index) || index < 0 || index >= questions.length) {
    return false;
  }
  if (!Array.isArray(answers) || answers.length > questions.length) {
    return false;
  }
  const valid = questions.every(
    (question) =>
      byId.has(question.correctId) &&
      Array.isArray(question.optionIds) &&
      question.optionIds.includes(question.correctId) &&
      question.optionIds.every((id) => byId.has(id)),
  );
  return (
    valid &&
    (selectedId == null || questions[index].optionIds.includes(selectedId))
  );
}

export function useQuizDraft(
  quizId: string,
  byId: Map<string, SnakeQuizSpecies>,
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
  const quizIdRef = useRef(quizId);
  const byIdRef = useRef(byId);
  const [draftReady, setDraftReady] = useState(false);
  const { answers, complete, hintOpen, index, playing, questions, selectedId } =
    session;

  useEffect(() => {
    quizIdRef.current = quizId;
    byIdRef.current = byId;
  }, [byId, quizId]);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const key = draftKey(quizIdRef.current);
        const raw = sessionStorage.getItem(key);
        if (raw) {
          const draft = JSON.parse(raw) as QuizDraft;
          if (isRestorableDraft(draft, byIdRef.current)) {
            dispatch({ draft, type: "restore" });
          } else {
            sessionStorage.removeItem(key);
          }
        }
      } catch {
        return;
      } finally {
        setDraftReady(true);
      }
    });
  }, [dispatch]);

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
