import { z } from "zod";

import { newsSeriesIds } from "@/data/newsSeries";
import { GROUP_HUBS, type GroupHubId } from "@/lib/groupHubs";
import { newsArticleIssues } from "@/lib/newsRules";

import { photoCredit } from "./speciesRecord";

const required = z.string().trim().min(1);
const date = required.refine((value) => !Number.isNaN(Date.parse(value)), {
  message: "Not a valid date",
});
const photoSrc = required.refine(
  (value) =>
    (value.startsWith("/") && !value.startsWith("//")) ||
    (URL.canParse(value) && value.startsWith("https://")),
  { message: "Photo src must be an https URL or a site path" },
);
const hubId = z.enum(Object.keys(GROUP_HUBS) as [GroupHubId, ...GroupHubId[]]);

const mark = z.union([
  z.string().min(1),
  z.strictObject({
    href: z.url(),
    label: required,
    type: z.literal("external"),
  }),
  z.strictObject({ id: hubId, label: required, type: z.literal("hub") }),
  z.strictObject({ id: required, label: required, type: z.literal("region") }),
  z.strictObject({ id: required, label: required, type: z.literal("species") }),
  z.strictObject({
    label: required,
    slug: required,
    type: z.literal("credit-author"),
  }),
  z.strictObject({ label: required, type: z.literal("news-index") }),
  z.strictObject({ name: required, type: z.literal("sci") }),
]);

const block = z.discriminatedUnion("type", [
  z.strictObject({ parts: z.array(mark).min(1), type: z.literal("p") }),
  z.strictObject({ src: photoSrc, type: z.literal("figure") }),
]);

const section = z.strictObject({
  blocks: z.array(block).min(1),
  heading: required,
});

const copy = z.strictObject({
  dek: required,
  lead: required,
  metaDescription: required,
  metaTitle: required,
  sections: z.array(section).min(1),
  title: required,
});

const photo = z.strictObject({
  alt: z.strictObject({
    en: required.optional(),
    ka: required,
    ru: required.optional(),
    tr: required.optional(),
  }),
  credit: photoCredit.optional(),
  fromAtlas: z.boolean().optional(),
  height: z.number().int().positive().optional(),
  plate: z.boolean().optional(),
  src: photoSrc,
  width: z.number().int().positive().optional(),
});

const source = z.strictObject({
  name: z.union([
    required,
    z.strictObject({ en: required, ka: required, ru: required, tr: required }),
  ]),
  url: z.url(),
});

export const newsArticleSchema = z
  .strictObject({
    copy: z.strictObject({
      en: copy.optional(),
      ka: copy,
      ru: copy.optional(),
      tr: copy.optional(),
    }),
    gallery: z.array(photo).min(1).optional(),
    id: required,
    image: photo.optional(),
    publishedAt: date,
    relatedHubIds: z.array(hubId),
    relatedRegionIds: z.array(required),
    relatedSpeciesIds: z.array(required),
    series: z.enum(newsSeriesIds).optional(),
    slug: required,
    sources: z.array(source).min(1),
    status: z.enum(["draft", "published"]),
    updatedAt: date.optional(),
  })
  .superRefine((article, ctx) => {
    for (const issue of newsArticleIssues(article)) {
      ctx.addIssue({
        code: "custom",
        message: issue.message,
        path: issue.path,
      });
    }
  });
