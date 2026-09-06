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
import { ANIMAL_GROUP_TO_HUB } from "../src/lib/groupHubs";
import { parseToSiteDateTime, toSiteDateTime } from "../src/lib/siteTime";
import { buildSpeciesSlugMaps } from "../src/lib/speciesSlugRules";
import {
  kaFrontmatterSchema,
  sourcesAreValid,
  translationFrontmatterSchema,
  type KaFrontmatter,
} from "./speciesFrontmatter";

const contentRoot = path.join(process.cwd(), "src/content/species");
const contentRootRel = "src/content/species";
const outFile = path.join(process.cwd(), "src/data/species.generated.ts");
const slugOutFile = path.join(
  process.cwd(),
  "src/data/speciesSlugs.generated.ts",
);
const GIT_COMMITTER_DATE = /^\d{4}-\d{2}-\d{2}T/;

function toRepoPath(filePath: string) {
  return path.relative(process.cwd(), filePath).split(path.sep).join("/");
}

function loadGitFileDates(rootRel: string) {
  const firstByPath = new Map<string, string>();
  const lastByPath = new Map<string, string>();
  try {
    const out = execFileSync(
      "git",
      ["log", "--name-only", "--pretty=format:%cI", "--", rootRel],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    );
    let date: null | string = null;
    for (const rawLine of out.split("\n")) {
      const line = rawLine.trim();
      if (!line) continue;
      if (GIT_COMMITTER_DATE.test(line)) {
        date = parseToSiteDateTime(line);
        continue;
      }
      if (!date) continue;
      if (!lastByPath.has(line)) lastByPath.set(line, date);
      firstByPath.set(line, date);
    }
  } catch {
    return { firstByPath, lastByPath };
  }
  return { firstByPath, lastByPath };
}

const gitFileDates = loadGitFileDates(contentRootRel);

function getGitFirstCommitDate(filePaths: string[]): string | null {
  let oldest: string | null = null;
  for (const filePath of filePaths) {
    if (!fs.existsSync(filePath)) continue;
    const parsed = gitFileDates.firstByPath.get(toRepoPath(filePath));
    if (parsed && (!oldest || parsed < oldest)) oldest = parsed;
  }
  return oldest;
}

function getGitLastCommitDate(filePaths: string[]): string | null {
  let latest: string | null = null;
  for (const filePath of filePaths) {
    const parsed = gitFileDates.lastByPath.get(toRepoPath(filePath));
    if (parsed && (!latest || parsed > latest)) latest = parsed;
  }
  return latest;
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

function resolvePublishedAt(
  filePaths: string[],
  override: string | undefined,
  updatedAt: string,
): string {
  if (override) {
    const parsed = parseToSiteDateTime(override);
    if (parsed) return parsed;
  }
  return getGitFirstCommitDate(filePaths) ?? updatedAt;
}

function creditLacksLocation(credit?: PhotoCredit) {
  return !credit?.location?.trim();
}

function warnGeorgiaFieldWithoutLocation(filePath: string, fm: KaFrontmatter) {
  const hits: string[] = [];
  if (
    fm.imageCredit?.photoConfidence === "georgia-field" &&
    creditLacksLocation(fm.imageCredit)
  ) {
    hits.push("imageCredit");
  }
  if (
    fm.mobileImageCredit?.photoConfidence === "georgia-field" &&
    creditLacksLocation(fm.mobileImageCredit)
  ) {
    hits.push("mobileImageCredit");
  }
  for (const [index, image] of (fm.gallery ?? []).entries()) {
    const georgiaField =
      image.photoConfidence === "georgia-field" ||
      image.credit?.photoConfidence === "georgia-field";
    if (georgiaField && creditLacksLocation(image.credit)) {
      hits.push(`gallery[${index}]`);
    }
  }
  if (hits.length > 0) {
    console.warn(
      `${filePath}: georgia-field photoConfidence without location (${hits.join(", ")})`,
    );
  }
}

function formatZodError(
  filePath: string,
  error: { issues: Array<{ message: string; path: PropertyKey[] }> },
) {
  return error.issues
    .map((issue) => {
      const field = issue.path.length > 0 ? issue.path.join(".") : "(root)";
      return `${filePath}: ${field}: ${issue.message}`;
    })
    .join("\n");
}

function toSpecies(
  fm: KaFrontmatter,
  options: { publishedAt: string; updatedAt: string },
): Species {
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
    publishedAt: options.publishedAt,
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

const publishedIds = new Set<string>(
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
    errors.push(
      `${kaPath}: folder/id mismatch: folder=${id} frontmatter=${fm.id}`,
    );
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
    errors.push(`${kaPath}: danger: not allowed for group ${meta.group}`);
  }

  const enPath = path.join(contentRoot, id, "en.mdx");
  if (isPublished && !fs.existsSync(enPath)) {
    errors.push(`${id}: published taxon missing en.mdx`);
  }

  const updatedAt = resolveUpdatedAt([kaPath, ...localePaths]);
  const publishedAt = resolvePublishedAt(
    [kaPath, ...localePaths],
    fm.datePublished,
    updatedAt,
  );
  species.push(toSpecies(fm, { publishedAt, updatedAt }));
  warnGeorgiaFieldWithoutLocation(kaPath, fm);

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
    translationTables[locale][id] = toTranslation(
      parsedTr.data as KaFrontmatter,
    );
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

const speciesById = new Map(species.map((item) => [item.id, item]));
const slugRows = featuredSpeciesIds
  .filter((id) => !unpublishedSpeciesIds.has(id))
  .map((id) => {
    const item = speciesById.get(id);
    if (!item) {
      throw new Error(`${id}: published id missing compiled species`);
    }
    const meta = speciesAtlasMeta[id];
    if (!meta) {
      throw new Error(`${id}: missing speciesAtlasMeta entry`);
    }
    return {
      commonName: item.commonName,
      hub: ANIMAL_GROUP_TO_HUB[meta.group],
      id,
    };
  });
const slugMaps = buildSpeciesSlugMaps(slugRows);

const banner = `/* eslint-disable */
// Generated by scripts/compile-species.ts — do not edit by hand.
`;

const source = `${banner}import type { Species, SpeciesTranslation } from "./speciesTypes";

export const species: Species[] = ${JSON.stringify(species, null, 2)};

export const speciesEn: Record<string, SpeciesTranslation> = ${JSON.stringify(speciesEn, null, 2)};

export const speciesRu: Record<string, SpeciesTranslation> = ${JSON.stringify(speciesRu, null, 2)};

export const speciesTr: Record<string, SpeciesTranslation> = ${JSON.stringify(speciesTr, null, 2)};
`;

const slugSource = `${banner}import type { GroupHubId } from "../lib/groupHubs";

export const speciesHubById: Record<string, GroupHubId> = ${JSON.stringify(slugMaps.hubById, null, 2)};

export const kaSlugById: Record<string, string> = ${JSON.stringify(slugMaps.kaSlugById, null, 2)};

export const idByAnySlug: Record<string, string> = ${JSON.stringify(slugMaps.idByAnySlug, null, 2)};
`;

fs.writeFileSync(outFile, source, "utf8");
fs.writeFileSync(slugOutFile, slugSource, "utf8");
console.log(`Compiled ${species.length} species → ${outFile}`);
console.log(
  `Compiled ${slugRows.length} published slug rows → ${slugOutFile}`,
);
