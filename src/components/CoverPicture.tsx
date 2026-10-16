import { DeferredPicture } from "@/components/DeferredPicture";
import {
  entryImgSrc,
  entryPictureSources,
  type ResolvedImageEntry,
} from "@/lib/optimizedImageSources";

export type CoverImageProps = {
  alt: string;
  "aria-hidden"?: boolean;
  className?: string;
  defer?: boolean;
  fill?: boolean;
  mobileSrc?: null | string;
  priority?: boolean;
  sizes: string;
  src: string;
};

export function CoverPicture({
  alt,
  "aria-hidden": ariaHidden,
  className,
  defer = false,
  entry,
  fill = true,
  mobileEntry,
  mobileSrc,
  priority = false,
  sizes,
  src,
}: CoverImageProps & {
  entry: null | ResolvedImageEntry;
  mobileEntry: null | ResolvedImageEntry;
}) {
  const mobileSources = mobileSrc
    ? entryPictureSources(mobileEntry, {
        media: "(max-width: 639px)",
        sizes,
      })
    : [];
  const desktopSources = entryPictureSources(entry, {
    ...(mobileSrc ? { media: "(min-width: 640px)" } : {}),
    sizes,
  });
  const sources = [...mobileSources, ...desktopSources];
  const deferred = defer && !priority;
  const pictureClassName = fill
    ? "media-placeholder absolute inset-0 block size-full"
    : "media-placeholder relative block";
  const img = {
    alt,
    "aria-hidden": ariaHidden,
    className: fill
      ? `absolute inset-0 size-full text-transparent${
          className ? ` ${className}` : ""
        }`
      : `text-transparent${className ? ` ${className}` : ""}`,
    decoding: priority ? "sync" : "async",
    fetchPriority: priority ? "high" : deferred ? "low" : "auto",
    height: entry?.height,
    loading: priority ? "eager" : "lazy",
    sizes,
    src: entryImgSrc(src, entry),
    width: entry?.width,
  } as const;

  if (deferred) {
    return (
      <DeferredPicture
        className={pictureClassName}
        img={img}
        sources={sources.map((source) => ({
          key: source.key,
          ...source.props,
        }))}
      />
    );
  }

  return (
    <picture className={pictureClassName}>
      {sources.map((source) => (
        <source key={source.key} {...source.props} />
      ))}
      <img {...img} alt={alt} />
    </picture>
  );
}
