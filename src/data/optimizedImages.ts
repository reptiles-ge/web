import { optimizedBaseUrl, optimizedImages } from "./optimizedImages.generated";

export type OptimizedImageFormat = "avif" | "webp";

export type OptimizedImageEntry = {
  path: string;
  width: number;
  height: number;
  widths: number[];
};

export const OPTIMIZED_IMAGE_FORMATS: OptimizedImageFormat[] = ["avif", "webp"];

export const OPTIMIZED_IMAGE_MIME_TYPES: Record<OptimizedImageFormat, string> =
  {
    avif: "image/avif",
    webp: "image/webp",
  };

export function optimizedEntry(
  src: string | null | undefined,
): OptimizedImageEntry | null {
  if (!src) return null;
  return optimizedImages[src] ?? null;
}

export function optimizedSrcSet(
  entry: OptimizedImageEntry,
  format: OptimizedImageFormat,
): string {
  return entry.widths
    .map(
      (width) =>
        `${optimizedBaseUrl}${entry.path}-${width}.${format} ${width}w`,
    )
    .join(", ");
}

export type PictureSource = {
  key: string;
  props: {
    type: string;
    srcSet: string;
    sizes: string;
    media?: string;
  };
};

export function pictureSources(
  src: string | null | undefined,
  options: { sizes: string; media?: string },
): PictureSource[] {
  const entry = optimizedEntry(src);
  if (!entry) return [];

  return OPTIMIZED_IMAGE_FORMATS.map((format) => ({
    key: `${options.media ?? "all"}-${format}`,
    props: {
      type: OPTIMIZED_IMAGE_MIME_TYPES[format],
      srcSet: optimizedSrcSet(entry, format),
      sizes: options.sizes,
      ...(options.media ? { media: options.media } : {}),
    },
  }));
}
