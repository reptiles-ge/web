import { z } from "zod";

import { locales } from "@/i18n/locales";

export const API_ACCESS_PROJECT_TYPES = [
  "tourism",
  "education",
  "research",
  "media",
  "other",
] as const;

export const API_ACCESS_DATA = [
  "species",
  "regions",
  "photos",
  "risk",
] as const;

export const API_ACCESS_VOLUMES = [
  "under10k",
  "10kTo100k",
  "over100k",
] as const;

export type ApiAccessData = (typeof API_ACCESS_DATA)[number];
export type ApiAccessProjectType = (typeof API_ACCESS_PROJECT_TYPES)[number];
export type ApiAccessVolume = (typeof API_ACCESS_VOLUMES)[number];

export const apiAccessRequestSchema = z.object({
  consent: z.literal(true),
  data: z
    .array(z.enum(API_ACCESS_DATA))
    .max(API_ACCESS_DATA.length)
    .refine((items) => new Set(items).size === items.length, {
      message: "Data types must be unique",
    }),
  description: z.string().trim().max(2000).default(""),
  email: z.string().trim().max(200).pipe(z.email()),
  locale: z.enum(locales),
  name: z.string().trim().min(1).max(100),
  organization: z.string().trim().max(150).default(""),
  projectType: z.enum(API_ACCESS_PROJECT_TYPES),
  volume: z.enum(API_ACCESS_VOLUMES),
  website: z.string().trim().min(1).max(300),
});

export type ApiAccessRequest = z.output<typeof apiAccessRequestSchema>;
