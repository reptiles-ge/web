import type { OptimizedImageEntry } from "@/lib/optimizedImageSources";

import type { ApiDatabase } from "./database";

export type OptimizedImageRow = OptimizedImageEntry & { src: string };

export async function listOptimizedImages(
  db: ApiDatabase,
): Promise<OptimizedImageRow[]> {
  const { results } = await db
    .prepare(
      "SELECT src, path, width, height, widths, formats FROM optimized_images ORDER BY src",
    )
    .all<{
      formats: string;
      height: number;
      path: string;
      src: string;
      width: number;
      widths: string;
    }>();
  return results.map((row) => ({
    formats: JSON.parse(row.formats) as OptimizedImageEntry["formats"],
    height: row.height,
    path: row.path,
    src: row.src,
    width: row.width,
    widths: JSON.parse(row.widths) as number[],
  }));
}

export function upsertOptimizedImageStatement(
  db: ApiDatabase,
  image: OptimizedImageRow,
  createdAt: string,
) {
  return db
    .prepare(
      "INSERT INTO optimized_images (src, path, width, height, widths, formats, created_at) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT (src) DO UPDATE SET path = excluded.path, width = excluded.width, height = excluded.height, widths = excluded.widths, formats = excluded.formats",
    )
    .bind(
      image.src,
      image.path,
      image.width,
      image.height,
      JSON.stringify(image.widths),
      JSON.stringify(image.formats),
      createdAt,
    );
}
