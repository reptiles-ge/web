"use client";

import { useOptimizedImage } from "@/components/OptimizedImagesProvider";
import { entryImgSrc, entryPictureSources } from "@/lib/optimizedImageSources";

type QuizCoverPictureProps = {
  alt: string;
  coverKey: string;
  coverMobileSrc: string | undefined;
  coverSrc: string;
  playing: boolean;
};

const COVER_SIZES = "(max-aspect-ratio: 3/2) 150vh, 100vw";

export function QuizCoverPicture({
  alt,
  coverKey,
  coverMobileSrc,
  coverSrc,
  playing,
}: QuizCoverPictureProps) {
  const split = Boolean(coverMobileSrc && coverMobileSrc !== coverSrc);
  const src = split && coverMobileSrc ? coverMobileSrc : coverSrc;
  const coverEntry = useOptimizedImage(coverSrc);
  const entry = useOptimizedImage(src);
  const desktopSources = split
    ? entryPictureSources(coverEntry, {
        media: "(min-width: 1024px)",
        sizes: COVER_SIZES,
      })
    : [];
  const primarySources = entryPictureSources(entry, { sizes: COVER_SIZES });

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
          srcSet={entryImgSrc(coverSrc, coverEntry)}
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
        src={entryImgSrc(src, entry)}
      />
    </picture>
  );
}
