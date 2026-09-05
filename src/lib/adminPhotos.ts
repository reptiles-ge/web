import {
  BunnyStorageAdapter,
  INPUT_MIME_TYPES,
  type SupportedInputFormat,
} from "@reptiles-ge/img-compression";
import { createRequire } from "node:module";
import path from "node:path";

import type { GalleryImage, PhotoCredit } from "@/data/species";

import {
  creditsEqual,
  type GalleryOverlayLocale,
  galleryStorageKeys,
  readAdminSpeciesGallery,
} from "@/lib/adminGalleryMdx";
import { openPhotoPullRequest } from "@/lib/adminPhotoPullRequest";
import {
  type OptimizeCatalogUpdate,
  optimizeUploadedOriginal,
} from "@/lib/imageOptimize";
import { CDN_BASE } from "@/lib/site";
import { kaToSlug } from "@/lib/slugify";

const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
const OUTPUT_EXT: Record<"jpeg" | "png" | "webp", string> = {
  jpeg: "jpg",
  png: "png",
  webp: "webp",
};

export type AddSpeciesPhotosResult = {
  added: GalleryImage[];
  pullRequestError?: string;
  pullRequestUrl?: string;
};

export type AdminPhotoCreditInput = {
  date?: string;
  location?: string;
  locationEn?: string;
  photographer?: string;
  photographerEn?: string;
  url?: string;
};

type SharpFn = (input: Buffer) => SharpInstance;

type SharpInstance = {
  jpeg: (options: { mozjpeg: boolean; quality: number }) => SharpInstance;
  metadata: () => Promise<{ format?: string; hasAlpha?: boolean }>;
  png: () => SharpInstance;
  rotate: () => SharpInstance;
  toBuffer: () => Promise<Buffer>;
  webp: (options: { quality: number }) => SharpInstance;
};

export async function addSpeciesPhotos(input: {
  credit: AdminPhotoCreditInput;
  files: Array<{ bytes: Buffer; filename: string }>;
  id: string;
}): Promise<AddSpeciesPhotosResult> {
  if (input.files.length === 0) {
    throw new Error("Choose at least one photo");
  }

  const current = readAdminSpeciesGallery(input.id);
  const used = galleryStorageKeys(current.gallery);
  const storage = createStorage();
  const slug = photographerSlug(input.credit.photographer);
  const kaCredit = creditFromInput(input.credit, "ka");
  const enCredit = creditFromInput(input.credit, "en");
  const added: GalleryImage[] = [];
  const items: Array<{
    ka: GalleryImage;
    overlays: Partial<Record<GalleryOverlayLocale, GalleryImage>>;
  }> = [];
  const catalog: OptimizeCatalogUpdate[] = [];

  const preparedFiles = await Promise.all(
    input.files.map((file) => prepareOriginal(file.bytes)),
  );
  const uploads = await allocateUploadKeys(
    storage,
    used,
    input.id,
    slug,
    preparedFiles,
  );

  const optimizedList = await Promise.all(
    uploads.map(async (upload) => {
      await storage.put(upload.key, upload.buffer, {
        contentType: upload.contentType,
      });
      const src = storage.urlFor(upload.key);
      const optimized = await optimizeUploadedOriginal({
        key: upload.key,
        source: upload.buffer,
        src,
        storage,
      });
      const kaItem: GalleryImage = kaCredit
        ? { credit: kaCredit, src }
        : { src };
      const overlays: Partial<Record<GalleryOverlayLocale, GalleryImage>> = {};
      if (enCredit && !creditsEqual(kaCredit, enCredit)) {
        overlays.en = { credit: enCredit, src };
      }
      return { kaItem, optimized, overlays };
    }),
  );

  for (const result of optimizedList) {
    if (result.optimized) catalog.push(result.optimized);
    items.push({ ka: result.kaItem, overlays: result.overlays });
    added.push(result.kaItem);
  }

  try {
    const pullRequestUrl = await openPhotoPullRequest({
      catalog,
      id: input.id,
      items,
    });
    return { added, pullRequestUrl };
  } catch (error) {
    const pullRequestError =
      error instanceof Error ? error.message : "Could not open pull request";
    return { added, pullRequestError };
  }
}

