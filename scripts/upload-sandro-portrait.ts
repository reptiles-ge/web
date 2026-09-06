import { BunnyStorageAdapter } from "@reptiles-ge/img-compression";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

import {
  applyOptimizeCatalog,
  optimizeUploadedOriginal,
} from "../src/lib/imageOptimize";
import { CDN_BASE } from "../src/lib/site";

const KEY = "authors/sandro-khakhva.jpg";
const SRC = `${CDN_BASE}/${KEY}`;
const INPUT =
  "/Users/asyncfinkd/.cursor/projects/Users-asyncfinkd-Desktop-reptiles/assets/728528249_1561391668985780_7058571497526828681_n-cf71d485-43ca-4341-9bdf-2bdd83aaaf17.jpg";

type SharpFn = (input: Buffer) => {
  jpeg: (options: { mozjpeg: boolean; quality: number }) => {
    toBuffer: () => Promise<Buffer>;
  };
  rotate: () => SharpInstance;
};

type SharpInstance = {
  jpeg: (options: { mozjpeg: boolean; quality: number }) => SharpInstance;
  toBuffer: () => Promise<Buffer>;
};

function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    const candidate = path.join(process.cwd(), file);
    if (!fs.existsSync(candidate)) continue;
    process.loadEnvFile(candidate);
  }
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

async function main() {
  loadEnv();
  const storage = createStorage();
  const sharp = loadSharp();
  const bytes = fs.readFileSync(INPUT);
  const buffer = await sharp(bytes).rotate().jpeg({ mozjpeg: true, quality: 92 }).toBuffer();
  await storage.put(KEY, buffer, { contentType: "image/jpeg" });
  const src = storage.urlFor(KEY);
  if (src !== SRC) {
    throw new Error(`CDN URL mismatch: ${src}`);
  }
  const optimized = await optimizeUploadedOriginal({
    key: KEY,
    source: buffer,
    src,
    storage,
  });
  if (optimized) {
    await applyOptimizeCatalog(process.cwd(), [optimized]);
  }
  process.stdout.write(`${src}\n`);
}

void main();
