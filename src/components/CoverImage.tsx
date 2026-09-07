import {
  optimizedEntry,
  optimizedImgSrc,
  pictureSources,
} from "@/data/optimizedImages";

type CoverImageProps = {
  alt: string;
  "aria-hidden"?: boolean;
  className?: string;
  fill?: boolean;
  mobileSrc?: null | string;
  priority?: boolean;
  sizes: string;
  src: string;
};

export function CoverImage({
  alt,
  "aria-hidden": ariaHidden,
  className,
  fill = true,
  mobileSrc,
  priority = false,
  sizes,
  src,
}: CoverImageProps) {
  const entry = optimizedEntry(src);
  const mobileSources = mobileSrc
    ? pictureSources(mobileSrc, {
        media: "(max-width: 639px)",
        sizes,
      })
    : [];
  const desktopSources = pictureSources(src, {
    ...(mobileSrc ? { media: "(min-width: 640px)" } : {}),
    sizes,
  });

  return (
    <picture
      className={
        fill
          ? "media-placeholder absolute inset-0 block size-full"
          : "media-placeholder relative block"
      }
    >
      {[...mobileSources, ...desktopSources].map((source) => (
        <source key={source.key} {...source.props} />
      ))}
      <img
        alt={alt}
        aria-hidden={ariaHidden}
        className={
          fill
            ? `absolute inset-0 size-full text-transparent${
                className ? ` ${className}` : ""
              }`
            : `text-transparent${className ? ` ${className}` : ""}`
        }
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        height={entry?.height}
        loading={priority ? "eager" : "lazy"}
        sizes={sizes}
        src={optimizedImgSrc(src)}
        width={entry?.width}
      />
    </picture>
  );
}
