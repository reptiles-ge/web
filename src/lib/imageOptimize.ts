import {
  type ManifestEntry,
  optimizeAndStore,
  resolveImageConfig,
  type StorageAdapter,
} from "@reptiles-ge/img-compression";

import type { OptimizedImageEntry } from "@/lib/optimizedImageSources";

import { serverEnv } from "@/lib/env";
import { putImageManifest } from "@/lib/optimizedImagesApi";
import {
  OPTIMIZED_PREFIX,
  PHOTO_ADDITIONAL_WIDTHS,
  PHOTO_ENCODING,
  PHOTO_FORMATS,
  PHOTO_MAX_WIDTH,
} from "@/lib/photoDerivatives";

const SPECIES_IMAGE_CONFIG = resolveImageConfig({
  additionalWidths: [...PHOTO_ADDITIONAL_WIDTHS],
  avifChromaSubsampling: PHOTO_ENCODING.avifChromaSubsampling,
  avifEffort: PHOTO_ENCODING.avifEffort,
  avifQuality: PHOTO_ENCODING.avifQuality,
  maxWidth: PHOTO_MAX_WIDTH,
  optimizedPrefix: OPTIMIZED_PREFIX,
  webpEffort: PHOTO_ENCODING.webpEffort,
  webpQuality: PHOTO_ENCODING.webpQuality,
});

export type OptimizeCatalogUpdate = {
  asset: null | OptimizedImageEntry;
  entry: ManifestEntry;
  key: string;
  src: string;
};

export async function applyOptimizeCatalog(updates: OptimizeCatalogUpdate[]) {
  if (updates.length === 0) return;
  const token = serverEnv().API_WRITE_TOKEN;
  if (!token) {
    throw new Error("API_WRITE_TOKEN must be in .env.local");
  }
  await putImageManifest(
    token,
    updates.map((update) => ({
      asset: update.asset,
      entry: { ...update.entry, derivatives: [...update.entry.derivatives] },
      key: update.key,
      src: update.src,
    })),
  );
}

export function compactOptimizedAsset(
  key: string,
  entry: ManifestEntry,
  storage: StorageAdapter,
  prefix: string,
): null | OptimizedImageEntry {
  const widths = [...new Set(entry.derivatives.map((item) => item.width))].sort(
    (a, b) => a - b,
  );

  const byFormatWidth = new Map(
    entry.derivatives.map((item) => [`${item.format}@${item.width}`, item]),
  );

  const formats = PHOTO_FORMATS.filter((format) => {
    const widest = entry.derivatives
      .filter((item) => item.format === format)
      .reduce<ManifestEntry["derivatives"][number] | null>(
        (best, item) => (!best || item.width > best.width ? item : best),
        null,
      );
    if (!widest) return false;
    return widest.width < entry.width || widest.byteSize < entry.originalSize;
  });

  if (formats.length === 0) return null;

  const anchor = entry.derivatives[0];
  if (!anchor) throw new Error(`${key} has no derivatives.`);

  const anchorUrl = storage.urlFor(anchor.key);
  const anchorSuffix = `-${anchor.width}.${anchor.format}`;
  if (!anchorUrl.startsWith(prefix) || !anchorUrl.endsWith(anchorSuffix)) {
    throw new Error(
      `Derivative naming changed: ${anchorUrl} is not "${prefix}<path>${anchorSuffix}".`,
    );
  }
  const assetPath = anchorUrl.slice(prefix.length, -anchorSuffix.length);

  for (const width of widths) {
    for (const format of formats) {
      const derivative = byFormatWidth.get(`${format}@${width}`);
      if (!derivative) {
        throw new Error(
          `${key} is missing the ${width}px ${format} derivative.`,
        );
      }
      const expected = `${prefix}${assetPath}-${width}.${format}`;
      if (storage.urlFor(derivative.key) !== expected) {
        throw new Error(
          `${key} derivative url ${storage.urlFor(derivative.key)} does not match ${expected}.`,
        );
      }
    }
  }

  return {
    formats: [...formats],
    height: entry.height,
    path: assetPath,
    width: entry.width,
    widths,
  };
}

export async function optimizeUploadedOriginal(input: {
  key: string;
  source: Buffer;
  src: string;
  storage: StorageAdapter;
}): Promise<null | OptimizeCatalogUpdate> {
  const result = await optimizeAndStore({
    config: SPECIES_IMAGE_CONFIG,
    key: input.key,
    source: input.source,
    storage: input.storage,
    storeOriginal: false,
  });
  if (!result.entry) return null;

  const entry = { ...result.entry, originalKey: input.key };
  const prefix = `${input.storage.urlFor(SPECIES_IMAGE_CONFIG.optimizedPrefix)}/`;
  const asset = compactOptimizedAsset(input.key, entry, input.storage, prefix);
  return { asset, entry, key: input.key, src: input.src };
}
