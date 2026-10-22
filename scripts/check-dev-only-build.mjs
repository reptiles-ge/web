import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const DIST = path.resolve("dist");
const CHECKS = [
  { label: "admin page route", pattern: /pattern:`\/admin(?:[/`])/ },
  { label: "dev-only API route", pattern: /pattern:`\/api\/(?:admin|dev)\// },
  { label: "admin API path", pattern: /\/api\/admin\// },
  { label: "dev API path", pattern: /\/api\/dev\// },
];

if (!existsSync(DIST)) {
  console.error("dist/ is missing. Run pnpm build:vinext first.");
  process.exit(1);
}

const files = readdirSync(DIST, { recursive: true })
  .map(String)
  .filter((file) => /\.m?js$/.test(file));
const problems = [];

for (const file of files) {
  const source = readFileSync(path.join(DIST, file), "utf8");
  for (const { label, pattern } of CHECKS) {
    if (pattern.test(source)) problems.push(`${label} in dist/${file}`);
  }
}

if (problems.length > 0) {
  console.error("Dev-only admin code is in the production build:");
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}

console.log(`No dev-only admin code in ${files.length} built files.`);
