"use client";

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
import { ArrowRight, Lightbulb, RotateCcw } from "lucide-react";
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

const OPTION_MARKS = {
  ka: ["ა", "ბ", "გ", "დ"],
  en: ["A", "B", "C", "D"],
} as const;

function optionClass(state: {
  revealed: boolean;
  selected: boolean;
  correct: boolean;
}) {
  if (!state.revealed) {
    return "border-white/15 bg-black/35 text-white hover:border-white/45 hover:bg-black/50";
  }
  if (state.correct) {
    return "border-emerald-300/80 bg-emerald-500/25 text-white";
  }
  if (state.selected) {
    return "border-destructive/80 bg-destructive/30 text-white";
  }
  return "border-white/10 bg-black/25 text-white/45";
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
  const [hintOpen, setHintOpen] = useState(false);

  const startRound = useCallback(
    (reason: "start" | "restart") => {
      const next = generateSnakeQuiz(snakes);
      setQuestions(next);
      setIndex(0);
      setAnswers([]);
      setSelectedId(null);
      setComplete(false);
      setHintOpen(false);
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
  const backdrop =
    question ?? questions?.[questions.length - 1] ?? null;

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
    setHintOpen(false);
  }

  const correctSpecies = question
    ? byId.get(question.correctId)
    : backdrop
      ? byId.get(backdrop.correctId)
      : undefined;

  return (
    <section
      aria-labelledby={headingId}
      className="relative isolate min-h-svh overflow-hidden bg-ink"
    >
      {backdrop ? (
        <Image
          key={complete ? "result" : backdrop.speciesId}
          src={backdrop.image}
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
          sizes="100vw"
          className="object-cover hero-drift"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/85" />
      <div className="absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_20%,transparent_20%,rgba(0,0,0,0.55)_100%)]" />

      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-[1400px] flex-col justify-between px-5 pb-6 pt-28 sm:px-8 lg:px-10 lg:pb-8">
        {!questions || !question ? (
          <p className="text-white/70">{t("loading")}</p>
        ) : complete ? (
          <ResultOverlay
            headingId={headingId}
            correctCount={correctCount}
            total={total}
            onRestart={() => startRound("restart")}
          />
        ) : (
          <>
            <header>
              <div className="flex items-center gap-3 text-[12px] tracking-[0.18em] text-white/70 uppercase">
                <span>
                  {t("progress", { current: index + 1, total })}
                </span>
                <span className="h-px flex-1 bg-white/20" aria-hidden="true" />
              </div>
              <div
                className="mt-3 flex gap-1.5"
                aria-hidden="true"
              >
                {Array.from({ length: total }, (_, i) => (
                  <span
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                      i < index || (i === index && revealed)
                        ? "bg-white"
                        : i === index
                          ? "bg-white/55"
                          : "bg-white/20"
                    }`}
                  />
                ))}
              </div>
              <h2
                id={headingId}
                className="mt-6 max-w-2xl font-display text-[clamp(1.9rem,5vw,3.4rem)] font-semibold leading-[1.05] text-white"
              >
                {t("question")}
              </h2>
            </header>

            <div>
              {!revealed && correctSpecies?.hint ? (
                <div className="mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      const next = !hintOpen;
                      setHintOpen(next);
                      if (next) {
                        trackEvent("quiz_hint_used", {
                          question: index + 1,
                          species: question.correctId,
                          difficulty: question.difficulty,
                        });
                      }
                    }}
                    aria-expanded={hintOpen}
                    className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/20 bg-black/35 px-3.5 text-[13px] font-medium text-white/90 backdrop-blur-md transition-colors hover:border-white/45 hover:bg-black/50 hover:text-white"
                  >
                    <Lightbulb className="size-3.5" aria-hidden="true" />
                    {hintOpen ? t("hintHide") : t("hint")}
                  </button>
                  {hintOpen ? (
                    <p className="mt-3 max-w-2xl rounded-2xl border border-white/15 bg-black/45 px-4 py-3 text-[14px] leading-relaxed text-white/80 backdrop-blur-md">
                      {correctSpecies.hint}
                    </p>
                  ) : null}
                </div>
              ) : null}
              <div
                role="radiogroup"
                aria-labelledby={headingId}
                className="grid gap-2.5 sm:grid-cols-2 sm:gap-3"
              >
                {question.optionIds.map((optionId, optionIndex) => {
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
                      className={`flex min-h-14 items-center gap-3 rounded-2xl border px-4 py-3.5 text-left backdrop-blur-md transition-colors duration-200 sm:min-h-[4.25rem] sm:px-5 ${optionClass(
                        {
                          revealed,
                          selected,
                          correct: isCorrect,
                        },
                      )}`}
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/20 text-[12px] font-medium">
                        {OPTION_MARKS[locale][optionIndex]}
                      </span>
                      <span>
                        <span className="block text-[15px] font-medium leading-snug sm:text-[16px]">
                          {option.commonName}
                        </span>
                        {revealed ? (
                          <span className="mt-0.5 block text-[12px] font-normal italic text-white/60">
                            {option.scientificName}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div aria-live="polite">
                {revealed && correctSpecies ? (
                  <div className="mt-4 rounded-[24px] border border-white/15 bg-black/45 p-5 backdrop-blur-xl sm:p-6">
                    <p className="font-display text-[1.45rem] font-semibold text-white">
                      {selectedId === question.correctId
                        ? t("correct")
                        : t("incorrect")}
                    </p>
                    <p className="mt-2 max-w-3xl text-[14px] leading-relaxed text-white/75 sm:text-[15px]">
                      {t("revealLead", {
                        commonName: correctSpecies.commonName,
                        scientificName: correctSpecies.scientificName,
                      })}{" "}
                      {question.explanation}
                    </p>
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                      <button
                        type="button"
                        onClick={onNext}
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-[14px] font-medium text-ink transition-opacity hover:opacity-90"
                      >
                        {index + 1 >= questions.length
                          ? t("seeResult")
                          : t("next")}
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </button>
                      <Link
                        href={speciesHref(question.correctId, locale)}
                        onClick={() =>
                          trackEvent("species_page_clicked", {
                            source: "quiz_question",
                            species: question.correctId,
                            question: index + 1,
                          })
                        }
                        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white/80 transition-colors hover:text-white"
                      >
                        {t("learnMore")}
                        <ArrowRight className="size-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function ResultOverlay({
  headingId,
  correctCount,
  total,
  onRestart,
}: {
  headingId: string;
  correctCount: number;
  total: number;
  onRestart: () => void;
}) {
  const t = useTranslations("snakeQuiz");
  const percent = scorePercent(correctCount, total);

  return (
    <div className="flex min-h-[70vh] flex-col justify-end pb-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-white/55">
        {t("resultEyebrow")}
      </p>
      <h2
        id={headingId}
        className="mt-4 font-display text-[clamp(4rem,14vw,8rem)] font-semibold leading-none text-white"
      >
        {correctCount}
        <span className="text-white/35"> / {total}</span>
      </h2>
      <p className="mt-2 text-[15px] text-white/55">
        {t("percentLabel", { percent })}
      </p>
      <p className="mt-6 max-w-xl text-[18px] leading-relaxed text-white sm:text-[20px]">
        {t(scoreMessageKey(percent))}
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-[14px] font-medium text-ink transition-opacity hover:opacity-90"
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
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-6 text-[14px] font-medium text-white transition-colors hover:border-white/50 hover:bg-white/10"
        >
          {t("discoverSnakes")}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
