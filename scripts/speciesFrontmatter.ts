import { z } from "zod/v4";

import { SPECIES_COLORS } from "../src/lib/speciesColors";

const nonempty = z.string().trim().min(1);

const photoConfidenceSchema = z.enum([
  "georgia-field",
  "placeholder",
  "range-typical",
]);

const photoCreditSchema = z
  .looseObject({
    date: z.string().optional(),
    lat: z.number().min(-90).max(90).optional(),
    lng: z.number().min(-180).max(180).optional(),
    location: z.string().optional(),
    photographer: z.string().optional(),
    photoConfidence: photoConfidenceSchema.optional(),
    url: z.string().optional(),
  })
  .superRefine((credit, ctx) => {
    const hasLat = credit.lat !== undefined;
    const hasLng = credit.lng !== undefined;
    if (hasLat === hasLng) return;
    ctx.addIssue({
      code: "custom",
      message: "photo credit lat and lng must both be set",
      path: hasLat ? ["lng"] : ["lat"],
    });
  });

const galleryImageSchema = z.strictObject({
  credit: photoCreditSchema.optional(),
  photoConfidence: photoConfidenceSchema.optional(),
  src: nonempty,
});

const fieldRecordEvidenceSchema = z.enum([
  "literature",
  "observation",
  "specimen",
]);

const fieldRecordSchema = z.strictObject({
  date: z.string().optional(),
  evidence: fieldRecordEvidenceSchema.optional(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  locality: nonempty,
  note: z.string().optional(),
  observer: z.string().optional(),
  observerName: z.string().optional(),
  source: z.string().optional(),
  url: z.string().optional(),
});

const sourceSchema = z.strictObject({
  name: nonempty,
  url: z.string().optional(),
});

const dangerLevelSchema = z.enum(["Harmless", "High", "Moderate"]);

const faqSchema = z.array(
  z.strictObject({
    answer: z.string(),
    question: z.string(),
  }),
);

const statsSchema = z.array(
  z.strictObject({
    label: z.string(),
    value: z.string(),
  }),
);

const identificationSchema = z.strictObject({
  coloration: z.string().optional(),
  colors: z.array(z.enum(SPECIES_COLORS)).max(13).optional(),
  summary: z.string().optional(),
  traits: z.array(z.string()).optional(),
});

const textShape = {
  behavior: z.string().optional(),
  commonName: nonempty,
  conservation: z.string().optional(),
  description: z.string().optional(),
  diet: z.string().optional(),
  facts: z.array(z.string()).optional(),
  faq: faqSchema.optional(),
  habitat: z.string().optional(),
  identification: identificationSchema.optional(),
  interaction: z.string().optional(),
  location: z.string().optional(),
  overview: z.string().optional(),
  stats: statsSchema.optional(),
};

export const kaFrontmatterSchema = z.strictObject({
  ...textShape,
  audio: z
    .strictObject({
      date: z.string().optional(),
      location: z.string().optional(),
      recordist: z.string().optional(),
      src: z.string().optional(),
      url: z.string().optional(),
    })
    .optional(),
  danger: dangerLevelSchema.optional(),
  dateModified: z.string().optional(),
  datePublished: z.string().optional(),
  family: nonempty,
  fieldRecords: z.array(fieldRecordSchema).optional(),
  gallery: z.array(galleryImageSchema).optional(),
  genus: nonempty,
  id: nonempty,
  image: z.string().optional(),
  imageCredit: photoCreditSchema.optional(),
  mobileImage: z.string().optional(),
  mobileImageCredit: photoCreditSchema.optional(),
  scientificName: nonempty,
  sources: z.array(sourceSchema).optional(),
});

export const translationFrontmatterSchema = z.strictObject({
  ...textShape,
  dateModified: z.string().optional(),
  gallery: z.array(galleryImageSchema).optional(),
  id: nonempty,
  imageCredit: photoCreditSchema.optional(),
  mobileImageCredit: photoCreditSchema.optional(),
  scientificName: nonempty,
});

export type KaFrontmatter = z.infer<typeof kaFrontmatterSchema>;
export type TranslationFrontmatter = z.infer<
  typeof translationFrontmatterSchema
>;

const GENERIC_SOURCE_NAMES = new Set(["scientific publications"]);

export function sourcesAreValid(
  sources: Array<{ name: string; url?: string }> | undefined,
): boolean {
  if (!sources || sources.length === 0) return false;
  const named = sources.filter((source) => source.name.trim());
  if (named.length === 0) return false;
  const allGenericWithoutUrl = named.every((source) => {
    const generic = GENERIC_SOURCE_NAMES.has(source.name.trim().toLowerCase());
    return generic && !source.url?.trim();
  });
  return !allGenericWithoutUrl;
}
