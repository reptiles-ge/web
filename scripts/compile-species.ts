import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  defaultSpeciesSources,
  type DangerLevel,
  type GalleryImage,
  type PhotoCredit,
  type Species,
  type SpeciesAudio,
  type SpeciesFaq,
  type SpeciesIdentification,
  type SpeciesSource,
  type SpeciesStat,
} from "../src/data/species";
import { parseToSiteDateTime, toSiteDateTime } from "../src/lib/siteTime";

const contentRoot = path.join(process.cwd(), "src/content/species");
const outFile = path.join(process.cwd(), "src/data/species.generated.ts");

type SpeciesFrontmatter = {
  id: string;
  commonName: string;
  scientificName: string;
  genus: string;
  family: string;
  location: string;
  description: string;
  overview: string;
  habitat: string;
  diet: string;
  behavior: string;
  conservation: string;
  interaction?: string;
  danger?: DangerLevel;
  image: string;
  imageCredit?: PhotoCredit;
  mobileImage?: string;
  mobileImageCredit?: PhotoCredit;
  gallery: GalleryImage[];
  stats: SpeciesStat[];
  facts: string[];
  identification?: SpeciesIdentification;
  audio?: SpeciesAudio;
  faq?: SpeciesFaq[];
  sources?: SpeciesSource[];
};

function getGitLastCommitDate(filePaths: string[]): string | null {
  try {
    const out = execFileSync(
      "git",
      ["log", "-1", "--format=%cI", "--", ...filePaths],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim();
    return out ? parseToSiteDateTime(out) : null;
  } catch {
    return null;
  }
}

function getMtimeDate(filePaths: string[]): string | null {
  let latest = 0;
  for (const filePath of filePaths) {
    if (!fs.existsSync(filePath)) continue;
    latest = Math.max(latest, fs.statSync(filePath).mtimeMs);
  }
  return latest === 0 ? null : toSiteDateTime(new Date(latest));
}

function resolveUpdatedAt(filePaths: string[]): string {
  const existing = filePaths.filter((filePath) => fs.existsSync(filePath));
  if (existing.length === 0) {
    throw new Error(`Unable to resolve updatedAt for: ${filePaths.join(", ")}`);
  }

  const gitDate = getGitLastCommitDate(existing);
  if (gitDate) return gitDate;

  const mtimeDate = getMtimeDate(existing);
  if (mtimeDate) return mtimeDate;

  throw new Error(`Unable to resolve updatedAt for: ${filePaths.join(", ")}`);
}

function readSpeciesMdx(
  filePath: string,
  options?: { updatedAt?: string; sources?: SpeciesSource[] },
): Species {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);
  const fm = data as SpeciesFrontmatter;

  if (!fm.id || !fm.commonName || !fm.scientificName) {
    throw new Error(`Invalid species frontmatter: ${filePath}`);
  }

  return {
    id: fm.id,
    commonName: fm.commonName,
    scientificName: fm.scientificName,
    genus: fm.genus,
    family: fm.family,
    location: fm.location,
    description: fm.description,
    overview: fm.overview,
    habitat: fm.habitat,
    diet: fm.diet,
    behavior: fm.behavior,
    conservation: fm.conservation,
    ...(fm.interaction ? { interaction: fm.interaction } : {}),
    ...(fm.danger ? { danger: fm.danger } : {}),
    image: fm.image,
    ...(fm.imageCredit ? { imageCredit: fm.imageCredit } : {}),
    ...(fm.mobileImage ? { mobileImage: fm.mobileImage } : {}),
    ...(fm.mobileImageCredit
      ? { mobileImageCredit: fm.mobileImageCredit }
      : {}),
    gallery: fm.gallery ?? [],
    stats: fm.stats ?? [],
    facts: fm.facts ?? [],
    ...(fm.identification ? { identification: fm.identification } : {}),
    ...(fm.audio?.src ? { audio: fm.audio } : {}),
    ...(fm.faq ? { faq: fm.faq } : {}),
    updatedAt: options?.updatedAt ?? toSiteDateTime(new Date()),
    sources:
      options?.sources ??
      (fm.sources && fm.sources.length > 0
        ? fm.sources
        : defaultSpeciesSources),
  };
}

function toTranslation(item: Species) {
  return {
    commonName: item.commonName,
    location: item.location,
    description: item.description,
    overview: item.overview,
    habitat: item.habitat,
    diet: item.diet,
    behavior: item.behavior,
    conservation: item.conservation,
    ...(item.interaction ? { interaction: item.interaction } : {}),
    stats: item.stats,
    facts: item.facts,
    ...(item.identification ? { identification: item.identification } : {}),
    ...(item.faq ? { faq: item.faq } : {}),
    ...(item.gallery.length > 0 ? { gallery: item.gallery } : {}),
    ...(item.imageCredit ? { imageCredit: item.imageCredit } : {}),
    ...(item.mobileImageCredit
      ? { mobileImageCredit: item.mobileImageCredit }
      : {}),
  };
}

if (!fs.existsSync(contentRoot)) {
  throw new Error(`Missing content directory: ${contentRoot}`);
}

const ids = fs
  .readdirSync(contentRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort((a, b) => a.localeCompare(b));

const species: Species[] = [];
const speciesEn: Record<string, ReturnType<typeof toTranslation>> = {};

for (const id of ids) {
  const kaPath = path.join(contentRoot, id, "ka.mdx");
  const enPath = path.join(contentRoot, id, "en.mdx");

  if (!fs.existsSync(kaPath)) {
    throw new Error(`Missing ka.mdx for species: ${id}`);
  }

  const rawKa = matter(fs.readFileSync(kaPath, "utf8")).data as SpeciesFrontmatter;
  const updatedAt = resolveUpdatedAt([kaPath, enPath]);
  const sources =
    rawKa.sources && rawKa.sources.length > 0
      ? rawKa.sources
      : defaultSpeciesSources;

  const ka = readSpeciesMdx(kaPath, { updatedAt, sources });
  if (ka.id !== id) {
    throw new Error(`Folder/id mismatch: folder=${id} frontmatter=${ka.id}`);
  }
  species.push(ka);

  if (fs.existsSync(enPath)) {
    speciesEn[id] = toTranslation(readSpeciesMdx(enPath, { updatedAt, sources }));
  }
}

const banner = `/* eslint-disable */
// Generated by scripts/compile-species.ts — do not edit by hand.
`;

const source = `${banner}import type { Species, SpeciesTranslation } from "./species";

export const species: Species[] = ${JSON.stringify(species, null, 2)};

export const speciesEn: Record<string, SpeciesTranslation> = ${JSON.stringify(speciesEn, null, 2)};
`;

fs.writeFileSync(outFile, source, "utf8");
console.log(`Compiled ${species.length} species → ${outFile}`);
