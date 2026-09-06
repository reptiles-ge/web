import { optimizedBaseUrl, optimizedImages } from "./optimizedImages.generated";

export type OptimizedImageEntry = {
  formats: OptimizedImageFormat[];
  height: number;
  path: string;
  width: number;
  widths: number[];
};

export type OptimizedImageFormat = "avif" | "webp";

export const OPTIMIZED_IMAGE_MIME_TYPES: Record<OptimizedImageFormat, string> =
  {
    avif: "image/avif",
    webp: "image/webp",
  };

export type PictureSource = {
  key: string;
  props: {
    media?: string;
    sizes: string;
    srcSet: string;
    type: string;
  };
};

export function optimizedEntry(
  src: null | string | undefined,
): null | OptimizedImageEntry {
  if (!src) return null;
  return optimizedImages[src] ?? null;
}

export function optimizedImgSrc(src: string, minWidth = 1200): string {
  const entry = optimizedEntry(src);
  if (!entry) return src;
  const format = entry.formats.includes("webp") ? "webp" : entry.formats[0];
  const width =
    entry.widths.find((item) => item >= minWidth) ??
    entry.widths[entry.widths.length - 1];
  return `${optimizedBaseUrl}${entry.path}-${width}.${format}`;
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

export function pictureSources(
  src: null | string | undefined,
  options: { media?: string; sizes: string },
): PictureSource[] {
  const entry = optimizedEntry(src);
  if (!entry) return [];

  return entry.formats.map((format) => ({
    key: `${options.media ?? "all"}-${format}`,
    props: {
      sizes: options.sizes,
      srcSet: optimizedSrcSet(entry, format),
      type: OPTIMIZED_IMAGE_MIME_TYPES[format],
      ...(options.media ? { media: options.media } : {}),
    },
  }));
}

export function srcSetPreloadUrl(srcSet: string) {
  const candidates = srcSet
    .split(",")
    .map((part) => {
      const [url, descriptor] = part.trim().split(/\s+/);
      const width = descriptor?.endsWith("w")
        ? Number(descriptor.slice(0, -1))
        : 0;
      return { url, width };
    })
    .filter((item): item is { url: string; width: number } => Boolean(item.url));

  return (
    candidates.find((item) => item.width >= 800)?.url ??
    candidates[candidates.length - 1]?.url ??
    candidates[0]?.url
  );
}