export function creditFromInput(
  input: AdminPhotoCreditInput,
  locale: "en" | "ka",
): PhotoCredit | undefined {
  const photographer =
    locale === "en"
      ? input.photographerEn?.trim() || input.photographer?.trim()
      : input.photographer?.trim();
  const location =
    locale === "en"
      ? input.locationEn?.trim() || input.location?.trim()
      : input.location?.trim();
  const date = input.date?.trim();
  const url = photoCreditUrl(input.url);
  const credit: PhotoCredit = {
    ...(photographer ? { photographer } : {}),
    ...(url ? { url } : {}),
    ...(location ? { location } : {}),
    ...(date ? { date } : {}),
  };
  return Object.keys(credit).length > 0 ? credit : undefined;
}

async function allocateUploadKeys(
  storage: BunnyStorageAdapter,
  used: Set<string>,
  id: string,
  slug: null | string,
  preparedFiles: Array<{
    buffer: Buffer;
    contentType: string;
    ext: string;
  }>,
  index = 0,
  acc: Array<{ buffer: Buffer; contentType: string; key: string }> = [],
): Promise<Array<{ buffer: Buffer; contentType: string; key: string }>> {
  if (index >= preparedFiles.length) return acc;
  const prepared = preparedFiles[index];
  if (!prepared) return acc;
  const key = await nextStorageKey(storage, used, id, slug, prepared.ext);
  acc.push({
    buffer: prepared.buffer,
    contentType: prepared.contentType,
    key,
  });
  return allocateUploadKeys(
    storage,
    used,
    id,
    slug,
    preparedFiles,
    index + 1,
    acc,
  );
}

function createStorage() {
  const zone = process.env.BUNNY_STORAGE_ZONE;
  const accessKey = process.env.BUNNY_STORAGE_ACCESS_KEY;
  if (!zone || !accessKey) {
    throw new Error(
      "BUNNY_STORAGE_ZONE and BUNNY_STORAGE_ACCESS_KEY must be in .env.local",
    );
  }
  return new BunnyStorageAdapter({
    accessKey,
    cdnBaseUrl: process.env.BUNNY_CDN_BASE_URL ?? CDN_BASE,
    storageZone: zone,
    ...(process.env.BUNNY_STORAGE_REGION
      ? { region: process.env.BUNNY_STORAGE_REGION }
      : {}),
  });
}

function loadSharp(): SharpFn {
  const require = createRequire(
    path.join(
      process.cwd(),
      "node_modules/@reptiles-ge/img-compression/package.json",
    ),
  );
  return require("sharp") as SharpFn;
}

async function nextStorageKey(
  storage: BunnyStorageAdapter,
  used: Set<string>,
  id: string,
  slug: null | string,
  ext: string,
) {
  let n = 1;
  while (n < 500) {
    const key = slug ? `${id}-${slug}-${n}.${ext}` : `${id}-${n}.${ext}`;
    if (!used.has(key) && !(await storage.exists(key))) {
      used.add(key);
      return key;
    }
    n += 1;
  }
  throw new Error("Could not allocate a free CDN filename");
}

function photoCreditUrl(value: string | undefined): string | undefined {
  const url = value?.trim();
  if (!url) return undefined;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("ავტორის URL არასწორია");
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("ავტორის URL უნდა იყოს http ან https");
  }
  return url;
}

function photographerSlug(photographer: string | undefined) {
  if (!photographer) return null;
  const first = photographer.trim().split(/\s+/)[0] ?? "";
  const slug = kaToSlug(first);
  if (!slug || slug.length < 2) return null;
  return slug.slice(0, 24);
}

async function prepareOriginal(bytes: Buffer): Promise<{
  buffer: Buffer;
  contentType: string;
  ext: string;
  format: SupportedInputFormat;
}> {
  if (bytes.byteLength > MAX_UPLOAD_BYTES) {
    throw new Error("File is larger than 12 MB");
  }
  const sharp = loadSharp();
  const image = sharp(bytes).rotate();
  const meta = await image.metadata();
  const decoded = meta.format;
  if (
    decoded !== "jpeg" &&
    decoded !== "png" &&
    decoded !== "webp" &&
    decoded !== "heif" &&
    decoded !== "tiff" &&
    decoded !== "avif"
  ) {
    throw new Error("Use a JPEG, PNG, WebP, or HEIC photo");
  }

  if (decoded === "png" && meta.hasAlpha) {
    const buffer = await image.png().toBuffer();
    return {
      buffer,
      contentType: INPUT_MIME_TYPES.png,
      ext: OUTPUT_EXT.png,
      format: "png",
    };
  }

  const buffer = await image.jpeg({ mozjpeg: true, quality: 92 }).toBuffer();
  return {
    buffer,
    contentType: INPUT_MIME_TYPES.jpeg,
    ext: OUTPUT_EXT.jpeg,
    format: "jpeg",
  };
}
