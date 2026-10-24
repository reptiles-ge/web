import type { GalleryImage, PhotoCredit } from "@/data/speciesTypes";

import { creditFromInput, type PhotoCreditInput } from "@/lib/photoCreditInput";
import {
  optimizedPhotoFormats,
  PHOTO_FORMATS,
  PHOTO_MAX_INPUT_PIXELS,
  photoAssetPath,
  photoDerivativeHeight,
  photoDerivativeKey,
  photoDerivativeWidths,
  type PhotoFormat,
  photographerSlug,
  speciesPhotoKey,
} from "@/lib/photoDerivatives";
import { CDN_BASE } from "@/lib/site";

import type { OptimizedImageRow } from "../db/optimizedImages";
import type { SpeciesRecord } from "../db/speciesRows";
import type { PhotoStorage } from "./bunnyStorage";

import { ApiError } from "./errors";
import { probeImage } from "./imageProbe";

const MAX_ORIGINAL_BYTES = 25 * 1024 * 1024;

const MAX_KEY_ATTEMPTS = 500;

const ORIGINAL_TYPES = {
  jpeg: { contentType: "image/jpeg", ext: "jpg" },
  png: { contentType: "image/png", ext: "png" },
} as const;

const DERIVATIVE_TYPES: Record<PhotoFormat, string> = {
  avif: "image/avif",
  webp: "image/webp",
};

type CheckedPhoto = {
  derivatives: Array<{
    bytes: Uint8Array<ArrayBuffer>;
    format: PhotoFormat;
    width: number;
  }>;
  original: {
    bytes: Uint8Array<ArrayBuffer>;
    contentType: string;
    ext: string;
    height: number;
    width: number;
  };
};

type PhotoCredits = { en?: PhotoCredit; ka?: PhotoCredit };

export function addGalleryPhoto(
  record: SpeciesRecord,
  src: string,
  credits: PhotoCredits,
) {
  const photo: GalleryImage = credits.ka
    ? { credit: credits.ka, src }
    : { src };
  record.base.gallery.push(photo);
  if (credits.en && JSON.stringify(credits.en) !== JSON.stringify(credits.ka)) {
    const translation = record.translations.en;
    translation.gallery = [
      ...(translation.gallery ?? []),
      { credit: credits.en, src },
    ];
  }
  return photo;
}

export async function checkPhotoFiles(
  original: File,
  derivatives: File[],
): Promise<CheckedPhoto> {
  if (original.size > MAX_ORIGINAL_BYTES) {
    throw invalid("The original is larger than 25 MB");
  }
  const originalBytes = new Uint8Array(await original.arrayBuffer());
  const source = probeImage(originalBytes);
  if (!source || (source.format !== "jpeg" && source.format !== "png")) {
    throw invalid("The original must be a JPEG or PNG");
  }
  if (source.width * source.height > PHOTO_MAX_INPUT_PIXELS) {
    throw invalid("The original has too many pixels");
  }
  const widths = photoDerivativeWidths(source.width);
  const expected = new Map<string, number>(
    widths.flatMap((width) =>
      PHOTO_FORMATS.map((format) => [`${format}@${width}`, width] as const),
    ),
  );
  const checked: CheckedPhoto["derivatives"] = [];
  const contents = await Promise.all(
    derivatives.map(async (file) => new Uint8Array(await file.arrayBuffer())),
  );
  for (const bytes of contents) {
    const probe = probeImage(bytes);
    if (!probe || (probe.format !== "avif" && probe.format !== "webp")) {
      throw invalid("Every derivative must be an AVIF or WebP image");
    }
    const id = `${probe.format}@${probe.width}`;
    if (!expected.has(id)) {
      throw invalid(`Unexpected derivative ${id}`, { expected: widths });
    }
    const height = photoDerivativeHeight(source, probe.width);
    if (Math.abs(probe.height - height) > 1) {
      throw invalid(`Derivative ${id} does not keep the aspect ratio`);
    }
    expected.delete(id);
    checked.push({ bytes, format: probe.format, width: probe.width });
  }
  if (expected.size > 0) {
    throw invalid("Derivatives are missing", { missing: [...expected.keys()] });
  }
  return {
    derivatives: checked.sort(
      (a, b) => a.width - b.width || a.format.localeCompare(b.format),
    ),
    original: {
      bytes: originalBytes,
      ...ORIGINAL_TYPES[source.format],
      height: source.height,
      width: source.width,
    },
  };
}

export function optimizedImage(
  photo: CheckedPhoto,
  key: string,
  storage: PhotoStorage,
): null | OptimizedImageRow {
  const formats = optimizedPhotoFormats(
    photo.derivatives.map((item) => ({
      byteSize: item.bytes.byteLength,
      format: item.format,
      width: item.width,
    })),
    photo.original.bytes.byteLength,
  );
  if (formats.length === 0) return null;
  const widths = [...new Set(photo.derivatives.map((item) => item.width))];
  const largest = Math.max(...widths);
  return {
    formats,
    height: photoDerivativeHeight(photo.original, largest),
    path: photoAssetPath(key),
    src: storage.urlFor(key),
    width: largest,
    widths,
  };
}

export function photoCredits(input: PhotoCreditInput): PhotoCredits {
  try {
    return {
      en: creditFromInput(input, "en"),
      ka: creditFromInput(input, "ka"),
    };
  } catch (error) {
    throw invalid(error instanceof Error ? error.message : "Invalid credit");
  }
}

export async function storePhoto(
  storage: PhotoStorage,
  photo: CheckedPhoto,
  record: SpeciesRecord,
  photographer: string | undefined,
) {
  const used = new Set(
    record.base.gallery.flatMap((item) =>
      item.src.startsWith(`${CDN_BASE}/`)
        ? [decodeURIComponent(item.src.slice(CDN_BASE.length + 1))]
        : [],
    ),
  );
  const existing = await storage.files("");
  const slug = photographerSlug(photographer);
  let key: string | undefined;
  for (let n = 1; n <= MAX_KEY_ATTEMPTS && !key; n += 1) {
    const candidate = speciesPhotoKey({
      ext: photo.original.ext,
      id: record.base.id,
      n,
      slug,
    });
    if (!used.has(candidate) && !existing.has(candidate)) key = candidate;
  }
  if (!key) {
    throw new ApiError(
      409,
      "conflict",
      "Could not allocate a free CDN filename",
    );
  }
  await storage.put(key, photo.original.bytes, photo.original.contentType);
  await Promise.all(
    photo.derivatives.map((item) =>
      storage.put(
        photoDerivativeKey(key, item.width, item.format),
        item.bytes,
        DERIVATIVE_TYPES[item.format],
      ),
    ),
  );
  return key;
}

function invalid(message: string, details?: unknown) {
  return new ApiError(400, "invalid_request", message, details);
}
