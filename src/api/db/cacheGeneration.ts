import type { ApiDatabase } from "./database";

export async function bumpCacheGeneration(db: ApiDatabase): Promise<void> {
  await db
    .prepare(
      "INSERT INTO api_cache_generation (id, generation) VALUES (1, 1) ON CONFLICT (id) DO UPDATE SET generation = generation + 1",
    )
    .run();
}

export async function readCacheGeneration(db: ApiDatabase): Promise<number> {
  const row = await db
    .prepare("SELECT generation FROM api_cache_generation WHERE id = 1")
    .first<{ generation: number }>();
  return row?.generation ?? 0;
}
