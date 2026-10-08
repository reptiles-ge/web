import fs from "node:fs";
import path from "node:path";
import { BunnyStorageAdapter } from "@reptiles-ge/img-compression/storage";
import { CDN_BASE } from "../src/lib/site";

export function loadEnv(root = process.cwd()) {
  for (const file of [".env.local", ".env"]) {
    const candidate = path.join(root, file);
    if (!fs.existsSync(candidate)) continue;
    process.loadEnvFile(candidate);
  }
}

export function createBunnyStorageContext() {
  const storageZone = process.env.BUNNY_STORAGE_ZONE;
  const accessKey = process.env.BUNNY_STORAGE_ACCESS_KEY;

  if (!storageZone || !accessKey) {
    throw new Error(
      "BUNNY_STORAGE_ZONE and BUNNY_STORAGE_ACCESS_KEY must be set. Put them in .env.local or .env.",
    );
  }

  const storage = new BunnyStorageAdapter({
    accessKey,
    cdnBaseUrl: process.env.BUNNY_CDN_BASE_URL ?? CDN_BASE,
    storageZone,
    ...(process.env.BUNNY_STORAGE_REGION
      ? { region: process.env.BUNNY_STORAGE_REGION }
      : {}),
  });

  return { accessKey, storage, storageZone };
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;

  async function worker() {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await fn(items[index] as T, index);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, worker),
  );
  return results;
}

export function printProgress(done: number, total: number, json: boolean) {
  if (json) return;
  process.stderr.write(`\rChecked ${done}/${total}`);
  if (done === total) process.stderr.write("\n");
}

type WalkOptions = {
  scanExts: ReadonlySet<string>;
  skipDirNames: ReadonlySet<string>;
  skipFileNames: ReadonlySet<string>;
  skipFileSuffixes?: readonly string[];
};

export function walkFiles(
  dir: string,
  options: WalkOptions,
  out: string[] = [],
) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") && entry.name !== ".") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (options.skipDirNames.has(entry.name)) continue;
      walkFiles(full, options, out);
      continue;
    }
    if (options.skipFileSuffixes?.some((s) => entry.name.endsWith(s))) continue;
    if (options.skipFileNames.has(entry.name)) continue;
    if (options.scanExts.has(path.extname(entry.name).toLowerCase())) {
      out.push(full);
    }
  }
  return out;
}
