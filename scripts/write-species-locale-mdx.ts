import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const contentRoot = path.join(process.cwd(), "src/content/species");

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

function pick(data: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const key of KEEP) {
    if (data[key] !== undefined) out[key] = data[key];
  }
  return out;
}

function dumpLocale(id: string, locale: "ru" | "tr", data: Record<string, unknown>) {
  const filePath = path.join(contentRoot, id, `${locale}.mdx`);
  const payload = pick(data);
  if (payload.id !== id) {
    throw new Error(`${id}: frontmatter id mismatch`);
  }
  const raw = matter.stringify("", payload).replace(/\n+$/, "\n");
  fs.writeFileSync(filePath, raw, "utf8");
}

const [locale, id, jsonPath] = process.argv.slice(2);
if ((locale !== "ru" && locale !== "tr") || !id || !jsonPath) {
  throw new Error("Usage: tsx scripts/write-species-locale-mdx.ts <ru|tr> <id> <json>");
}

const data = JSON.parse(fs.readFileSync(jsonPath, "utf8")) as Record<
  string,
  unknown
>;
dumpLocale(id, locale, data);
