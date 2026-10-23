import { describe, expect, it } from "vitest";

import { routing } from "@/i18n/routing";

import { contributorsFixture } from "../../tests/fixtures/speciesCatalog";
import {
  authorAffiliationNames,
  authorSameAs,
  creditAuthorHref,
  creditAuthorIndexHref,
} from "./authors";

const contributors = contributorsFixture("ka");
const english = contributorsFixture("en");

function contributor(id: string) {
  const author = contributors.find((item) => item.id === id);
  if (!author) throw new Error(`No contributor ${id}`);
  return author;
}

describe("contributor data", () => {
  it("has unique ids and gives every contributor a name and a portrait", () => {
    const ids = contributors.map((author) => author.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const author of contributors) {
      expect(author.name, author.id).toBeTruthy();
      expect(author.portraitSrc, author.id).toBeTruthy();
      expect(author.isContributor, author.id).toBe(true);
    }
  });

  it("never shares an alias between two contributors", () => {
    const seen = new Map<string, string>();
    for (const author of contributors) {
      for (const alias of author.aliases) {
        expect(seen.get(alias), alias).toBeUndefined();
        seen.set(alias, author.id);
      }
    }
  });

  it("lists the same contributors in every locale", () => {
    for (const locale of routing.locales) {
      expect(
        contributorsFixture(locale).map((author) => author.id),
        locale,
      ).toEqual(contributors.map((author) => author.id));
    }
  });

  it("labels each contributor with the role the owner confirmed", () => {
    const roles: Record<string, string> = {
      "armen-seropian": "researcher",
      "david-tarkhnishvili": "professor",
      "giorgi-iankoshvili": "herpetologist",
      "giorgi-sheklashvili": "researcher",
      "ioane-rostiashvili": "herpetologist",
      "lasha-gogodze": "researcher",
      "sandro-khakhva": "herpetologist",
      "shota-zandukeli": "herpetologist",
      "zauri-khachidze": "ranger",
    };
    for (const author of contributors) {
      expect(author.role, author.id).toBe(roles[author.id] ?? "photographer");
    }
  });

  it("names every affiliation and job title in the English bio", () => {
    for (const author of english) {
      for (const name of authorAffiliationNames(author, "en")) {
        expect(author.bio, `${author.id} ${name}`).toContain(name);
      }
      if (author.jobTitle) {
        expect(author.bio?.toLowerCase(), author.id).toContain(author.jobTitle);
      }
    }
  });

  it("keeps puffery out of bios and descriptions, and descriptions short", () => {
    const puffery =
      /well-known|renowned|famous|experienced|ცნობილ|გამოცდილ|известн|опытн|tanınmış|deneyimli/i;
    for (const locale of routing.locales) {
      for (const author of contributorsFixture(locale)) {
        for (const text of [author.bio, author.metaDescription]) {
          expect(text ?? "", `${locale} ${author.id}`).not.toMatch(puffery);
        }
        expect(
          (author.metaDescription ?? "").length,
          author.id,
        ).toBeLessThanOrEqual(160);
      }
    }
  });

  it("gives job titles and affiliations to people only", () => {
    for (const author of contributors) {
      if (author.kind === "person") continue;
      expect(author.jobTitle, author.id).toBeNull();
      expect(author.affiliations, author.id).toEqual([]);
    }
  });
});

describe("photography page contributor", () => {
  it("is a page that does not describe its subjects beyond the atlas record", () => {
    for (const locale of routing.locales) {
      const page = contributorsFixture(locale).find(
        (author) => author.id === "velur-bunebastan-axlos",
      );
      expect(page?.kind).toBe("page");
      expect(page?.bio ?? "").not.toMatch(
        /ქვეწარმავ|ამფიბ|reptile|amphibian|рептил|амфиби|sürüngen|amfibi/i,
      );
    }
  });
});

describe("presentation helpers", () => {
  it("builds hrefs", () => {
    expect(creditAuthorHref("x")).toEqual({
      params: { slug: "x" },
      pathname: "/authors/[slug]",
    });
    expect(creditAuthorIndexHref()).toBe("/authors");
  });

  it("localizes affiliation names", () => {
    const zauri = contributor("zauri-khachidze");
    expect(authorAffiliationNames(zauri, "ka")).toEqual([
      "ბორჯომ-ხარაგაულის ეროვნული პარკი",
    ]);
    expect(authorAffiliationNames(zauri, "en")).toEqual([
      "Borjomi-Kharagauli National Park",
    ]);
  });

  it("lists only the social links that exist", () => {
    const author = contributor("zauri-khachidze");
    expect(authorSameAs({ ...author, links: {} })).toEqual([]);
    expect(
      authorSameAs({
        links: {
          facebook: "https://f",
          inaturalist: "https://n",
          researchGate: "https://r",
        },
      }),
    ).toEqual(["https://f", "https://n", "https://r"]);
  });
});
