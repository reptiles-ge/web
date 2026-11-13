import { z } from "zod";

import { PHOTO_FORMATS } from "@/lib/photoDerivatives";

const positiveInt = z.int().min(1);

const nonEmpty = z.string().trim().min(1).max(500);

const SCHEMA_CROP_RATIOS = ["16x9", "4x3", "1x1"] as const;

const manifestDerivative = z.strictObject({
  byteSize: z.int().min(0),
  format: z.enum(PHOTO_FORMATS),
  height: positiveInt,
  key: nonEmpty,
  width: positiveInt,
});

const manifestEntry = z.strictObject({
  configFingerprint: nonEmpty,
  derivatives: z.array(manifestDerivative).max(40),
  height: positiveInt,
  originalKey: nonEmpty,
  originalSize: z.int().min(0),
  sourceHash: nonEmpty,
  updatedAt: z.iso.datetime(),
  width: positiveInt,
});

const optimizedAsset = z.strictObject({
  formats: z.array(z.enum(PHOTO_FORMATS)).min(1),
  height: positiveInt,
  path: nonEmpty,
  width: positiveInt,
  widths: z.array(positiveInt).min(1),
});

export const imageManifestBody = z.strictObject({
  images: z
    .array(
      z.strictObject({
        asset: optimizedAsset.nullable(),
        entry: manifestEntry,
        key: nonEmpty,
        src: nonEmpty,
      }),
    )
    .min(1)
    .max(200),
});

const schemaCrop = z.strictObject({
  height: positiveInt,
  ratio: z.enum(SCHEMA_CROP_RATIOS),
  url: nonEmpty,
  width: positiveInt,
});

export const schemaImageCropsBody = z.strictObject({
  images: z
    .array(
      z.strictObject({
        crops: z.array(schemaCrop).length(SCHEMA_CROP_RATIOS.length),
        src: nonEmpty,
      }),
    )
    .min(1)
    .max(500),
});

export type ImageManifestInput = z.infer<typeof imageManifestBody>["images"];
export type SchemaImageCropsInput = z.infer<
  typeof schemaImageCropsBody
>["images"];
