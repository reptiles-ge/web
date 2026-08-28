import { pictureSources } from "@/data/optimizedImages";

type CoverImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  "aria-hidden"?: boolean;
};

export function CoverImage({
  src,
  alt,
  sizes,
  className,
  priority = false,
  "aria-hidden": ariaHidden,
}: CoverImageProps) {
  return (
    <picture>
      {pictureSources(src, { sizes }).map((source) => (
        <source key={source.key} {...source.props} />
      ))}
      <img
        src={src}
        alt={alt}
        aria-hidden={ariaHidden}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        className={`absolute inset-0 h-full w-full text-transparent${
          className ? ` ${className}` : ""
        }`}
      />
    </picture>
  );
}

type CoverImagePreloadProps = {
  src: string | null | undefined;
  sizes: string;
  media?: string;
};

export function CoverImagePreload({ src, sizes, media }: CoverImagePreloadProps) {
  if (!src) return null;

  const best = pictureSources(src, {
    sizes,
    ...(media ? { media } : {}),
  })[0];

  if (!best) {
    return (
      <link
        rel="preload"
        as="image"
        href={src}
        {...(media ? { media } : {})}
        fetchPriority="high"
      />
    );
  }

  return (
    <link
      rel="preload"
      as="image"
      type={best.props.type}
      imageSrcSet={best.props.srcSet}
      imageSizes={best.props.sizes}
      {...(media ? { media } : {})}
      fetchPriority="high"
    />
  );
}
