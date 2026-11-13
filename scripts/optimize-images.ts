import fs from "node:fs";
import path from "node:path";
import {
  emptyManifest,
  ogImageKey,
  optimizeAndStore,
  planOptimization,
  renderAndStoreOgImage,
  resolveImageConfig,
  resolveOgImageConfig,
  type ImageConfig,
  type Manifest,
  type ManifestEntry,
  type OgImageConfig,
} from "@reptiles-ge/img-compression";
import type { StorageAdapter } from "@reptiles-ge/img-compression/storage";
import {
  georgiaRegionPaths,
  type RegionPathId,
} from "../src/data/georgia-paths";
import { getAllNewsArticles, newsArticlePhotos } from "../src/data/news";
import { getRegionHeroImage } from "../src/data/regionImages";
import { images as siteImages } from "../src/data/speciesMedia";
import type { CatalogPhotoSpecies } from "../src/data/speciesCatalogTypes";
import { GROUP_HUB_ILLUSTRATIONS } from "../src/lib/groupHubs";
import { compactOptimizedAsset } from "../src/lib/imageOptimize";
import { getContributors } from "../src/lib/authorsApi";
import {
  getImageManifest,
  type ImageManifestWrite,
  putImageManifest,
} from "../src/lib/optimizedImagesApi";
import { getNewsArticle, getNewsSummaries } from "../src/lib/newsApi";
import { getSpeciesCatalog } from "../src/lib/speciesCatalogApi";
import { createBunnyStorageContext, formatBytes, loadEnv } from "./scriptUtils";

const CDN_BASE = "https://cdn.reptiles.ge";
const PUBLIC_ROOT = path.join(process.cwd(), "public");
const CHECKPOINT_INTERVAL = 25;

const MAX_WIDTH = 2400;
const ADDITIONAL_WIDTHS = [320, 400, 640, 800, 1200];

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
  imageSources: string[];
  regionId: RegionPathId | undefined;
  all: boolean;
  news: boolean;
  site: boolean;
  siteKeys: string[];
  dryRun: boolean;
  force: boolean;
  limit: number | undefined;
  concurrency: number;
};

