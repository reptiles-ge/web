"use client";

import type { SnakeQuizQuestion } from "@/lib/snakeQuiz";

import { CoverImagePreload } from "@/components/CoverImagePreload";

export function QuizCoverPreload({
  nextQuestion,
}: {
  nextQuestion: SnakeQuizQuestion | undefined;
}) {
  const mobile = nextQuestion?.mobileImage;
  const image = nextQuestion?.image;
  const split = Boolean(mobile && mobile !== image);

  if (!image) return null;

  if (split && mobile) {
    return (
      <>
        <CoverImagePreload
          media="(max-width: 1023px)"
          sizes="100vw"
          src={mobile}
        />
        <CoverImagePreload
          media="(min-width: 1024px)"
          sizes="100vw"
          src={image}
        />
      </>
    );
  }

  return <CoverImagePreload sizes="100vw" src={image} />;
}
