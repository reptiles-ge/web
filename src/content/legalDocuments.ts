import type { AppLocale } from "@/i18n/routing";

import { PRIVACY_POLICY } from "@/content/privacyPolicy";
import { TERMS_OF_USE } from "@/content/termsOfUse";

export type LegalDocumentId = "privacy" | "terms";

export const legalDocuments: Record<
  LegalDocumentId,
  Record<AppLocale, string>
> = {
  privacy: PRIVACY_POLICY,
  terms: TERMS_OF_USE,
};
