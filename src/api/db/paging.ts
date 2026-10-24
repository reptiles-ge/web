import { pageOffset, type PageParams } from "@/lib/pagination";

import type { ApiDatabase } from "./database";

export type PageSql = { from: string; order: string; select: string };

export async function readPage<Row>(
  db: ApiDatabase,
  sql: PageSql,
  params: unknown[],
  page: PageParams,
) {
  const [rows, count] = await Promise.all([
    db
      .prepare(
        `SELECT ${sql.select} ${sql.from} ORDER BY ${sql.order} LIMIT ? OFFSET ?`,
      )
      .bind(...params, page.limit, pageOffset(page))
      .all<Row>(),
    db
      .prepare(`SELECT COUNT(*) AS total ${sql.from}`)
      .bind(...params)
      .first<{ total: number }>(),
  ]);
  return { rows: rows.results, total: count?.total ?? 0 };
}
