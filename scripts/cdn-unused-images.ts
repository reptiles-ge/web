import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { BunnyStorageAdapter } from "@reptiles-ge/img-compression/storage";
import {
  optimizedBaseUrl,
  optimizedImages,
} from "../src/data/optimizedImages.generated";
import { georgiaRegionPaths, type RegionPathId } from "../src/data/georgia-paths";
import { getRegionHeroImage } from "../src/data/regionImages";
import { images as siteImages } from "../src/data/speciesMedia";
import {
  CDN_BASE,
  FALLBACK_OG_IMAGE_URL,
  SITE_OG_IMAGE_URL,
  ogImageUrlFromSrc,
} from "../src/lib/site";

const ROOT = process.cwd();
const IMAGE_EXT = /\.(avif|gif|jpe?g|png|svg|webp)$/i;
const CDN_URL_RE = /https:\/\/cdn\.reptiles\.ge\/[^"'\\\s)>]+/g;
const SKIP_DIR_NAMES = new Set([
  ".git",
  ".next",
  "coverage",
  "node_modules",
  "playwright-report",
  "test-results",
]);
const SKIP_FILE_NAMES = new Set([
  "image-manifest.json",
  "optimizedImages.generated.ts",
]);
const SCAN_EXTS = new Set([
  ".css",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mdx",
  ".ts",
  ".tsx",
]);
const SCAN_ROOTS = ["src", "messages", "scripts"];

const REGION_HOSTS: Record<string, string> = {
  "": "storage.bunnycdn.com",
  de: "storage.bunnycdn.com",
  uk: "uk.storage.bunnycdn.com",
  ny: "ny.storage.bunnycdn.com",
  la: "la.storage.bunnycdn.com",
  sg: "sg.storage.bunnycdn.com",
  se: "se.storage.bunnycdn.com",
  br: "br.storage.bunnycdn.com",
  jh: "jh.storage.bunnycdn.com",
  syd: "syd.storage.bunnycdn.com",
};

function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    const candidate = path.join(ROOT, file);
    if (!fs.existsSync(candidate)) continue;
    process.loadEnvFile(candidate);
  }
}

function keyFromCdnUrl(url: string): string | null {
  const base = (process.env.BUNNY_CDN_BASE_URL ?? CDN_BASE).replace(/\/+$/, "");
  if (!url.startsWith(`${base}/`) && !url.startsWith(`${CDN_BASE}/`)) {
    return null;
  }
  const prefix = url.startsWith(`${base}/`) ? base : CDN_BASE;
  const key = decodeURIComponent(
    url.slice(prefix.length + 1).split("?")[0] ?? "",
  );
  return key || null;
}

function walkFiles(dir: string, out: string[] = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") && entry.name !== ".") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIR_NAMES.has(entry.name)) continue;
      walkFiles(full, out);
      continue;
    }
    if (SKIP_FILE_NAMES.has(entry.name)) continue;
    if (SCAN_EXTS.has(path.extname(entry.name).toLowerCase())) {
      out.push(full);
    }
  }
  return out;
}

function markUsed(used: Set<string>, url: string) {
  const key = keyFromCdnUrl(url);
  if (!key) return;
  used.add(key);

  if (key.startsWith("optimized/") || key.startsWith("og/")) return;

  const src = `${CDN_BASE}/${key}`;
  const og = ogImageUrlFromSrc(src);
  if (og) {
    const ogKey = keyFromCdnUrl(og);
    if (ogKey) used.add(ogKey);
  }

  const entry = optimizedImages[src];
  if (!entry) return;
  for (const format of entry.formats) {
    for (const width of entry.widths) {
      const optimizedKey = keyFromCdnUrl(
        `${optimizedBaseUrl}${entry.path}-${width}.${format}`,
      );
      if (optimizedKey) used.add(optimizedKey);
    }
  }
}

