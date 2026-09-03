"use client";

import { optimizedImgSrc, pictureSources } from "@/data/optimizedImages";

type QuizCoverPictureProps = {
  alt: string;
  coverKey: string;
  coverMobileSrc: string | undefined;
  coverSrc: string;
  playing: boolean;
};

const COVER_SIZES = "100vw";

export function QuizCoverPicture({
  alt,
  coverKey,
  coverMobileSrc,
  coverSrc,
  playing,
}: QuizCoverPictureProps) {
  const split = Boolean(coverMobileSrc && coverMobileSrc !== coverSrc);
  const src = split && coverMobileSrc ? coverMobileSrc : coverSrc;
  const desktopSources = split
    ? pictureSources(coverSrc, {
        media: "(min-width: 1024px)",
        sizes: COVER_SIZES,
      })
    : [];
  const primarySources = pictureSources(src, { sizes: COVER_SIZES });

  return (
    <picture
      className="media-placeholder absolute inset-0 block size-full"
      key={coverKey}
    >
      {desktopSources.map((source) => (
        <source key={source.key} {...source.props} />
      ))}
      {split ? (
        <source
          media="(min-width: 1024px)"
          srcSet={optimizedImgSrc(coverSrc)}
        />
      ) : null}
      {primarySources.map((source) => (
        <source key={source.key} {...source.props} />
      ))}
      <img
        alt={alt}
        className="hero-drift size-full object-cover text-transparent"
        decoding="async"
        fetchPriority={!playing ? "high" : "auto"}
        src={optimizedImgSrc(src)}
      />
    </picture>
  );
}
