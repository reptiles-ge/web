import { z } from "zod";

const nonempty = z.string().trim().min(1);

const photoCreditSchema = z
  .object({
    date: z.string().optional(),
    location: z.string().optional(),
    photographer: z.string().optional(),
    url: z.string().optional(),
  })
  .passthrough();

const galleryImageSchema = z
  .object({
    credit: photoCreditSchema.optional(),
    src: nonempty,
  })
  .passthrough();

const sourceSchema = z
  .object({
    name: nonempty,
    url: z.string().optional(),
  })
  .passthrough();

export const dangerLevelSchema = z.enum(["Harmless", "High", "Moderate"]);

export const kaFrontmatterSchema = z
  .object({
    audio: z
      .object({
        date: z.string().optional(),
        location: z.string().optional(),
        recordist: z.string().optional(),
        src: z.string().optional(),
        url: z.string().optional(),
      })
      .passthrough()
      .optional(),
    behavior: z.string().optional(),
    commonName: nonempty,
    conservation: z.string().optional(),
    danger: dangerLevelSchema.optional(),
    description: z.string().optional(),
    diet: z.string().optional(),
    facts: z.array(z.string()).optional(),
    family: nonempty,
    faq: z
      .array(
        z.object({
          answer: z.string(),
          question: z.string(),
        }),
      )
      .optional(),
    gallery: z.array(galleryImageSchema).optional(),
    genus: nonempty,
    habitat: z.string().optional(),
    id: nonempty,
    identification: z
      .object({
        summary: z.string().optional(),
        traits: z.array(z.string()).optional(),
      })
      .passthrough()
      .optional(),
    image: z.string().optional(),
    imageCredit: photoCreditSchema.optional(),
    interaction: z.string().optional(),
    location: z.string().optional(),
    mobileImage: z.string().optional(),
    mobileImageCredit: photoCreditSchema.optional(),
    overview: z.string().optional(),
    scientificName: nonempty,
    sources: z.array(sourceSchema).optional(),
    stats: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
        }),
      )
      .optional(),
  })
  .passthrough();

export const translationFrontmatterSchema = z
  .object({
    commonName: nonempty,
    id: nonempty,
    scientificName: nonempty,
  })
  .passthrough();

export type KaFrontmatter = z.infer<typeof kaFrontmatterSchema>;

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
