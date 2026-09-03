"use client";

import { useTranslations } from "next-intl";
import { type RefObject } from "react";

import type {
  QuizDifficulty,
  SnakeQuizQuestion,
  SnakeQuizSpecies,
} from "@/lib/snakeQuiz";

import { QuizCover } from "@/components/QuizCover";
import { QuizStagePanel } from "@/components/QuizStagePanel";
import { cn } from "@/lib/cn";

type Answered = {
  correct: boolean;
  selectedId: string;
};

type QuizStageProps = {
  answers: Answered[];
  byId: Map<string, SnakeQuizSpecies>;
  complete: boolean;
  correctCount: number;
  correctSpecies: SnakeQuizSpecies | undefined;
  coverKey: string;
  coverMobileSrc: string | undefined;
  coverSrc: string | undefined;
  feedbackRef: RefObject<HTMLParagraphElement | null>;
  headingId: string;
  hintedQuestions: RefObject<Set<number>>;
  hintOpen: boolean;
  index: number;
  nextLabel: string;
  nextQuestion: SnakeQuizQuestion | undefined;
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

export function QuizStage({
  answers,
  byId,
  complete,
  correctCount,
  correctSpecies,
  coverKey,
  coverMobileSrc,
  coverSrc,
  feedbackRef,
  headingId,
  hintedQuestions,
  hintOpen,
  index,
  nextLabel,
  nextQuestion,
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
}: QuizStageProps) {
  const t = useTranslations("snakeQuiz");

  return (
    <section
      aria-labelledby={headingId}
      className="relative isolate min-h-dvh bg-ink"
    >
      <QuizCover
        coverKey={coverKey}
        coverMobileSrc={coverMobileSrc}
        coverSrc={coverSrc}
        correctSpecies={correctSpecies}
        hiddenAlt={t("imageAltHidden")}
        nextQuestion={nextQuestion}
        playing={playing}
        revealed={revealed}
      />

      <div
        className={cn(
          "relative z-10 mx-auto flex w-full max-w-[1400px] flex-col px-5 pt-24 sm:px-8 sm:pt-28 lg:px-10",
          stagePadClass(playing, complete, revealed),
        )}
      >
        <QuizStagePanel
          answers={answers}
          byId={byId}
          complete={complete}
          correctCount={correctCount}
          correctSpecies={correctSpecies}
          feedbackRef={feedbackRef}
          headingId={headingId}
          hintedQuestions={hintedQuestions}
          hintOpen={hintOpen}
          index={index}
          nextLabel={nextLabel}
          onHintToggle={onHintToggle}
          onNext={onNext}
          onRestart={onRestart}
          onSelect={onSelect}
          onStart={onStart}
          optionRefs={optionRefs}
          playing={playing}
          question={question}
          questions={questions}
          quizId={quizId}
          revealed={revealed}
          selectedId={selectedId}
          shareUrl={shareUrl}
          total={total}
        />
      </div>
    </section>
  );
}

function stagePadClass(
  playing: boolean,
  complete: boolean,
  revealed: boolean,
) {
  if (!playing || complete) {
    return "pb-[max(1.25rem,env(safe-area-inset-bottom))]";
  }
  if (revealed) {
    return "min-h-dvh pb-[calc(8.25rem+env(safe-area-inset-bottom))] sm:pb-[max(2rem,env(safe-area-inset-bottom))]";
  }
  return "min-h-dvh pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pb-10";
}
