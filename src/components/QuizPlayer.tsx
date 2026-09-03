"use client";

import { useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useReducer,
  useRef,
} from "react";

import { QuizStage } from "@/components/QuizStage";
import { trackEvent } from "@/lib/analytics";
import { draftKey, type QuizDraft, useQuizDraft } from "@/lib/quizDraft";
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

type QuizAction =
  | { correct: boolean; optionId: string; type: "select"; }
  | { draft: QuizDraft; type: "restore" }
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
  useQuizDraft(quizId, dispatch, session);

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

  const cover = quizCoverState({
    byId,
    complete,
    introCover,
    playing,
    question,
    questions,
  });
  const correctSpecies = question ? byId.get(question.correctId) : undefined;
  const nextQuestion = revealed ? questions?.[index + 1] : undefined;
  const nextLabel =
    questions && index + 1 >= questions.length ? t("seeResult") : t("next");

  return (
    <QuizStage
      answers={answers}
      byId={byId}
      complete={complete}
      correctCount={correctCount}
      correctSpecies={correctSpecies}
      coverKey={cover.coverKey}
      coverMobileSrc={cover.coverMobileSrc}
      coverSrc={cover.coverSrc}
      feedbackRef={feedbackRef}
      headingId={headingId}
      hintedQuestions={hintedQuestions}
      hintOpen={hintOpen}
      index={index}
      nextLabel={nextLabel}
      nextQuestion={nextQuestion}
      onHintToggle={(open) => dispatch({ open, type: "setHintOpen" })}
      onNext={onNext}
      onRestart={() => startRound("restart")}
      onSelect={onSelect}
      onStart={() => startRound("start")}
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
  );

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

function quizCoverState({
  byId,
  complete,
  introCover,
  playing,
  question,
  questions,
}: {
  byId: Map<string, SnakeQuizSpecies>;
  complete: boolean;
  introCover: SnakeQuizSpecies | undefined;
  playing: boolean;
  question: SnakeQuizQuestion | undefined;
  questions: null | SnakeQuizQuestion[];
}) {
  const coverSpecies = playing
    ? (question ? (byId.get(question.correctId) ?? introCover) : introCover)
    : introCover;
  return {
    coverKey: !playing
      ? "intro"
      : complete
        ? "result"
        : (question?.speciesId ?? "cover"),
    coverMobileSrc: playing
      ? (question?.mobileImage ?? coverSpecies?.mobileImage)
      : introCover?.mobileImage,
    coverSrc: playing
      ? (question?.image ?? questions?.at(-1)?.image ?? introCover?.image)
      : introCover?.image,
  };
}
