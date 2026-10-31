import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";

import { toSiteDateTime } from "../src/lib/siteTime";

const KEY_CLEANUP_COMMIT = "3adf3d1f76a97c9ce3d14e98079432fd0bf33985";
const KEY_CLEANUP_TEXT_EDITS = new Set([
  "src/content/species/anguis-colchica/en.mdx",
  "src/content/species/anguis-colchica/ru.mdx",
  "src/content/species/anguis-colchica/tr.mdx",
]);
const NEWS_ROOT = "src/content/news";

const { values } = parseArgs({
  options: {
    out: { default: ".wrangler/backfill-text-dates.sql", type: "string" },
  },
});

function git(args: string[]) {
  return execFileSync("git", args, {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  }).trim();
}

function quote(value: string) {
  return `'${value.replaceAll("'", "''")}'`;
}

function siteDateTime(commitDate: string) {
  return toSiteDateTime(new Date(commitDate));
}

function speciesStatements() {
  const cleanupDate = siteDateTime(
    git(["show", "-s", "--format=%cI", KEY_CLEANUP_COMMIT]),
  );
  const files = git([
    "show",
    "--format=",
    "--name-only",
    KEY_CLEANUP_COMMIT,
    "--",
    "src/content/species",
  ])
    .split("\n")
    .filter(
      (file) => file.endsWith(".mdx") && !KEY_CLEANUP_TEXT_EDITS.has(file),
    );

  const statements: string[] = [];
  for (const file of files) {
    const match = file.match(
      /^src\/content\/species\/([^/]+)\/(ka|en|ru|tr)\.mdx$/,
    );
    if (!match) continue;
    const previous = git([
      "log",
      "-1",
      "--format=%cI",
      `${KEY_CLEANUP_COMMIT}~1`,
      "--",
      file,
    ]);
    if (!previous) continue;
    statements.push(
      `UPDATE species_texts SET updated_at = ${quote(siteDateTime(previous))} WHERE species_id = ${quote(match[1]!)} AND locale = ${quote(match[2]!)} AND updated_at = ${quote(cleanupDate)};`,
    );
  }
  return statements;
}

function newsStatements() {
  const statements: string[] = [];
  for (const slug of fs.readdirSync(NEWS_ROOT).sort()) {
    const kaFile = path.join(NEWS_ROOT, slug, "ka.mdx");
    if (!fs.existsSync(kaFile)) continue;
    const updatedAt = fs
      .readFileSync(kaFile, "utf8")
      .match(/^updatedAt:\s*['"]?(\d{4}-\d{2}-\d{2})['"]?\s*$/m)?.[1];
    if (!updatedAt) continue;
    const sameDay = git([
      "log",
      "--format=%cI",
      "--",
      path.join(NEWS_ROOT, slug),
    ])
      .split("\n")
      .filter(Boolean)
      .map(siteDateTime)
      .find((date) => date.startsWith(updatedAt));
    if (!sameDay) continue;
    statements.push(
      `UPDATE news_articles SET updated_at = ${quote(sameDay)} WHERE id = ${quote(slug)} AND updated_at = ${quote(updatedAt)};`,
    );
  }
  return statements;
}

const REVISION_TIME = `SELECT strftime('%Y-%m-%dT%H:%M:%S+04:00', r.created_at, '+4 hours') FROM news_revisions r WHERE r.article_id = news_articles.id AND date(r.created_at, '+4 hours') = news_articles.updated_at ORDER BY r.version DESC LIMIT 1`;

const species = speciesStatements();
const news = [
  ...newsStatements(),
  `UPDATE news_articles SET updated_at = (${REVISION_TIME}) WHERE length(updated_at) = 10 AND (${REVISION_TIME}) IS NOT NULL;`,
];
fs.mkdirSync(path.dirname(values.out), { recursive: true });
fs.writeFileSync(values.out, [...species, ...news].join("\n") + "\n");
console.log(
  `${species.length} species text dates and ${news.length} news dates → ${values.out}`,
);