function parseArguments(argv: string[]): CliOptions {
  const speciesIds: string[] = [];
  const imageSources: string[] = [];
  let regionId: RegionPathId | undefined;
  let all = false;
  let news = false;
  let site = false;
  const siteKeys: string[] = [];
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
      case "--images":
        index += 1;
        for (const src of (argv[index] ?? "").split(",")) {
          if (src.trim()) imageSources.push(src.trim());
        }
        break;
      case "--region": {
        const id = argv[++index];
        if (!id || !Object.hasOwn(georgiaRegionPaths, id)) {
          throw new Error(`Unknown region id "${id}".`);
        }
        regionId = id as RegionPathId;
        break;
      }
      case "--all":
        all = true;
        break;
      case "--news":
        news = true;
        break;
      case "--site":
        site = true;
        break;
      case "--site-key":
        siteKeys.push(...(argv[++index] ?? "").split(",").filter(Boolean));
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

  const scopes = [
    all,
    news,
    site,
    siteKeys.length > 0,
    speciesIds.length > 0,
    imageSources.length > 0,
    !!regionId,
  ].filter(Boolean).length;
  if (scopes > 1) {
    throw new Error(
      "Pass only one of --all, --species, --images, --region, --news, --site, or --site-key.",
    );
  }
  if (
    !all &&
    !news &&
    !site &&
    siteKeys.length === 0 &&
    speciesIds.length === 0 &&
    imageSources.length === 0 &&
    !regionId
  ) {
    throw new Error(
      "Pass --species <id>, --images <paths>, --region <id>, --news, --site, --site-key <key>, or --all.",
    );
  }
  if (limit !== undefined && (!Number.isInteger(limit) || limit < 1)) {
    throw new Error("--limit requires a positive integer.");
  }
  if (!Number.isInteger(concurrency) || concurrency < 1) {
    throw new Error("--concurrency requires a positive integer.");
  }

  return {
    speciesIds,
    imageSources,
    regionId,
    all,
    news,
    site,
    siteKeys,
    dryRun,
    force,
    limit,
    concurrency,
  };
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

async function loadNewsPhotoSources(): Promise<string[]> {
  const sources = new Set<string>();
  for (const article of getAllNewsArticles()) {
    for (const photo of newsArticlePhotos(article)) sources.add(photo.src);
  }
  const summaries = await getNewsSummaries();
  const articles = await Promise.all(
    summaries.map((summary) => getNewsArticle(summary.slug)),
  );
  for (const article of articles) {
    if (!article) continue;
    for (const photo of newsArticlePhotos(article)) sources.add(photo.src);
  }
  return [...sources];
}

function collectSources(
  species: CatalogPhotoSpecies[],
  portraits: readonly string[],
  newsPhotos: readonly string[],
): Map<string, string> {
  const byKey = new Map<string, string>();

  const add = (src: string | undefined) => {
    if (!src) return;
    const key = toStorageKey(src);
    if (key) byKey.set(key, src);
  };

  for (const src of Object.values(siteImages)) add(src);
  for (const src of Object.values(GROUP_HUB_ILLUSTRATIONS)) add(src);
  for (const src of portraits) add(src);
  for (const id of Object.keys(georgiaRegionPaths) as RegionPathId[]) {
    add(getRegionHeroImage(id));
  }

  for (const src of newsPhotos) add(src);

  for (const item of species) {
    add(item.image);
    add(item.mobileImage);
    for (const photo of item.gallery) add(photo.src);
  }

  return byKey;
}

function collectTargets(
  species: CatalogPhotoSpecies[],
  portraits: readonly string[],
  newsPhotos: readonly string[],
  ids: string[],
  imageSources: string[],
  regionId: RegionPathId | undefined,
  all: boolean,
  news: boolean,
  site: boolean,
  siteKeys: string[],
): Target[] {
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

  if (imageSources.length > 0) {
    const siteImageSources = new Set([
      ...Object.values(siteImages),
      ...Object.values(GROUP_HUB_ILLUSTRATIONS),
      ...portraits,
    ]);
    for (const src of imageSources) {
      if (!siteImageSources.has(src)) {
        throw new Error(`Unknown site, group or author image "${src}".`);
      }
      add(src);
    }
    return [...targets.values()].sort((a, b) => a.key.localeCompare(b.key));
  }

  if (all) {
    for (const src of Object.values(siteImages)) add(src);
  }

  for (const key of siteKeys) {
    if (!Object.hasOwn(siteImages, key))
      throw new Error(`Unknown site image key "${key}".`);
    add(siteImages[key as keyof typeof siteImages]);
  }

  if (all || site) {
    if (site) {
      for (const src of Object.values(siteImages)) {
        if (src.startsWith("/")) add(src);
      }
    }
    for (const src of Object.values(GROUP_HUB_ILLUSTRATIONS)) add(src);
    for (const src of portraits) add(src);
    for (const id of Object.keys(georgiaRegionPaths) as RegionPathId[]) {
      add(getRegionHeroImage(id));
    }
  }

  if (regionId) add(getRegionHeroImage(regionId));

  if (all || news) {
    for (const src of newsPhotos) add(src);
  }

  for (const item of species) {
    if (!all && !wanted.has(item.id)) continue;
    add(item.image);
    add(item.mobileImage);
    for (const photo of item.gallery) add(photo.src);
  }

  return [...targets.values()].sort((a, b) => a.key.localeCompare(b.key));
}

function collectCoverKeys(
  species: CatalogPhotoSpecies[],
  ids: string[],
  all: boolean,
  news: boolean,
): Set<string> {
  const wanted = new Set(ids);
  const keys = new Set<string>();

  const add = (src: string | undefined) => {
    if (!src) return;
    const key = toStorageKey(src);
    if (key) keys.add(key);
  };

  if (all) add(siteImages.hero);

  if (all || news) {
    for (const article of getAllNewsArticles()) add(article.image?.src);
  }

  for (const item of species) {
    if (!all && !wanted.has(item.id)) continue;
    add(item.image);
  }

  return keys;
}

async function readLocalSource(target: Target): Promise<Buffer | null> {
  const absolute = path.join(PUBLIC_ROOT, target.key);
  if (!absolute.startsWith(PUBLIC_ROOT + path.sep)) {
    throw new Error(`Refusing to read outside public/: ${target.key}`);
  }
  if (!fs.existsSync(absolute)) return null;
  return fs.promises.readFile(absolute);
}

async function readSource(target: Target): Promise<Buffer> {
  if (target.src.startsWith("http")) {
    try {
      const response = await fetch(target.src);
      if (response.ok) {
        return Buffer.from(await response.arrayBuffer());
      }
    } catch {}
    const local = await readLocalSource(target);
    if (local) return local;
    throw new Error(`HTTP fetch failed and no local file for ${target.src}`);
  }

  const local = await readLocalSource(target);
  if (!local) {
    throw new Error(`Missing local file: ${target.key}`);
  }
  return local;
}

type OgStatus = "written" | "skipped" | "planned";

async function ensureOgImage(input: {
  target: Target;
  source: Buffer;
  storage: StorageAdapter;
  config: ImageConfig;
  og: OgImageConfig;
  force: boolean;
  dryRun: boolean;
}): Promise<{
  status: OgStatus;
  key: string;
  bytes?: number;
  quality?: number;
  enlarged?: boolean;
}> {
  const key = ogImageKey(input.og, input.target.key);
  if (!input.force && (await input.storage.exists(key))) {
    return { status: "skipped", key };
  }
  if (input.dryRun) {
    return { status: "planned", key };
  }

  const stored = await renderAndStoreOgImage({
    key: input.target.key,
    source: input.source,
    alt: input.target.key,
    storage: input.storage,
    og: input.og,
    config: input.config,
  });

  return {
    status: "written",
    key,
    bytes: stored.byteSize,
    quality: stored.quality,
    enlarged: stored.enlarged,
  };
}

function formatOgResult(result: Awaited<ReturnType<typeof ensureOgImage>>) {
  if (result.status === "skipped") return `og skipped ${result.key}`;
  if (result.status === "planned") return `og planned ${result.key}`;
  const size =
    result.bytes === undefined ? "" : ` ${formatBytes(result.bytes)}`;
  const quality = result.quality === undefined ? "" : ` q${result.quality}`;
  const enlarged = result.enlarged ? " enlarged" : "";
  return `og written ${result.key}${size}${quality}${enlarged}`;
}

type ManifestState = {
  entries: Map<string, ManifestEntry>;
  sources: Map<string, string>;
};

async function loadManifestFromApi(token: string): Promise<ManifestState> {
  const rows = await getImageManifest(token);
  const entries = new Map<string, ManifestEntry>();
  const sources = new Map<string, string>();
  for (const row of rows) {
    entries.set(row.key, row.entry);
    sources.set(row.key, row.src);
  }
  return { entries, sources };
}

function manifestFor(state: ManifestState): Manifest {
  return { ...emptyManifest(), entries: Object.fromEntries(state.entries) };
}

function catalogWrite(
  key: string,
  entry: ManifestEntry,
  src: string,
  storage: StorageAdapter,
  prefix: string,
): ImageManifestWrite {
  return {
    asset: compactOptimizedAsset(key, entry, storage, prefix),
    entry: { ...entry, derivatives: [...entry.derivatives] },
    key,
    src,
  };
}

function resolveSource(
  key: string,
  byKey: Map<string, string>,
  state: ManifestState,
  storage: StorageAdapter,
): string | null {
  return (
    byKey.get(key) ??
    state.sources.get(key) ??
    (key.startsWith("external/") ? storage.urlFor(key) : null)
  );
}

function writeToken(): string {
  const token = process.env.API_WRITE_TOKEN;
  if (!token) {
    throw new Error("API_WRITE_TOKEN must be in .env.local");
  }
  return token;
}

async function run() {
  const options = parseArguments(process.argv.slice(2));
  loadEnv();

  const config: ImageConfig = resolveImageConfig({
    maxWidth: MAX_WIDTH,
    additionalWidths: ADDITIONAL_WIDTHS,
  });
  const og = resolveOgImageConfig();
  const storage: StorageAdapter = createBunnyStorageContext().storage;
  const token = writeToken();
  const prefix = `${storage.urlFor(config.optimizedPrefix)}/`;

  const [species, contributors, newsPhotos] = await Promise.all([
    getSpeciesCatalog("ka", "photos"),
    getContributors("ka"),
    loadNewsPhotoSources(),
  ]);
  const portraits = contributors.map((author) => author.portraitSrc);
  const byKey = collectSources(species, portraits, newsPhotos);

  const discovered = collectTargets(
    species,
    portraits,
    newsPhotos,
    options.speciesIds,
    options.imageSources,
    options.regionId,
    options.all,
    options.news,
    options.site,
    options.siteKeys,
  );
  const coverKeys = collectCoverKeys(
    species,
    options.speciesIds,
    options.all,
    options.news,
  );
  const targets =
    options.limit === undefined
      ? discovered
      : discovered.slice(0, options.limit);

  const state = await loadManifestFromApi(token);
  const manifest = manifestFor(state);
  const entries = state.entries;
  const pending = new Map<string, ImageManifestWrite>();

  console.log(
    `Storage: ${storage.name}. Widths: ${[...config.additionalWidths, config.maxWidth].join(", ")}. ` +
      `AVIF q${config.avifQuality}, WebP q${config.webpQuality}. ` +
      `OG ${og.width}×${og.height} JPEG q${og.quality}–${og.minQuality}, ≤${formatBytes(og.maxBytes)}.`,
  );
  console.log(
    `Scope: ${options.all ? "all" : options.news ? "news" : options.site ? "site" : options.siteKeys.length > 0 ? options.siteKeys.join(", ") : (options.regionId ?? (options.imageSources.length ? options.imageSources.join(", ") : options.speciesIds.join(", ")))}. ` +
      `${targets.length} image(s)${options.dryRun ? " (dry run)" : ""}.`,
  );

  let originalBytes = 0;
  let optimizedBytes = 0;
  let processed = 0;
  let skipped = 0;
  let ogWritten = 0;
  let ogSkipped = 0;
  let ogPlanned = 0;
  const failures: string[] = [];

  let sinceCheckpoint = 0;
  let checkpointChain: Promise<void> = Promise.resolve();
  const checkpoint = () => {
    if (options.dryRun || pending.size === 0) return checkpointChain;
    const batch = [...pending.values()];
    pending.clear();
    checkpointChain = checkpointChain.then(() =>
      putImageManifest(token, batch),
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
        const wantsOg = coverKeys.has(target.key);

        const ogLine = wantsOg
          ? await (async () => {
              try {
                const ogResult = await ensureOgImage({
                  target,
                  source,
                  storage,
                  config,
                  og,
                  force: options.force,
                  dryRun: options.dryRun,
                });
                if (ogResult.status === "written") ogWritten += 1;
                if (ogResult.status === "skipped") ogSkipped += 1;
                if (ogResult.status === "planned") ogPlanned += 1;
                return ` | ${formatOgResult(ogResult)}`;
              } catch (error) {
                const message =
                  error instanceof Error ? error.message : String(error);
                failures.push(`og ${target.key}: ${message}`);
                return ` | og failed ${message}`;
              }
            })()
          : "";

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
              `→ ${plan.derivatives.map((item) => `${item.width}.${item.format}`).join(", ")}${ogLine}`,
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
          const entry = { ...result.entry, originalKey: target.key };
          entries.set(target.key, entry);
          const src = resolveSource(target.key, byKey, state, storage);
          if (src) {
            pending.set(
              target.key,
              catalogWrite(target.key, entry, src, storage, prefix),
            );
          } else {
            failures.push(
              `${target.key}: optimized, but no page uses it, so it was not cataloged`,
            );
          }
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
        console.log(
          `${position} ${result.status.padEnd(11)} ${target.key}${saving}${ogLine}`,
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        failures.push(`${target.key}: ${message}`);
        console.error(
          `${position} ${"failed".padEnd(11)} ${target.key}: ${message}`,
        );
      }

      sinceCheckpoint += 1;
      if (sinceCheckpoint >= CHECKPOINT_INTERVAL) {
        sinceCheckpoint = 0;
        await checkpoint();
      }
    }
  };

  await Promise.all(
    Array.from(
      { length: Math.min(options.concurrency, targets.length) },
      worker,
    ),
  );

  if (!options.dryRun) {
    await checkpoint();
    console.log(
      `\nCatalog: ${processed} image(s) written to the API. Deploy the site (pnpm images:compile runs in the build) to serve them.`,
    );
  }

  console.log("");
  if (options.dryRun) {
    console.log(
      `Dry run: ${processed} would be processed, ${skipped} already up to date, ` +
        `${failures.length} unreadable. Nothing was written.`,
    );
    console.log(
      `OG: ${ogPlanned} would be written, ${ogSkipped} already present.`,
    );
  } else {
    console.log(
      `Processed ${processed}, skipped ${skipped}, failed ${failures.length} of ${targets.length}.`,
    );
    console.log(`OG: wrote ${ogWritten}, skipped ${ogSkipped}.`);
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
