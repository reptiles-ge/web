import { optimizedBaseUrl, optimizedImages } from "./optimizedImages.generated";

export type OptimizedImageFormat = "avif" | "webp";

export type OptimizedImageEntry = {
  path: string;
  width: number;
  height: number;
  widths: number[];
  formats: OptimizedImageFormat[];
};

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

export function optimizedImgSrc(src: string): string {
  const entry = optimizedEntry(src);
  if (!entry) return src;
  const format = entry.formats.includes("webp") ? "webp" : entry.formats[0];
  const width =
    entry.widths.find((item) => item >= 1200) ??
    entry.widths[entry.widths.length - 1];
  return `${optimizedBaseUrl}${entry.path}-${width}.${format}`;
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

  return entry.formats.map((format) => ({
    key: `${options.media ?? "all"}-${format}`,
    props: {
      type: OPTIMIZED_IMAGE_MIME_TYPES[format],
      srcSet: optimizedSrcSet(entry, format),
      sizes: options.sizes,
      ...(options.media ? { media: options.media } : {}),
    },
  }));
}
