import type { AnimalGroup } from "@/data/speciesAtlasMeta";
import type { DangerLevel } from "@/data/speciesTypes";
import type { AppLocale } from "@/i18n/routing";

import { applySpeciesTranslation } from "@/i18n/speciesTranslation";

import type { ApiDatabase } from "./database";

import { readSpeciesCatalog } from "./speciesCatalog";

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
  idOrSlug: string,
) {
  const row = await db
    .prepare(
      "SELECT id FROM species WHERE status = 'published' AND (id = ? OR id = (SELECT species_id FROM species_slugs WHERE slug = ?))",
    )
    .bind(idOrSlug, idOrSlug)
    .first<{ id: string }>();
  return row?.id ?? null;
}

export async function getSpeciesDetail(
  db: ApiDatabase,
  id: string,
  locale: AppLocale,
) {
  const [catalog, lookalikes] = await Promise.all([
    readSpeciesCatalog(db, id),
    listLookalikes(db, id, locale),
  ]);
  const base = catalog.species[0];
  const meta = catalog.atlasMeta[id];
  if (!base || !meta) return null;
  const translation =
    locale === "ka" ? undefined : catalog.translations[locale][id];
  return {
    ...(translation
      ? applySpeciesTranslation(base, translation, locale)
      : base),
    group: meta.group,
    habitats: meta.habitats,
    lookalikes,
    slug: publicSlug(id, catalog.kaSlugById[id] ?? null, locale),
  };
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
