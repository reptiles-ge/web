import { z } from "zod";

import { PHOTO_ADDITIONAL_WIDTHS, PHOTO_FORMATS } from "@/lib/photoDerivatives";

const text = (max: number) => z.string().trim().max(max).optional();

const file = z.instanceof(File);

const MAX_DERIVATIVES =
  (PHOTO_ADDITIONAL_WIDTHS.length + 1) * PHOTO_FORMATS.length;

export const photoUploadForm = z.strictObject({
  date: text(40),
  derivatives: z.array(file).min(PHOTO_FORMATS.length).max(MAX_DERIVATIVES),
  georgiaField: z.enum(["0", "1"]).optional(),
  lat: text(40),
  lng: text(40),
  location: text(300),
  locationEn: text(300),
  original: file,
  photographer: text(200),
  photographerEn: text(200),
  url: text(500),
});
