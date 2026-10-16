import { z } from "zod/v4";

import { GROUP_HUBS, type GroupHubId } from "../src/lib/groupHubs";

const nonempty = z.string().trim().min(1);

const copyFields = {
  dek: nonempty,
  lead: nonempty,
  metaDescription: nonempty,
  metaTitle: nonempty,
  title: nonempty,
};

const photoAltSchema = z.strictObject({ alt: nonempty, src: nonempty });

const newsPhotoSchema = z.strictObject({
  alt: nonempty,
  credit: z
    .strictObject({
      date: z.string().optional(),
      lat: z.number().optional(),
      lng: z.number().optional(),
      location: z.string().optional(),
      photoConfidence: z
        .enum(["georgia-field", "placeholder", "range-typical"])
        .optional(),
      photographer: z.string().optional(),
      url: z.string().optional(),
    })
    .optional(),
  fromAtlas: z.boolean().optional(),
  height: z.number().int().positive().optional(),
  plate: z.boolean().optional(),
  src: nonempty,
  width: z.number().int().positive().optional(),
});

export const newsKaFrontmatterSchema = z.strictObject({
  ...copyFields,
  gallery: z.array(newsPhotoSchema).optional(),
  image: newsPhotoSchema.optional(),
  publishedAt: nonempty,
  relatedHubIds: z.array(
    z.enum(Object.keys(GROUP_HUBS) as [GroupHubId, ...GroupHubId[]]),
  ),
  relatedRegionIds: z.array(nonempty),
  relatedSpeciesIds: z.array(nonempty),
  slug: nonempty,
  sources: z
    .array(
      z.strictObject({
        name: z.union([
          nonempty,
          z.strictObject({
            en: nonempty,
            ka: nonempty,
            ru: nonempty,
            tr: nonempty,
          }),
        ]),
        url: nonempty,
      }),
    )
    .min(1),
  status: z.enum(["draft", "published"]),
  updatedAt: nonempty.optional(),
});

export const newsTranslationFrontmatterSchema = z.strictObject({
  ...copyFields,
  gallery: z.array(photoAltSchema).optional(),
  image: photoAltSchema.optional(),
});
