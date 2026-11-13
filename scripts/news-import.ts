import path from "node:path";

import { newsArticlePhotos } from "../src/data/news";
import { isOptimizedImageSrc } from "../src/data/optimizedImages";
import { uploadedOptimizedImages } from "../src/data/optimizedImages.api.generated";
import { createAdminNews, publishAdminNews } from "../src/lib/adminNewsApi";
import { apiOrigin } from "../src/lib/apiClient";
import { checkNewsHero } from "../src/lib/newsHeroImage";
import {
  newsArticleFromMdx,
  readNewsMdxFiles,
} from "../src/lib/newsMdxArticle";
import { newsArticleLocales } from "../src/lib/newsRules";
import { newsSlugIssue } from "../src/lib/newsSlug";
import { findPageReferences } from "../src/lib/pageTalkProse";
import { loadEnv } from "./scriptUtils";

const USAGE =
  "Usage: pnpm news:import <slug> [--dir <folder>] [--dry-run] [--publish] [--actor <name>]";
const DEFAULT_DIR = ".news";

const args = process.argv.slice(2);
const slug = args.find((arg) => !arg.startsWith("--"));
const dryRun = args.includes("--dry-run");
const publish = args.includes("--publish");
const actorIndex = args.indexOf("--actor");
const actor =
  (actorIndex >= 0 ? args[actorIndex + 1] : undefined) ??
  process.env.USER ??
  "news-import";
const dirIndex = args.indexOf("--dir");
const dir = (dirIndex >= 0 ? args[dirIndex + 1] : undefined) ?? DEFAULT_DIR;

if (
  !slug ||
  (actorIndex >= 0 && !args[actorIndex + 1]) ||
  (dirIndex >= 0 && !args[dirIndex + 1])
) {
  console.error(USAGE);
  process.exit(1);
}
if (dryRun && publish) {
  console.error("Pass either --dry-run or --publish, not both.");
  process.exit(1);
}

loadEnv();

const contentRoot = path.resolve(process.cwd(), dir);
const { article, errors, heroImageException } = newsArticleFromMdx(
  slug,
  readNewsMdxFiles(contentRoot, slug),
);
if (!article || errors.length > 0) {
  console.error(
    errors.length > 0
      ? errors.join("\n")
      : `${slug}: no MDX files in ${path.relative(process.cwd(), contentRoot)}/${slug}`,
  );
  process.exit(1);
}

const slugProblem = newsSlugIssue(slug);
if (slugProblem) errors.push(`${slug}: ${slugProblem}`);
for (const photo of newsArticlePhotos(article)) {
  if (!isOptimizedImageSrc(photo.src))
    errors.push(
      `${slug}: ${photo.src} has no AVIF/WebP ladder; run images:optimize:news first`,
    );
}
for (const locale of newsArticleLocales(article)) {
  for (const hit of findPageReferences(article.copy[locale], locale, locale))
    errors.push(`${slug}: ${hit.field}: page talk: ${hit.match}`);
}
const hero = checkNewsHero(
  {
    exception: heroImageException,
    image: article.image,
    publishedAt: article.publishedAt,
    slug,
  },
  uploadedOptimizedImages,
);
if (hero.error) errors.push(hero.error);
if (hero.warning) console.warn(hero.warning);
if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

const target = apiOrigin();
try {
  const created = await createAdminNews(article, {
    actor,
    dryRun,
    summary: `Import ${slug} from MDX`,
  });
  if (created.version === null) {
    console.log(`${slug}: valid, not saved (${target}).`);
  } else {
    console.log(
      `${slug}: created as a draft, version ${created.version} (${target}).`,
    );
    if (publish) {
      const published = await publishAdminNews(slug, {
        actor,
        expectedVersion: created.version,
      });
      console.log(`${slug}: published, version ${published.version}.`);
    }
  }
} catch (error) {
  console.error(`${slug}: ${(error as Error).message}`);
  process.exit(1);
}
