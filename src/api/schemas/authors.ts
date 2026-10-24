import { z } from "zod";

import { locales } from "@/i18n/locales";

import { speciesIdText } from "./common";

export const AUTHOR_KINDS = ["page", "person"] as const;

export const AUTHOR_ROLES = [
  "herpetologist",
  "photographer",
  "professor",
  "ranger",
  "researcher",
] as const;

export const AUTHOR_JOB_TITLES = [
  "director",
  "professor",
  "ranger",
  "researcher",
] as const;

export const AFFILIATIONS = [
  "borjomi-kharagauli-national-park",
  "connecticut-college",
  "georgian-society-of-nature-friends",
  "ilia-state-university",
  "institute-of-zoology",
  "naturehistorium",
] as const;

const filled = z.string().trim().min(1);
const url = z.url({ protocol: /^https$/ });

const authorText = z.strictObject({
  bio: filled.max(4000).optional(),
  metaDescription: filled.max(300).optional(),
  name: filled.max(200),
});

export const authorParam = z.object({ id: speciesIdText });

export const authorListQuery = z.object({
  contributor: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => value === "true"),
});

const CONTRIBUTOR_MAX_LIMIT = 100;

export const contributorListQuery = z.object({
  limit: z.coerce.number().int().min(1).max(CONTRIBUTOR_MAX_LIMIT).optional(),
});

export const authorRecordSchema = z
  .strictObject({
    affiliations: z.array(z.enum(AFFILIATIONS)).max(10),
    aliases: z.array(filled.max(200)).min(1).max(50),
    id: speciesIdText,
    isContributor: z.boolean(),
    jobTitle: z.enum(AUTHOR_JOB_TITLES).nullable(),
    kind: z.enum(AUTHOR_KINDS),
    links: z.strictObject({
      facebook: url.optional(),
      inaturalist: url.optional(),
      instagram: url.optional(),
      researchGate: url.optional(),
    }),
    portraitClass: filled.max(100).nullable(),
    portraitSrc: url.nullable(),
    role: z.enum(AUTHOR_ROLES).nullable(),
    texts: z
      .partialRecord(z.enum(locales), authorText)
      .refine((texts) => Boolean(texts.ka), "A Georgian name is required"),
  })
  .refine((author) => new Set(author.aliases).size === author.aliases.length, {
    message: "Aliases must be unique",
    path: ["aliases"],
  })
  .refine(
    (author) =>
      new Set(author.affiliations).size === author.affiliations.length,
    { message: "Affiliations must be unique", path: ["affiliations"] },
  )
  .refine(
    (author) =>
      !author.isContributor ||
      (author.role !== null && author.portraitSrc !== null),
    {
      message: "A contributor needs a role and a portrait",
      path: ["isContributor"],
    },
  );

export const authorWriteBody = z.strictObject({ author: authorRecordSchema });

export const authorTextsBody = z.strictObject({
  texts: authorRecordSchema.shape.texts,
});
