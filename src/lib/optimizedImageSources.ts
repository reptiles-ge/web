export type OptimizedImageEntry = {
  baseUrl?: string;
  formats: OptimizedImageFormat[];
  height: number;
  path: string;
  width: number;
  widths: number[];
};

export type ResolvedImageEntries = Record<string, ResolvedImageEntry>;

export type ResolvedImageEntry = OptimizedImageEntry & { baseUrl: string };

type OptimizedImageFormat = "avif" | "webp";

const OPTIMIZED_IMAGE_MIME_TYPES: Record<OptimizedImageFormat, string> = {
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

export function entryImgSize(
  entry: null | OptimizedImageEntry | undefined,
  minWidth = 1200,
): null | { height: number; width: number } {
  if (!entry?.width || !entry.height) return null;
  const width = entryImgWidth(entry, minWidth);
  return {
    height: Math.round((entry.height * width) / entry.width),
    width,
  };
}

export function entryImgSrc(
  src: string,
  entry: null | ResolvedImageEntry | undefined,
  minWidth = 1200,
): string {
  if (!entry) return src;
  const format = entry.formats.includes("webp") ? "webp" : entry.formats[0];
  return `${entry.baseUrl}${entry.path}-${entryImgWidth(entry, minWidth)}.${format}`;
}

export function entryPictureSources(
  entry: null | ResolvedImageEntry | undefined,
  options: { media?: string; sizes: string },
): PictureSource[] {
  if (!entry) return [];

  return entry.formats.map((format) => ({
    key: `${options.media ?? "all"}-${format}`,
    props: {
      sizes: options.sizes,
      srcSet: entrySrcSet(entry, format),
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
    .filter((item): item is { url: string; width: number } =>
      Boolean(item.url),
    );

  return (
    candidates.find((item) => item.width >= 800)?.url ??
    candidates[candidates.length - 1]?.url ??
    candidates[0]?.url
  );
}

function entryImgWidth(entry: OptimizedImageEntry, minWidth: number) {
  return (
    entry.widths.find((item) => item >= minWidth) ??
    entry.widths[entry.widths.length - 1]
  );
}

function entrySrcSet(
  entry: ResolvedImageEntry,
  format: OptimizedImageFormat,
): string {
  return entry.widths
    .map(
      (width) => `${entry.baseUrl}${entry.path}-${width}.${format} ${width}w`,
    )
    .join(", ");
}
