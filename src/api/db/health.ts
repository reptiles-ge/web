import type { ApiDatabase, ApiQueryMeta } from "./database";

export async function pingDatabase(
  db: ApiDatabase,
): Promise<{ meta?: ApiQueryMeta; ok: boolean }> {
  // `.all()` rather than `.first()`: only `.all()` returns D1's timing meta
  const { meta, results } = await db
    .prepare("SELECT 1 AS ok")
    .all<{ ok: number }>();
  return { meta, ok: results[0]?.ok === 1 };
}