function collectUsedKeys(): Set<string> {
  const used = new Set<string>();

  for (const rel of SCAN_ROOTS) {
    for (const filePath of walkFiles(path.join(ROOT, rel))) {
      const text = fs.readFileSync(filePath, "utf8");
      for (const match of text.matchAll(CDN_URL_RE)) {
        markUsed(used, match[0]);
      }
    }
  }

  for (const id of Object.keys(georgiaRegionPaths) as RegionPathId[]) {
    markUsed(used, getRegionHeroImage(id));
  }
  for (const src of Object.values(siteImages)) {
    markUsed(used, src);
  }
  markUsed(used, SITE_OG_IMAGE_URL);
  markUsed(used, FALLBACK_OG_IMAGE_URL);
  used.add("image-manifest.json");

  return used;
}

function createStorage() {
  const zone = process.env.BUNNY_STORAGE_ZONE;
  const accessKey = process.env.BUNNY_STORAGE_ACCESS_KEY;
  if (!zone || !accessKey) {
    throw new Error(
      "BUNNY_STORAGE_ZONE and BUNNY_STORAGE_ACCESS_KEY must be set. Put them in .env.local or .env.",
    );
  }
  return {
    accessKey,
    storage: new BunnyStorageAdapter({
      accessKey,
      cdnBaseUrl: process.env.BUNNY_CDN_BASE_URL ?? CDN_BASE,
      storageZone: zone,
      ...(process.env.BUNNY_STORAGE_REGION
        ? { region: process.env.BUNNY_STORAGE_REGION }
        : {}),
    }),
    storageZone: zone,
  };
}

function storageOrigin() {
  const region = (process.env.BUNNY_STORAGE_REGION ?? "").trim().toLowerCase();
  const host = REGION_HOSTS[region];
  if (!host) {
    throw new Error(`Unknown BUNNY_STORAGE_REGION "${region}".`);
  }
  return `https://${host}`;
}

async function deleteStorageKey(
  key: string,
  storageZone: string,
  accessKey: string,
) {
  const encoded = key
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  const url = `${storageOrigin()}/${encodeURIComponent(storageZone)}/${encoded}`;
  const response = await fetch(url, {
    headers: { AccessKey: accessKey },
    method: "DELETE",
  });
  if (!response.ok && response.status !== 404) {
    throw new Error(`DELETE ${key} → HTTP ${response.status}`);
  }
}

async function main() {
  loadEnv();
  const { accessKey, storage, storageZone } = createStorage();

  console.log("Scanning repo for CDN image references…");
  const used = collectUsedKeys();
  console.log(`Used CDN keys (incl. optimized/og derivatives): ${used.size}`);

  console.log("Listing BunnyCDN storage…");
  const listed = await storage.list("");
  const images = listed.filter((key) => IMAGE_EXT.test(key));
  const unused = images.filter((key) => !used.has(key)).sort();

  console.log(`BunnyCDN image files: ${images.length}`);
  console.log(`Unused image files: ${unused.length}\n`);

  if (unused.length === 0) {
    console.log("Nothing to delete.");
    return;
  }

  const reportPath = path.join(ROOT, "cdn-unused-images.txt");
  fs.writeFileSync(reportPath, `${unused.join("\n")}\n`, "utf8");
  for (const key of unused) {
    console.log(`  ${key}`);
  }
  console.log(`\nList written to ${path.relative(ROOT, reportPath)}`);

  const rl = readline.createInterface({ input, output });
  try {
    const answer = (
      await rl.question(
        `\n${unused.length} გამოუყენებელი ფოტოა. წავშალოთ BunnyCDN-დან? [Y/N] `,
      )
    )
      .trim()
      .toLowerCase();

    if (answer !== "y" && answer !== "yes") {
      console.log("გაუქმდა. არაფერი წაშლილა.");
      return;
    }

    console.log("Deleting…");
    let deleted = 0;
    for (const key of unused) {
      await deleteStorageKey(key, storageZone, accessKey);
      deleted += 1;
      console.log(`  deleted ${key}`);
    }
    console.log(`\nRemoved ${deleted} unused CDN images.`);
  } finally {
    rl.close();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
