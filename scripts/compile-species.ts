import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  type DangerLevel,
  type GalleryImage,
  type PhotoCredit,
  type Species,
  type SpeciesAudio,
  type SpeciesFaq,
  type SpeciesIdentification,
  type SpeciesSource,
  type SpeciesStat,
  type SpeciesTranslation,
} from "../src/data/speciesTypes";
import {
  groupHasVenomConcept,
  speciesAtlasMeta,
} from "../src/data/speciesAtlasMeta";
import {
  featuredSpeciesIds,
  unpublishedSpeciesIds,
} from "../src/data/speciesPublish";
import { parseToSiteDateTime, toSiteDateTime } from "../src/lib/siteTime";
import {
  kaFrontmatterSchema,
  sourcesAreValid,
  translationFrontmatterSchema,
  type KaFrontmatter,
} from "./speciesFrontmatter";

const contentRoot = path.join(process.cwd(), "src/content/species");
const outFile = path.join(process.cwd(), "src/data/species.generated.ts");

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

function formatZodError(filePath: string, error: { issues: Array<{ message: string; path: PropertyKey[] }> }) {
  return error.issues
    .map((issue) => {
      const field = issue.path.length > 0 ? issue.path.join(".") : "(root)";
      return `${filePath}: ${field}: ${issue.message}`;
    })
    .join("\n");
}

function toSpecies(fm: KaFrontmatter, options: { updatedAt: string }): Species {
  const sources = (fm.sources ?? []) as SpeciesSource[];
  return {
    id: fm.id,
    commonName: fm.commonName,
    scientificName: fm.scientificName,
    genus: fm.genus,
    family: fm.family,
    location: fm.location ?? "",
    description: fm.description ?? "",
    overview: fm.overview ?? "",
    habitat: fm.habitat ?? "",
    diet: fm.diet ?? "",
    behavior: fm.behavior ?? "",
    conservation: fm.conservation ?? "",
    ...(fm.interaction ? { interaction: fm.interaction } : {}),
    ...(fm.danger ? { danger: fm.danger as DangerLevel } : {}),
    image: fm.image ?? "",
    ...(fm.imageCredit ? { imageCredit: fm.imageCredit as PhotoCredit } : {}),
    ...(fm.mobileImage ? { mobileImage: fm.mobileImage } : {}),
    ...(fm.mobileImageCredit
      ? { mobileImageCredit: fm.mobileImageCredit as PhotoCredit }
      : {}),
    gallery: (fm.gallery as GalleryImage[] | undefined) ?? [],
    stats: (fm.stats as SpeciesStat[] | undefined) ?? [],
    facts: fm.facts ?? [],
    ...(fm.identification
      ? { identification: fm.identification as SpeciesIdentification }
      : {}),
    ...(fm.audio?.src ? { audio: fm.audio as SpeciesAudio } : {}),
    ...(fm.faq ? { faq: fm.faq as SpeciesFaq[] } : {}),
    updatedAt: options.updatedAt,
    sources,
  };
}

function toTranslation(fm: KaFrontmatter): SpeciesTranslation {
  return {
    commonName: fm.commonName,
    location: fm.location ?? "",
    description: fm.description ?? "",
    overview: fm.overview ?? "",
    habitat: fm.habitat ?? "",
    diet: fm.diet ?? "",
    behavior: fm.behavior ?? "",
    conservation: fm.conservation ?? "",
    ...(fm.interaction ? { interaction: fm.interaction } : {}),
    stats: (fm.stats as SpeciesStat[] | undefined) ?? [],
    facts: fm.facts ?? [],
    ...(fm.identification
      ? { identification: fm.identification as SpeciesIdentification }
      : {}),
    ...(fm.faq ? { faq: fm.faq as SpeciesFaq[] } : {}),
    ...(fm.gallery?.length ? { gallery: fm.gallery as GalleryImage[] } : {}),
    ...(fm.imageCredit ? { imageCredit: fm.imageCredit as PhotoCredit } : {}),
    ...(fm.mobileImageCredit
      ? { mobileImageCredit: fm.mobileImageCredit as PhotoCredit }
      : {}),
  };
}

