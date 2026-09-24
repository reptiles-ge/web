import fs from "node:fs";
import path from "node:path";
import {
  ogImageKey,
  renderAndStoreOgImage,
  resolveImageConfig,
  resolveOgImageConfig,
} from "@reptiles-ge/img-compression";
import {
  BunnyStorageAdapter,
  type StorageAdapter,
} from "@reptiles-ge/img-compression/storage";
import { getGuideArticles } from "../src/data/guideArticles";
import { optimizedBaseUrl } from "../src/data/optimizedImages.generated";
import { optimizedEntry } from "../src/data/optimizedImages";
import { getCatalogSpecies } from "../src/data/species";
import { absoluteImageUrl, CDN_BASE, speciesOgImageUrl } from "../src/lib/site";

const PUBLIC_ROOT = path.join(process.cwd(), "public");

type SpeciesOgTarget = {
  id: string;
  image: string;
  key: string;
  kind: "species";
  ogUrl: string;
};

type GuideOgTarget = {
  heroAlt: string;
  heroSrc: string;
  id: string;
  key: string;
  kind: "guide";
  ogUrl: string;
};

type OgTarget = GuideOgTarget | SpeciesOgTarget;

type CliOptions = {
  concurrency: number;
  dryRun: boolean;
  force: boolean;
  guideIds: string[];
  speciesIds: string[];
  timeoutMs: number;
};

function parseArguments(argv: string[]): CliOptions {
  const guideIds: string[] = [];
  const speciesIds: string[] = [];
  let concurrency = 2;
  let dryRun = false;
  let force = false;
  let timeoutMs = 12_000;

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    switch (argument) {
      case "--concurrency":
        index += 1;
        concurrency = Number(argv[index]);
        break;
      case "--dry-run":
        dryRun = true;
        break;
      case "--force":
        force = true;
        break;
      case "--guide":
        index += 1;
        {
          const value = argv[index];
          if (!value || value.startsWith("--")) {
            throw new Error("--guide requires a comma-separated list of ids.");
          }
          for (const id of value.split(",")) {
            if (id.trim()) guideIds.push(id.trim());
          }
        }
        break;
      case "--species":
        index += 1;
        {
          const value = argv[index];
          if (!value || value.startsWith("--")) {
            throw new Error("--species requires a comma-separated list of ids.");
          }
          for (const id of value.split(",")) {
            if (id.trim()) speciesIds.push(id.trim());
          }
        }
        break;
      case "--timeout":
        index += 1;
        timeoutMs = Number(argv[index]);
        break;
      case "--":
        break;
      default:
        throw new Error(`Unknown argument "${argument}".`);
    }
  }

  if (!Number.isInteger(concurrency) || concurrency < 1) {
    throw new Error("--concurrency requires a positive integer.");
  }
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1) {
    throw new Error("--timeout requires a positive integer (milliseconds).");
  }

  return { concurrency, dryRun, force, guideIds, speciesIds, timeoutMs };
}

function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    const candidate = path.join(process.cwd(), file);
    if (!fs.existsSync(candidate)) continue;
    process.loadEnvFile(candidate);
  }
}

