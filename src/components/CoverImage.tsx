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
