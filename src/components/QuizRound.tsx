"use client";

import { ArrowRight, Lightbulb } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { type KeyboardEvent, type RefObject } from "react";

import type { AppLocale } from "@/i18n/routing";

import { Link } from "@/i18n/navigation";
import { trackEvent, trackSpeciesClick } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import type { QuizDifficulty, SnakeQuizQuestion, SnakeQuizSpecies } from "@/lib/snakeQuiz";
import { speciesHref } from "@/lib/speciesRoutes";

const OPTION_MARKS: Record<
  AppLocale,
  readonly [string, string, string, string]
> = {
  en: ["A", "B", "C", "D"],
  ka: ["ა", "ბ", "გ", "დ"],
  ru: ["А", "Б", "В", "Г"],
  tr: ["A", "B", "C", "D"],
};

type QuizRoundProps = {
  byId: Map<string, SnakeQuizSpecies>;
  correctSpecies: SnakeQuizSpecies;
  feedbackRef: RefObject<HTMLParagraphElement | null>;
  headingId: string;
  hintOpen: boolean;
  hintedQuestions: RefObject<Set<number>>;
  index: number;
  nextLabel: string;
  onHintToggle: (open: boolean) => void;
  onNext: () => void;
  onSelect: (optionId: string, difficulty: QuizDifficulty) => void;
  optionRefs: RefObject<Array<HTMLButtonElement | null>>;
  question: SnakeQuizQuestion;
  quizId: string;
  revealed: boolean;
  selectedId: null | string;
  total: number;
};

