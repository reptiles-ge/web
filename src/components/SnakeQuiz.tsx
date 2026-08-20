"use client";

import { PhotoCreditCaption } from "@/components/PhotoCreditCaption";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { trackEvent } from "@/lib/analytics";
import { speciesImageAlt } from "@/lib/speciesMeta";
import { speciesHref } from "@/lib/speciesRoutes";
import {
  generateSnakeQuiz,
  QUIZ_LENGTH,
  scoreMessageKey,
  scorePercent,
  type QuizDifficulty,
  type SnakeQuizQuestion,
  type SnakeQuizSpecies,
} from "@/lib/snakeQuiz";
import { ArrowRight, RotateCcw } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

type SnakeQuizProps = {
  snakes: SnakeQuizSpecies[];
};

type Answered = {
  selectedId: string;
  correct: boolean;
};

function optionClass(state: {
  revealed: boolean;
  selected: boolean;
  correct: boolean;
}) {
  if (!state.revealed) {
    return "border-border bg-card text-foreground hover:border-primary/40 hover:bg-background";
  }
  if (state.correct) {
    return "border-primary bg-primary/10 text-foreground";
  }
  if (state.selected) {
    return "border-destructive bg-destructive/10 text-foreground";
  }
  return "border-border bg-card text-muted-foreground opacity-60";
}

