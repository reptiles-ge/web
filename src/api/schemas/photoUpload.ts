import { z } from "zod";

import { PHOTO_ADDITIONAL_WIDTHS, PHOTO_FORMATS } from "@/lib/photoDerivatives";

const text = (max: number) => z.string().trim().max(max).optional();

const file = z.instanceof(File);

const MAX_DERIVATIVES =
  (PHOTO_ADDITIONAL_WIDTHS.length + 1) * PHOTO_FORMATS.length;

const creditText = {
  date: text(40),
  lat: text(40),
  lng: text(40),
  location: text(300),
  locationEn: text(300),
  photographer: text(200),
  photographerEn: text(200),
  url: text(500),
};

export const photoUploadForm = z.strictObject({
  ...creditText,
  derivatives: z.array(file).min(PHOTO_FORMATS.length).max(MAX_DERIVATIVES),
  georgiaField: z.enum(["0", "1"]).optional(),
  original: file,
});

const photoSrc = z.string().trim().min(1).max(500);

export const photoCreditBody = z.strictObject({
  credit: z.strictObject({ ...creditText, georgiaField: z.boolean() }),
  expectedVersion: z.int().min(1),
  src: photoSrc,
});

export const photoDeleteBody = z.strictObject({
  expectedVersion: z.int().min(1),
  src: photoSrc,
});

export const inaturalistPhotoBody = z.strictObject({
  url: z.string().trim().min(1).max(500),
});