export function QuizRound({
  byId,
  correctSpecies,
  feedbackRef,
  headingId,
  hintOpen,
  hintedQuestions,
  index,
  nextLabel,
  onHintToggle,
  onNext,
  onSelect,
  optionRefs,
  question,
  quizId,
  revealed,
  selectedId,
  total,
}: QuizRoundProps) {
  const t = useTranslations("snakeQuiz");
  const locale = useLocale() as AppLocale;

  function onRadioKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (revealed) return;
    const ids = question.optionIds;
    const current = optionRefs.current.findIndex(
      (node) => node === document.activeElement,
    );
    const active = current >= 0 ? current : 0;
    let next = active;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      next = (active + 1) % ids.length;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      next = (active - 1 + ids.length) % ids.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = ids.length - 1;
    } else {
      return;
    }
    event.preventDefault();
    optionRefs.current[next]?.focus();
  }

  return (
    <>
      <header className="shrink-0">
        <div className="flex items-center gap-3 text-[11px] tracking-[0.18em] text-white/70 uppercase sm:text-[12px]">
          <span>{t("progress", { current: index + 1, total })}</span>
          <span aria-hidden="true" className="h-px flex-1 bg-white/20" />
        </div>
        <div aria-hidden="true" className="mt-2 flex gap-1.5 sm:mt-3">
          {Array.from({ length: total }, (_, i) => (
            <span
              className={cn(
                "h-1 flex-1 rounded-full transition-colors duration-300",
                i < index || (i === index && revealed)
                  ? "bg-white"
                  : i === index
                    ? "bg-white/55"
                    : "bg-white/20",
              )}
              key={`progress-${i}`}
            />
          ))}
        </div>
        <h2
          className="mt-3 max-w-2xl font-display text-[clamp(1.3rem,6.4vw,3.4rem)] leading-[1.08] font-semibold text-white sm:mt-6"
          id={headingId}
        >
          {t("question")}
        </h2>
      </header>

      <div aria-hidden="true" className="min-h-3 flex-1" />

      <div className="shrink-0">
        {!revealed && correctSpecies.hint ? (
          <div className="mb-2.5 sm:mb-3">
            <button
              aria-expanded={hintOpen}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/20 bg-black/35 px-3.5 text-[13px] font-medium text-white/90 backdrop-blur-md transition-colors hover:border-white/45 hover:bg-black/50 hover:text-white"
              onClick={() => {
                const next = !hintOpen;
                onHintToggle(next);
                if (next && !hintedQuestions.current.has(index)) {
                  hintedQuestions.current.add(index);
                  trackEvent("quiz_hint", {
                    difficulty: question.difficulty,
                    question_index: index + 1,
                    quiz_id: quizId,
                    species_id: question.correctId,
                  });
                }
              }}
              type="button"
            >
              <Lightbulb aria-hidden="true" className="size-3.5" />
              {hintOpen ? t("hintHide") : t("hint")}
            </button>
            {hintOpen ? (
              <p className="mt-2.5 max-w-2xl rounded-2xl border border-white/15 bg-black/45 px-4 py-3 text-[13px] leading-relaxed text-white/80 backdrop-blur-md sm:mt-3 sm:text-[14px]">
                {correctSpecies.hint}
              </p>
            ) : null}
          </div>
        ) : null}
        <div
          aria-labelledby={headingId}
          className="grid gap-1.5 sm:grid-cols-2 sm:gap-3"
          onKeyDown={onRadioKeyDown}
          role="radiogroup"
        >
          {question.optionIds.map((optionId, optionIndex) => {
            const option = byId.get(optionId);
            if (!option) return null;
            const selected = selectedId === optionId;
            const isCorrect = optionId === question.correctId;
            return (
              <button
                aria-checked={selected}
                className={cn(
                  "flex min-h-11 items-center gap-2.5 rounded-2xl border px-3 py-2.5 text-left backdrop-blur-md transition-colors duration-200 sm:min-h-17 sm:gap-3 sm:px-5 sm:py-3.5",
                  optionClass({
                    correct: isCorrect,
                    revealed,
                    selected,
                  }),
                )}
                disabled={revealed}
                key={optionId}
                onClick={() => onSelect(optionId, question.difficulty)}
                ref={(node) => {
                  optionRefs.current[optionIndex] = node;
                }}
                role="radio"
                type="button"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-white/20 text-[12px] font-medium sm:size-8">
                  {OPTION_MARKS[locale][optionIndex]}
                </span>
                <span className="min-w-0">
                  <span className="line-clamp-2 block text-[14px] leading-snug font-medium sm:line-clamp-none sm:text-[16px]">
                    {option.commonName}
                  </span>
                  {revealed ? (
                    <span className="mt-0.5 block text-[12px] font-normal text-white/60 italic">
                      {option.scientificName}
                    </span>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>

        <div
          aria-label={
            revealed
              ? t("revealLead", {
                  commonName: correctSpecies.commonName,
                  scientificName: correctSpecies.scientificName,
                })
              : undefined
          }
          aria-live="polite"
        >
          {revealed ? (
            <div className="mt-2.5 rounded-[20px] border border-white/15 bg-black/55 p-3.5 backdrop-blur-xl sm:mt-4 sm:rounded-[24px] sm:p-6">
              <p
                className="font-display text-[1.1rem] font-semibold text-white outline-none sm:text-[1.45rem]"
                ref={feedbackRef}
                tabIndex={-1}
              >
                {selectedId === question.correctId ? t("correct") : t("incorrect")}
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-white/75 sm:mt-2 sm:text-[15px]">
                {t("revealLead", {
                  commonName: correctSpecies.commonName,
                  scientificName: correctSpecies.scientificName,
                })}{" "}
                {question.explanation}
              </p>
              <div className="mt-5 hidden sm:flex sm:items-center sm:gap-3">
                <button
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-[14px] font-medium text-ink transition-opacity hover:opacity-90"
                  onClick={onNext}
                  type="button"
                >
                  {nextLabel}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </button>
                <Link
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white/80 transition-colors hover:text-white"
                  href={speciesHref(question.correctId, locale)}
                  onClick={() =>
                    trackSpeciesClick({
                      position: index + 1,
                      source: "quiz_question",
                      species_id: question.correctId,
                    })
                  }
                >
                  {t("learnMore")}
                  <ArrowRight aria-hidden="true" className="size-3.5" />
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {revealed ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-black/80 px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl sm:hidden">
          <button
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-6 text-[14px] font-medium text-ink"
            onClick={onNext}
            type="button"
          >
            {nextLabel}
            <ArrowRight aria-hidden="true" className="size-4" />
          </button>
          <Link
            className="mt-4 flex items-center justify-center gap-1.5 pb-0.5 text-[13px] font-medium text-white/80"
            href={speciesHref(question.correctId, locale)}
            onClick={() =>
              trackSpeciesClick({
                position: index + 1,
                source: "quiz_question",
                species_id: question.correctId,
              })
            }
          >
            {t("learnMore")}
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>
      ) : null}
    </>
  );
}

function optionClass(state: {
  correct: boolean;
  revealed: boolean;
  selected: boolean;
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
