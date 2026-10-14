import { describe, expect, it } from "vitest";

import { legalDocuments } from "@/content/legalDocuments";
import { TERMS_OF_USE } from "@/content/termsOfUse";
import { routing } from "@/i18n/routing";
import { CONTACT_EMAIL } from "@/lib/site";

function anchors(text: string) {
  return [...text.matchAll(/^## .+ \{#([a-z0-9-]+)\}$/gm)].map(
    (match) => match[1],
  );
}

function headings(text: string) {
  return text.match(/^#{1,3} /gm)?.length ?? 0;
}

describe("terms of use", () => {
  it("has a translation in every locale with the same structure as KA", () => {
    const ka = TERMS_OF_USE.ka;
    for (const locale of routing.locales) {
      const text = TERMS_OF_USE[locale];
      expect(anchors(text), locale).toEqual(anchors(ka));
      expect(headings(text), locale).toBe(headings(ka));
      expect(text.match(/^- /gm)?.length, locale).toBe(
        ka.match(/^- /gm)?.length,
      );
      expect(text, locale).toContain("2026-10-14");
      expect(text, locale).toContain(`\`${CONTACT_EMAIL}\``);
      expect(text, locale).toContain("](/photo-use)");
    }
    expect(legalDocuments.terms).toBe(TERMS_OF_USE);
  });

  it("anchors the Reptiles.ge license right after intellectual property", () => {
    const list = anchors(TERMS_OF_USE.ka);
    expect(list.indexOf("reptiles-ge-license")).toBe(
      list.indexOf("intellectual-property") + 1,
    );
  });
});
