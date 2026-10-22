import { defineRouting } from "next-intl/routing";

import { defaultLocale, locales } from "./locales";
import { pathnames } from "./pathnames";

export const routing = defineRouting({
  alternateLinks: false,
  defaultLocale,
  localeCookie: false,
  localeDetection: false,
  localePrefix: "as-needed",
  locales,
  pathnames,
});

export type AppLocale = (typeof routing.locales)[number];
export type AppPathnames = keyof typeof pathnames;
