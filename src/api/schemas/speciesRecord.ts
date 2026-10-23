import { z } from "zod";

import { groupHasVenomConcept } from "@/data/speciesAtlasMeta";
import { SPECIES_COLORS } from "@/lib/speciesColors";
import { sourcesAreValid } from "@/lib/speciesSources";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ANIMAL_GROUPS = [
  "amphibian",
  "bird",
  "insect",
  "lizard",
  "mammal",
  "scorpion",
  "snake",
  "spider",
  "turtle",
] as const;
export const HABITATS = ["forest", "grassland", "mountain", "wetland"] as const;
export const PHOTO_CONFIDENCE = z.enum([
  "georgia-field",
  "placeholder",
  "range-typical",
]);
const TRANSLATION_LOCALES = ["en", "ru", "tr"] as const;

const text = z.string().trim();
const required = z.string().trim().min(1);
const date = required.refine((value) => !Number.isNaN(Date.parse(value)), {
  message: "Not a valid date",
});
const url = z.url();

const credit = z
  .strictObject({
    date: z.string().optional(),
    lat: z.number().min(-90).max(90).optional(),
    lng: z.number().min(-180).max(180).optional(),
    location: z.string().optional(),
    photoConfidence: PHOTO_CONFIDENCE.optional(),
    photographer: z.string().optional(),
    url: z.string().optional(),
  })
  .refine((value) => (value.lat === undefined) === (value.lng === undefined), {
    message: "lat and lng must be set together",
  });

const galleryImage = z.strictObject({
  credit: credit.optional(),
  photoConfidence: PHOTO_CONFIDENCE.optional(),
  src: url,
});

const identification = z.strictObject({
  coloration: z.string().optional(),
  colors: z.array(z.enum(SPECIES_COLORS)).max(13).optional(),
  summary: z.string(),
  traits: z.array(z.string()),
});

const textFields = {
  behavior: text,
  commonName: required,
  conservation: text,
  description: text,
  diet: text,
  facts: z.array(required),
  faq: z
    .array(z.strictObject({ answer: required, question: required }))
    .optional(),
  habitat: text,
  identification: identification.optional(),
  interaction: z.string().optional(),
  location: text,
  overview: text,
  stats: z.array(z.strictObject({ label: required, value: required })),
};

const base = z.strictObject({
  ...textFields,
  audio: z
    .strictObject({
      date: z.string().optional(),
      location: z.string().optional(),
      recordist: z.string().optional(),
      src: required,
      url: z.string().optional(),
    })
    .optional(),
  danger: z.enum(["Harmless", "High", "Moderate"]).optional(),
  family: required,
  gallery: z.array(galleryImage),
  genus: required,
  id: z.string().regex(SLUG).max(100),
  image: url,
  imageCredit: credit.optional(),
  mobileImage: url.optional(),
  mobileImageCredit: credit.optional(),
  publishedAt: date,
  scientificName: required,
  sources: z.array(
    z.strictObject({ name: required, url: z.string().optional() }),
  ),
  updatedAt: date,
});

const translation = z.strictObject({
  ...textFields,
  gallery: z.array(galleryImage).optional(),
  imageCredit: credit.optional(),
  mobileImageCredit: credit.optional(),
  updatedAt: date.optional(),
});

export const speciesRecordSchema = z
  .strictObject({
    base,
    catalogPosition: z.int().min(0),
    group: z.enum(ANIMAL_GROUPS),
    habitats: z.array(z.enum(HABITATS)),
    lookalikes: z.array(z.string().regex(SLUG)),
    slugKa: z.string().regex(SLUG).nullable(),
    slugs: z.array(z.string().regex(SLUG)),
    status: z.enum(["draft", "published", "unpublished"]),
    translations: z.strictObject({
      en: translation,
      ru: translation,
      tr: translation,
    }),
  })
  .superRefine((record, ctx) => {
    const issue = (path: (number | string)[], message: string) =>
      ctx.addIssue({ code: "custom", message, path });
    const { base: ka } = record;
    if (!sourcesAreValid(ka.sources)) {
      issue(["base", "sources"], "Needs at least one specific source");
    }
    if (ka.danger && !groupHasVenomConcept(record.group)) {
      issue(["base", "danger"], `Group ${record.group} has no danger level`);
    }
    if (record.status === "published" && !record.slugKa) {
      issue(["slugKa"], "A published species needs a Georgian slug");
    }
    if (record.lookalikes.includes(ka.id)) {
      issue(["lookalikes"], "A species cannot look like itself");
    }
    for (const [name, list] of [
      ["habitats", record.habitats],
      ["lookalikes", record.lookalikes],
      ["slugs", record.slugs],
    ] as const) {
      if (new Set<string>(list).size !== list.length) {
        issue([name], "Duplicate entries");
      }
    }
    const gallerySrcs = ka.gallery.map((image) => image.src);
    const gallerySrcSet = new Set(gallerySrcs);
    if (gallerySrcSet.size !== gallerySrcs.length) {
      issue(["base", "gallery"], "Duplicate gallery src");
    }
    for (const locale of TRANSLATION_LOCALES) {
      const other = record.translations[locale];
      const path = (key: string) => ["translations", locale, key];
      for (const [key, left, right] of [
        ["facts", ka.facts.length, other.facts.length],
        ["faq", ka.faq?.length ?? 0, other.faq?.length ?? 0],
        ["stats", ka.stats.length, other.stats.length],
        [
          "identification",
          ka.identification?.traits.length ?? 0,
          other.identification?.traits.length ?? 0,
        ],
      ] as const) {
        if (left !== right) {
          issue(path(key), `${key} has ${right} items, Georgian has ${left}`);
        }
      }
      if (
        JSON.stringify(ka.identification?.colors ?? []) !==
        JSON.stringify(other.identification?.colors ?? [])
      ) {
        issue(path("identification"), "colors must match Georgian");
      }
      for (const [index, image] of (other.gallery ?? []).entries()) {
        if (!gallerySrcSet.has(image.src)) {
          issue(
            [...path("gallery"), index],
            `${image.src} is not in the Georgian gallery`,
          );
        }
      }
    }
  });

export const speciesWriteBody = z.strictObject({
  actor: z.string().trim().min(1).max(100),
  expectedVersion: z.int().min(1),
  record: speciesRecordSchema,
  source: z.enum(["admin", "ai", "api"]),
  summary: z.string().trim().min(1).max(500),
});

export const speciesIdParam = z.object({
  id: z.string().regex(SLUG).max(100),
});

const actor = z.string().trim().min(1).max(100);
const photoSrc = z.string().trim().min(1).max(500);

export const photoCoverBody = z.strictObject({
  actor,
  coverSrc: photoSrc.optional(),
  src: photoSrc,
  target: z.enum(["both", "desktop", "mobile"]),
});

export const photoOrderBody = z.strictObject({
  actor,
  srcs: z.array(photoSrc).min(2).max(200),
});

export const photoRemoveBody = z.strictObject({ actor, src: photoSrc });

export const photoCoordinatesBody = z.strictObject({
  actor,
  coordinates: z
    .strictObject({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    })
    .nullable(),
  src: photoSrc,
});

export const draftCreateBody = z.strictObject({
  actor,
  baseVersion: z.int().min(1),
  record: speciesRecordSchema,
  source: z.enum(["admin", "ai", "api"]),
  summary: z.string().trim().min(1).max(500),
});

export const draftDecisionBody = z.strictObject({ actor });

export const draftParam = z.object({
  draftId: z.coerce.number().int().min(1),
  id: z.string().regex(SLUG).max(100),
});
