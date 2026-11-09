import type { AppLocale } from "@/i18n/routing";

import { type PageParams, toPage } from "@/lib/pagination";
import { trafficChannel, type TrafficSourceId } from "@/lib/trafficSource";

import type { ApiDatabase } from "./database";

import { readPage } from "./paging";
import { containsPattern } from "./search";

export type AdminPageViewFilters = {
  from?: string;
  lang?: AppLocale;
  q?: string;
  to?: string;
};

export type AdminTrafficSourceFilters = AdminPageViewFilters & {
  country?: string;
  source?: TrafficSourceId;
};

export type TrafficVisit = PageView & {
  country: null | string;
  referrer: string;
  source: TrafficSourceId;
};

type PageView = {
  day: string;
  locale: AppLocale;
  path: string;
  visitor: string;
};

type PageViewRow = { last_day: string; path: string; views: number };

type TrafficSourceRow = {
  country: string;
  last_day: string;
  path: string;
  referrer: string;
  source: string;
  visits: number;
};

const PAGE_VIEW_FROM =
  "FROM (SELECT path, SUM(views) AS views, MAX(day) AS last_day FROM page_views WHERE (?1 IS NULL OR day >= ?1) AND (?2 IS NULL OR day <= ?2) AND (?3 IS NULL OR locale = ?3) GROUP BY path) t WHERE (?4 IS NULL OR t.path LIKE ?4 ESCAPE '\\')";

const TRAFFIC_SOURCE_FROM =
  "FROM (SELECT source, referrer, path, country, SUM(visits) AS visits, MAX(day) AS last_day FROM traffic_sources WHERE (?1 IS NULL OR day >= ?1) AND (?2 IS NULL OR day <= ?2) AND (?3 IS NULL OR locale = ?3) AND (?4 IS NULL OR source = ?4) AND (?5 IS NULL OR country = ?5) GROUP BY source, referrer, path, country) t WHERE (?6 IS NULL OR t.referrer LIKE ?6 ESCAPE '\\' OR t.path LIKE ?6 ESCAPE '\\')";

const TRAFFIC_SUMMARY_WHERE =
  "WHERE (?1 IS NULL OR day >= ?1) AND (?2 IS NULL OR day <= ?2) AND (?3 IS NULL OR locale = ?3) AND (?4 IS NULL OR source = ?4) AND (?5 IS NULL OR country = ?5)";

export async function listAdminPageViews(
  db: ApiDatabase,
  filters: AdminPageViewFilters,
  page: PageParams,
) {
  const params = [
    filters.from ?? null,
    filters.to ?? null,
    filters.lang ?? null,
    containsPattern(filters.q),
  ];
  const [{ rows, total }, sum] = await Promise.all([
    readPage<PageViewRow>(
      db,
      {
        from: PAGE_VIEW_FROM,
        order: "t.views DESC, t.last_day DESC, t.path",
        select: "t.path, t.views, t.last_day",
      },
      params,
      page,
    ),
    db
      .prepare(`SELECT COALESCE(SUM(t.views), 0) AS views ${PAGE_VIEW_FROM}`)
      .bind(...params)
      .first<{ views: number }>(),
  ]);
  const data = rows.map((row) => ({
    lastDay: row.last_day,
    path: row.path,
    views: row.views,
  }));
  return { ...toPage(data, total, page), views: sum?.views ?? 0 };
}

export async function listAdminTrafficSources(
  db: ApiDatabase,
  filters: AdminTrafficSourceFilters,
  page: PageParams,
) {
  const params = [
    filters.from ?? null,
    filters.to ?? null,
    filters.lang ?? null,
    filters.source ?? null,
    filters.country ?? null,
    containsPattern(filters.q),
  ];
  const [{ rows, total }, summary, countrySummary] = await Promise.all([
    readPage<TrafficSourceRow>(
      db,
      {
        from: TRAFFIC_SOURCE_FROM,
        order:
          "t.visits DESC, t.last_day DESC, t.source, t.referrer, t.path, t.country",
        select: "t.source, t.referrer, t.path, t.country, t.visits, t.last_day",
      },
      params,
      page,
    ),
    db
      .prepare(
        `SELECT source, SUM(visits) AS visits FROM traffic_sources ${TRAFFIC_SUMMARY_WHERE} GROUP BY source ORDER BY visits DESC, source`,
      )
      .bind(params[0], params[1], params[2], null, params[4])
      .all<{ source: string; visits: number }>(),
    db
      .prepare(
        `SELECT country, SUM(visits) AS visits FROM traffic_sources ${TRAFFIC_SUMMARY_WHERE} GROUP BY country ORDER BY visits DESC, country`,
      )
      .bind(params[0], params[1], params[2], params[3], null)
      .all<{ country: string; visits: number }>(),
  ]);
  const data = rows.map((row) => ({
    channel: trafficChannel(row.source),
    country: row.country || null,
    lastDay: row.last_day,
    path: row.path,
    referrer: row.referrer || null,
    source: row.source,
    visits: row.visits,
  }));
  const sources = summary.results.map((row) => ({
    channel: trafficChannel(row.source),
    source: row.source,
    visits: row.visits,
  }));
  const countries = countrySummary.results.map((row) => ({
    country: row.country || null,
    visits: row.visits,
  }));
  return {
    ...toPage(data, total, page),
    countries,
    sources,
    visits: sources.reduce((sum, row) => sum + row.visits, 0),
  };
}

export async function recordTrafficVisit(db: ApiDatabase, visit: TrafficVisit) {
  const { results } = await db
    .prepare(
      "INSERT OR IGNORE INTO traffic_source_visitors (day, source, visitor) VALUES (?, ?, ?) RETURNING visitor",
    )
    .bind(visit.day, visit.source, visit.visitor)
    .all<{ visitor: string }>();
  if (results.length === 0) return;
  await db
    .prepare(
      "INSERT INTO traffic_sources (day, source, referrer, path, locale, country, visits) VALUES (?, ?, ?, ?, ?, ?, 1) ON CONFLICT (day, source, referrer, path, locale, country) DO UPDATE SET visits = visits + 1",
    )
    .bind(
      visit.day,
      visit.source,
      visit.referrer,
      visit.path,
      visit.locale,
      visit.country ?? "",
    )
    .run();
}