if (!fs.existsSync(contentRoot)) {
  throw new Error(`Missing content directory: ${contentRoot}`);
}

const TRANSLATION_LOCALES = ["en", "ru", "tr"] as const;

const publishedIds = new Set(
  featuredSpeciesIds.filter((id) => !unpublishedSpeciesIds.has(id)),
);

const ids = fs
  .readdirSync(contentRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort((a, b) => a.localeCompare(b));

const species: Species[] = [];
const speciesEn: Record<string, SpeciesTranslation> = {};
const speciesRu: Record<string, SpeciesTranslation> = {};
const speciesTr: Record<string, SpeciesTranslation> = {};
const translationTables = {
  en: speciesEn,
  ru: speciesRu,
  tr: speciesTr,
} as const;

const errors: string[] = [];

for (const id of ids) {
  const kaPath = path.join(contentRoot, id, "ka.mdx");
  const localePaths = TRANSLATION_LOCALES.map((locale) =>
    path.join(contentRoot, id, `${locale}.mdx`),
  );

  if (!fs.existsSync(kaPath)) {
    errors.push(`${path.join(contentRoot, id)}: missing ka.mdx`);
    continue;
  }

  const rawKa = matter(fs.readFileSync(kaPath, "utf8")).data;
  const parsedKa = kaFrontmatterSchema.safeParse(rawKa);
  if (!parsedKa.success) {
    errors.push(formatZodError(kaPath, parsedKa.error));
    continue;
  }

  const fm = parsedKa.data;
  if (fm.id !== id) {
    errors.push(`${kaPath}: folder/id mismatch: folder=${id} frontmatter=${fm.id}`);
  }

  if (!sourcesAreValid(fm.sources)) {
    errors.push(
      `${kaPath}: sources: missing, empty, or only generic entries without a URL`,
    );
  }

  const meta = speciesAtlasMeta[id];
  const isPublished = publishedIds.has(id);
  if (isPublished && !meta) {
    errors.push(`${id}: missing speciesAtlasMeta entry`);
  }

  if (fm.danger && meta && !groupHasVenomConcept(meta.group)) {
    errors.push(
      `${kaPath}: danger: not allowed for group ${meta.group}`,
    );
  }

  const enPath = path.join(contentRoot, id, "en.mdx");
  if (isPublished && !fs.existsSync(enPath)) {
    errors.push(`${id}: published taxon missing en.mdx`);
  }

  const updatedAt = resolveUpdatedAt([kaPath, ...localePaths]);
  species.push(toSpecies(fm, { updatedAt }));

  for (const locale of TRANSLATION_LOCALES) {
    const filePath = path.join(contentRoot, id, `${locale}.mdx`);
    if (!fs.existsSync(filePath)) continue;
    const parsedTr = translationFrontmatterSchema.safeParse(
      matter(fs.readFileSync(filePath, "utf8")).data,
    );
    if (!parsedTr.success) {
      errors.push(formatZodError(filePath, parsedTr.error));
      continue;
    }
    translationTables[locale][id] = toTranslation(parsedTr.data as KaFrontmatter);
  }
}

for (const id of publishedIds) {
  if (!ids.includes(id)) {
    errors.push(`${id}: published id has no content folder`);
  }
}

if (errors.length > 0) {
  console.error(`species:compile failed with ${errors.length} error(s):\n`);
  console.error(errors.join("\n"));
  process.exit(1);
}

const banner = `/* eslint-disable */
// Generated by scripts/compile-species.ts — do not edit by hand.
`;

const source = `${banner}import type { Species, SpeciesTranslation } from "./speciesTypes";

export const species: Species[] = ${JSON.stringify(species, null, 2)};

export const speciesEn: Record<string, SpeciesTranslation> = ${JSON.stringify(speciesEn, null, 2)};

export const speciesRu: Record<string, SpeciesTranslation> = ${JSON.stringify(speciesRu, null, 2)};

export const speciesTr: Record<string, SpeciesTranslation> = ${JSON.stringify(speciesTr, null, 2)};
`;

fs.writeFileSync(outFile, source, "utf8");
console.log(`Compiled ${species.length} species → ${outFile}`);
