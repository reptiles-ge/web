import type { ConsentCategoryId } from "@/lib/consent/types";

export const COOKIE_CONSENT_NAME = "reptiles_cookie_consent";
export const COOKIE_CONSENT_VERSION = 1;
export const COOKIE_CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;
export const GTM_ID = "GTM-NM65ZMML";
export const COOKIE_CONSENT_EVENT = "reptiles-cookie-consent";

export const CONSENT_CATEGORIES: Array<{
  id: ConsentCategoryId;
  required: boolean;
}> = [
  { id: "necessary", required: true },
  { id: "analytics", required: false },
];
