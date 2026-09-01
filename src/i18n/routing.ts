import { defineRouting } from "next-intl/routing";
import { pathnames } from "./pathnames";

export const routing = defineRouting({
  locales: ["ka", "en", "ru", "tr"],
  defaultLocale: "ka",
  localePrefix: "as-needed",
  localeDetection: false,
  alternateLinks: false,
  pathnames,
});

export type AppLocale = (typeof routing.locales)[number];
export type AppPathnames = keyof typeof pathnames;
