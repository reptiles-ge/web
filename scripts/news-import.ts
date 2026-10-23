import path from "node:path";

import { createAdminNews, publishAdminNews } from "../src/lib/adminNewsApi";
import { apiOrigin } from "../src/lib/apiClient";
import {
  newsArticleFromMdx,
  readNewsMdxFiles,
} from "../src/lib/newsMdxArticle";
import { loadEnv } from "./scriptUtils";

const USAGE =
  "Usage: pnpm news:import <slug> [--dry-run] [--publish] [--actor <name>]";

const args = process.argv.slice(2);
const slug = args.find((arg) => !arg.startsWith("--"));
const dryRun = args.includes("--dry-run");
const publish = args.includes("--publish");
const actorIndex = args.indexOf("--actor");
const actor =
  (actorIndex >= 0 ? args[actorIndex + 1] : undefined) ??
  process.env.USER ??
  "news-import";

if (!slug || (actorIndex >= 0 && !args[actorIndex + 1])) {
  console.error(USAGE);
  process.exit(1);
}
if (dryRun && publish) {
  console.error("Pass either --dry-run or --publish, not both.");
  process.exit(1);
}

loadEnv();

const contentRoot = path.join(process.cwd(), "src/content/news");
const { article, errors } = newsArticleFromMdx(
  slug,
  readNewsMdxFiles(contentRoot, slug),
);
if (!article || errors.length > 0) {
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
