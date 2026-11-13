import type { ImageManifestInput } from "../schemas/images";
import type { ApiDatabase } from "./database";

import {
  deleteOptimizedImageStatement,
  upsertOptimizedImageStatement,
} from "./optimizedImages";

export type ImageManifestRow = {
  entry: ImageManifestInput[number]["entry"];
  key: string;
  src: string;
};

export async function listImageManifest(
  db: ApiDatabase,
): Promise<ImageManifestRow[]> {
  const { results } = await db
    .prepare("SELECT key, src, entry FROM image_manifest ORDER BY key")
    .all<{ entry: string; key: string; src: string }>();
  return results.map((row) => ({
    entry: JSON.parse(row.entry) as ImageManifestRow["entry"],
    key: row.key,
    src: row.src,
  }));
}

export async function writeImageManifest(
  db: ApiDatabase,
  images: ImageManifestInput,
  updatedAt: string,
) {
  const statements = images.flatMap((image) => [
    db
      .prepare(
        "INSERT INTO image_manifest (key, src, entry, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT (key) DO UPDATE SET src = excluded.src, entry = excluded.entry, updated_at = excluded.updated_at",
      )
      .bind(image.key, image.src, JSON.stringify(image.entry), updatedAt),
    image.asset
      ? upsertOptimizedImageStatement(
          db,
          { ...image.asset, src: image.src },
          updatedAt,
        )
      : deleteOptimizedImageStatement(db, image.src),
  ]);
  await db.batch(statements);
}
