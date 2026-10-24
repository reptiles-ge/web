import type {
  NewsArticle,
  NewsPhoto,
  NewsSectionBlock,
  NewsSource,
} from "@/data/newsTypes";
import type { PhotoCredit } from "@/data/speciesTypes";
import type { AppLocale } from "@/i18n/routing";

import { locales } from "@/i18n/locales";

import type { ApiDatabase } from "./database";
import type { NewsRecord } from "./newsRows";

type AdminListRow = {
  id: string;
  image: null | string;
  last_edited_at: null | string;
  photo_count: number;
  published_at: string;
  series_id: null | string;
  status: NewsArticle["status"];
  updated_at: null | string;
  version: number;
};

type AdminTitleRow = { article_id: string; locale: AppLocale; title: string };

type AltRow = { alt: string; locale: AppLocale; media_id: number };

type ArticleRow = {
  id: string;
  position: number;
  published_at: string;
  series_id: null | string;
  status: NewsArticle["status"];
  updated_at: null | string;
};

type MediaRow = {
  article_id: string;
  author_id: null | string;
  credit_date: null | string;
  credit_lat: null | number;
  credit_lng: null | number;
  credit_location: null | string;
  credit_person: null | string;
  credit_photo_confidence_id: null | string;
  credit_url: null | string;
  from_atlas: null | number;
  height: null | number;
  id: number;
  plate: null | number;
  role: "cover" | "gallery";
  src: string;
  width: null | number;
};

type RefRow = { article_id: string; ref_id: string };

type SectionRow = {
  article_id: string;
  blocks: string;
  heading: string;
  locale: AppLocale;
};

type SourceRow = {
  article_id: string;
  name: null | string;
  name_en: null | string;
  name_ka: null | string;
  name_ru: null | string;
  name_tr: null | string;
  url: string;
};

type TextRow = {
  article_id: string;
  dek: string;
  lead: string;
  locale: AppLocale;
  meta_description: string;
  meta_title: string;
  title: string;
};

export async function listAdminNews(db: ApiDatabase) {
  const [articles, titles] = await Promise.all([
    db
      .prepare(
        "SELECT a.id, a.status, a.published_at, a.updated_at, a.series_id, a.version, c.src AS image, (SELECT COUNT(*) FROM news_media g WHERE g.article_id = a.id AND g.role = 'gallery') AS photo_count, (SELECT r.created_at FROM news_revisions r WHERE r.article_id = a.id ORDER BY r.version DESC LIMIT 1) AS last_edited_at FROM news_articles a LEFT JOIN news_media c ON c.article_id = a.id AND c.role = 'cover' ORDER BY a.published_at DESC, a.position",
      )
      .all<AdminListRow>(),
    db
      .prepare("SELECT article_id, locale, title FROM news_texts")
      .all<AdminTitleRow>(),
  ]);
  const byArticle = new Map<string, Map<AppLocale, string>>();
  for (const row of titles.results) {
    const texts = byArticle.get(row.article_id) ?? new Map();
    texts.set(row.locale, row.title);
    byArticle.set(row.article_id, texts);
  }
  return articles.results.map((row) => {
    const texts = byArticle.get(row.id) ?? new Map<AppLocale, string>();
    return {
      id: row.id,
      image: row.image,
      lastEditedAt: row.last_edited_at,
      locales: locales.filter((locale) => texts.has(locale)),
      photoCount: row.photo_count,
      publishedAt: row.published_at,
      series: row.series_id,
      status: row.status,
      title: { en: texts.get("en") ?? null, ka: texts.get("ka") ?? null },
      updatedAt: row.updated_at,
      version: row.version,
    };
  });
}

