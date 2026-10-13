import { describe, expect, it } from "vitest";

import { legalDocuments } from "@/content/legalDocuments";
import { buildSecurityTxt, SECURITY_CONTACT_EMAIL } from "@/lib/securityTxt";

describe("buildSecurityTxt", () => {
  const now = new Date("2026-10-13T10:00:00Z");
  const body = buildSecurityTxt(now);

  it("has the RFC 9116 fields", () => {
    expect(body).toBe(
      [
        `Contact: mailto:${SECURITY_CONTACT_EMAIL}`,
        "Expires: 2027-10-08T00:00:00Z",
        "Preferred-Languages: ka, en",
        "Canonical: https://reptiles.ge/.well-known/security.txt",
        "",
      ].join("\n"),
    );
  });

  it("expires less than a year after it is served", () => {
    const expires = Date.parse(body.match(/^Expires: (.+)$/m)?.[1] ?? "");
    expect(expires).toBeGreaterThan(now.getTime());
    expect(expires - now.getTime()).toBeLessThan(365 * 86_400_000);
  });

  it("uses the contact published in the privacy policy", () => {
    expect(legalDocuments.privacy).toContain(SECURITY_CONTACT_EMAIL);
  });
});
