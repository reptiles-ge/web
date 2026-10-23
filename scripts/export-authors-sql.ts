import { writeFileSync } from "node:fs";
import path from "node:path";

import type { AppLocale } from "@/i18n/routing";

import { AUTHOR_TABLES, RELINK_MEDIA_AUTHORS } from "@/api/db/authors";
import { renderLiteralInserts } from "@/api/db/sqlRender";
import { createSpeciesTestDatabase } from "@/api/testing/sqliteDatabase";
import { CREDIT_AUTHORS } from "@/data/creditAuthors";
import { CREDIT_PEOPLE } from "@/data/creditNames";
import { transliterateKa } from "@/lib/slugify";

type Author = {
  aliases: Set<string>;
  bio: Partial<Record<AppLocale, string>>;
  contributor: (typeof CREDIT_AUTHORS)[number] | null;
  id: string;
  names: Partial<Record<AppLocale, string>>;
};

const OUTPUT = path.resolve(
  import.meta.dirname,
  "../migrations/api/0007_authors_backfill.sql",
);
const REPORT = process.argv[2];
const LOCALES: AppLocale[] = ["ka", "en", "ru", "tr"];
const CYRILLIC: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "kh",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "shch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
};
const LICENSE_SUFFIX = /\s*(?:\/\s*|\()\s*CC[ -][^)]*\)?\s*$/i;

