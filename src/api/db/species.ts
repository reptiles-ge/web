import type { AnimalGroup } from "@/data/speciesAtlasMeta";
import type { DangerLevel } from "@/data/speciesTypes";
import type { AppLocale } from "@/i18n/routing";

import { applySpeciesTranslation } from "@/i18n/speciesTranslation";
import { type PageParams, toPage } from "@/lib/pagination";

import type { ApiDatabase } from "./database";

import { readCreditPersonNames } from "./authors";
import { readPage } from "./paging";
import { containsPattern } from "./search";
import { readSpeciesCatalog } from "./speciesCatalog";

export type AdminSpeciesFilters = {
  group?: AnimalGroup;
  q?: string;
  status?: AdminListRow["status"];
};

type AdminListRow = {
  common_name_en: null | string;
  common_name_ka: string;
  danger_id: DangerLevel | null;
  group_id: AnimalGroup;
  id: string;
  image: null | string;
  last_edited_at: null | string;
  pending_drafts: number;
  photo_count: number;
  scientific_name: string;
  slug_ka: null | string;
  status: "draft" | "published" | "unpublished";
  version: number;
};

type ListRow = {
  common_name: string;
  danger_id: DangerLevel | null;
  group_id: AnimalGroup;
  id: string;
  image: string;
  scientific_name: string;
  slug_ka: null | string;
  updated_at: string;
};

type LookalikeRow = {
  common_name: string;
  id: string;
  slug_ka: null | string;
};

export async function findPublishedSpeciesId(
  db: ApiDatabase,
  slug: string,
  locale: AppLocale,
) {
  const row = await db
    .prepare(
      `SELECT id FROM species WHERE status = 'published' AND ${locale === "ka" ? "slug_ka" : "id"} = ?`,
    )
    .bind(slug)
    .first<{ id: string }>();
  return row?.id ?? null;
}

export async function getSpeciesDetail(
  db: ApiDatabase,
  id: string,
  locale: AppLocale,
) {
  const [catalog, lookalikes, personNames] = await Promise.all([
    readSpeciesCatalog(db, id),
    listLookalikes(db, id, locale),
    readCreditPersonNames(db, locale),
  ]);
  const base = catalog.species[0];
  const meta = catalog.atlasMeta[id];
  if (!base || !meta) return null;
  const translation =
    locale === "ka" ? undefined : catalog.translations[locale][id];
  return {
    ...(translation
      ? applySpeciesTranslation(base, translation, locale, personNames)
      : base),
    group: meta.group,
    habitats: meta.habitats,
    lookalikes,
    slug: publicSlug(id, catalog.kaSlugById[id] ?? null, locale),
  };
}

export async function listAdminSpecies(
  db: ApiDatabase,
  filters: AdminSpeciesFilters,
  page: PageParams,
) {
  const { rows, total } = await readPage<AdminListRow>(
    db,
    {
      from: "FROM species s JOIN species_texts k ON k.species_id = s.id AND k.locale = 'ka' LEFT JOIN species_texts e ON e.species_id = s.id AND e.locale = 'en' LEFT JOIN species_media h ON h.species_id = s.id AND h.role = 'hero' WHERE (?1 IS NULL OR s.group_id = ?1) AND (?2 IS NULL OR s.status = ?2) AND (?3 IS NULL OR s.id LIKE ?3 ESCAPE '\\' OR s.scientific_name LIKE ?3 ESCAPE '\\' OR k.common_name LIKE ?3 ESCAPE '\\' OR e.common_name LIKE ?3 ESCAPE '\\')",
      order: "s.catalog_position",
      select:
        "s.id, s.scientific_name, s.group_id, s.danger_id, s.status, s.slug_ka, s.version, k.common_name AS common_name_ka, e.common_name AS common_name_en, h.src AS image, (SELECT COUNT(*) FROM species_media g WHERE g.species_id = s.id AND g.role = 'gallery') AS photo_count, (SELECT COUNT(*) FROM species_drafts d WHERE d.species_id = s.id AND d.status = 'pending') AS pending_drafts, (SELECT r.created_at FROM species_revisions r WHERE r.species_id = s.id ORDER BY r.version DESC LIMIT 1) AS last_edited_at",
    },
    [filters.group ?? null, filters.status ?? null, containsPattern(filters.q)],
    page,
  );
  const data = rows.map((row) => ({
    commonName: { en: row.common_name_en, ka: row.common_name_ka },
    danger: row.danger_id,
    group: row.group_id,
    id: row.id,
    image: row.image,
    lastEditedAt: row.last_edited_at,
    pendingDrafts: row.pending_drafts,
    photoCount: row.photo_count,
    scientificName: row.scientific_name,
    slug: row.slug_ka,
    status: row.status,
    version: row.version,
  }));
  return toPage(data, total, page);
}

export async function listPublishedSpecies(
  db: ApiDatabase,
  locale: AppLocale,
  group?: AnimalGroup,
) {
  const query = `SELECT s.id, s.scientific_name, s.group_id, s.danger_id, s.slug_ka, t.common_name, COALESCE(t.updated_at, k.updated_at) AS updated_at, m.src AS image FROM species s JOIN species_texts t ON t.species_id = s.id AND t.locale = ? JOIN species_texts k ON k.species_id = s.id AND k.locale = 'ka' JOIN species_media m ON m.species_id = s.id AND m.role = 'hero' WHERE s.status = 'published'${group ? " AND s.group_id = ?" : ""} ORDER BY s.catalog_position`;
  const statement = db.prepare(query);
  const { results } = await (
    group ? statement.bind(locale, group) : statement.bind(locale)
  ).all<ListRow>();
  return results.map((row) => ({
    commonName: row.common_name,
    danger: row.danger_id,
    group: row.group_id,
    id: row.id,
    image: row.image,
    scientificName: row.scientific_name,
    slug: publicSlug(row.id, row.slug_ka, locale),
    updatedAt: row.updated_at,
  }));
}

export async function readSpeciesIdsRevisedSince(
  db: ApiDatabase,
  since: string,
) {
  const { results } = await db
    .prepare("SELECT species_id FROM species_revisions WHERE created_at >= ?")
    .bind(since)
    .all<{ species_id: string }>();
  return [...new Set(results.map(({ species_id }) => species_id))].sort();
}

async function listLookalikes(db: ApiDatabase, id: string, locale: AppLocale) {
  const { results } = await db
    .prepare(
      "SELECT s.id, s.slug_ka, t.common_name FROM (SELECT lookalike_id AS peer, 0 AS direction, position FROM species_lookalikes WHERE species_id = ? UNION ALL SELECT species_id AS peer, 1 AS direction, 0 AS position FROM species_lookalikes WHERE lookalike_id = ?) AS l JOIN species s ON s.id = l.peer AND s.status = 'published' JOIN species_texts t ON t.species_id = s.id AND t.locale = ? GROUP BY s.id, s.slug_ka, t.common_name ORDER BY MIN(l.direction), MIN(CASE WHEN l.direction = 0 THEN l.position END), s.id",
    )
    .bind(id, id, locale)
    .all<LookalikeRow>();
  return results.map((row) => ({
    commonName: row.common_name,
    id: row.id,
    slug: publicSlug(row.id, row.slug_ka, locale),
  }));
}

function publicSlug(id: string, slugKa: null | string, locale: AppLocale) {
  return locale === "ka" ? (slugKa ?? id) : id;
}
