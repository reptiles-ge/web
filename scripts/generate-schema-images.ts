import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  renderAndStoreOgImage,
  resolveOgImageConfig,
} from "@reptiles-ge/img-compression";
import {
  LocalStorageAdapter,
  type StorageAdapter,
} from "@reptiles-ge/img-compression/storage";

import { getPublishedNewsArticles } from "../src/data/news";
import {
  SCHEMA_IMAGE_MIN_WIDTH,
  SCHEMA_RATIOS,
  type SchemaCrop,
} from "../src/data/schemaImages";
import {
  newsHeroImage,
  type NewsHeroImage as CropSource,
} from "../src/lib/newsSchemaImages";
import { absoluteImageUrl, CDN_BASE } from "../src/lib/site";
import { createBunnyStorageContext, formatBytes, loadEnv } from "./scriptUtils";
import { getSpeciesCatalog } from "../src/lib/speciesCatalogApi";

const PUBLIC_ROOT = path.join(process.cwd(), "public");
const MANIFEST_PATH = path.join(process.cwd(), "src/data/schemaImages.json");
const MAX_BYTES = 600_000;

type CliOptions = {
  check: boolean;
  force: boolean;
  slugs: string[];
  upload: boolean;
};

type Selected = { hero: CropSource; key: string };

type Manifest = {
  entries: Record<string, SchemaCrop[]>;
  version: number;
};

function parseArguments(argv: string[]): CliOptions {
  const slugs: string[] = [];
  let check = false;
  let force = false;
  let upload = false;

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    switch (argument) {
      case "--":
        break;
      case "--check":
        check = true;
        break;
      case "--force":
        force = true;
        break;
      case "--news":
        index += 1;
        {
          const value = argv[index];
          if (!value || value.startsWith("--")) {
            throw new Error("--news requires a comma-separated list of slugs.");
          }
          for (const slug of value.split(",")) {
            if (slug.trim()) slugs.push(slug.trim());
          }
        }
        break;
      case "--upload":
        upload = true;
        break;
      default:
        throw new Error(`Unknown argument "${argument}".`);
    }
  }

  if (check && upload) {
    throw new Error("--check and --upload cannot be combined.");
  }
  return { check, force, slugs, upload };
}

function addHero(
  heroes: Map<string, Selected>,
  label: string,
  hero: CropSource | null,
  manifest: Manifest,
  force: boolean,
) {
  if (!hero) {
    console.log(`${label}: image size unknown, skipped.`);
    return;
  }
  if (hero.width < SCHEMA_IMAGE_MIN_WIDTH) {
    console.log(`${label}: image is ${hero.width} px wide, skipped.`);
    return;
  }
  const key = storageKey(hero.src);
  if (!key) {
    console.log(`${label}: image is not on the CDN, skipped.`);
    return;
  }
  if (!force && manifest.entries[hero.src]) return;
  heroes.set(hero.src, { hero, key });
}

function readManifest(): Manifest {
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8")) as Manifest;
}

function writeManifest(manifest: Manifest) {
  const entries = Object.fromEntries(
    Object.entries(manifest.entries).sort(([a], [b]) => a.localeCompare(b)),
  );
  fs.writeFileSync(
    MANIFEST_PATH,
    `${JSON.stringify({ ...manifest, entries }, null, 2)}\n`,
  );
}

function storageKey(src: string) {
  if (src.startsWith(`${CDN_BASE}/`)) {
    return decodeURIComponent(src.slice(CDN_BASE.length + 1));
  }
  if (src.startsWith("/")) return src.slice(1);
  return null;
}

async function readSource(hero: CropSource) {
  if (hero.src.startsWith("/")) {
    const local = path.join(PUBLIC_ROOT, hero.src);
    if (fs.existsSync(local)) return fs.readFileSync(local);
  }
  for (const url of [absoluteImageUrl(hero.src), hero.url]) {
    const response = await fetch(url);
    if (response.ok) return Buffer.from(await response.arrayBuffer());
  }
  throw new Error(`No readable source for ${hero.src}.`);
}

function createStorage(upload: boolean): StorageAdapter {
  if (upload) return createBunnyStorageContext().storage;
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "news-schema-"));
  return new LocalStorageAdapter({ baseUrl: "/", root });
}

function selectHeroes(
  options: CliOptions,
  manifest: Manifest,
  catalog: Parameters<typeof newsHeroImage>[1],
) {
  const articles = getPublishedNewsArticles();
  const known = new Set(articles.map((article) => article.slug));
  const unknown = options.slugs.filter((slug) => !known.has(slug));
  if (unknown.length > 0) {
    throw new Error(`Unknown news slug(s): ${unknown.join(", ")}.`);
  }

  const heroes = new Map<string, Selected>();
  for (const article of articles) {
    if (options.slugs.length > 0 && !options.slugs.includes(article.slug)) {
      continue;
    }
    addHero(
      heroes,
      article.slug,
      newsHeroImage(article, catalog),
      manifest,
      options.force,
    );
  }
  return [...heroes.values()];
}

async function main() {
  loadEnv();
  const options = parseArguments(process.argv.slice(2));
  const manifest = readManifest();
  const catalog = (await getSpeciesCatalog("ka")).filter(
    (item): item is typeof item & { image: string } => Boolean(item.image),
  );
  const heroes = selectHeroes(options, manifest, catalog);

  if (heroes.length === 0) {
    console.log(
      "Every selected image already has its schema crops. Nothing to do.",
    );
    return;
  }

  if (options.check) {
    for (const { hero } of heroes) console.error(`Missing crops: ${hero.src}`);
    throw new Error(
      [
        `${path.relative(process.cwd(), MANIFEST_PATH)} is missing schema crops for ${heroes.length} image(s).`,
        "Fix the image manifest locally: run `pnpm images:schema --upload` and commit the updated manifest.",
      ].join("\n"),
    );
  }

  const storage = createStorage(options.upload);

  for (const { hero, key } of heroes) {
    const source = await readSource(hero);
    const crops: SchemaCrop[] = [];
    for (const ratio of SCHEMA_RATIOS) {
      const result = await renderAndStoreOgImage({
        alt: hero.src,
        key,
        og: resolveOgImageConfig({
          height: ratio.height,
          maxBytes: MAX_BYTES,
          prefix: `schema/${ratio.id}`,
          width: ratio.width,
        }),
        source,
        storage,
      });
      console.log(
        [
          `${ratio.id}: ${result.descriptor.url}`,
          `${result.width}x${result.height}`,
          formatBytes(result.byteSize),
          `q${result.quality}`,
          result.enlarged ? "enlarged" : "",
          result.withinBudget ? "" : "OVER BUDGET",
        ]
          .filter(Boolean)
          .join(" · "),
      );
      crops.push({
        height: result.height,
        ratio: ratio.id,
        url: result.descriptor.url,
        width: result.width,
      });
    }
    if (options.upload) {
      manifest.entries[hero.src] = crops;
      writeManifest(manifest);
    }
  }

  console.log(
    options.upload
      ? `Updated ${path.relative(process.cwd(), MANIFEST_PATH)}.`
      : "Dry run: nothing uploaded. Pass --upload to publish.",
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
