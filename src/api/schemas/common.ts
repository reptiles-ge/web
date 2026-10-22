import { z } from "zod";

import { defaultLocale, locales } from "@/i18n/locales";

export const localeQuery = z.enum(locales).default(defaultLocale);
