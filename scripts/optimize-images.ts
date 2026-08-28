import fs from "node:fs";
import path from "node:path";
import {
  emptyManifest,
  loadManifest,
  optimizeAndStore,
  planOptimization,
  resolveImageConfig,
  saveManifest,
  type ImageConfig,
  type Manifest,
  type ManifestEntry,
} from "@reptiles-ge/img-compression";
import {
  BunnyStorageAdapter,
  LocalStorageAdapter,
  type StorageAdapter,
} from "@reptiles-ge/img-compression/storage";
import { species, speciesEn } from "../src/data/species.generated";
import { images as siteImages } from "../src/data/species";

const CDN_BASE = "https://cdn.reptiles.ge";
const PUBLIC_ROOT = path.join(process.cwd(), "public");
const MANIFEST_ROOT = path.join(process.cwd(), "src/data");
const MANIFEST_KEY = "image-manifest.json";
const OUT_FILE = path.join(process.cwd(), "src/data/optimizedImages.generated.ts");
const CHECKPOINT_INTERVAL = 25;

const MAX_WIDTH = 2400;
const ADDITIONAL_WIDTHS = [400, 800, 1200];
const FORMATS = ["avif", "webp"] as const;

const PLACEHOLDER_MARKERS = [
  "species-placeholder.png",
  "species-placeholder.svg",
  "species-placeholder.jpg",
];

type Target = {
  key: string;
  src: string;
};

type CliOptions = {
  speciesIds: string[];
  all: boolean;
  emitOnly: boolean;
  dryRun: boolean;
  force: boolean;
  limit: number | undefined;
  concurrency: number;
};

function parseArguments(argv: string[]): CliOptions {
  const speciesIds: string[] = [];
  let all = false;
  let emitOnly = false;
  let dryRun = false;
  let force = false;
  let limit: number | undefined;
  let concurrency = 4;

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    switch (argument) {
      case "--species":
        index += 1;
        for (const id of (argv[index] ?? "").split(",")) {
          if (id.trim()) speciesIds.push(id.trim());
        }
        break;
      case "--all":
        all = true;
        break;
      case "--emit-only":
        emitOnly = true;
        break;
      case "--dry-run":
        dryRun = true;
        break;
      case "--force":
        force = true;
        break;
      case "--limit":
        index += 1;
        limit = Number(argv[index]);
        break;
      case "--concurrency":
        index += 1;
        concurrency = Number(argv[index]);
        break;
      default:
        throw new Error(`Unknown argument "${argument}".`);
    }
  }

  if (all && speciesIds.length > 0) {
    throw new Error("Pass either --all or --species, not both.");
  }
  if (!all && !emitOnly && speciesIds.length === 0) {
    throw new Error(
      "Pass --species <id> (comma-separated for several), or --all for every species.",
    );
  }
  if (limit !== undefined && (!Number.isInteger(limit) || limit < 1)) {
    throw new Error("--limit requires a positive integer.");
  }
  if (!Number.isInteger(concurrency) || concurrency < 1) {
    throw new Error("--concurrency requires a positive integer.");
  }

  return { speciesIds, all, emitOnly, dryRun, force, limit, concurrency };
}

function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    const candidate = path.join(process.cwd(), file);
    if (!fs.existsSync(candidate)) continue;
    process.loadEnvFile(candidate);
  }
}

function isPlaceholder(src: string) {
  return PLACEHOLDER_MARKERS.some((marker) => src.includes(marker));
}

function toStorageKey(src: string): string | null {
  if (isPlaceholder(src)) return null;
  if (src.startsWith(`${CDN_BASE}/`)) {
    return decodeURIComponent(src.slice(CDN_BASE.length + 1));
  }
  if (src.startsWith("/")) return src.slice(1);
  return null;
}

function collectSources(): Map<string, string> {
  const byKey = new Map<string, string>();

  const add = (src: string | undefined) => {
    if (!src) return;
    const key = toStorageKey(src);
    if (key) byKey.set(key, src);
  };

  for (const src of Object.values(siteImages)) add(src);

  for (const item of species) {
    add(item.image);
    add(item.mobileImage);
    for (const photo of item.gallery) add(photo.src);

    const translated = speciesEn[item.id];
    for (const photo of translated?.gallery ?? []) add(photo.src);
  }

  return byKey;
}

