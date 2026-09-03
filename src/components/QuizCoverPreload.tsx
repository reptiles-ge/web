"use client";

import type { SnakeQuizQuestion } from "@/lib/snakeQuiz";

export function QuizCoverPreload({
  nextQuestion,
}: {
  nextQuestion: SnakeQuizQuestion | undefined;
}) {
  const mobile = nextQuestion?.mobileImage;
  const image = nextQuestion?.image;
  const split = Boolean(mobile && mobile !== image);

  return (
    <>
      {split ? (
        <link
          as="image"
          href={mobile}
          media="(max-width: 1023px)"
          rel="preload"
        />
      ) : null}
      {image ? (
        <link
          as="image"
          href={image}
          media={split ? "(min-width: 1024px)" : undefined}
          rel="preload"
        />
      ) : null}
    </>
  );
}
