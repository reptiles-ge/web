import { optimizedImgSrc, pictureSources } from "@/data/optimizedImages";

type CoverImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  "aria-hidden"?: boolean;
};

export function CoverImage({
  src,
  alt,
  sizes,
  className,
  priority = false,
  fill = true,
  "aria-hidden": ariaHidden,
}: CoverImageProps) {
  return (
    <picture
      className={
        fill
          ? "media-placeholder absolute inset-0 block size-full"
          : "media-placeholder relative block"
      }
    >
      {pictureSources(src, { sizes }).map((source) => (
        <source key={source.key} {...source.props} />
      ))}
      <img
        src={optimizedImgSrc(src)}
        alt={alt}
        aria-hidden={ariaHidden}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        className={
          fill
            ? `absolute inset-0 size-full text-transparent${
                className ? ` ${className}` : ""
              }`
            : `text-transparent${className ? ` ${className}` : ""}`
        }
      />
    </picture>
  );
}
