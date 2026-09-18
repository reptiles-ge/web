import matter from "gray-matter";
import fs from "node:fs";
import path from "node:path";

import { getPublishedCreditAuthors } from "../src/data/creditAuthors";
import { getHerpetofaunaChecklistStatus } from "../src/data/herpetofauna-checklist";
import {
  getNewsArticleLocales,
  getPublishedNewsArticles,
} from "../src/data/news";
import { regions } from "../src/data/regions";
import { species } from "../src/data/species.generated";
import {
  type AnimalGroup,
  groupHasVenomConcept,
  speciesAtlasMeta,
} from "../src/data/speciesAtlasMeta";
import {
  featuredSpeciesIds,
  unpublishedSpeciesIds,
} from "../src/data/speciesPublish";
import {
  idByAnySlug,
  kaSlugById,
  speciesHubById,
} from "../src/data/speciesSlugs.generated";
import { pathnames } from "../src/i18n/pathnames";
import { type AppLocale } from "../src/i18n/routing";
import { routing } from "../src/i18n/routing";
import { ANIMAL_GROUP_TO_HUB, RESERVED_HUB_SLUGS } from "../src/lib/groupHubs";
import { liveQuizzes } from "../src/lib/quizzes";
import { getSpeciesPublicSlug } from "../src/lib/speciesSlugTable";

const repoRoot = process.cwd();
const contentRoot = path.join(repoRoot, "src/content/species");
const outFile = path.join(repoRoot, ".atlas/graph.json");
const locales = routing.locales;

type MdxLocale = {
  body: string;
  frontmatter: Record<string, unknown>;
  path: string;
};

function groupById() {
  return Object.fromEntries(
    Object.entries(speciesAtlasMeta).map(([id, meta]) => [
      id,
      {
        group: meta.group,
        habitats: meta.habitats,
        hasVenomConcept: groupHasVenomConcept(meta.group),
        hub: ANIMAL_GROUP_TO_HUB[meta.group],
      },
    ]),
  );
}

function localizedPattern(
  internalPath: keyof typeof pathnames,
  locale: AppLocale,
) {
  const table = pathnames as Record<string, Record<AppLocale, string> | string>;
  const value = table[String(internalPath)];
  if (!value) throw new Error(`Unknown pathname: ${String(internalPath)}`);
  const pattern =
    typeof value === "string" ? value : (value[locale] ?? value.en ?? value.ka);
  if (locale === "ka") return pattern;
  return pattern === "/" ? `/${locale}` : `/${locale}${pattern}`;
}

function main() {
  const publishedSpeciesIds = featuredSpeciesIds.filter(
    (id) => !unpublishedSpeciesIds.has(id),
  );
  const generatedById = Object.fromEntries(
    species.map((item) => [
      item.id,
      {
        commonName: item.commonName,
        danger: item.danger ?? null,
        dateModified: item.updatedAt,
        datePublished: item.publishedAt,
        galleryCount: item.gallery.length,
        scientificName: item.scientificName,
      },
    ]),
  );

  const graph = {
    generatedAt: new Date().toISOString(),
    locales,
    regions: regions.map((region) => ({
      id: region.id,
      speciesIds: region.speciesIds,
    })),
    routing: {
      idByAnySlug,
      kaSlugById,
      reservedSlugsByHub: RESERVED_HUB_SLUGS,
      speciesHubById,
      speciesSlugsByLocale: speciesSlugsByLocale(publishedSpeciesIds),
      validPaths: [...validAtlasPaths(publishedSpeciesIds)].sort(),
    },
    species: {
      atlasMetaById: groupById(),
      checklistStatusById: Object.fromEntries(
        Object.keys(speciesAtlasMeta).map((id) => [
          id,
          getHerpetofaunaChecklistStatus(id),
        ]),
      ),
      featuredIds: featuredSpeciesIds,
      generatedById,
      publishedIds: publishedSpeciesIds,
      unpublishedIds: [...unpublishedSpeciesIds].sort(),
      venomConceptGroups: venomConceptGroups(),
    },
    speciesContent: readContent(),
  };

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, `${JSON.stringify(graph, null, 2)}\n`, "utf8");
  console.log(`Wrote ${outFile}`);
}

