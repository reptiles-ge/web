import { describe, expect, it } from "vitest";

import {
  CREDIT_AFFILIATIONS,
  CREDIT_AUTHORS,
  creditAuthorAffiliationNames,
  creditAuthorBio,
  creditAuthorHref,
  creditAuthorIndexHref,
  creditAuthorKind,
  creditAuthorName,
  creditAuthorSameAs,
  getPublishedCreditAuthorByName,
  getPublishedCreditAuthorBySlug,
  getPublishedCreditAuthors,
} from "@/data/creditAuthors";

const published = getPublishedCreditAuthors();

describe("credit author data", () => {
  it("has unique slugs and ids", () => {
    const slugs = CREDIT_AUTHORS.map((author) => author.slug);
    const ids = CREDIT_AUTHORS.map((author) => author.id);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every author a Georgian and English name and a portrait", () => {
    for (const author of CREDIT_AUTHORS) {
      expect(author.name.ka, author.slug).toBeTruthy();
      expect(author.name.en, author.slug).toBeTruthy();
      expect(author.portraitSrc, author.slug).toBeTruthy();
    }
  });

  it("never shares an alias between two authors", () => {
    const seen = new Map<string, string>();
    for (const author of CREDIT_AUTHORS) {
      for (const alias of author.aliases) {
        expect(seen.get(alias), alias).toBeUndefined();
        seen.set(alias, author.slug);
      }
    }
  });

  it("only exposes published authors", () => {
    expect(published.every((author) => author.published)).toBe(true);
    for (const author of CREDIT_AUTHORS.filter((item) => !item.published)) {
      expect(getPublishedCreditAuthorBySlug(author.slug)).toBeUndefined();
    }
  });
});

describe("lookups", () => {
  const author = published[0];

  it("finds a published author by slug", () => {
    expect(getPublishedCreditAuthorBySlug(author.slug)).toBe(author);
    expect(getPublishedCreditAuthorBySlug("no-such-author")).toBeUndefined();
  });

  it("finds a published author by any alias, ignoring surrounding spaces", () => {
    for (const alias of author.aliases) {
      expect(getPublishedCreditAuthorByName(`  ${alias} `)).toBe(author);
    }
  });

  it("returns nothing for an empty or unknown name", () => {
    expect(getPublishedCreditAuthorByName("")).toBeUndefined();
    expect(getPublishedCreditAuthorByName("   ")).toBeUndefined();
    expect(getPublishedCreditAuthorByName("Nobody Atall")).toBeUndefined();
  });
});

describe("presentation helpers", () => {
  const author = published[0];

  it("builds hrefs", () => {
    expect(creditAuthorHref("x")).toEqual({
      params: { slug: "x" },
      pathname: "/authors/[slug]",
    });
    expect(creditAuthorIndexHref()).toBe("/authors");
  });

  it("picks the name per locale, falling back to English", () => {
    expect(creditAuthorName(author, "ka")).toBe(author.name.ka);
    expect(creditAuthorName(author, "en")).toBe(author.name.en);
    const noRu = { ...author, name: { en: "E", ka: "K" } };
    expect(creditAuthorName(noRu, "ru")).toBe("E");
  });

  it("returns undefined for a missing bio and picks a locale bio otherwise", () => {
    expect(
      creditAuthorBio({ ...author, bio: undefined }, "en"),
    ).toBeUndefined();
    expect(
      creditAuthorBio({ ...author, bio: { en: "E", ka: "K" } }, "ka"),
    ).toBe("K");
    expect(
      creditAuthorBio({ ...author, bio: { en: "E", ka: "K" } }, "tr"),
    ).toBe("E");
  });

  it("lists only the social links that exist", () => {
    expect(creditAuthorSameAs({ ...author, links: undefined })).toEqual([]);
    expect(
      creditAuthorSameAs({
        ...author,
        links: { facebook: "https://f", researchGate: "https://r" },
      }),
    ).toEqual(["https://f", "https://r"]);
  });
});

describe("verified job titles and affiliations", () => {
  it("names every affiliation in the English bio", () => {
    for (const author of CREDIT_AUTHORS) {
      for (const id of author.affiliations ?? []) {
        expect(author.bio?.en, `${author.slug} ${id}`).toContain(
          CREDIT_AFFILIATIONS[id].en,
        );
      }
    }
  });

  it("states every job title in the English bio", () => {
    for (const author of CREDIT_AUTHORS) {
      if (!author.jobTitle) continue;
      expect(author.bio?.en.toLowerCase(), author.slug).toContain(
        author.jobTitle,
      );
    }
  });

  it("gives job titles and affiliations to people only", () => {
    for (const author of CREDIT_AUTHORS) {
      if (creditAuthorKind(author) === "person") continue;
      expect(author.jobTitle, author.slug).toBeUndefined();
      expect(author.affiliations, author.slug).toBeUndefined();
    }
  });

  it("localizes affiliation names", () => {
    const zauri = CREDIT_AUTHORS.find((a) => a.slug === "zauri-khachidze")!;
    expect(creditAuthorAffiliationNames(zauri, "ka")).toEqual([
      "ბორჯომ-ხარაგაულის ეროვნული პარკი",
    ]);
    expect(creditAuthorAffiliationNames(zauri, "en")).toEqual([
      "Borjomi-Kharagauli National Park",
    ]);
  });

  it("keeps manual meta descriptions within 160 characters", () => {
    for (const author of CREDIT_AUTHORS) {
      for (const text of Object.values(author.metaDescription ?? {})) {
        expect(text.length, author.slug).toBeLessThanOrEqual(160);
      }
    }
  });
});

describe("photography page contributor", () => {
  const page = CREDIT_AUTHORS.find(
    (author) => author.slug === "velur-bunebastan-axlos",
  )!;

  it("is a page, not a person", () => {
    expect(creditAuthorKind(page)).toBe("page");
  });

  it("does not describe its subjects beyond the atlas record", () => {
    for (const locale of ["ka", "en", "ru", "tr"] as const) {
      const bio = creditAuthorBio(page, locale) ?? "";
      expect(bio).not.toMatch(
        /ქვეწარმავ|ამფიბ|reptile|amphibian|рептил|амфиби|sürüngen|amfibi/i,
      );
    }
  });
});
