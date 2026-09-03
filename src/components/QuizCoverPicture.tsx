"use client";

type QuizCoverPictureProps = {
  alt: string;
  coverKey: string;
  coverMobileSrc: string | undefined;
  coverSrc: string;
  playing: boolean;
};

export function QuizCoverPicture({
  alt,
  coverKey,
  coverMobileSrc,
  coverSrc,
  playing,
}: QuizCoverPictureProps) {
  const split = Boolean(coverMobileSrc && coverMobileSrc !== coverSrc);
  const src = split ? coverMobileSrc : coverSrc;

  return (
    <picture
      className="media-placeholder absolute inset-0 block size-full"
      key={coverKey}
    >
      {split ? <source media="(min-width: 1024px)" srcSet={coverSrc} /> : null}
      <img
        alt={alt}
        className="hero-drift size-full object-cover text-transparent"
        decoding="async"
        fetchPriority={!playing ? "high" : "auto"}
        src={src}
      />
    </picture>
  );
}
