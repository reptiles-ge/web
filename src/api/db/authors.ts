import type { AppLocale } from "@/i18n/routing";
import type { CreditPersonNames } from "@/i18n/speciesTranslation";

import type { ApiDatabase } from "./database";

import { renderBoundInserts } from "./sqlRender";

const AUTHOR_TABLES = [
  {
    columns: [
      "id",
      "kind_id",
      "role_id",
      "job_title_id",
      "is_contributor",
      "portrait_src",
      "portrait_class",
      "facebook_url",
      "inaturalist_url",
      "instagram_url",
      "research_gate_url",
    ],
    name: "authors",
  },
  {
    columns: ["author_id", "locale", "name", "bio", "meta_description"],
    name: "author_texts",
  },
  { columns: ["alias", "author_id"], name: "author_aliases" },
  {
    columns: ["author_id", "affiliation_id", "position"],
    name: "author_affiliations",
  },
] as const;

export const RELINK_MEDIA_AUTHORS = [
  "UPDATE species_media SET author_id = (SELECT author_id FROM author_aliases WHERE alias = species_media.credit_person);",
  "UPDATE species_media_overlays SET author_id = (SELECT author_id FROM author_aliases WHERE alias = species_media_overlays.credit_person);",
];

const RELINK_SPECIES_MEDIA =
  "UPDATE species_media SET author_id = (SELECT author_id FROM author_aliases WHERE alias = species_media.credit_person) WHERE species_id = ?";

const RELINK_SPECIES_OVERLAYS =
  "UPDATE species_media_overlays SET author_id = (SELECT author_id FROM author_aliases WHERE alias = species_media_overlays.credit_person) WHERE media_id IN (SELECT id FROM species_media WHERE species_id = ?)";

export type AuthorRecord = {
  affiliations: string[];
  aliases: string[];
  id: string;
  isContributor: boolean;
  jobTitle: null | string;
  kind: AuthorKind;
  links: AuthorLinks;
  portraitClass: null | string;
  portraitSrc: null | string;
  role: null | string;
  texts: Partial<Record<AppLocale, AuthorText>> & { ka: AuthorText };
};

type AuthorKind = "page" | "person";

type AuthorLinks = {
  facebook?: string;
  inaturalist?: string;
  instagram?: string;
  researchGate?: string;
};

type AuthorRow = {
  facebook_url: null | string;
  id: string;
  inaturalist_url: null | string;
  instagram_url: null | string;
  is_contributor: number;
  job_title_id: null | string;
  kind_id: AuthorKind;
  portrait_class: null | string;
  portrait_src: null | string;
  research_gate_url: null | string;
  role_id: null | string;
};

type AuthorText = {
  bio?: string;
  metaDescription?: string;
  name: string;
};

type TextRow = {
  author_id: string;
  bio: null | string;
  locale: AppLocale;
  meta_description: null | string;
  name: string;
};

const AUTHOR_SELECT =
  "SELECT id, kind_id, role_id, job_title_id, is_contributor, portrait_src, portrait_class, facebook_url, inaturalist_url, instagram_url, research_gate_url FROM authors";

export async function findAliasOwners(
  db: ApiDatabase,
  aliases: readonly string[],
) {
  if (aliases.length === 0) return new Map<string, string>();
  const { results } = await db
    .prepare(
      `SELECT alias, author_id FROM author_aliases WHERE alias IN (${aliases.map(() => "?").join(", ")})`,
    )
    .bind(...aliases)
    .all<{ alias: string; author_id: string }>();
  return new Map(results.map((row) => [row.alias, row.author_id]));
}