function createBunnyStorage(): StorageAdapter {
  const zone = process.env.BUNNY_STORAGE_ZONE;
  const accessKey = process.env.BUNNY_STORAGE_ACCESS_KEY;

  if (!zone || !accessKey) {
    throw new Error(
      "BUNNY_STORAGE_ZONE and BUNNY_STORAGE_ACCESS_KEY must be set. Put them in .env.local.",
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

function storageKeyFromSrc(src: string): string | null {
  if (src.startsWith(`${CDN_BASE}/`)) {
    return decodeURIComponent(src.slice(CDN_BASE.length + 1));
  }
  if (src.startsWith("/")) return src.slice(1);
  return null;
}

function collectSpeciesTargets(ids: string[]): SpeciesOgTarget[] {
  const wanted = new Set(ids);
  const catalog = getCatalogSpecies();
  const known = new Set(catalog.map((item) => item.id));

  for (const id of wanted) {
    if (!known.has(id)) throw new Error(`Unknown species id "${id}".`);
  }

  return catalog
    .filter((item) => wanted.size === 0 || wanted.has(item.id))
    .map((item) => {
      const key = storageKeyFromSrc(item.image);
      if (!key) {
        throw new Error(`${item.id} has no storage key for ${item.image}`);
      }
      return {
        id: item.id,
        image: item.image,
        key,
        kind: "species" as const,
        ogUrl: speciesOgImageUrl(item.id, item.image),
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

function collectGuideTargets(ids: string[]): GuideOgTarget[] {
  const wanted = new Set(ids);
  const articles = getGuideArticles();
  const known = new Set(articles.map((article) => article.id));

  for (const id of wanted) {
    if (!known.has(id)) throw new Error(`Unknown guide id "${id}".`);
  }

  return articles
    .filter((article) => wanted.size === 0 || wanted.has(article.id))
    .map((article) => ({
      heroAlt: article.hero.alt.en,
      heroSrc: article.hero.src,
      id: article.id,
      key: `images/guides/${article.id}.jpg`,
      kind: "guide" as const,
      ogUrl: absoluteImageUrl(article.ogImage),
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

function collectTargets(options: CliOptions): OgTarget[] {
  const hasSpeciesFilter = options.speciesIds.length > 0;
  const hasGuideFilter = options.guideIds.length > 0;

  const species =
    hasGuideFilter && !hasSpeciesFilter
      ? []
      : collectSpeciesTargets(options.speciesIds);
  const guides =
    hasSpeciesFilter && !hasGuideFilter
      ? []
      : collectGuideTargets(options.guideIds);

  return [...species, ...guides];
}

async function fetchBuffer(
  url: string,
  timeoutMs: number,
): Promise<Buffer | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) return null;
    return Buffer.from(await response.arrayBuffer());
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function headOk(url: string, timeoutMs: number): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
    });
    return response.status >= 200 && response.status < 400;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

function derivativeUrls(src: string): string[] {
  const entry = optimizedEntry(src);
  if (!entry) return [];
  const widths = [...entry.widths].sort((a, b) => b - a);
  const formats = entry.formats.includes("webp")
    ? ["webp", ...entry.formats.filter((format) => format !== "webp")]
    : [...entry.formats];
  const urls: string[] = [];
  for (const width of widths) {
    for (const format of formats) {
      urls.push(`${optimizedBaseUrl}${entry.path}-${width}.${format}`);
    }
  }
  return urls;
}

async function readLocalCover(key: string): Promise<Buffer | null> {
  const absolute = path.join(PUBLIC_ROOT, key);
  if (!absolute.startsWith(PUBLIC_ROOT + path.sep)) {
    throw new Error(`Refusing to read outside public/: ${key}`);
  }
  if (!fs.existsSync(absolute)) return null;
  return fs.promises.readFile(absolute);
}

async function ogAlreadyPresent(
  target: OgTarget,
  timeoutMs: number,
): Promise<boolean> {
  return headOk(target.ogUrl, timeoutMs);
}

async function readSpeciesCover(
  target: SpeciesOgTarget,
  storage: StorageAdapter,
  timeoutMs: number,
): Promise<{ buffer: Buffer; from: string }> {
  const original = await fetchBuffer(target.image, timeoutMs);
  if (original) return { buffer: original, from: target.image };

  for (const url of derivativeUrls(target.image)) {
    const derivative = await fetchBuffer(url, timeoutMs);
    if (derivative) return { buffer: derivative, from: url };
  }

  const stored = await storage.get(target.key);
  if (stored) return { buffer: stored, from: `storage:${target.key}` };

  const local = await readLocalCover(target.key);
  if (local) return { buffer: local, from: `public/${target.key}` };

  throw new Error(`No cover source for ${target.id} (${target.image})`);
}

async function readGuideCover(
  target: GuideOgTarget,
  timeoutMs: number,
): Promise<{ buffer: Buffer; from: string }> {
  if (target.heroSrc.startsWith("/")) {
    const local = await readLocalCover(target.heroSrc.slice(1));
    if (local) return { buffer: local, from: `public${target.heroSrc}` };
    throw new Error(`No local hero for ${target.id} (${target.heroSrc})`);
  }

  const remote = await fetchBuffer(target.heroSrc, timeoutMs);
  if (remote) return { buffer: remote, from: target.heroSrc };

  throw new Error(`No hero source for ${target.id} (${target.heroSrc})`);
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;

  async function worker() {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await fn(items[index] as T);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, worker),
  );
  return results;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  loadEnv();

  const og = resolveOgImageConfig();
  const config = resolveImageConfig();
  const targets = collectTargets(options);
  const storage = createBunnyStorage();

  const speciesCount = targets.filter((t) => t.kind === "species").length;
  const guideCount = targets.filter((t) => t.kind === "guide").length;

  console.log(
    `Storage: ${storage.name}. OG ${og.width}×${og.height} JPEG. ` +
      `${speciesCount} species, ${guideCount} guides` +
      `${options.dryRun ? " (dry run)" : ""}.`,
  );

  let written = 0;
  let skipped = 0;
  let planned = 0;
  const failures: string[] = [];

  await mapPool(targets, options.concurrency, async (target) => {
    const label = `${target.kind}/${target.id}`;
    try {
      if (!options.force && (await ogAlreadyPresent(target, options.timeoutMs))) {
        skipped += 1;
        console.log(`skipped  ${label} ${target.ogUrl}`);
        return;
      }

      const cover =
        target.kind === "species"
          ? await readSpeciesCover(target, storage, options.timeoutMs)
          : await readGuideCover(target, options.timeoutMs);
      const key = ogImageKey(og, target.key);

      if (options.dryRun) {
        planned += 1;
        console.log(`planned  ${label} ${key} ← ${cover.from}`);
        return;
      }

      const stored = await renderAndStoreOgImage({
        alt: target.kind === "guide" ? target.heroAlt : target.id,
        config,
        key: target.key,
        og,
        source: cover.buffer,
        storage,
      });

      written += 1;
      console.log(
        `written  ${label} ${stored.key} ${formatBytes(stored.byteSize)} q${stored.quality}` +
          `${stored.enlarged ? " enlarged" : ""} ← ${cover.from}`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push(`${label}: ${message}`);
      console.error(`failed   ${label}: ${message}`);
    }
  });

  console.log("");
  console.log(
    options.dryRun
      ? `Dry run: ${planned} would be written, ${skipped} already present, ${failures.length} failed.`
      : `Wrote ${written}, skipped ${skipped}, failed ${failures.length}.`,
  );

  if (failures.length > 0) {
    console.log("\nFailures:");
    for (const failure of failures) console.log(`  ${failure}`);
    process.exitCode = 1;
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
