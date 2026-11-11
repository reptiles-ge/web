import type { ApiDatabase } from "./database";

export async function pingDatabase(db: ApiDatabase) {
  const row = await db.prepare("SELECT 1 AS ok").first<{ ok: number }>();
  return row?.ok === 1;
}
