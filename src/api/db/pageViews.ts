import type { AppLocale } from "@/i18n/routing";

import { type PageParams, toPage } from "@/lib/pagination";
import { trafficChannel, type TrafficSourceId } from "@/lib/trafficSource";

import type { ApiDatabase } from "./database";

import { readPage } from "./paging";
import { containsPattern } from "./search";

export type AdminPageViewFilters = {
  lang?: AppLocale;
  q?: string;
  since?: string;
};

export type AdminTrafficSourceFilters = AdminPageViewFilters & {
  source?: TrafficSourceId;
};

export type PageView = {
  day: string;
  locale: AppLocale;
  path: string;
  visitor: string;
};

export type TrafficVisit = PageView & {
  referrer: string;
  source: TrafficSourceId;
};

type PageViewRow = { last_day: string; path: string; views: number };

type TrafficSourceRow = {
  last_day: string;
  path: string;
  referrer: string;
  source: string;
  visits: number;
};

const PAGE_VIEW_FROM =
  "FROM (SELECT path, SUM(views) AS views, MAX(day) AS last_day FROM page_views WHERE (?1 IS NULL OR day >= ?1) AND (?2 IS NULL OR locale = ?2) GROUP BY path) t WHERE (?3 IS NULL OR t.path LIKE ?3 ESCAPE '\\')";

const TRAFFIC_SOURCE_FROM =
  "FROM (SELECT source, referrer, path, SUM(visits) AS visits, MAX(day) AS last_day FROM traffic_sources WHERE (?1 IS NULL OR day >= ?1) AND (?2 IS NULL OR locale = ?2) AND (?3 IS NULL OR source = ?3) GROUP BY source, referrer, path) t WHERE (?4 IS NULL OR t.referrer LIKE ?4 ESCAPE '\\' OR t.path LIKE ?4 ESCAPE '\\')";

export async function listAdminPageViews(
  db: ApiDatabase,
  filters: AdminPageViewFilters,
  page: PageParams,
) {
  const params = [
    filters.since ?? null,
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
    filters.since ?? null,
    filters.lang ?? null,
    filters.source ?? null,
    containsPattern(filters.q),
  ];
  const [{ rows, total }, summary] = await Promise.all([
    readPage<TrafficSourceRow>(
      db,
      {
        from: TRAFFIC_SOURCE_FROM,
        order: "t.visits DESC, t.last_day DESC, t.source, t.referrer, t.path",
        select: "t.source, t.referrer, t.path, t.visits, t.last_day",
      },
      params,
      page,
    ),
    db
      .prepare(
        "SELECT source, SUM(visits) AS visits FROM traffic_sources WHERE (?1 IS NULL OR day >= ?1) AND (?2 IS NULL OR locale = ?2) GROUP BY source ORDER BY visits DESC, source",
      )
      .bind(filters.since ?? null, filters.lang ?? null)
      .all<{ source: string; visits: number }>(),
  ]);
  const data = rows.map((row) => ({
    channel: trafficChannel(row.source),
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
  return {
    ...toPage(data, total, page),
    sources,
    visits: sources.reduce((sum, row) => sum + row.visits, 0),
  };
}

export async function recordPageView(db: ApiDatabase, view: PageView) {
  const { results } = await db
    .prepare(
      "INSERT OR IGNORE INTO page_view_visitors (day, path, visitor) VALUES (?, ?, ?) RETURNING visitor",
    )
    .bind(view.day, view.path, view.visitor)
    .all<{ visitor: string }>();
  if (results.length === 0) return;
  await db
    .prepare(
      "INSERT INTO page_views (path, locale, day, views) VALUES (?, ?, ?, 1) ON CONFLICT (path, locale, day) DO UPDATE SET views = views + 1",
    )
    .bind(view.path, view.locale, view.day)
    .run();
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
      "INSERT INTO traffic_sources (day, source, referrer, path, locale, visits) VALUES (?, ?, ?, ?, ?, 1) ON CONFLICT (day, source, referrer, path, locale) DO UPDATE SET visits = visits + 1",
    )
    .bind(visit.day, visit.source, visit.referrer, visit.path, visit.locale)
    .run();
}
