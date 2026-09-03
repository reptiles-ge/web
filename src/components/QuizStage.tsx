"use client";

import { useTranslations } from "next-intl";
import { type RefObject } from "react";

import { QuizIntroOverlay } from "@/components/QuizIntroOverlay";
import { QuizResultOverlay } from "@/components/QuizResultOverlay";
import { QuizRound } from "@/components/QuizRound";
import { cn } from "@/lib/cn";
import type {
  QuizDifficulty,
  SnakeQuizQuestion,
  SnakeQuizSpecies,
} from "@/lib/snakeQuiz";

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
  hintOpen: boolean;
  hintedQuestions: RefObject<Set<number>>;
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
  hintOpen,
  hintedQuestions,
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
      {nextQuestion?.mobileImage &&
      nextQuestion.mobileImage !== nextQuestion.image ? (
        <link
          as="image"
          href={nextQuestion.mobileImage}
          media="(max-width: 1023px)"
          rel="preload"
        />
      ) : null}
      {nextQuestion?.image ? (
        <link
          as="image"
          href={nextQuestion.image}
          media={
            nextQuestion.mobileImage &&
            nextQuestion.mobileImage !== nextQuestion.image
              ? "(min-width: 1024px)"
              : undefined
          }
          rel="preload"
        />
      ) : null}
      <div className="absolute inset-0 overflow-hidden">
        {coverSrc ? (
          <picture
            className="media-placeholder absolute inset-0 block size-full"
            key={coverKey}
          >
            {coverMobileSrc && coverMobileSrc !== coverSrc ? (
              <source media="(min-width: 1024px)" srcSet={coverSrc} />
            ) : null}
            <img
              alt={
                playing && revealed && correctSpecies
                  ? correctSpecies.imageAlt
                  : t("imageAltHidden")
              }
              className="hero-drift size-full object-cover text-transparent"
              decoding="async"
              fetchPriority={!playing ? "high" : "auto"}
              src={
                coverMobileSrc && coverMobileSrc !== coverSrc
                  ? coverMobileSrc
                  : coverSrc
              }
            />
          </picture>
        ) : null}
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/20 to-black/85" />
        <div className="absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_20%,transparent_20%,rgba(0,0,0,0.55)_100%)]" />
      </div>

      <div
        className={cn(
          "relative z-10 mx-auto flex w-full max-w-[1400px] flex-col px-5 pt-24 sm:px-8 sm:pt-28 lg:px-10",
          playing && !complete
            ? revealed
              ? "min-h-dvh pb-[calc(8.25rem+env(safe-area-inset-bottom))] sm:pb-[max(2rem,env(safe-area-inset-bottom))]"
              : "min-h-dvh pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pb-10"
            : "pb-[max(1.25rem,env(safe-area-inset-bottom))]",
        )}
      >
        {!playing ? (
          <QuizIntroOverlay headingId={headingId} onStart={onStart} />
        ) : complete && questions ? (
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
        ) : !question ? (
          <p className="text-white/70">{t("loading")}</p>
        ) : correctSpecies ? (
          <QuizRound
            byId={byId}
            correctSpecies={correctSpecies}
            feedbackRef={feedbackRef}
            headingId={headingId}
            hintOpen={hintOpen}
            hintedQuestions={hintedQuestions}
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
        ) : (
          <p className="text-white/70">{t("loading")}</p>
        )}
      </div>
    </section>
  );
}
