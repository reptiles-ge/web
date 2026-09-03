"use client";

import type { SnakeQuizQuestion } from "@/lib/snakeQuiz";

export function QuizCoverPreload({
  nextQuestion,
}: {
  nextQuestion: SnakeQuizQuestion | undefined;
}) {
  return (
    <>
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
    </>
  );
}
