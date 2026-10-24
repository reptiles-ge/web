import { z } from "zod";

import { defaultLocale, locales } from "@/i18n/locales";
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "@/lib/pagination";

export const LOCALE_HEADER = "X-Locale";

export const localeHeader = z.object({
  "x-locale": z.enum(locales).default(defaultLocale),
});

export const speciesIdText = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(100);

export const sitePageGroupParam = z.object({ id: speciesIdText });

export const listSearch = z.string().trim().max(100).optional();

export const pageQuery = z.object({
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_PAGE_SIZE)
    .default(DEFAULT_PAGE_SIZE),
  page: z.coerce.number().int().min(1).default(1),
});
