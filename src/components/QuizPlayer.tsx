"use client";

import { ArrowRight, Lightbulb } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

import type { AppLocale } from "@/i18n/routing";

import { QuizIntroOverlay } from "@/components/QuizIntroOverlay";
import { QuizResultOverlay } from "@/components/QuizResultOverlay";
import { Link } from "@/i18n/navigation";
import { trackEvent, trackSpeciesClick } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import {
  generateSnakeQuiz,
  QUIZ_LENGTH,
  type QuizDifficulty,
  scorePercent,
  type SnakeQuizQuestion,
  type SnakeQuizSpecies,
} from "@/lib/snakeQuiz";
import { speciesHref } from "@/lib/speciesRoutes";

type Answered = {
  correct: boolean;
  selectedId: string;
};

type Draft = {
  answers: Answered[];
  hintOpen: boolean;
  index: number;
  questions: SnakeQuizQuestion[];
  selectedId: null | string;
};

type QuizAction =
  | { correct: boolean; optionId: string; type: "select"; }
  | { draft: Draft; type: "restore" }
  | { open: boolean; type: "setHintOpen" }
  | { questions: SnakeQuizQuestion[]; type: "start" }
  | { type: "advance" };

type QuizPlayerProps = {
  quizId: string;
  shareUrl: string;
  snakes: SnakeQuizSpecies[];
};

type QuizSession = {
  answers: Answered[];
  complete: boolean;
  hintOpen: boolean;
  index: number;
  playing: boolean;
  questions: null | SnakeQuizQuestion[];
  selectedId: null | string;
};

const OPTION_MARKS: Record<
  AppLocale,
  readonly [string, string, string, string]
> = {
  en: ["A", "B", "C", "D"],
  ka: ["ა", "ბ", "გ", "დ"],
  ru: ["А", "Б", "В", "Г"],
  tr: ["A", "B", "C", "D"],
};

const initialSession: QuizSession = {
  answers: [],
  complete: false,
  hintOpen: false,
  index: 0,
  playing: false,
  questions: null,
  selectedId: null,
};

