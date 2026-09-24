import fs from "node:fs";
import path from "node:path";
import {
  ogImageKey,
  renderAndStoreOgImage,
  resolveOgImageConfig,
} from "@reptiles-ge/img-compression";
import {
  BunnyStorageAdapter,
  LocalStorageAdapter,
  type StorageAdapter,
} from "@reptiles-ge/img-compression/storage";

import { getGuideArticles } from "../src/data/guideArticles";
import { CDN_BASE } from "../src/lib/site";

const PUBLIC_ROOT = path.join(process.cwd(), "public");

type CliOptions = {
  force: boolean;
  guideIds: string[];
  upload: boolean;
};

function parseArguments(argv: string[]): CliOptions {
  const guideIds: string[] = [];
  let force = false;
  let upload = false;

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    switch (argument) {
      case "--force":
        force = true;
        break;
      case "--guide":
        index += 1;
        for (const id of (argv[index] ?? "").split(",")) {
          if (id.trim()) guideIds.push(id.trim());
        }
        break;
      case "--upload":
        upload = true;
        break;
      default:
        throw new Error(`Unknown argument "${argument}".`);
    }
  }

  return { force, guideIds, upload };
}

function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    const candidate = path.join(process.cwd(), file);
    if (fs.existsSync(candidate)) process.loadEnvFile(candidate);
  }
}

function createStorage(upload: boolean): StorageAdapter {
  if (!upload)
    return new LocalStorageAdapter({ baseUrl: "/", root: PUBLIC_ROOT });

  const zone = process.env.BUNNY_STORAGE_ZONE;
  const accessKey = process.env.BUNNY_STORAGE_ACCESS_KEY;
  if (!zone || !accessKey) {
    throw new Error(
      "--upload needs BUNNY_STORAGE_ZONE and BUNNY_STORAGE_ACCESS_KEY. Put them in .env.local.",
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

function selectArticles(options: CliOptions) {
  const articles = getGuideArticles();
  if (options.guideIds.length > 0) {
    const known = new Set(articles.map((article) => article.id));
    const unknown = options.guideIds.filter((id) => !known.has(id));
    if (unknown.length > 0) {
      throw new Error(`Unknown guide id(s): ${unknown.join(", ")}.`);
    }
    return articles.filter((article) => options.guideIds.includes(article.id));
  }
  return articles.filter(
    (article) =>
      article.ogImage.startsWith("/") &&
      (options.force ||
        !fs.existsSync(path.join(PUBLIC_ROOT, article.ogImage))),
  );
}

async function main() {
  loadEnv();
  const options = parseArguments(process.argv.slice(2));
  const og = resolveOgImageConfig();
  const storage = createStorage(options.upload);
  const articles = selectArticles(options);

  if (articles.length === 0) {
    console.log("Every guide already has its share image. Nothing to do.");
    return;
  }

  for (const article of articles) {
    const key = ogImageKey(og, `images/guides/${article.id}.jpg`);
    const localPath = path.join(PUBLIC_ROOT, key);
    if (!options.upload && !options.force && fs.existsSync(localPath)) {
      console.log(`${article.id}: ${key} exists, skipped (use --force).`);
      continue;
    }

    const source = fs.readFileSync(path.join(PUBLIC_ROOT, article.hero.src));
    const result = await renderAndStoreOgImage({
      alt: article.hero.alt.en,
      key: `images/guides/${article.id}.jpg`,
      og,
      source,
      storage,
    });

    console.log(
      [
        `${article.id}: ${result.descriptor.url}`,
        `${result.width}x${result.height}`,
        `${Math.round(result.byteSize / 1024)} KB`,
        `q${result.quality}`,
        result.enlarged ? "enlarged" : "",
        result.withinBudget ? "" : "OVER BUDGET",
      ]
        .filter(Boolean)
        .join(" · "),
    );
    console.log(`  set ogImage: "${result.descriptor.url}"`);
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
