"use client";

import type { SnakeQuizQuestion, SnakeQuizSpecies } from "@/lib/snakeQuiz";

type QuizCoverProps = {
  correctSpecies: SnakeQuizSpecies | undefined;
  coverKey: string;
  coverMobileSrc: string | undefined;
  coverSrc: string | undefined;
  hiddenAlt: string;
  nextQuestion: SnakeQuizQuestion | undefined;
  playing: boolean;
  revealed: boolean;
};

export function QuizCover({
  correctSpecies,
  coverKey,
  coverMobileSrc,
  coverSrc,
  hiddenAlt,
  nextQuestion,
  playing,
  revealed,
}: QuizCoverProps) {
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
                  : hiddenAlt
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
    </>
  );
}
