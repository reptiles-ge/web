"use client";

import { type RefObject } from "react";

import type {
  QuizDifficulty,
  SnakeQuizQuestion,
  SnakeQuizSpecies,
} from "@/lib/snakeQuizEngine";

import { useQuizCopy } from "@/components/QuizCopyContext";
import { QuizIntroOverlay } from "@/components/QuizIntroOverlay";
import { QuizResultOverlay } from "@/components/QuizResultOverlay";
import { QuizRound } from "@/components/QuizRound";

type Answered = {
  correct: boolean;
  selectedId: string;
};

type QuizStagePanelProps = {
  answers: Answered[];
  byId: Map<string, SnakeQuizSpecies>;
  complete: boolean;
  correctCount: number;
  correctSpecies: SnakeQuizSpecies | undefined;
  feedbackRef: RefObject<HTMLParagraphElement | null>;
  headingId: string;
  hintedQuestions: RefObject<Set<number>>;
  hintOpen: boolean;
  index: number;
  nextLabel: string;
  onHintToggle: (open: boolean) => void;
  onNext: () => void;
  onRestart: () => void;
  onSelect: (optionId: string, difficulty: QuizDifficulty) => void;
  onStart: () => void;
  optionRefs: RefObject<Array<HTMLButtonElement | null>>;
  playing: boolean;
  question: SnakeQuizQuestion | undefined;
  questions: null | SnakeQuizQuestion[];
  quizId: string;
  revealed: boolean;
  selectedId: null | string;
  shareUrl: string;
  total: number;
};

export function QuizStagePanel({
  answers,
  byId,
  complete,
  correctCount,
  correctSpecies,
  feedbackRef,
  headingId,
  hintedQuestions,
  hintOpen,
  index,
  nextLabel,
  onHintToggle,
  onNext,
  onRestart,
  onSelect,
  onStart,
  optionRefs,
  playing,
  question,
  questions,
  quizId,
  revealed,
  selectedId,
  shareUrl,
  total,
}: QuizStagePanelProps) {
  const t = useQuizCopy();

  if (!playing) {
    return <QuizIntroOverlay headingId={headingId} onStart={onStart} />;
  }
  if (complete && questions) {
    return (
      <QuizResultOverlay
        answers={answers}
        byId={byId}
        correctCount={correctCount}
        headingId={headingId}
        onRestart={onRestart}
        questions={questions}
        quizId={quizId}
        shareUrl={shareUrl}
        total={total}
      />
    );
  }
  if (!question || !correctSpecies) {
    return <p className="text-white/70">{t("loading")}</p>;
  }
  return (
    <QuizRound
      byId={byId}
      correctSpecies={correctSpecies}
      feedbackRef={feedbackRef}
      headingId={headingId}
      hintedQuestions={hintedQuestions}
      hintOpen={hintOpen}
      index={index}
      nextLabel={nextLabel}
      onHintToggle={onHintToggle}
      onNext={onNext}
      onSelect={onSelect}
      optionRefs={optionRefs}
      question={question}
      quizId={quizId}
      revealed={revealed}
      selectedId={selectedId}
      total={total}
    />
  );
}
