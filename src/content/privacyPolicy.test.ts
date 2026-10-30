import { describe, expect, it } from "vitest";

import { legalDocuments } from "@/content/legalDocuments";
import { PRIVACY_POLICY } from "@/content/privacyPolicy";
import { routing } from "@/i18n/routing";
import { CONTACT_EMAIL } from "@/lib/site";

function anchors(text: string) {
  return [...text.matchAll(/^## .+ \{#([a-z0-9-]+)\}$/gm)].map(
    (match) => match[1],
  );
}

function count(text: string, pattern: RegExp) {
  return text.match(pattern)?.length ?? 0;
}

describe("privacy policy", () => {
  it("has a translation in every locale with the same structure as KA", () => {
    const ka = PRIVACY_POLICY.ka;
    for (const locale of routing.locales) {
      const text = PRIVACY_POLICY[locale];
      expect(anchors(text), locale).toEqual(anchors(ka));
      expect(count(text, /^#{1,3} /gm), locale).toBe(count(ka, /^#{1,3} /gm));
      expect(count(text, /^- /gm), locale).toBe(count(ka, /^- /gm));
      expect(count(text, /^\|/gm), locale).toBe(count(ka, /^\|/gm));
      expect(text, locale).toContain("2026-10-30");
      expect(text, locale).toContain(`\`${CONTACT_EMAIL}\``);
    }
    expect(legalDocuments.privacy).toBe(PRIVACY_POLICY);
  });

  it("names the processors the site runs in every locale", () => {
    for (const locale of routing.locales) {
      for (const name of [
        "Cloudflare",
        "Bunny CDN/Storage",
        "Google Tag Manager",
        "Google Analytics 4",
        "Sentry",
        "Telegram",
      ]) {
        expect(PRIVACY_POLICY[locale], `${locale} ${name}`).toContain(name);
      }
      expect(PRIVACY_POLICY[locale], locale).not.toContain("Vercel");
    }
  });

  it("keeps the code names of every stored key in every locale", () => {
    const keys = PRIVACY_POLICY.ka.match(/`[a-zA-Z_.{}-]+`/g) ?? [];
    expect(keys.length).toBeGreaterThan(0);
    for (const locale of routing.locales) {
      for (const key of keys) {
        expect(PRIVACY_POLICY[locale], `${locale} ${key}`).toContain(key);
      }
    }
  });
});
