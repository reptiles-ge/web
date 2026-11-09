import type { ApiDatabase } from "./database";

export async function reservePhotoUploadKey(
  db: ApiDatabase,
  key: string,
  createdAt: string,
): Promise<boolean> {
  const row = await db
    .prepare(
      "INSERT INTO photo_upload_keys (key, created_at) VALUES (?, ?) ON CONFLICT (key) DO NOTHING RETURNING key",
    )
    .bind(key, createdAt)
    .first<{ key: string }>();
  return row !== null;
}
