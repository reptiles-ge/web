import { describe, expect, it } from "vitest";

import { COOKIE_CONSENT_NAME } from "@/lib/consent/config";
import {
  consentValue,
  readConsentCookie,
  serializeConsentCookie,
} from "@/lib/consent/cookies";

describe("cookie consent cookies", () => {
  it("round-trips current consent and ignores outdated versions", () => {
    const stored = serializeConsentCookie(consentValue(true), false);
    expect(readConsentCookie(`foo=bar; ${stored}`)).toEqual({
      analytics: true,
      version: 1,
    });

    const outdated = encodeURIComponent(
      JSON.stringify({ analytics: true, version: 0 }),
    );
    expect(readConsentCookie(`${COOKIE_CONSENT_NAME}=${outdated}`)).toBeNull();
  });
});
