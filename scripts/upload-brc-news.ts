import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import {
  BunnyStorageAdapter,
  INPUT_MIME_TYPES,
  renderAndStoreOgImage,
  resolveImageConfig,
  resolveOgImageConfig,
} from "@reptiles-ge/img-compression";
import { CDN_BASE } from "../src/lib/site";
import {
  applyOptimizeCatalog,
  optimizeUploadedOriginal,
} from "../src/lib/imageOptimize";

const ROOT = process.cwd();
const SRC_DIR = "/tmp/brc-2026";

process.loadEnvFile(path.join(ROOT, ".env"));

const FILES = [
  {
    from: "hero-full.jpg",
    key: "news-batumi-19300-hoekstra-1.jpg",
    og: true,
  },
  {
    from: "sunrise.jpg",
    key: "news-batumi-19300-meskhidze-1.jpg",
    og: false,
  },
  {
    from: "kite.jpg",
    key: "news-batumi-19300-cosentino-kite-1.jpg",
    og: false,
  },
  {
    from: "station2.jpg",
    key: "news-batumi-19300-eldakamawy-1.jpg",
    og: false,
  },
] as const;

type SharpInstance = {
  rotate: () => SharpInstance;
  jpeg: (options: { quality: number; mozjpeg: boolean }) => SharpInstance;
  toBuffer: () => Promise<Buffer>;
};
type SharpFn = (input: Buffer) => SharpInstance;

function loadSharp(): SharpFn {
  const require = createRequire(
    path.join(ROOT, "node_modules/@reptiles-ge/img-compression/package.json"),
  );
  return require("sharp") as SharpFn;
}

function createStorage() {
  const zone = process.env.BUNNY_STORAGE_ZONE;
  const accessKey = process.env.BUNNY_STORAGE_ACCESS_KEY;
  if (!zone || !accessKey) {
    throw new Error("Missing Bunny credentials");
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

async function main() {
  const sharp = loadSharp();
  const storage = createStorage();
  const config = resolveImageConfig({
    maxWidth: 2400,
    additionalWidths: [400, 800, 1200],
  });
  const og = resolveOgImageConfig();
  const catalog = [];

  for (const file of FILES) {
    const raw = fs.readFileSync(path.join(SRC_DIR, file.from));
    const buffer = await sharp(raw)
      .rotate()
      .jpeg({ quality: 92, mozjpeg: true })
      .toBuffer();
    await storage.put(file.key, buffer, { contentType: INPUT_MIME_TYPES.jpeg });
    const src = storage.urlFor(file.key);
    console.log("uploaded", src, buffer.byteLength);
    const optimized = await optimizeUploadedOriginal({
      key: file.key,
      source: buffer,
      src,
      storage,
    });
    if (optimized) catalog.push(optimized);
    if (file.og) {
      const stored = await renderAndStoreOgImage({
        key: file.key,
        source: buffer,
        alt: file.key,
        storage,
        og,
        config,
      });
      console.log("og", stored.key, stored.byteSize);
    }
  }

  await applyOptimizeCatalog(ROOT, catalog);
  console.log("catalog", catalog.length);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