function materializePath(
  internalPath: keyof typeof pathnames,
  locale: AppLocale,
  params: Record<string, string> = {},
) {
  let out = localizedPattern(internalPath, locale);
  for (const [key, value] of Object.entries(params)) {
    out = out.replace(`[${key}]`, value);
  }
  return out;
}

function readContent() {
  if (!fs.existsSync(contentRoot)) {
    throw new Error(`Missing content directory: ${contentRoot}`);
  }

  return fs
    .readdirSync(contentRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const id = entry.name;
      const dir = path.join(contentRoot, id);
      const byLocale: Partial<Record<(typeof locales)[number], MdxLocale>> = {};
      for (const locale of locales) {
        const localeFile = readLocale(path.join(dir, `${locale}.mdx`));
        if (localeFile) byLocale[locale] = localeFile;
      }
      return { id, locales: byLocale, path: relPath(dir) };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

function readLocale(filePath: string): MdxLocale | null {
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  return {
    body: parsed.content,
    frontmatter: parsed.data,
    path: relPath(filePath),
  };
}

function relPath(filePath: string) {
  return path.relative(repoRoot, filePath).split(path.sep).join("/");
}

function speciesSlugsByLocale(ids: readonly string[]) {
  return Object.fromEntries(
    routing.locales.map((locale) => [
      locale,
      Object.fromEntries(
        ids.map((id) => [id, getSpeciesPublicSlug(id, locale)]),
      ),
    ]),
  );
}

function validAtlasPaths(publishedSpeciesIds: readonly string[]) {
  const paths = new Set<string>();
  const add = (value: string) => paths.add(value.replace(/\/+$/, "") || "/");
  const published = new Set(publishedSpeciesIds);

  for (const internal of Object.keys(pathnames) as Array<
    keyof typeof pathnames
  >) {
    if (String(internal).includes("[")) continue;
    add(String(internal));
    for (const locale of routing.locales) {
      add(materializePath(internal, locale));
    }
  }

  for (const id of publishedSpeciesIds) {
    const hub = speciesHubById[id];
    if (!hub) continue;
    const internal = `/${hub}/[slug]` as keyof typeof pathnames;
    for (const locale of routing.locales) {
      add(
        materializePath(internal, locale, {
          slug: getSpeciesPublicSlug(id, locale),
        }),
      );
    }
  }

  for (const [slug, id] of Object.entries(idByAnySlug)) {
    const hub = speciesHubById[id];
    if (published.has(id) && hub) add(`/${hub}/${slug}`);
  }

  for (const region of regions) {
    add(`/regions/${region.id}`);
    for (const locale of routing.locales) {
      add(materializePath("/regions/[id]", locale, { id: region.id }));
    }
  }

  for (const article of getPublishedNewsArticles()) {
    add(`/news/${article.slug}`);
    for (const locale of getNewsArticleLocales(article)) {
      add(materializePath("/news/[slug]", locale, { slug: article.slug }));
    }
  }

  for (const author of getPublishedCreditAuthors()) {
    add(`/authors/${author.slug}`);
    for (const locale of routing.locales) {
      add(materializePath("/authors/[slug]", locale, { slug: author.slug }));
    }
  }

  for (const quiz of liveQuizzes()) {
    for (const slug of Object.values(quiz.slugs)) {
      add(`/quiz/${slug}`);
    }
    for (const locale of routing.locales) {
      add(
        materializePath("/quiz/[slug]", locale, { slug: quiz.slugs[locale] }),
      );
    }
  }

  return paths;
}

function venomConceptGroups() {
  const groups: AnimalGroup[] = [
    "amphibian",
    "bird",
    "insect",
    "lizard",
    "mammal",
    "snake",
    "spider",
    "turtle",
  ];
  return groups.filter(groupHasVenomConcept);
}

main();
