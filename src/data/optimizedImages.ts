import {
  entryImgSrc,
  entryPictureSources,
  type PictureSource,
  type ResolvedImageEntries,
  type ResolvedImageEntry,
} from "@/lib/optimizedImageSources";

import { optimizedBaseUrl, optimizedImages } from "./optimizedImages.generated";

export type {
  OptimizedImageEntry,
  PictureSource,
  ResolvedImageEntries,
  ResolvedImageEntry,
} from "@/lib/optimizedImageSources";
export { srcSetPreloadUrl } from "@/lib/optimizedImageSources";

export function allOptimizedImageEntries(): ResolvedImageEntries {
  return optimizedImageEntries(Object.keys(optimizedImages));
}

export function isOptimizedImageSrc(value: string): boolean {
  return Object.hasOwn(optimizedImages, value);
}

export function optimizedEntry(
  src: null | string | undefined,
): null | ResolvedImageEntry {
  if (!src) return null;
  const entry = optimizedImages[src];
  if (!entry) return null;
  return { ...entry, baseUrl: entry.baseUrl ?? optimizedBaseUrl };
}

export function optimizedImageEntries(
  srcs: Iterable<null | string | undefined>,
): ResolvedImageEntries {
  const entries: ResolvedImageEntries = {};
  for (const src of srcs) {
    if (!src || entries[src]) continue;
    const entry = optimizedEntry(src);
    if (entry) entries[src] = entry;
  }
  return entries;
}

export function optimizedImgSrc(src: string, minWidth = 1200): string {
  return entryImgSrc(src, optimizedEntry(src), minWidth);
}

export function pictureSources(
  src: null | string | undefined,
  options: { media?: string; sizes: string },
): PictureSource[] {
  return entryPictureSources(optimizedEntry(src), options);
}