export async function getAuthorDetail(
  db: ApiDatabase,
  id: string,
  locale: AppLocale,
) {
  const [record, photoCount] = await Promise.all([
    readAuthor(db, id),
    readAuthorPhotoCount(db, id),
  ]);
  if (!record) return null;
  const text = record.texts[locale];
  const bio = text?.bio ?? record.texts.ka.bio;
  const metaDescription = text?.metaDescription;
  return {
    affiliations: record.affiliations,
    aliases: record.aliases,
    ...(bio ? { bio } : {}),
    id: record.id,
    isContributor: record.isContributor,
    jobTitle: record.jobTitle,
    kind: record.kind,
    links: record.links,
    ...(metaDescription ? { metaDescription } : {}),
    name: text?.name ?? record.texts.ka.name,
    photoCount,
    portraitClass: record.portraitClass,
    portraitSrc: record.portraitSrc,
    role: record.role,
  };
}

export async function listAuthors(
  db: ApiDatabase,
  locale: AppLocale,
  contributorsOnly: boolean,
) {
  const [authors, texts, photos] = await Promise.all([
    db
      .prepare(
        `${AUTHOR_SELECT}${contributorsOnly ? " WHERE is_contributor = 1" : ""} ORDER BY id`,
      )
      .all<AuthorRow>(),
    db
      .prepare(
        "SELECT author_id, locale, name, bio, meta_description FROM author_texts WHERE locale IN ('ka', ?)",
      )
      .bind(locale)
      .all<TextRow>(),
    countPublishedPhotos(db),
  ]);
  const names = new Map<string, Partial<Record<AppLocale, string>>>();
  for (const row of texts.results) {
    names.set(row.author_id, {
      ...names.get(row.author_id),
      [row.locale]: row.name,
    });
  }
  return authors.results.map((row) => {
    const name = names.get(row.id);
    return {
      id: row.id,
      isContributor: row.is_contributor === 1,
      kind: row.kind_id,
      name: name?.[locale] ?? name?.ka ?? row.id,
      photoCount: photos.get(row.id) ?? 0,
      role: row.role_id,
    };
  });
}

export async function readAuthor(db: ApiDatabase, id: string) {
  const [row, texts, aliases, affiliations] = await db.batch([
    db.prepare(`${AUTHOR_SELECT} WHERE id = ?`).bind(id),
    db
      .prepare(
        "SELECT author_id, locale, name, bio, meta_description FROM author_texts WHERE author_id = ? ORDER BY locale",
      )
      .bind(id),
    db
      .prepare(
        "SELECT alias FROM author_aliases WHERE author_id = ? ORDER BY alias",
      )
      .bind(id),
    db
      .prepare(
        "SELECT affiliation_id FROM author_affiliations WHERE author_id = ? ORDER BY position",
      )
      .bind(id),
  ]);
  const author = row!.results[0] as AuthorRow | undefined;
  if (!author) return null;
  const record: AuthorRecord = {
    affiliations: (
      affiliations!.results as Array<{ affiliation_id: string }>
    ).map((entry) => entry.affiliation_id),
    aliases: (aliases!.results as Array<{ alias: string }>).map(
      (entry) => entry.alias,
    ),
    id: author.id,
    isContributor: author.is_contributor === 1,
    jobTitle: author.job_title_id,
    kind: author.kind_id,
    links: compactLinks(author),
    portraitClass: author.portrait_class,
    portraitSrc: author.portrait_src,
    role: author.role_id,
    texts: {} as AuthorRecord["texts"],
  };
  for (const text of texts!.results as TextRow[]) {
    record.texts[text.locale] = {
      name: text.name,
      ...(text.bio ? { bio: text.bio } : {}),
      ...(text.meta_description
        ? { metaDescription: text.meta_description }
        : {}),
    };
  }
  return record;
}

export async function readCreditPersonNames(
  db: ApiDatabase,
  locale: AppLocale,
): Promise<CreditPersonNames> {
  if (locale === "ka") return () => undefined;
  const { results } = await db
    .prepare(
      "SELECT a.alias AS alias, t.name AS name FROM author_aliases a JOIN author_texts t ON t.author_id = a.author_id AND t.locale = ?",
    )
    .bind(locale)
    .all<{ alias: string; name: string }>();
  const names = new Map(results.map((row) => [row.alias, row.name]));
  return (photographer) => names.get(photographer);
}

