import type { CookieConsent } from "@/lib/consent/types";

import {
  COOKIE_CONSENT_MAX_AGE_SECONDS,
  COOKIE_CONSENT_NAME,
  COOKIE_CONSENT_VERSION,
} from "@/lib/consent/config";

export function consentValue(analytics: boolean): CookieConsent {
  return {
    analytics,
    version: COOKIE_CONSENT_VERSION,
  };
}

export function parseConsentValue(value: null | string | undefined) {
  if (!value) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as {
      analytics?: unknown;
      version?: unknown;
    };
    if (parsed.version !== COOKIE_CONSENT_VERSION) return null;
    if (typeof parsed.analytics !== "boolean") return null;
    return {
      analytics: parsed.analytics,
      version: COOKIE_CONSENT_VERSION,
    };
  } catch {
    return null;
  }
}

export function readConsentCookie(cookieString: null | string | undefined) {
  if (!cookieString) return null;
  for (const part of cookieString.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === COOKIE_CONSENT_NAME) {
      return parseConsentValue(rest.join("="));
    }
  }
  return null;
}

export function serializeConsentCookie(
  consent: CookieConsent,
  secure: boolean,
) {
  const value = encodeURIComponent(JSON.stringify(consent));
  return [
    `${COOKIE_CONSENT_NAME}=${value}`,
    `Max-Age=${COOKIE_CONSENT_MAX_AGE_SECONDS}`,
    "Path=/",
    "SameSite=Lax",
    secure ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
}
