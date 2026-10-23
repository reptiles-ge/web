import type { NewsArticle, NewsPhoto } from "@/data/newsTypes";

import { locales } from "@/i18n/locales";

import type { SqlExpression, SqlValue } from "./speciesRows";

import { RELINK_NEWS_MEDIA_AUTHORS } from "./authors";
import { NEWS_TABLES, type NewsTable } from "./newsSchema";
import { renderLiteralInserts } from "./sqlRender";

export type NewsRecord = {
  article: NewsArticle;
  position: number;
};

type Cell = SqlExpression | SqlValue;

type MediaRole = "cover" | "gallery";

const NEWS_IMPORT_GUARD =
  "INSERT INTO news_import_runs (ran_at) SELECT CASE WHEN EXISTS (SELECT 1 FROM news_articles) THEN NULL ELSE strftime('%Y-%m-%dT%H:%M:%fZ', 'now') END;";

export function buildNewsImport(articles: readonly NewsArticle[]) {
  const merged = new Map<NewsTable, Cell[][]>(
    NEWS_TABLES.map((table) => [table.name, []]),
  );
  articles.forEach((article, position) => {
    for (const [table, rows] of newsRecordRows({ article, position })) {
      merged.get(table)!.push(...rows);
    }
  });
  return [
    NEWS_IMPORT_GUARD,
    ...NEWS_TABLES.flatMap((table) =>
      renderLiteralInserts(table.name, table.columns, merged.get(table.name)!),
    ),
    RELINK_NEWS_MEDIA_AUTHORS,
  ];
}

export function newsRecordRows({ article, position }: NewsRecord) {
  const rows = new Map<NewsTable, Cell[][]>(
    NEWS_TABLES.map((table) => [table.name, []]),
  );
  const add = (table: NewsTable, row: Cell[]) => rows.get(table)!.push(row);
  const id = article.id;

  add("news_articles", [
    id,
    article.status,
    position,
    article.publishedAt,
    article.updatedAt ?? null,
    article.series ?? null,
  ]);
  for (const locale of locales) {
    const copy = article.copy[locale];
    if (!copy) continue;
    add("news_texts", [
      id,
      locale,
      copy.title,
      copy.dek,
      copy.lead,
      copy.metaTitle,
      copy.metaDescription,
    ]);
    copy.sections.forEach((section, index) =>
      add("news_sections", [
        id,
        locale,
        index,
        section.heading,
        JSON.stringify(section.blocks),
      ]),
    );
  }

  const addMedia = (role: MediaRole, index: number, photo: NewsPhoto) => {
    add("news_media", [
      id,
      role,
      index,
      photo.src,
      photo.width ?? null,
      photo.height ?? null,
      flag(photo.plate),
      flag(photo.fromAtlas),
      photo.credit?.photographer ?? null,
      photo.credit?.location ?? null,
      photo.credit?.date ?? null,
      photo.credit?.lat ?? null,
      photo.credit?.lng ?? null,
      photo.credit?.url ?? null,
      photo.credit?.photoConfidence ?? null,
    ]);
    for (const locale of locales) {
      const alt = photo.alt[locale];
      if (alt) add("news_media_alts", [mediaRef(id, role, index), locale, alt]);
    }
  };
  if (article.image) addMedia("cover", 0, article.image);
  (article.gallery ?? []).forEach((photo, index) =>
    addMedia("gallery", index, photo),
  );

  article.sources.forEach((source, index) =>
    add(
      "news_sources",
      typeof source.name === "string"
        ? [id, index, source.url, source.name, null, null, null, null]
        : [
            id,
            index,
            source.url,
            null,
            source.name.ka,
            source.name.en,
            source.name.ru,
            source.name.tr,
          ],
    ),
  );
  article.relatedHubIds.forEach((hub, index) =>
    add("news_hubs", [id, index, hub]),
  );
  article.relatedRegionIds.forEach((region, index) =>
    add("news_regions", [id, index, region]),
  );
  article.relatedSpeciesIds.forEach((species, index) =>
    add("news_species", [id, index, species]),
  );
  return rows;
}

function flag(value: boolean | undefined) {
  return value === undefined ? null : value ? 1 : 0;
}

function mediaRef(
  articleId: string,
  role: MediaRole,
  position: number,
): SqlExpression {
  return {
    sql: "(SELECT id FROM news_media WHERE article_id = ? AND role = ? AND position = ?)",
    values: [articleId, role, position],
  };
}