function asciiSlug(value: string) {
  const latin = [...transliterateKa(value.toLowerCase())]
    .map((char) => CYRILLIC[char] ?? char)
    .join("");
  return latin
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const database = createSpeciesTestDatabase();
const media = database.sqlite
  .prepare(
    "SELECT DISTINCT credit_person AS name FROM species_media WHERE credit_person IS NOT NULL ORDER BY credit_person",
  )
  .all() as Array<{ name: string }>;
const overlayNames = database.sqlite
  .prepare(
    "SELECT DISTINCT locale, credit_person AS name FROM species_media_overlays WHERE credit_person IS NOT NULL ORDER BY credit_person, locale",
  )
  .all() as Array<{ locale: AppLocale; name: string }>;
const overlays = database.sqlite
  .prepare(
    "SELECT o.locale AS locale, o.credit_person AS name, m.credit_person AS base, m.species_id AS species, m.src AS src FROM species_media_overlays o JOIN species_media m ON m.id = o.media_id WHERE o.credit_person IS NOT NULL AND m.credit_person IS NOT NULL ORDER BY m.credit_person, o.locale, o.credit_person",
  )
  .all() as Array<{
  base: string;
  locale: AppLocale;
  name: string;
  species: string;
  src: string;
}>;

const authors = new Map<string, Author>();
const byAlias = new Map<string, Author>();
const takenIds = new Set<string>();
const review: string[] = [];
const translationOnly = new Set<string>();

function uniqueId(base: string) {
  const root = base || "author";
  let id = root;
  for (let n = 2; takenIds.has(id); n += 1) id = `${root}-${n}`;
  takenIds.add(id);
  return id;
}

function addAlias(author: Author, alias: string) {
  const owner = byAlias.get(alias);
  if (owner && owner !== author) {
    review.push(
      `Alias "${alias}" already belongs to ${owner.id}; not added to ${author.id}`,
    );
    return;
  }
  author.aliases.add(alias);
  byAlias.set(alias, author);
}

for (const contributor of CREDIT_AUTHORS) {
  const author: Author = {
    aliases: new Set(),
    bio: { ...contributor.bio },
    contributor,
    id: uniqueId(contributor.id),
    names: { ...contributor.name },
  };
  authors.set(author.id, author);
  for (const alias of [
    ...contributor.aliases,
    ...Object.values(contributor.name),
  ])
    if (alias) addAlias(author, alias);
}

for (const [ka, translations] of Object.entries(CREDIT_PEOPLE)) {
  const known = [ka, ...Object.values(translations)].find((name) =>
    byAlias.has(name),
  );
  const author =
    (known ? byAlias.get(known) : undefined) ??
    (() => {
      const created: Author = {
        aliases: new Set(),
        bio: {},
        contributor: null,
        id: uniqueId(asciiSlug(translations.en) || asciiSlug(ka)),
        names: { ka, ...translations },
      };
      authors.set(created.id, created);
      return created;
    })();
  for (const alias of [ka, ...Object.values(translations)])
    addAlias(author, alias);
}

function ensureAuthor(name: string, locale: AppLocale = "ka") {
  if (byAlias.has(name)) return;
  const clean = name.replace(LICENSE_SUFFIX, "").trim();
  const existing = byAlias.get(clean) ?? authors.get(asciiSlug(clean));
  if (existing) {
    if (!byAlias.has(clean)) {
      review.push(`"${clean}" merged into ${existing.id} by spelling`);
      addAlias(existing, clean);
      if (!existing.names[locale]) existing.names[locale] = clean;
    }
    addAlias(existing, name);
    return;
  }
  if (locale !== "ka") translationOnly.add(clean);
  const author: Author = {
    aliases: new Set(),
    bio: {},
    contributor: null,
    id: uniqueId(asciiSlug(clean)),
    names: { ka: clean },
  };
  authors.set(author.id, author);
  addAlias(author, clean);
  if (clean !== name) addAlias(author, name);
  if (/ & | and |\//.test(clean))
    review.push(
      `"${clean}" (${author.id}) names more than one person or an organisation`,
    );
}

for (const { name } of media) ensureAuthor(name);
for (const { locale, name } of overlayNames) ensureAuthor(name, locale);

const mismatches = new Set<string>();
for (const { base, locale, name, species, src } of overlays) {
  const ka = byAlias.get(base)!;
  const translated = byAlias.get(name)!;
  if (ka !== translated)
    mismatches.add(
      `${species} ${src.split("/").pop()}: ka ${ka.id}, ${locale} ${translated.id}`,
    );
}

const sorted = [...authors.values()].sort((a, b) => a.id.localeCompare(b.id));
const rows: Record<string, unknown[][]> = {
  author_affiliations: [],
  author_aliases: [],
  author_texts: [],
  authors: [],
};
for (const author of sorted) {
  const c = author.contributor;
  rows.authors.push([
    author.id,
    c?.kind ?? "person",
    c?.role ?? null,
    c?.jobTitle ?? null,
    c?.published ? 1 : 0,
    c?.portraitSrc ?? null,
    c?.portraitClass ?? null,
    c?.links?.facebook ?? null,
    c?.links?.inaturalist ?? null,
    c?.links?.instagram ?? null,
    c?.links?.researchGate ?? null,
  ]);
  for (const locale of LOCALES) {
    const name = author.names[locale];
    if (!name) continue;
    rows.author_texts.push([
      author.id,
      locale,
      name,
      author.bio[locale] ?? null,
      locale === "ka" ? null : (c?.metaDescription?.[locale] ?? null),
    ]);
  }
  for (const alias of [...author.aliases].sort())
    rows.author_aliases.push([alias, author.id]);
  for (const [position, affiliation] of (c?.affiliations ?? []).entries())
    rows.author_affiliations.push([author.id, affiliation, position]);
}

const statements = [
  ...AUTHOR_TABLES.flatMap((table) =>
    renderLiteralInserts(table.name, table.columns, rows[table.name]!),
  ),
  ...RELINK_MEDIA_AUTHORS,
];
writeFileSync(OUTPUT, `${statements.join("\n")}\n`);

const report = [
  `authors: ${sorted.length} (contributors: ${sorted.filter((a) => a.contributor?.published).length})`,
  `aliases: ${rows.author_aliases.length}`,
  `photo credit names: ${media.length}, overlay rows: ${overlays.length}`,
  `photos whose translated credit names another author: ${mismatches.size}`,
  `authors known only from a translated credit: ${translationOnly.size}`,
  "",
  ...new Set(review),
  "",
  ...mismatches,
  "",
  ...[...translationOnly].sort(),
].join("\n");
if (REPORT) writeFileSync(REPORT, `${report}\n`);
console.log(report.split("\n").slice(0, 3).join("\n"));
console.log(
  `review notes: ${new Set(review).size}, credit mismatches: ${mismatches.size} → ${path.relative(process.cwd(), OUTPUT)}`,
);
