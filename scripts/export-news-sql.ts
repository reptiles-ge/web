import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { buildNewsImport } from "@/api/db/newsRows";
import { NEWS_ARTICLES } from "@/data/news.generated";

const output = path.resolve(
  import.meta.dirname,
  "../.wrangler/news-import.sql",
);
const statements = buildNewsImport(NEWS_ARTICLES);

mkdirSync(path.dirname(output), { recursive: true });
writeFileSync(output, `${statements.join("\n")}\n`);
console.log(
  `Wrote ${statements.length} statements for ${NEWS_ARTICLES.length} news articles → ${path.relative(process.cwd(), output)}`,
);
