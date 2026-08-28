import { pictureSources } from "@/data/optimizedImages";

type CoverImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
};

export function CoverImage({
  src,
  alt,
  sizes,
  className,
  priority = false,
}: CoverImageProps) {
  return (
    <picture>
      {pictureSources(src, { sizes }).map((source) => (
        <source key={source.key} {...source.props} />
      ))}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
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
