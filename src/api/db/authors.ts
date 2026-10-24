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

export const RELINK_NEWS_MEDIA_AUTHORS =
  "UPDATE news_media SET author_id = (SELECT author_id FROM author_aliases WHERE alias = news_media.credit_person);";

export const RELINK_MEDIA_AUTHORS = [
  "UPDATE species_media SET author_id = (SELECT author_id FROM author_aliases WHERE alias = species_media.credit_person);",
  "UPDATE species_media_overlays SET author_id = (SELECT author_id FROM author_aliases WHERE alias = species_media_overlays.credit_person);",
  RELINK_NEWS_MEDIA_AUTHORS,
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
  return record ? authorProfile(record, locale, photoCount) : null;
}

export async function listAuthors(
  db: ApiDatabase,
  locale: AppLocale,
  contributorsOnly: boolean,
) {
  const [authors, texts, photos, aliases] = await Promise.all([
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
    db
      .prepare(
        contributorsOnly
          ? "SELECT a.alias AS alias, a.author_id AS author_id FROM author_aliases a JOIN authors au ON au.id = a.author_id WHERE au.is_contributor = 1 ORDER BY a.alias"
          : "SELECT alias, author_id FROM author_aliases ORDER BY alias",
      )
      .all<{ alias: string; author_id: string }>(),
  ]);
  const names = new Map<string, Partial<Record<AppLocale, string>>>();
  for (const row of texts.results) {
    names.set(row.author_id, {
      ...names.get(row.author_id),
      [row.locale]: row.name,
    });
  }
  const aliasesByAuthor = new Map<string, string[]>();
  for (const row of aliases.results) {
    const list = aliasesByAuthor.get(row.author_id);
    if (list) list.push(row.alias);
    else aliasesByAuthor.set(row.author_id, [row.alias]);
  }
  return authors.results.map((row) => {
    const name = names.get(row.id);
    return {
      aliases: aliasesByAuthor.get(row.id) ?? [],
      id: row.id,
      isContributor: row.is_contributor === 1,
      kind: row.kind_id,
      name: name?.[locale] ?? name?.ka ?? row.id,
      photoCount: photos.get(row.id) ?? 0,
      role: row.role_id,
    };
  });
}

export async function listContributors(
  db: ApiDatabase,
  locale: AppLocale,
  limit?: number,
) {
  const [authors, texts, aliases, affiliations, counts] = await Promise.all([
    db.prepare(`${AUTHOR_SELECT} WHERE is_contributor = 1`).all<AuthorRow>(),
    db
      .prepare(
        "SELECT t.author_id AS author_id, t.locale AS locale, t.name AS name, t.bio AS bio, t.meta_description AS meta_description FROM author_texts t JOIN authors a ON a.id = t.author_id WHERE a.is_contributor = 1 AND t.locale IN ('ka', ?)",
      )
      .bind(locale)
      .all<TextRow>(),
    db
      .prepare(
        "SELECT al.alias AS alias, al.author_id AS author_id FROM author_aliases al JOIN authors a ON a.id = al.author_id WHERE a.is_contributor = 1 ORDER BY al.alias",
      )
      .all<{ alias: string; author_id: string }>(),
    db
      .prepare(
        "SELECT af.affiliation_id AS affiliation_id, af.author_id AS author_id FROM author_affiliations af JOIN authors a ON a.id = af.author_id WHERE a.is_contributor = 1 ORDER BY af.author_id, af.position",
      )
      .all<{ affiliation_id: string; author_id: string }>(),
    db
      .prepare(
        "SELECT m.author_id AS author_id, COUNT(DISTINCT m.src) AS photos, COUNT(DISTINCT m.species_id) AS species FROM species_media m JOIN species s ON s.id = m.species_id JOIN authors a ON a.id = m.author_id WHERE a.is_contributor = 1 AND m.role != 'audio' AND s.status = 'published' GROUP BY m.author_id",
      )
      .all<{ author_id: string; photos: number; species: number }>(),
  ]);
  const records = new Map<string, AuthorRecord>(
    authors.results.map((row) => [row.id, authorRecord(row)]),
  );
  for (const text of texts.results) {
    const record = records.get(text.author_id);
    if (record) record.texts[text.locale] = authorText(text);
  }
  for (const { alias, author_id } of aliases.results) {
    records.get(author_id)?.aliases.push(alias);
  }
  for (const { affiliation_id, author_id } of affiliations.results) {
    records.get(author_id)?.affiliations.push(affiliation_id);
  }
  const totals = new Map(counts.results.map((row) => [row.author_id, row]));
  const data = [...records.values()]
    .map((record) => {
      const count = totals.get(record.id);
      return {
        ...authorProfile(record, locale, count?.photos ?? 0),
        speciesCount: count?.species ?? 0,
      };
    })
    .sort((a, b) => b.photoCount - a.photoCount || a.id.localeCompare(b.id));
  return { data: data.slice(0, limit), total: data.length };
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
  const record = authorRecord(author);
  record.affiliations = (
    affiliations!.results as Array<{ affiliation_id: string }>
  ).map((entry) => entry.affiliation_id);
  record.aliases = (aliases!.results as Array<{ alias: string }>).map(
    (entry) => entry.alias,
  );
  for (const text of texts!.results as TextRow[]) {
    record.texts[text.locale] = authorText(text);
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

function authorProfile(
  record: AuthorRecord,
  locale: AppLocale,
  photoCount: number,
) {
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

function authorRecord(row: AuthorRow): AuthorRecord {
  return {
    affiliations: [],
    aliases: [],
    id: row.id,
    isContributor: row.is_contributor === 1,
    jobTitle: row.job_title_id,
    kind: row.kind_id,
    links: compactLinks(row),
    portraitClass: row.portrait_class,
    portraitSrc: row.portrait_src,
    role: row.role_id,
    texts: {} as AuthorRecord["texts"],
  };
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

function authorText(row: TextRow): AuthorText {
  return {
    name: row.name,
    ...(row.bio ? { bio: row.bio } : {}),
    ...(row.meta_description ? { metaDescription: row.meta_description } : {}),
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