export function QuizPlayer({ quizId, shareUrl, snakes }: QuizPlayerProps) {
  const t = useTranslations("snakeQuiz");
  const locale = useLocale() as AppLocale;
  const headingId = useId();
  const byId = useMemo(
    () => new Map(snakes.map((item) => [item.id, item])),
    [snakes],
  );
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const feedbackRef = useRef<HTMLParagraphElement>(null);
  const abandonSent = useRef(false);
  const hintedQuestions = useRef(new Set<number>());

  const [session, dispatch] = useReducer(quizReducer, initialSession);
  const { answers, complete, hintOpen, index, playing, questions, selectedId } =
    session;
  const [draftReady, setDraftReady] = useState(false);

  const introCover =
    snakes.find((item) => item.id === "natrix-natrix") ?? snakes[0];

  const startRound = useCallback(
    (reason: "restart" | "start") => {
      const next = generateSnakeQuiz(snakes);
      dispatch({ questions: next, type: "start" });
      abandonSent.current = false;
      hintedQuestions.current = new Set();
      trackEvent("quiz_start", {
        method: reason,
        question_count: next.length,
        quiz_id: quizId,
      });
    },
    [snakes, quizId],
  );

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(draftKey(quizId));
      if (!raw) return;
      const draft = JSON.parse(raw) as Draft;
      if (!Array.isArray(draft.questions) || draft.questions.length === 0) {
        return;
      }
      dispatch({ draft, type: "restore" });
    } catch {
      return;
    } finally {
      setDraftReady(true);
    }
  }, [quizId]);

  useEffect(() => {
    if (!draftReady) return;
    if (!playing || complete || !questions) {
      sessionStorage.removeItem(draftKey(quizId));
      return;
    }
    const draft: Draft = {
      answers,
      hintOpen,
      index,
      questions,
      selectedId,
    };
    sessionStorage.setItem(draftKey(quizId), JSON.stringify(draft));
  }, [
    draftReady,
    playing,
    complete,
    questions,
    index,
    answers,
    selectedId,
    hintOpen,
    quizId,
  ]);

  useEffect(() => {
    function onHide() {
      if (abandonSent.current) return;
      if (!playing || complete || !questions) return;
      abandonSent.current = true;
      trackEvent("quiz_abandon", {
        answered_count: answers.length,
        question_index: index + 1,
        quiz_id: quizId,
      });
    }

    window.addEventListener("pagehide", onHide);
    return () => {
      window.removeEventListener("pagehide", onHide);
      onHide();
    };
  }, [playing, complete, questions, index, answers.length, quizId]);

  const question = questions?.[index];
  const revealed = selectedId !== null;
  const correctCount = answers.filter((item) => item.correct).length;
  const total = questions?.length ?? QUIZ_LENGTH;

  useEffect(() => {
    if (revealed) feedbackRef.current?.focus();
  }, [revealed, index]);

  function onSelect(optionId: string, difficulty: QuizDifficulty) {
    if (!question || revealed) return;
    const correct = optionId === question.correctId;
    dispatch({ correct, optionId, type: "select" });
    trackEvent("quiz_answer", {
      difficulty,
      is_correct: correct,
      question_index: index + 1,
      quiz_id: quizId,
      selected_id: optionId,
      species_id: question.correctId,
    });
  }

  function onRadioKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (revealed || !question) return;
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

  function onNext() {
    if (!questions) return;
    if (index + 1 >= questions.length) {
      const percent = scorePercent(
        answers.filter((item) => item.correct).length,
        questions.length,
      );
      dispatch({ type: "advance" });
      sessionStorage.removeItem(draftKey(quizId));
      trackEvent("quiz_complete", {
        correct_count: answers.filter((item) => item.correct).length,
        percent,
        quiz_id: quizId,
        total: questions.length,
      });
      return;
    }
    dispatch({ type: "advance" });
  }

  const coverSpecies = playing
    ? question
      ? (byId.get(question.correctId) ?? introCover)
      : introCover
    : introCover;
  const coverSrc = playing
    ? (question?.image ?? questions?.at(-1)?.image ?? introCover?.image)
    : introCover?.image;
  const coverMobileSrc = playing
    ? (question?.mobileImage ?? coverSpecies?.mobileImage)
    : introCover?.mobileImage;
  const coverKey = !playing
    ? "intro"
    : complete
      ? "result"
      : (question?.speciesId ?? "cover");

  const correctSpecies = question ? byId.get(question.correctId) : undefined;
  const nextQuestion = revealed ? questions?.[index + 1] : undefined;

  const nextLabel =
    questions && index + 1 >= questions.length ? t("seeResult") : t("next");

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
          <QuizIntroOverlay
            headingId={headingId}
            onStart={() => startRound("start")}
          />
        ) : complete && questions ? (
          <QuizResultOverlay
            answers={answers}
            byId={byId}
            correctCount={correctCount}
            headingId={headingId}
            onRestart={() => startRound("restart")}
            questions={questions}
            quizId={quizId}
            shareUrl={shareUrl}
            total={total}
          />
        ) : !question ? (
          <p className="text-white/70">{t("loading")}</p>
        ) : (
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
                    key={i}
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
              {!revealed && correctSpecies?.hint ? (
                <div className="mb-2.5 sm:mb-3">
                  <button
                    aria-expanded={hintOpen}
                    className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/20 bg-black/35 px-3.5 text-[13px] font-medium text-white/90 backdrop-blur-md transition-colors hover:border-white/45 hover:bg-black/50 hover:text-white"
                    onClick={() => {
                      const next = !hintOpen;
                      dispatch({ open: next, type: "setHintOpen" });
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
                  revealed && correctSpecies
                    ? t("revealLead", {
                        commonName: correctSpecies.commonName,
                        scientificName: correctSpecies.scientificName,
                      })
                    : undefined
                }
                aria-live="polite"
              >
                {revealed && correctSpecies ? (
                  <div className="mt-2.5 rounded-[20px] border border-white/15 bg-black/55 p-3.5 backdrop-blur-xl sm:mt-4 sm:rounded-[24px] sm:p-6">
                    <p
                      className="font-display text-[1.1rem] font-semibold text-white outline-none sm:text-[1.45rem]"
                      ref={feedbackRef}
                      tabIndex={-1}
                    >
                      {selectedId === question.correctId
                        ? t("correct")
                        : t("incorrect")}
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

            {revealed && correctSpecies ? (
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
        )}
      </div>
    </section>
  );
}

function draftKey(quizId: string) {
  return `reptiles.quiz.draft.${quizId}`;
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

function quizReducer(state: QuizSession, action: QuizAction): QuizSession {
  switch (action.type) {
    case "advance": {
      if (!state.questions) return state;
      if (state.index + 1 >= state.questions.length) {
        return { ...state, complete: true };
      }
      return {
        ...state,
        hintOpen: false,
        index: state.index + 1,
        selectedId: null,
      };
    }
    case "restore":
      return {
        answers: action.draft.answers ?? [],
        complete: false,
        hintOpen: Boolean(action.draft.hintOpen),
        index: action.draft.index ?? 0,
        playing: true,
        questions: action.draft.questions,
        selectedId: action.draft.selectedId ?? null,
      };
    case "select":
      if (state.selectedId !== null) return state;
      return {
        ...state,
        answers: [
          ...state.answers,
          { correct: action.correct, selectedId: action.optionId },
        ],
        selectedId: action.optionId,
      };
    case "setHintOpen":
      return { ...state, hintOpen: action.open };
    case "start":
      return {
        answers: [],
        complete: false,
        hintOpen: false,
        index: 0,
        playing: true,
        questions: action.questions,
        selectedId: null,
      };
    default:
      return state;
  }
}
