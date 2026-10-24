import { z } from "zod";

import { defaultLocale, locales } from "@/i18n/locales";

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