export async function readNewsRecords(
  db: ApiDatabase,
  articleId?: string,
): Promise<NewsRecord[]> {
  const where = (column: string) => (articleId ? ` WHERE ${column} = ?` : "");
  const statement = (query: string) =>
    articleId ? db.prepare(query).bind(articleId) : db.prepare(query);
  const [
    articles,
    texts,
    sections,
    media,
    alts,
    sources,
    hubs,
    regions,
    species,
  ] = (
    await db.batch([
      statement(
        `SELECT id, status, position, published_at, updated_at, series_id FROM news_articles${where("id")} ORDER BY position`,
      ),
      statement(
        `SELECT article_id, locale, title, dek, lead, meta_title, meta_description FROM news_texts${where("article_id")} ORDER BY article_id, (SELECT position FROM locales WHERE code = locale)`,
      ),
      statement(
        `SELECT article_id, locale, heading, blocks FROM news_sections${where("article_id")} ORDER BY article_id, locale, position`,
      ),
      statement(
        `SELECT id, article_id, role, src, width, height, plate, from_atlas, author_id, credit_person, credit_location, credit_date, credit_lat, credit_lng, credit_url, credit_photo_confidence_id FROM news_media${where("article_id")} ORDER BY article_id, role, position`,
      ),
      statement(
        `SELECT media_id, locale, alt FROM news_media_alts${articleId ? " WHERE media_id IN (SELECT id FROM news_media WHERE article_id = ?)" : ""} ORDER BY media_id, (SELECT position FROM locales WHERE code = locale)`,
      ),
      statement(
        `SELECT article_id, url, name, name_ka, name_en, name_ru, name_tr FROM news_sources${where("article_id")} ORDER BY article_id, position`,
      ),
      statement(
        `SELECT article_id, hub_id AS ref_id FROM news_hubs${where("article_id")} ORDER BY article_id, position`,
      ),
      statement(
        `SELECT article_id, region_id AS ref_id FROM news_regions${where("article_id")} ORDER BY article_id, position`,
      ),
      statement(
        `SELECT article_id, species_id AS ref_id FROM news_species${where("article_id")} ORDER BY article_id, position`,
      ),
    ])
  ).map((result) => result.results) as [
    ArticleRow[],
    TextRow[],
    SectionRow[],
    MediaRow[],
    AltRow[],
    SourceRow[],
    RefRow[],
    RefRow[],
    RefRow[],
  ];

  const altsByMedia = byKey(alts, (row) => String(row.media_id));
  const mediaByArticle = byKey(media, (row) => row.article_id);
  const textsByArticle = byKey(texts, (row) => row.article_id);
  const sectionsByArticle = byKey(sections, (row) => row.article_id);
  const sourcesByArticle = byKey(sources, (row) => row.article_id);
  const refs = (list: RefRow[]) => {
    const grouped = byKey(list, (row) => row.article_id);
    return (id: string) => (grouped.get(id) ?? []).map((row) => row.ref_id);
  };
  const hubIds = refs(hubs);
  const regionIds = refs(regions);
  const speciesIds = refs(species);

  return articles.map((row) => {
    const copy = {} as NewsArticle["copy"];
    const articleSections = sectionsByArticle.get(row.id) ?? [];
    for (const text of textsByArticle.get(row.id) ?? []) {
      copy[text.locale] = {
        dek: text.dek,
        lead: text.lead,
        metaDescription: text.meta_description,
        metaTitle: text.meta_title,
        sections: articleSections
          .filter((section) => section.locale === text.locale)
          .map((section) => ({
            blocks: JSON.parse(section.blocks) as NewsSectionBlock[],
            heading: section.heading,
          })),
        title: text.title,
      };
    }
    const articleMedia = mediaByArticle.get(row.id) ?? [];
    const toPhoto = (entry: MediaRow) =>
      photo(entry, altsByMedia.get(String(entry.id)) ?? []);
    const cover = articleMedia.find((entry) => entry.role === "cover");
    const gallery = articleMedia
      .filter((entry) => entry.role === "gallery")
      .map(toPhoto);
    const article: NewsArticle = compact({
      copy,
      gallery: gallery.length > 0 ? gallery : undefined,
      id: row.id,
      image: cover ? toPhoto(cover) : undefined,
      publishedAt: row.published_at,
      relatedHubIds: hubIds(row.id) as NewsArticle["relatedHubIds"][number][],
      relatedRegionIds: regionIds(row.id),
      relatedSpeciesIds: speciesIds(row.id),
      series: (row.series_id as NewsArticle["series"]) ?? undefined,
      slug: row.id,
      sources: (sourcesByArticle.get(row.id) ?? []).map(source),
      status: row.status,
      updatedAt: row.updated_at ?? undefined,
    });
    return { article, position: row.position };
  });
}

function byKey<T>(list: T[], key: (row: T) => string) {
  const map = new Map<string, T[]>();
  for (const row of list) {
    const id = key(row);
    const bucket = map.get(id);
    if (bucket) bucket.push(row);
    else map.set(id, [row]);
  }
  return map;
}

function compact<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as T;
}

function photo(row: MediaRow, alts: AltRow[]): NewsPhoto {
  const credit = compact<PhotoCredit>({
    authorId: row.author_id ?? undefined,
    date: row.credit_date ?? undefined,
    lat: row.credit_lat ?? undefined,
    lng: row.credit_lng ?? undefined,
    location: row.credit_location ?? undefined,
    photoConfidence:
      (row.credit_photo_confidence_id as PhotoCredit["photoConfidence"]) ??
      undefined,
    photographer: row.credit_person ?? undefined,
    url: row.credit_url ?? undefined,
  });
  return compact({
    alt: Object.fromEntries(
      alts.map((entry) => [entry.locale, entry.alt]),
    ) as NewsPhoto["alt"],
    credit: Object.keys(credit).length > 0 ? credit : undefined,
    fromAtlas: row.from_atlas === null ? undefined : row.from_atlas === 1,
    height: row.height ?? undefined,
    plate: row.plate === null ? undefined : row.plate === 1,
    src: row.src,
    width: row.width ?? undefined,
  });
}

function source(row: SourceRow): NewsSource {
  return {
    name:
      row.name ??
      ({
        en: row.name_en!,
        ka: row.name_ka!,
        ru: row.name_ru!,
        tr: row.name_tr!,
      } satisfies Record<AppLocale, string>),
    url: row.url,
  };
}
