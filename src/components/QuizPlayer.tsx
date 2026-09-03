/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { ArrowRight, Check, Lightbulb, RotateCcw, Share2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import type { AppLocale } from "@/i18n/routing";

import { CoverImage } from "@/components/CoverImage";
import { Link } from "@/i18n/navigation";
import { trackEvent, trackSpeciesClick } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import {
  generateSnakeQuiz,
  QUIZ_LENGTH,
  type QuizDifficulty,
  scoreMessageKey,
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

type QuizPlayerProps = {
  quizId: string;
  shareUrl: string;
  snakes: SnakeQuizSpecies[];
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

  const [playing, setPlaying] = useState(false);
  const [questions, setQuestions] = useState<null | SnakeQuizQuestion[]>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answered[]>([]);
  const [selectedId, setSelectedId] = useState<null | string>(null);
  const [complete, setComplete] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const [draftReady, setDraftReady] = useState(false);

  const introCover =
    snakes.find((item) => item.id === "natrix-natrix") ?? snakes[0];

  const startRound = useCallback(
    (reason: "restart" | "start") => {
      const next = generateSnakeQuiz(snakes);
      setQuestions(next);
      setIndex(0);
      setAnswers([]);
      setSelectedId(null);
      setComplete(false);
      setHintOpen(false);
      setPlaying(true);
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
      setQuestions(draft.questions);
      setIndex(draft.index ?? 0);
      setAnswers(draft.answers ?? []);
      setSelectedId(draft.selectedId ?? null);
      setHintOpen(Boolean(draft.hintOpen));
      setComplete(false);
      setPlaying(true);
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
    setSelectedId(optionId);
    setAnswers((current) => [...current, { correct, selectedId: optionId }]);
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
      setComplete(true);
      sessionStorage.removeItem(draftKey(quizId));
      trackEvent("quiz_complete", {
        correct_count: answers.filter((item) => item.correct).length,
        percent,
        quiz_id: quizId,
        total: questions.length,
      });
      return;
    }
    setIndex((current) => current + 1);
    setSelectedId(null);
    setHintOpen(false);
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
          <IntroOverlay
            headingId={headingId}
            onStart={() => startRound("start")}
          />
        ) : complete && questions ? (
          <ResultOverlay
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
                      setHintOpen(next);
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

function IntroOverlay({
  headingId,
  onStart,
}: {
  headingId: string;
  onStart: () => void;
}) {
  const t = useTranslations("snakeQuiz");
  const rules = [
    { body: t("rule1Body"), title: t("rule1Title") },
    { body: t("rule2Body"), title: t("rule2Title") },
    { body: t("rule3Body"), title: t("rule3Title") },
  ] as const;

  return (
    <div className="flex min-h-[calc(100dvh-7.5rem)] w-full flex-col">
      <div className="mt-auto w-full pb-8 sm:pb-20 lg:pb-24">
        <QuizBreadcrumbs />
        <p className="text-[11px] font-medium tracking-[0.32em] text-white/55 uppercase">
          {t("eyebrow")}
        </p>
        <h1
          className="mt-3 max-w-3xl font-display text-[clamp(1.85rem,10vw,5.4rem)] leading-[0.98] font-semibold text-white sm:mt-4"
          id={headingId}
        >
          {t("title")}
        </h1>
        <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-white/70 sm:mt-5 sm:text-[17px]">
          {t("startLead")}
        </p>

        <ul className="mt-5 grid gap-px overflow-hidden rounded-[24px] border border-white/12 bg-white/10 sm:mt-10 sm:grid-cols-3">
          {rules.map((rule, index) => (
            <li
              className="bg-black/40 px-4 py-3.5 backdrop-blur-xl sm:p-6"
              key={rule.title}
            >
              <span className="font-display text-[12px] tracking-[0.22em] text-white/40">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-2 font-display text-[16px] font-semibold text-white sm:mt-3 sm:text-[18px]">
                {rule.title}
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-white/60 sm:mt-2">
                {rule.body}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-5 sm:mt-8">
          <button
            className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-white px-8 text-[15px] font-medium text-ink transition-opacity hover:opacity-90 sm:w-auto"
            onClick={onStart}
            type="button"
          >
            {t("start")}
            <ArrowRight aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>
    </div>
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

function QuizBreadcrumbs() {
  const t = useTranslations("snakeQuiz");
  const tQuizzes = useTranslations("quizzes");

  return (
    <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-[13px] text-white/55">
        <li>
          <Link className="transition-colors hover:text-white" href="/">
            {t("breadcrumbHome")}
          </Link>
        </li>
        <li aria-hidden="true" className="text-white/30">
          /
        </li>
        <li>
          <Link className="transition-colors hover:text-white" href="/quiz">
            {tQuizzes("breadcrumbCurrent")}
          </Link>
        </li>
        <li aria-hidden="true" className="text-white/30">
          /
        </li>
        <li className="text-white/80">{t("breadcrumbCurrent")}</li>
      </ol>
    </nav>
  );
}

function ResultOverlay({
  answers,
  byId,
  correctCount,
  headingId,
  onRestart,
  questions,
  quizId,
  shareUrl,
  total,
}: {
  answers: Answered[];
  byId: Map<string, SnakeQuizSpecies>;
  correctCount: number;
  headingId: string;
  onRestart: () => void;
  questions: SnakeQuizQuestion[];
  quizId: string;
  shareUrl: string;
  total: number;
}) {
  const t = useTranslations("snakeQuiz");
  const locale = useLocale() as AppLocale;
  const percent = scorePercent(correctCount, total);
  const [copied, setCopied] = useState(false);

  async function onShare() {
    const text = t("shareText", {
      score: `${correctCount}/${total}`,
      url: shareUrl.replace(/^https?:\/\//, ""),
    });
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({
          text,
          title: t("title"),
          url: shareUrl,
        });
        trackEvent("quiz_share", {
          method: "share",
          percent,
          quiz_id: quizId,
        });
        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
    }
    try {
      await navigator.clipboard.writeText(`${text} ${shareUrl}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
      trackEvent("quiz_share", {
        method: "copy",
        percent,
        quiz_id: quizId,
      });
    } catch {
      return;
    }
  }

  return (
    <div className="flex w-full flex-col pb-16 sm:pb-24">
      <QuizBreadcrumbs />
      <p className="text-[11px] font-medium tracking-[0.3em] text-white/55 uppercase">
        {t("resultEyebrow")}
      </p>
      <h2
        className="mt-3 font-display text-[clamp(2.6rem,16vw,8rem)] leading-none font-semibold text-white sm:mt-4"
        id={headingId}
      >
        {correctCount}
        <span className="text-white/35"> / {total}</span>
      </h2>
      <p className="mt-2 text-[15px] text-white/55">
        {t("percentLabel", { percent })}
      </p>
      <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-white sm:mt-6 sm:text-[20px]">
        {t(scoreMessageKey(percent))}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row">
        <button
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-6 text-[14px] font-medium text-ink transition-opacity hover:opacity-90 sm:w-auto"
          onClick={onRestart}
          type="button"
        >
          <RotateCcw aria-hidden="true" className="size-4" />
          {t("restart")}
        </button>
        <button
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/25 px-6 text-[14px] font-medium text-white transition-colors hover:border-white/50 hover:bg-white/10 sm:w-auto"
          onClick={onShare}
          type="button"
        >
          {copied ? (
            <Check aria-hidden="true" className="size-4" />
          ) : (
            <Share2 aria-hidden="true" className="size-4" />
          )}
          {copied ? t("shareCopied") : t("share")}
        </button>
      </div>

      <h3 className="mt-12 font-display text-[1.25rem] font-semibold text-white sm:mt-16 sm:text-[1.5rem]">
        {t("roundRecap")}
      </h3>
      <ul className="mt-4 grid gap-2 sm:mt-5 sm:grid-cols-2">
        {questions.map((item, questionIndex) => {
          const species = byId.get(item.correctId);
          const answer = answers[questionIndex];
          if (!species || !answer) return null;
          return (
            <li className="min-w-0" key={`${item.correctId}-${questionIndex}`}>
              <Link
                className="flex min-w-0 items-center gap-2.5 rounded-[20px] border border-white/12 bg-black/45 p-2 backdrop-blur-md transition-colors hover:border-white/30 hover:bg-black/60 sm:gap-3 sm:p-2.5"
                href={speciesHref(item.correctId, locale)}
                onClick={() =>
                  trackSpeciesClick({
                    position: questionIndex + 1,
                    source: "quiz_result",
                    species_id: item.correctId,
                  })
                }
              >
                <span className="relative size-12 shrink-0 overflow-hidden rounded-2xl sm:size-16">
                  <CoverImage
                    alt={species.imageAlt}
                    className="object-cover"
                    sizes="64px"
                    src={species.image}
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-medium text-white">
                    {species.commonName}
                  </span>
                  <span className="mt-0.5 block truncate text-[12px] text-white/55 italic">
                    {species.scientificName}
                  </span>
                </span>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-1 text-[11px] font-medium whitespace-nowrap sm:px-2.5",
                    answer.correct
                      ? "bg-emerald-500/20 text-emerald-100"
                      : "bg-destructive/25 text-red-100",
                  )}
                >
                  {answer.correct ? t("resultCorrect") : t("resultWrong")}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="mt-8 max-w-xl text-[14px] leading-relaxed text-white/65 sm:mt-10">
        {t("practiceNote")}
      </p>
      <p className="mt-6 text-[11px] font-medium tracking-[0.28em] text-white/45 uppercase">
        {t("relatedTitle")}
      </p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-5 text-[14px] font-medium text-white transition-colors hover:border-white/50 hover:bg-white/10"
          href="/snakes/shxamiani-gvelis-amocnoba"
        >
          {t("ctaIdentify")}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
        <Link
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-5 text-[14px] font-medium text-white transition-colors hover:border-white/50 hover:bg-white/10"
          href="/venomous-snakes"
        >
          {t("ctaVenomous")}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
        <Link
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-5 text-[14px] font-medium text-white transition-colors hover:border-white/50 hover:bg-white/10"
          href="/snakes"
        >
          {t("discoverSnakes")}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </div>
  );
}
