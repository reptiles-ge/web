"use client";

import { useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

import { QuizIntroOverlay } from "@/components/QuizIntroOverlay";
import { QuizResultOverlay } from "@/components/QuizResultOverlay";
import { QuizRound } from "@/components/QuizRound";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import {
  generateSnakeQuiz,
  QUIZ_LENGTH,
  type QuizDifficulty,
  scorePercent,
  type SnakeQuizQuestion,
  type SnakeQuizSpecies,
} from "@/lib/snakeQuiz";

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

const initialSession: QuizSession = {
  answers: [],
  complete: false,
  hintOpen: false,
  index: 0,
  playing: false,
  questions: null,
  selectedId: null,
};

export function QuizPlayer(props: QuizPlayerProps) {
  return <QuizPlayerSession key={props.quizId} {...props} />;
}

function QuizPlayerSession({ quizId, shareUrl, snakes }: QuizPlayerProps) {
  const t = useTranslations("snakeQuiz");
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
  }, []);

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
            onHintToggle={(open) => dispatch({ open, type: "setHintOpen" })}
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

      </div>
    </section>
  );
}

function draftKey(quizId: string) {
  return `reptiles.quiz.draft.${quizId}`;
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