export function SnakeQuiz({ snakes }: SnakeQuizProps) {
  const t = useTranslations("snakeQuiz");
  const locale = useLocale() as AppLocale;
  const headingId = useId();
  const byId = useMemo(
    () => new Map(snakes.map((item) => [item.id, item])),
    [snakes],
  );

  const [questions, setQuestions] = useState<SnakeQuizQuestion[] | null>(null);
  const started = useRef(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answered[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [complete, setComplete] = useState(false);

  const startRound = useCallback(
    (reason: "start" | "restart") => {
      const next = generateSnakeQuiz(snakes);
      setQuestions(next);
      setIndex(0);
      setAnswers([]);
      setSelectedId(null);
      setComplete(false);
      trackEvent(reason === "restart" ? "quiz_restarted" : "quiz_started", {
        length: next.length,
        mode: "default",
      });
    },
    [snakes],
  );

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    startRound("start");
  }, [startRound]);

  const question = questions?.[index];
  const revealed = selectedId !== null;
  const correctCount = answers.filter((item) => item.correct).length;
  const total = questions?.length ?? QUIZ_LENGTH;

  function onSelect(optionId: string, difficulty: QuizDifficulty) {
    if (!question || revealed) return;
    const correct = optionId === question.correctId;
    setSelectedId(optionId);
    setAnswers((current) => [...current, { selectedId: optionId, correct }]);
    trackEvent("quiz_answered", {
      question: index + 1,
      species: question.correctId,
      selected_answer: optionId,
      correct,
      difficulty,
    });
  }

  function onNext() {
    if (!questions) return;
    if (index + 1 >= questions.length) {
      const percent = scorePercent(
        answers.filter((item) => item.correct).length,
        questions.length,
      );
      setComplete(true);
      trackEvent("quiz_completed", {
        correct: answers.filter((item) => item.correct).length,
        incorrect:
          questions.length - answers.filter((item) => item.correct).length,
        total: questions.length,
        percent,
      });
      return;
    }
    setIndex((current) => current + 1);
    setSelectedId(null);
  }

  if (!questions || !question) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-6 text-muted-foreground">
        {t("loading")}
      </div>
    );
  }

  if (complete) {
    const percent = scorePercent(correctCount, total);
    const message = t(scoreMessageKey(percent));
    return (
      <section
        className="mx-auto w-full max-w-[1400px] px-6 py-10 lg:px-10 lg:py-16"
        aria-labelledby={headingId}
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
          {t("resultEyebrow")}
        </p>
        <h2
          id={headingId}
          className="mt-4 font-display text-[clamp(3rem,10vw,6rem)] font-semibold leading-none"
        >
          {correctCount} / {total}
        </h2>
        <p className="mt-3 text-[16px] text-muted-foreground">
          {t("percentLabel", { percent })}
        </p>
        <p className="mt-8 max-w-2xl text-[18px] leading-relaxed text-foreground sm:text-[20px]">
          {message}
        </p>
        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => startRound("restart")}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-[14px] font-medium text-background transition-opacity hover:opacity-90"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            {t("restart")}
          </button>
          <Link
            href="/snakes"
            onClick={() =>
              trackEvent("species_page_clicked", {
                source: "quiz_complete",
                target: "snakes_hub",
              })
            }
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border px-6 text-[14px] font-medium transition-colors hover:border-primary/40 hover:text-primary"
          >
            {t("discoverSnakes")}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    );
  }

  const correctSpecies = byId.get(question.correctId);

  return (
    <section aria-labelledby={headingId}>
      <div className="mx-auto mb-5 flex w-full max-w-[1400px] items-center gap-4 px-6 text-[13px] text-muted-foreground lg:px-10">
        <p className="shrink-0">
          {t("progress", { current: index + 1, total })}
        </p>
        <div
          className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary"
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300"
            style={{
              width: `${((index + (revealed ? 1 : 0)) / total) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="grid lg:min-h-[72vh] lg:grid-cols-[1.15fr_0.85fr]">
        <div className="group relative min-h-[52vh] w-full bg-ink sm:min-h-[58vh] lg:min-h-full">
          <Image
            src={question.image}
            alt={
              revealed && correctSpecies
                ? speciesImageAlt(
                    correctSpecies.commonName,
                    correctSpecies.scientificName,
                    correctSpecies.location,
                  )
                : t("imageAltHidden")
            }
            fill
            priority
            quality={90}
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover"
          />
          <PhotoCreditCaption credit={question.imageCredit} />
        </div>

        <div className="flex flex-col justify-center bg-surface px-6 py-8 sm:px-8 lg:px-12 lg:py-12">
          <h2
            id={headingId}
            className="font-display text-[clamp(1.7rem,3.4vw,2.5rem)] font-semibold leading-tight"
          >
            {t("question")}
          </h2>

          <div
            role="radiogroup"
            aria-labelledby={headingId}
            className="mt-7 grid gap-3 sm:grid-cols-2"
          >
            {question.optionIds.map((optionId) => {
              const option = byId.get(optionId);
              if (!option) return null;
              const selected = selectedId === optionId;
              const isCorrect = optionId === question.correctId;
              return (
                <button
                  key={optionId}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  disabled={revealed}
                  onClick={() => onSelect(optionId, question.difficulty)}
                  className={`min-h-16 rounded-2xl border px-5 py-5 text-left text-[16px] font-medium transition-colors duration-200 ${optionClass(
                    {
                      revealed,
                      selected,
                      correct: isCorrect,
                    },
                  )}`}
                >
                  <span className="block leading-snug">{option.commonName}</span>
                  {revealed ? (
                    <span className="mt-1 block text-[12px] font-normal italic text-muted-foreground">
                      {option.scientificName}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div aria-live="polite">
            {revealed && correctSpecies ? (
              <div className="mt-8 border-t border-border pt-6">
                <p className="font-display text-[1.5rem] font-semibold">
                  {selectedId === question.correctId
                    ? t("correct")
                    : t("incorrect")}
                </p>
                <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                  {t("revealLead", {
                    commonName: correctSpecies.commonName,
                    scientificName: correctSpecies.scientificName,
                  })}{" "}
                  {question.explanation}
                </p>
                <Link
                  href={speciesHref(question.correctId, locale)}
                  onClick={() =>
                    trackEvent("species_page_clicked", {
                      source: "quiz_question",
                      species: question.correctId,
                      question: index + 1,
                    })
                  }
                  className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground/80 transition-colors hover:text-primary"
                >
                  {t("learnMore")}
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
                <div className="mt-7">
                  <button
                    type="button"
                    onClick={onNext}
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 text-[14px] font-medium text-background transition-opacity hover:opacity-90 sm:w-auto"
                  >
                    {index + 1 >= questions.length
                      ? t("seeResult")
                      : t("next")}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
