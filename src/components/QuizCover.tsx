"use client";

import type { SnakeQuizQuestion, SnakeQuizSpecies } from "@/lib/snakeQuizEngine";

import { CoverImagePreload } from "@/components/CoverImagePreload";
import { QuizCoverPicture } from "@/components/QuizCoverPicture";

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
  const alt =
    playing && revealed && correctSpecies ? correctSpecies.imageAlt : hiddenAlt;
  const nextImage = nextQuestion?.image;
  const nextMobile = nextQuestion?.mobileImage;
  const split = Boolean(nextMobile && nextMobile !== nextImage);

  return (
    <>
      {nextImage ? (
        split && nextMobile ? (
          <>
            <CoverImagePreload
              media="(max-width: 1023px)"
              sizes="100vw"
              src={nextMobile}
            />
            <CoverImagePreload
              media="(min-width: 1024px)"
              sizes="100vw"
              src={nextImage}
            />
          </>
        ) : (
          <CoverImagePreload sizes="100vw" src={nextImage} />
        )
      ) : null}
      <div className="absolute inset-0 overflow-hidden">
        {coverSrc ? (
          <QuizCoverPicture
            alt={alt}
            coverKey={coverKey}
            coverMobileSrc={coverMobileSrc}
            coverSrc={coverSrc}
            playing={playing}
          />
        ) : null}
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/20 to-black/85" />
        <div className="absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_20%,transparent_20%,rgba(0,0,0,0.55)_100%)]" />
      </div>
    </>
  );
}
