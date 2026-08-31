import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import path from "node:path";
import {
  BunnyStorageAdapter,
  INPUT_MIME_TYPES,
  type SupportedInputFormat,
} from "@reptiles-ge/img-compression";
import { kaToSlug } from "@/lib/slugify";
import { CDN_BASE } from "@/lib/site";
import type { GalleryImage, PhotoCredit } from "@/data/species";
import {
  appendGalleryItemToSpecies,
  galleryStorageKeys,
  readAdminSpeciesGallery,
} from "@/lib/adminGalleryMdx";

const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
const OUTPUT_EXT: Record<"jpeg" | "png" | "webp", string> = {
  jpeg: "jpg",
  png: "png",
  webp: "webp",
};

type SharpInstance = {
  rotate: () => SharpInstance;
  metadata: () => Promise<{ format?: string; hasAlpha?: boolean }>;
  jpeg: (options: { quality: number; mozjpeg: boolean }) => SharpInstance;
  png: () => SharpInstance;
  webp: (options: { quality: number }) => SharpInstance;
  toBuffer: () => Promise<Buffer>;
};

type SharpFn = (input: Buffer) => SharpInstance;

function loadSharp(): SharpFn {
  const require = createRequire(
    path.join(
      process.cwd(),
      "node_modules/@reptiles-ge/img-compression/package.json",
    ),
  );
  return require("sharp") as SharpFn;
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
    storageZone: zone,
    accessKey,
    cdnBaseUrl: process.env.BUNNY_CDN_BASE_URL ?? CDN_BASE,
    ...(process.env.BUNNY_STORAGE_REGION
      ? { region: process.env.BUNNY_STORAGE_REGION }
      : {}),
  });
}

export type AdminPhotoCreditInput = {
  photographer?: string;
  photographerEn?: string;
  location?: string;
  locationEn?: string;
  date?: string;
};

function creditFromInput(
  input: AdminPhotoCreditInput,
  locale: "ka" | "en",
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
  const credit: PhotoCredit = {
    ...(photographer ? { photographer } : {}),
    ...(location ? { location } : {}),
    ...(date ? { date } : {}),
  };
  return Object.keys(credit).length > 0 ? credit : undefined;
}

function photographerSlug(photographer: string | undefined) {
  if (!photographer) return null;
  const first = photographer.trim().split(/\s+/)[0] ?? "";
  const slug = kaToSlug(first);
  if (!slug || slug.length < 2) return null;
  return slug.slice(0, 24);
}

async function nextStorageKey(
  storage: BunnyStorageAdapter,
  used: Set<string>,
  id: string,
  slug: string | null,
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

async function prepareOriginal(bytes: Buffer): Promise<{
  buffer: Buffer;
  format: SupportedInputFormat;
  contentType: string;
  ext: string;
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
      format: "png",
      contentType: INPUT_MIME_TYPES.png,
      ext: OUTPUT_EXT.png,
    };
  }

  const buffer = await image.jpeg({ quality: 92, mozjpeg: true }).toBuffer();
  return {
    buffer,
    format: "jpeg",
    contentType: INPUT_MIME_TYPES.jpeg,
    ext: OUTPUT_EXT.jpeg,
  };
}

function compileSpeciesCatalog() {
  const tsxCli = path.join(process.cwd(), "node_modules/tsx/dist/cli.mjs");
  const script = path.join(process.cwd(), "scripts/compile-species.ts");
  execFileSync(process.execPath, [tsxCli, script], {
    cwd: process.cwd(),
    stdio: ["ignore", "pipe", "pipe"],
    env: process.env,
  });
}

export async function addSpeciesPhotos(input: {
  id: string;
  files: Array<{ bytes: Buffer; filename: string }>;
  credit: AdminPhotoCreditInput;
}): Promise<GalleryImage[]> {
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

  for (const file of input.files) {
    const prepared = await prepareOriginal(file.bytes);
    const key = await nextStorageKey(
      storage,
      used,
      input.id,
      slug,
      prepared.ext,
    );
    await storage.put(key, prepared.buffer, {
      contentType: prepared.contentType,
    });
    const src = storage.urlFor(key);
    const kaItem: GalleryImage = kaCredit
      ? { src, credit: kaCredit }
      : { src };
    const enItem: GalleryImage = enCredit
      ? { src, credit: enCredit }
      : { src };
    appendGalleryItemToSpecies(input.id, kaItem, enItem);
    added.push(kaItem);
  }

  try {
    compileSpeciesCatalog();
  } catch (error) {
    const detail = error instanceof Error ? error.message : "compile failed";
    throw new Error(
      `Photos are in MDX, but species:compile failed: ${detail}`,
    );
  }
  return added;
}
