import { kaToSlug } from "@/lib/slugify";

export const PHOTO_MAX_WIDTH = 2400;

export const PHOTO_ADDITIONAL_WIDTHS = [320, 400, 640, 800, 1200] as const;

export const PHOTO_FORMATS = ["avif", "webp"] as const;

export type PhotoFormat = (typeof PHOTO_FORMATS)[number];

export const PHOTO_ENCODING = {
  avifChromaSubsampling: "4:4:4",
  avifEffort: 4,
  avifQuality: 60,
  originalJpegQuality: 92,
  webpEffort: 5,
  webpQuality: 82,
} as const;

export const PHOTO_MAX_UPLOAD_BYTES = 12 * 1024 * 1024;

export const PHOTO_MAX_INPUT_PIXELS = 80_000_000;

export const OPTIMIZED_PREFIX = "optimized";

export type PhotoDerivativeSize = {
  byteSize: number;
  format: PhotoFormat;
  width: number;
};

export function optimizedPhotoFormats(
  derivatives: PhotoDerivativeSize[],
  originalSize: number,
): PhotoFormat[] {
  const largest = Math.max(0, ...derivatives.map((item) => item.width));
  return PHOTO_FORMATS.filter((format) => {
    const widest = derivatives
      .filter((item) => item.format === format)
      .reduce<null | PhotoDerivativeSize>(
        (best, item) => (!best || item.width > best.width ? item : best),
        null,
      );
    if (!widest) return false;
    return widest.width < largest || widest.byteSize < originalSize;
  });
}

export function photoAssetPath(key: string) {
  return key.replace(/\.[a-z0-9]+$/i, "");
}

export function photoDerivativeHeight(
  source: { height: number; width: number },
  width: number,
) {
  if (width >= source.width) return source.height;
  return Math.max(1, Math.round((source.height * width) / source.width));
}

export function photoDerivativeKey(
  key: string,
  width: number,
  format: PhotoFormat,
) {
  return `${OPTIMIZED_PREFIX}/${photoAssetPath(key)}-${width}.${format}`;
}

export function photoDerivativeWidths(sourceWidth: number): number[] {
  const widths = new Set<number>(
    [...PHOTO_ADDITIONAL_WIDTHS, PHOTO_MAX_WIDTH].filter(
      (width) => width <= PHOTO_MAX_WIDTH && width < sourceWidth,
    ),
  );
  widths.add(Math.min(sourceWidth, PHOTO_MAX_WIDTH));
  return [...widths].sort((a, b) => a - b);
}

export function photographerSlug(photographer: string | undefined) {
  if (!photographer) return null;
  const first = photographer.trim().split(/\s+/)[0] ?? "";
  const slug = kaToSlug(first);
  if (!slug || slug.length < 2) return null;
  return slug.slice(0, 24);
}

export function speciesPhotoKey(input: {
  ext: string;
  id: string;
  n: number;
  slug: null | string;
}) {
  return input.slug
    ? `${input.id}-${input.slug}-${input.n}.${input.ext}`
    : `${input.id}-${input.n}.${input.ext}`;
}
