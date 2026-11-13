import type { SchemaImageCropsInput } from "../schemas/images";
import type { ApiDatabase } from "./database";

export type SchemaImageCropRow = SchemaImageCropsInput[number];

export async function listSchemaImageCrops(
  db: ApiDatabase,
): Promise<SchemaImageCropRow[]> {
  const { results } = await db
    .prepare(
      "SELECT src, ratio, url, width, height FROM schema_image_crops ORDER BY src, CASE ratio WHEN '16x9' THEN 0 WHEN '4x3' THEN 1 ELSE 2 END",
    )
    .all<{
      height: number;
      ratio: SchemaImageCropRow["crops"][number]["ratio"];
      src: string;
      url: string;
      width: number;
    }>();
  const bySrc = new Map<string, SchemaImageCropRow>();
  for (const row of results) {
    const image = bySrc.get(row.src) ?? { crops: [], src: row.src };
    image.crops.push({
      height: row.height,
      ratio: row.ratio,
      url: row.url,
      width: row.width,
    });
    bySrc.set(row.src, image);
  }
  return [...bySrc.values()];
}

export async function writeSchemaImageCrops(
  db: ApiDatabase,
  images: SchemaImageCropsInput,
  updatedAt: string,
) {
  const statements = images.flatMap((image) => [
    db.prepare("DELETE FROM schema_image_crops WHERE src = ?").bind(image.src),
    ...image.crops.map((crop) =>
      db
        .prepare(
          "INSERT INTO schema_image_crops (src, ratio, url, width, height, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
        )
        .bind(
          image.src,
          crop.ratio,
          crop.url,
          crop.width,
          crop.height,
          updatedAt,
        ),
    ),
  ]);
  await db.batch(statements);
}
