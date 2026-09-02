/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { CoverImage } from "@/components/CoverImage";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { trackEvent, trackSpeciesClick } from "@/lib/analytics";
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
import { ArrowRight, Check, Lightbulb, RotateCcw, Share2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

type QuizPlayerProps = {
  quizId: string;
  snakes: SnakeQuizSpecies[];
  shareUrl: string;
};

type Answered = {
  selectedId: string;
  correct: boolean;
};

type Draft = {
  questions: SnakeQuizQuestion[];
  index: number;
  answers: Answered[];
  selectedId: string | null;
  hintOpen: boolean;
};

const OPTION_MARKS: Record<AppLocale, readonly [string, string, string, string]> =
  {
    ka: ["ა", "ბ", "გ", "დ"],
    en: ["A", "B", "C", "D"],
    ru: ["А", "Б", "В", "Г"],
    tr: ["A", "B", "C", "D"],
  };

function draftKey(quizId: string) {
  return `reptiles.quiz.draft.${quizId}`;
}

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

export function QuizPlayer({ quizId, snakes, shareUrl }: QuizPlayerProps) {
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
  const [questions, setQuestions] = useState<SnakeQuizQuestion[] | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answered[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [complete, setComplete] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const [draftReady, setDraftReady] = useState(false);

  const introCover =
    snakes.find((item) => item.id === "natrix-natrix") ?? snakes[0];

  const startRound = useCallback(
    (reason: "start" | "restart") => {
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
        quiz_id: quizId,
        method: reason,
        question_count: next.length,
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
      questions,
      index,
      answers,
      selectedId,
      hintOpen,
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
        quiz_id: quizId,
        question_index: index + 1,
        answered_count: answers.length,
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
    setAnswers((current) => [...current, { selectedId: optionId, correct }]);
    trackEvent("quiz_answer", {
      quiz_id: quizId,
      question_index: index + 1,
      species_id: question.correctId,
      selected_id: optionId,
      is_correct: correct,
      difficulty,
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
        quiz_id: quizId,
        correct_count: answers.filter((item) => item.correct).length,
        total: questions.length,
        percent,
      });
      return;
    }
    setIndex((current) => current + 1);
    setSelectedId(null);
    setHintOpen(false);
  }

  const coverSpecies = playing
    ? (question ? (byId.get(question.correctId) ?? introCover) : introCover)
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
          rel="preload"
          as="image"
          href={nextQuestion.mobileImage}
          media="(max-width: 1023px)"
        />
      ) : null}
      {nextQuestion?.image ? (
        <link
          rel="preload"
          as="image"
          href={nextQuestion.image}
          media={
            nextQuestion.mobileImage &&
            nextQuestion.mobileImage !== nextQuestion.image
              ? "(min-width: 1024px)"
              : undefined
          }
        />
      ) : null}
      <div className="absolute inset-0 overflow-hidden">
        {coverSrc ? (
          <picture
            key={coverKey}
            className="media-placeholder absolute inset-0 block h-full w-full"
          >
            {coverMobileSrc && coverMobileSrc !== coverSrc ? (
              <source media="(min-width: 1024px)" srcSet={coverSrc} />
            ) : null}
            <img
              src={
                coverMobileSrc && coverMobileSrc !== coverSrc
                  ? coverMobileSrc
                  : coverSrc
              }
              alt={
                playing && revealed && correctSpecies
                  ? correctSpecies.imageAlt
                  : t("imageAltHidden")
              }
              fetchPriority={!playing ? "high" : "auto"}
              decoding="async"
              className="h-full w-full object-cover hero-drift text-transparent"
            />
          </picture>
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/85" />
        <div className="absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_20%,transparent_20%,rgba(0,0,0,0.55)_100%)]" />
      </div>

      <div
        className={`relative z-10 mx-auto flex w-full max-w-[1400px] flex-col px-5 pt-24 sm:px-8 sm:pt-28 lg:px-10 ${
          playing && !complete
            ? revealed
              ? "min-h-dvh pb-[calc(8.25rem+env(safe-area-inset-bottom))] sm:pb-[max(2rem,env(safe-area-inset-bottom))]"
              : "min-h-dvh pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pb-10"
            : "pb-[max(1.25rem,env(safe-area-inset-bottom))]"
        }`}
      >
        {!playing ? (
          <IntroOverlay
            headingId={headingId}
            onStart={() => startRound("start")}
          />
        ) : complete && questions ? (
          <ResultOverlay
            headingId={headingId}
            quizId={quizId}
            correctCount={correctCount}
            total={total}
            questions={questions}
            answers={answers}
            byId={byId}
            shareUrl={shareUrl}
            onRestart={() => startRound("restart")}
          />
        ) : !question ? (
          <p className="text-white/70">{t("loading")}</p>
        ) : (
          <>
            <header className="shrink-0">
              <div className="flex items-center gap-3 text-[11px] tracking-[0.18em] text-white/70 uppercase sm:text-[12px]">
                <span>{t("progress", { current: index + 1, total })}</span>
                <span className="h-px flex-1 bg-white/20" aria-hidden="true" />
              </div>
              <div className="mt-2 flex gap-1.5 sm:mt-3" aria-hidden="true">
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
                className="mt-3 max-w-2xl font-display text-[clamp(1.3rem,6.4vw,3.4rem)] font-semibold leading-[1.08] text-white sm:mt-6"
              >
                {t("question")}
              </h2>
            </header>

            <div className="min-h-3 flex-1" aria-hidden="true" />

            <div className="shrink-0">
              {!revealed && correctSpecies?.hint ? (
                <div className="mb-2.5 sm:mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      const next = !hintOpen;
                      setHintOpen(next);
                      if (next && !hintedQuestions.current.has(index)) {
                        hintedQuestions.current.add(index);
                        trackEvent("quiz_hint", {
                          quiz_id: quizId,
                          question_index: index + 1,
                          species_id: question.correctId,
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
                    <p className="mt-2.5 max-w-2xl rounded-2xl border border-white/15 bg-black/45 px-4 py-3 text-[13px] leading-relaxed text-white/80 backdrop-blur-md sm:mt-3 sm:text-[14px]">
                      {correctSpecies.hint}
                    </p>
                  ) : null}
                </div>
              ) : null}
              <div
                role="radiogroup"
                aria-labelledby={headingId}
                onKeyDown={onRadioKeyDown}
                className="grid gap-1.5 sm:grid-cols-2 sm:gap-3"
              >
                {question.optionIds.map((optionId, optionIndex) => {
                  const option = byId.get(optionId);
                  if (!option) return null;
                  const selected = selectedId === optionId;
                  const isCorrect = optionId === question.correctId;
                  return (
                    <button
                      key={optionId}
                      ref={(node) => {
                        optionRefs.current[optionIndex] = node;
                      }}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      disabled={revealed}
                      onClick={() => onSelect(optionId, question.difficulty)}
                      className={`flex min-h-11 items-center gap-2.5 rounded-2xl border px-3 py-2.5 text-left backdrop-blur-md transition-colors duration-200 sm:min-h-[4.25rem] sm:gap-3 sm:px-5 sm:py-3.5 ${optionClass(
                        {
                          revealed,
                          selected,
                          correct: isCorrect,
                        },
                      )}`}
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-white/20 text-[12px] font-medium sm:size-8">
                        {OPTION_MARKS[locale][optionIndex]}
                      </span>
                      <span className="min-w-0">
                        <span className="line-clamp-2 block text-[14px] font-medium leading-snug sm:line-clamp-none sm:text-[16px]">
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

              <div
                aria-live="polite"
                aria-label={
                  revealed && correctSpecies
                    ? t("revealLead", {
                        commonName: correctSpecies.commonName,
                        scientificName: correctSpecies.scientificName,
                      })
                    : undefined
                }
              >
                {revealed && correctSpecies ? (
                  <div className="mt-2.5 rounded-[20px] border border-white/15 bg-black/55 p-3.5 backdrop-blur-xl sm:mt-4 sm:rounded-[24px] sm:p-6">
                    <p
                      ref={feedbackRef}
                      tabIndex={-1}
                      className="font-display text-[1.1rem] font-semibold text-white outline-none sm:text-[1.45rem]"
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
                        type="button"
                        onClick={onNext}
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-[14px] font-medium text-ink transition-opacity hover:opacity-90"
                      >
                        {nextLabel}
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </button>
                      <Link
                        href={speciesHref(question.correctId, locale)}
                        onClick={() =>
                          trackSpeciesClick({
                            species_id: question.correctId,
                            source: "quiz_question",
                            position: index + 1,
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

            {revealed && correctSpecies ? (
              <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-black/80 px-5 pt-3 backdrop-blur-xl sm:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <button
                  type="button"
                  onClick={onNext}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-6 text-[14px] font-medium text-ink"
                >
                  {nextLabel}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </button>
                <Link
                  href={speciesHref(question.correctId, locale)}
                  onClick={() =>
                    trackSpeciesClick({
                      species_id: question.correctId,
                      source: "quiz_question",
                      position: index + 1,
                    })
                  }
                  className="mt-4 flex items-center justify-center gap-1.5 pb-0.5 text-[13px] font-medium text-white/80"
                >
                  {t("learnMore")}
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}

function QuizBreadcrumbs() {
  const t = useTranslations("snakeQuiz");
  const tQuizzes = useTranslations("quizzes");

  return (
    <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-[13px] text-white/55">
        <li>
          <Link href="/" className="transition-colors hover:text-white">
            {t("breadcrumbHome")}
          </Link>
        </li>
        <li aria-hidden="true" className="text-white/30">
          /
        </li>
        <li>
          <Link href="/quiz" className="transition-colors hover:text-white">
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

function IntroOverlay({
  headingId,
  onStart,
}: {
  headingId: string;
  onStart: () => void;
}) {
  const t = useTranslations("snakeQuiz");
  const rules = [
    { title: t("rule1Title"), body: t("rule1Body") },
    { title: t("rule2Title"), body: t("rule2Body") },
    { title: t("rule3Title"), body: t("rule3Body") },
  ] as const;

  return (
    <div className="flex min-h-[calc(100dvh-7.5rem)] w-full flex-col">
      <div className="mt-auto w-full pb-8 sm:pb-20 lg:pb-24">
        <QuizBreadcrumbs />
        <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-white/55">
          {t("eyebrow")}
        </p>
        <h1
          id={headingId}
          className="mt-3 max-w-3xl font-display text-[clamp(1.85rem,10vw,5.4rem)] font-semibold leading-[0.98] text-white sm:mt-4"
        >
          {t("title")}
        </h1>
        <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-white/70 sm:mt-5 sm:text-[17px]">
          {t("startLead")}
        </p>

        <ul className="mt-5 grid gap-px overflow-hidden rounded-[24px] border border-white/12 bg-white/10 sm:mt-10 sm:grid-cols-3">
          {rules.map((rule, index) => (
            <li
              key={rule.title}
              className="bg-black/40 px-4 py-3.5 backdrop-blur-xl sm:px-6 sm:py-6"
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
            type="button"
            onClick={onStart}
            className="inline-flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-full bg-white px-8 text-[15px] font-medium text-ink transition-opacity hover:opacity-90 sm:w-auto"
          >
            {t("start")}
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ResultOverlay({
  headingId,
  quizId,
  correctCount,
  total,
  questions,
  answers,
  byId,
  shareUrl,
  onRestart,
}: {
  headingId: string;
  quizId: string;
  correctCount: number;
  total: number;
  questions: SnakeQuizQuestion[];
  answers: Answered[];
  byId: Map<string, SnakeQuizSpecies>;
  shareUrl: string;
  onRestart: () => void;
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
          title: t("title"),
          text,
          url: shareUrl,
        });
        trackEvent("quiz_share", {
          quiz_id: quizId,
          method: "share",
          percent,
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
        quiz_id: quizId,
        method: "copy",
        percent,
      });
    } catch {
      return;
    }
  }

  return (
    <div className="flex w-full flex-col pb-16 sm:pb-24">
      <QuizBreadcrumbs />
      <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-white/55">
        {t("resultEyebrow")}
      </p>
      <h2
        id={headingId}
        className="mt-3 font-display text-[clamp(2.6rem,16vw,8rem)] font-semibold leading-none text-white sm:mt-4"
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
          type="button"
          onClick={onRestart}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-6 text-[14px] font-medium text-ink transition-opacity hover:opacity-90 sm:w-auto"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          {t("restart")}
        </button>
        <button
          type="button"
          onClick={onShare}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/25 px-6 text-[14px] font-medium text-white transition-colors hover:border-white/50 hover:bg-white/10 sm:w-auto"
        >
          {copied ? (
            <Check className="size-4" aria-hidden="true" />
          ) : (
            <Share2 className="size-4" aria-hidden="true" />
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
            <li key={`${item.correctId}-${questionIndex}`} className="min-w-0">
              <Link
                href={speciesHref(item.correctId, locale)}
                onClick={() =>
                  trackSpeciesClick({
                    species_id: item.correctId,
                    source: "quiz_result",
                    position: questionIndex + 1,
                  })
                }
                className="flex min-w-0 items-center gap-2.5 rounded-[20px] border border-white/12 bg-black/45 p-2 backdrop-blur-md transition-colors hover:border-white/30 hover:bg-black/60 sm:gap-3 sm:p-2.5"
              >
                <span className="relative size-12 shrink-0 overflow-hidden rounded-2xl sm:size-16">
                  <CoverImage
                    src={species.image}
                    alt={species.imageAlt}
                    sizes="64px"
                    className="object-cover"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-medium text-white">
                    {species.commonName}
                  </span>
                  <span className="mt-0.5 block truncate text-[12px] italic text-white/55">
                    {species.scientificName}
                  </span>
                </span>
                <span
                  className={`shrink-0 whitespace-nowrap rounded-full px-2 py-1 text-[11px] font-medium sm:px-2.5 ${
                    answer.correct
                      ? "bg-emerald-500/20 text-emerald-100"
                      : "bg-destructive/25 text-red-100"
                  }`}
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
      <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.28em] text-white/45">
        {t("relatedTitle")}
      </p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          href="/snakes/shxamiani-gvelis-amocnoba"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-5 text-[14px] font-medium text-white transition-colors hover:border-white/50 hover:bg-white/10"
        >
          {t("ctaIdentify")}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        <Link
          href="/venomous-snakes"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-5 text-[14px] font-medium text-white transition-colors hover:border-white/50 hover:bg-white/10"
        >
          {t("ctaVenomous")}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        <Link
          href="/snakes"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-5 text-[14px] font-medium text-white transition-colors hover:border-white/50 hover:bg-white/10"
        >
          {t("discoverSnakes")}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
