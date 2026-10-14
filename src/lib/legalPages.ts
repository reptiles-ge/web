import type { LegalDocumentId } from "@/content/legalDocuments";

export const LEGAL_PATHS = {
  privacy: "/privacy",
  terms: "/terms-and-conditions",
} as const satisfies Record<LegalDocumentId, string>;
