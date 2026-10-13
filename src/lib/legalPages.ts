import type { LegalDocumentId } from "@/content/legalDocuments";

import { type AppLocale, routing } from "@/i18n/routing";
import { localeAlternates } from "@/lib/site";

export const LEGAL_PATHS = {
  privacy: "/privacy",
  terms: "/terms-and-conditions",
} as const satisfies Record<LegalDocumentId, string>;

export type LegalPath = (typeof LEGAL_PATHS)[LegalDocumentId];

export function isIndexableLegalLocale(locale: AppLocale) {
  return locale === routing.defaultLocale;
}

export function legalAlternates(
  locale: AppLocale,
  path: LegalPath,
): { canonical: string; languages?: Record<string, string> } {
  const { canonical, languages } = localeAlternates(locale, path);
  if (!isIndexableLegalLocale(locale)) return { canonical };
  return {
    canonical,
    languages: {
      [routing.defaultLocale]: languages[routing.defaultLocale],
      "x-default": languages["x-default"],
    },
  };
}
