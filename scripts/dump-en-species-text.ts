import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const contentRoot = path.join(process.cwd(), "src/content/species");
const outRoot = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(process.cwd(), "tmp/en-species");

const KEEP = [
  "id",
  "scientificName",
  "genus",
  "family",
  "commonName",
  "location",
  "description",
  "overview",
  "habitat",
  "diet",
  "behavior",
  "conservation",
  "interaction",
  "stats",
  "facts",
  "identification",
  "faq",
] as const;

fs.mkdirSync(outRoot, { recursive: true });

const ids = fs
  .readdirSync(contentRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort((a, b) => a.localeCompare(b));

for (const id of ids) {
  const filePath = path.join(contentRoot, id, "en.mdx");
  if (!fs.existsSync(filePath)) continue;
  const { data } = matter(fs.readFileSync(filePath, "utf8"));
  const out: Record<string, unknown> = {};
  for (const key of KEEP) {
    if (data[key] !== undefined) out[key] = data[key];
  }
  fs.writeFileSync(
    path.join(outRoot, `${id}.json`),
    `${JSON.stringify(out, null, 2)}\n`,
    "utf8",
  );
}

console.log(`Wrote ${ids.length} EN text dumps → ${outRoot}`);