export function relinkSpeciesAuthors(db: ApiDatabase, speciesId: string) {
  return [
    db.prepare(RELINK_SPECIES_MEDIA).bind(speciesId),
    db.prepare(RELINK_SPECIES_OVERLAYS).bind(speciesId),
  ];
}

export async function writeAuthor(db: ApiDatabase, author: AuthorRecord) {
  const rows = authorRows(author);
  await db.batch([
    db
      .prepare("DELETE FROM author_affiliations WHERE author_id = ?")
      .bind(author.id),
    db
      .prepare("DELETE FROM author_aliases WHERE author_id = ?")
      .bind(author.id),
    db.prepare("DELETE FROM author_texts WHERE author_id = ?").bind(author.id),
    db
      .prepare(
        "INSERT INTO authors (id, kind_id, role_id, job_title_id, is_contributor, portrait_src, portrait_class, facebook_url, inaturalist_url, instagram_url, research_gate_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (id) DO UPDATE SET kind_id = excluded.kind_id, role_id = excluded.role_id, job_title_id = excluded.job_title_id, is_contributor = excluded.is_contributor, portrait_src = excluded.portrait_src, portrait_class = excluded.portrait_class, facebook_url = excluded.facebook_url, inaturalist_url = excluded.inaturalist_url, instagram_url = excluded.instagram_url, research_gate_url = excluded.research_gate_url",
      )
      .bind(...rows.authors[0]!),
    ...AUTHOR_TABLES.slice(1).flatMap((table) =>
      renderBoundInserts(table.name, table.columns, rows[table.name]).map(
        ({ sql, values }) => db.prepare(sql).bind(...values),
      ),
    ),
    ...RELINK_MEDIA_AUTHORS.map((sql) => db.prepare(sql)),
  ]);
}

function authorRows(author: AuthorRecord) {
  return {
    author_affiliations: author.affiliations.map((id, position) => [
      author.id,
      id,
      position,
    ]),
    author_aliases: author.aliases.map((alias) => [alias, author.id]),
    author_texts: Object.entries(author.texts).map(([locale, text]) => [
      author.id,
      locale,
      text.name,
      text.bio ?? null,
      text.metaDescription ?? null,
    ]),
    authors: [
      [
        author.id,
        author.kind,
        author.role,
        author.jobTitle,
        author.isContributor ? 1 : 0,
        author.portraitSrc,
        author.portraitClass,
        author.links.facebook ?? null,
        author.links.inaturalist ?? null,
        author.links.instagram ?? null,
        author.links.researchGate ?? null,
      ],
    ],
  };
}

function compactLinks(row: AuthorRow): AuthorLinks {
  const links: AuthorLinks = {};
  if (row.facebook_url) links.facebook = row.facebook_url;
  if (row.inaturalist_url) links.inaturalist = row.inaturalist_url;
  if (row.instagram_url) links.instagram = row.instagram_url;
  if (row.research_gate_url) links.researchGate = row.research_gate_url;
  return links;
}

async function countPublishedPhotos(db: ApiDatabase, id?: string) {
  const { results } = await db
    .prepare(
      `SELECT m.author_id AS author_id, COUNT(DISTINCT m.src) AS photos FROM species_media m JOIN species s ON s.id = m.species_id WHERE m.author_id IS NOT NULL AND m.role != 'audio' AND s.status = 'published'${id ? " AND m.author_id = ?" : ""} GROUP BY m.author_id`,
    )
    .bind(...(id ? [id] : []))
    .all<{ author_id: string; photos: number }>();
  return new Map(results.map((row) => [row.author_id, row.photos]));
}

async function readAuthorPhotoCount(db: ApiDatabase, id: string) {
  return (await countPublishedPhotos(db, id)).get(id) ?? 0;
}
