export type OptimizedImageFormat = "avif" | "webp";

export type OptimizedImageSource = {
  format: OptimizedImageFormat;
  url: string;
  width: number;
  height: number;
};

export type OptimizedImageAsset = {
  width: number;
  height: number;
  sources: OptimizedImageSource[];
};

export type OptimizedImageMap = Record<string, OptimizedImageAsset>;

export const OPTIMIZED_IMAGE_FORMATS: OptimizedImageFormat[] = ["avif", "webp"];

export const OPTIMIZED_IMAGE_MIME_TYPES: Record<OptimizedImageFormat, string> = {
  avif: "image/avif",
  webp: "image/webp",
};

export function optimizedSrcSet(
  asset: OptimizedImageAsset,
  format: OptimizedImageFormat,
): string | null {
  const candidates = asset.sources
    .filter((source) => source.format === format)
    .sort((a, b) => a.width - b.width)
    .map((source) => `${source.url} ${source.width}w`);

  return candidates.length === 0 ? null : candidates.join(", ");
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
  optimized: OptimizedImageMap,
  src: string | null | undefined,
  options: { sizes: string; media?: string },
): PictureSource[] {
  if (!src) return [];
  const asset = optimized[src];
  if (!asset) return [];

  return OPTIMIZED_IMAGE_FORMATS.flatMap((format) => {
    const srcSet = optimizedSrcSet(asset, format);
    if (!srcSet) return [];
    return [
      {
        key: `${options.media ?? "all"}-${format}`,
        props: {
          type: OPTIMIZED_IMAGE_MIME_TYPES[format],
          srcSet,
          sizes: options.sizes,
          ...(options.media ? { media: options.media } : {}),
        },
      },
    ];
  });
}