function collectTargets(ids: string[], all: boolean): Target[] {
  const wanted = new Set(ids);
  const known = new Set(species.map((item) => item.id));
  for (const id of wanted) {
    if (!known.has(id)) throw new Error(`Unknown species id "${id}".`);
  }

  const targets = new Map<string, Target>();

  const add = (src: string | undefined) => {
    if (!src) return;
    const key = toStorageKey(src);
    if (key) targets.set(key, { key, src });
  };

  if (all) {
    for (const src of Object.values(siteImages)) add(src);
  }

  for (const item of species) {
    if (!all && !wanted.has(item.id)) continue;
    add(item.image);
    add(item.mobileImage);
    for (const photo of item.gallery) add(photo.src);
    for (const photo of speciesEn[item.id]?.gallery ?? []) add(photo.src);
  }

  return [...targets.values()].sort((a, b) => a.key.localeCompare(b.key));
}

async function readSource(target: Target): Promise<Buffer> {
  if (target.src.startsWith("http")) {
    const response = await fetch(target.src);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} fetching ${target.src}`);
    }
    return Buffer.from(await response.arrayBuffer());
  }

  const absolute = path.join(PUBLIC_ROOT, target.key);
  if (!absolute.startsWith(PUBLIC_ROOT + path.sep)) {
    throw new Error(`Refusing to read outside public/: ${target.key}`);
  }
  return fs.promises.readFile(absolute);
}

function createStorage(): StorageAdapter {
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

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function compactAsset(
  key: string,
  entry: ManifestEntry,
  storage: StorageAdapter,
  prefix: string,
) {
  const widths = [...new Set(entry.derivatives.map((item) => item.width))].sort(
    (a, b) => a - b,
  );

  const byFormatWidth = new Map(
    entry.derivatives.map((item) => [`${item.format}@${item.width}`, item]),
  );

  const formats = FORMATS.filter((format) => {
    const widest = entry.derivatives
      .filter((item) => item.format === format)
      .reduce<ManifestEntry["derivatives"][number] | null>(
        (best, item) => (!best || item.width > best.width ? item : best),
        null,
      );
    if (!widest) return false;
    return (
      widest.width < entry.width || widest.byteSize < entry.originalSize
    );
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
        throw new Error(`${key} is missing the ${width}px ${format} derivative.`);
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
    path: assetPath,
    width: entry.width,
    height: entry.height,
    widths,
    formats,
  };
}

async function generateDataFile(
  manifest: Manifest,
  byKey: Map<string, string>,
  storage: StorageAdapter,
  config: ImageConfig,
) {
  const prefix = `${storage.urlFor(config.optimizedPrefix)}/`;

  const assets: [string, NonNullable<ReturnType<typeof compactAsset>>][] = [];
  let skippedNoGain = 0;

  for (const [key, entry] of Object.entries(manifest.entries).sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    if (!byKey.has(key)) continue;
    const asset = compactAsset(key, entry, storage, prefix);
    if (!asset) {
      skippedNoGain += 1;
      continue;
    }
    assets.push([byKey.get(key) as string, asset]);
  }

  const source = `/* eslint-disable */
// Generated by scripts/optimize-images.ts — do not edit by hand.
import type { OptimizedImageEntry } from "./optimizedImages";

export const optimizedBaseUrl = ${JSON.stringify(prefix)};

export const optimizedImages: Record<string, OptimizedImageEntry> = ${JSON.stringify(
    Object.fromEntries(assets),
    null,
    2,
  )};
`;

  await fs.promises.writeFile(OUT_FILE, source, "utf8");
  console.log(`\nWrote ${assets.length} asset(s) → ${path.relative(process.cwd(), OUT_FILE)}`);
  if (skippedNoGain > 0) {
    console.log(
      `${skippedNoGain} image(s) left on the original: no derivative beat it.`,
    );
  }
}

async function run() {
  const options = parseArguments(process.argv.slice(2));
  loadEnv();

  const config: ImageConfig = resolveImageConfig({
    maxWidth: MAX_WIDTH,
    additionalWidths: ADDITIONAL_WIDTHS,
  });
  const storage = createStorage();
  const manifestStorage = new LocalStorageAdapter({ root: MANIFEST_ROOT });

  const byKey = collectSources();

  if (options.emitOnly) {
    const current = await loadManifest(manifestStorage, MANIFEST_KEY, (message) =>
      console.warn(`  warning  ${message}`),
    );
    await generateDataFile(current, byKey, storage, config);
    return 0;
  }

  const discovered = collectTargets(options.speciesIds, options.all);
  const targets =
    options.limit === undefined ? discovered : discovered.slice(0, options.limit);

  const manifest = await loadManifest(manifestStorage, MANIFEST_KEY, (message) =>
    console.warn(`  warning  ${message}`),
  );
  const entries = new Map<string, ManifestEntry>(Object.entries(manifest.entries));

  console.log(
    `Storage: ${storage.name}. Widths: ${[...config.additionalWidths, config.maxWidth].join(", ")}. ` +
      `AVIF q${config.avifQuality}, WebP q${config.webpQuality}.`,
  );
  console.log(
    `Species: ${options.all ? "all" : options.speciesIds.join(", ")}. ` +
      `${targets.length} image(s)${options.dryRun ? " (dry run)" : ""}.`,
  );

  let originalBytes = 0;
  let optimizedBytes = 0;
  let processed = 0;
  let skipped = 0;
  const failures: string[] = [];

  let sinceCheckpoint = 0;
  let checkpointChain: Promise<void> = Promise.resolve();
  const checkpoint = () => {
    if (options.dryRun) return checkpointChain;
    checkpointChain = checkpointChain.then(() =>
      saveManifest(manifestStorage, MANIFEST_KEY, {
        ...emptyManifest(),
        entries: Object.fromEntries(entries),
      }),
    );
    return checkpointChain;
  };

  let cursor = 0;
  const worker = async () => {
    for (;;) {
      const index = cursor;
      cursor += 1;
      if (index >= targets.length) return;

      const target = targets[index] as Target;
      const position = `[${index + 1}/${targets.length}]`;

      try {
        const source = await readSource(target);

        if (options.dryRun) {
          const plan = await planOptimization({
            key: target.key,
            source,
            storage,
            config,
            manifest,
            force: options.force,
          });
          originalBytes += plan.originalSize;
          console.log(
            `${position} ${(plan.upToDate ? "up-to-date" : "planned").padEnd(11)} ${target.key} ` +
              `→ ${plan.derivatives.map((item) => `${item.width}.${item.format}`).join(", ")}`,
          );
          if (plan.upToDate) skipped += 1;
          else processed += 1;
          continue;
        }

        const result = await optimizeAndStore({
          key: target.key,
          source,
          storage,
          config,
          manifest,
          storeOriginal: false,
          force: options.force,
        });

        if (result.entry) {
          entries.set(target.key, { ...result.entry, originalKey: target.key });
        }

        originalBytes += result.record.originalSize;
        optimizedBytes += result.record.optimizedSize;
        if (result.status === "processed") processed += 1;
        if (result.status === "skipped") skipped += 1;

        const saving =
          result.record.originalSize === 0
            ? ""
            : ` ${formatBytes(result.record.originalSize)} → ${formatBytes(
                result.record.optimizedSize,
              )} (${(
                100 -
                (result.record.optimizedSize / result.record.originalSize) * 100
              ).toFixed(1)}% smaller)`;
        console.log(`${position} ${result.status.padEnd(11)} ${target.key}${saving}`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        failures.push(`${target.key}: ${message}`);
        console.error(`${position} ${"failed".padEnd(11)} ${target.key}: ${message}`);
      }

      sinceCheckpoint += 1;
      if (sinceCheckpoint >= CHECKPOINT_INTERVAL) {
        sinceCheckpoint = 0;
        await checkpoint();
      }
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(options.concurrency, targets.length) }, worker),
  );

  if (!options.dryRun) {
    await checkpoint();
    const updated: Manifest = {
      ...emptyManifest(),
      entries: Object.fromEntries(entries),
    };
    await generateDataFile(updated, byKey, storage, config);
  }

  console.log("");
  if (options.dryRun) {
    console.log(
      `Dry run: ${processed} would be processed, ${skipped} already up to date, ` +
        `${failures.length} unreadable. Nothing was written.`,
    );
  } else {
    console.log(
      `Processed ${processed}, skipped ${skipped}, failed ${failures.length} of ${targets.length}.`,
    );
    if (originalBytes > 0) {
      console.log(
        `Originals ${formatBytes(originalBytes)}, AVIF at full width ` +
          `${formatBytes(optimizedBytes)} ` +
          `(${(100 - (optimizedBytes / originalBytes) * 100).toFixed(1)}% smaller).`,
      );
    }
  }

  if (failures.length > 0) {
    console.log("\nFailures:");
    for (const failure of failures) console.log(`  ${failure}`);
  }

  return failures.length > 0 ? 1 : 0;
}

run()
  .then((code) => {
    process.exitCode = code;
  })
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
