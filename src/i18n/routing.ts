import { defineRouting } from "next-intl/routing";

import { pathnames } from "./pathnames";

export const routing = defineRouting({
  alternateLinks: false,
  defaultLocale: "ka",
  localeDetection: false,
  localePrefix: "as-needed",
  locales: ["ka", "en", "ru", "tr"],
  pathnames,
});

export type AppLocale = (typeof routing.locales)[number];
export type AppPathnames = keyof typeof pathnames;
