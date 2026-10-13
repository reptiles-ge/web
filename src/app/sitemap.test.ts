import { describe, expect, it, vi } from "vitest";

vi.mock("@/i18n/navigation", () => ({
  getPathname: ({
    href,
    locale,
  }: {
    href: string | { params?: Record<string, string>; pathname: string };
    locale: string;
  }) => {
    const path =
      typeof href === "string"
        ? href
        : href.pathname.replace(
            /\[(\w+)\]/g,
            (_match, name: string) => href.params?.[name] ?? name,
          );
    const normalized = path === "/" ? "" : path;
    return locale === "ka" ? normalized || "/" : `/${locale}${normalized}`;
  },
  Link: "a",
  usePathname: () => "/",
  useRouter: () => ({}),
}));

import { getCatalogSpecies } from "@/data/species";
import { speciesUpdatedAt } from "@/i18n/localizeSpecies";
import { routing } from "@/i18n/routing";
import { creditAuthorUrl } from "@/lib/creditAuthors";
import {
  absoluteUrl,
  localePath,
  quizPageUrl,
  speciesPageUrl,
} from "@/lib/site";
import { regionHref } from "@/lib/speciesRoutes";
import {
  atlasDateFields,
  authorDateFields,
  pageDateFields,
  quizDateFields,
  regionDateFields,
} from "@/lib/structuredDataDates";

import sitemap from "./sitemap";

const entries = sitemap();
const urls = entries.map((entry) => entry.url);

describe("sitemap", () => {
  it("lists the Georgian-only legal pages once, without other-locale alternates", () => {
    for (const path of ["/privacy", "/terms-and-conditions"]) {
      const legal = entries.filter((entry) => entry.url.endsWith(path));
      expect(legal.map((entry) => entry.url)).toEqual([
        `https://reptiles.ge${path}`,
      ]);
      expect(Object.keys(legal[0]?.alternates?.languages ?? {})).toEqual([
        "ka",
        "x-default",
      ]);
    }
  });

  it("dates every locale of the species atlas like its structured data", () => {
    for (const locale of routing.locales) {
      const url = `https://reptiles.ge${locale === "ka" ? "" : `/${locale}`}/species`;
      const entry = entries.find((item) => item.url === url);
      expect(entry?.lastModified, url).toBe(
        atlasDateFields(locale).dateModified,
      );
    }
  });

  it("dates hubs, regions, quizzes and contributors like their structured data", () => {
    const byUrl = new Map(entries.map((entry) => [entry.url, entry]));
    for (const locale of routing.locales) {
      const hub = byUrl.get(absoluteUrl(localePath(locale, "/snakes")));
      expect(hub?.lastModified).toBe(
        pageDateFields("/snakes", locale).dateModified,
      );
      const region = byUrl.get(
        absoluteUrl(localePath(locale, regionHref("kakheti"))),
      );
      expect(region?.lastModified).toBe(
        regionDateFields("kakheti", locale).dateModified,
      );
      const quiz = byUrl.get(quizPageUrl(locale, "snake"));
      expect(quiz?.lastModified).toBe(
        quizDateFields("snake", locale).dateModified,
      );
      const author = byUrl.get(creditAuthorUrl(locale, "sandro-khakhva"));
      expect(author?.lastModified).toBe(
        authorDateFields("sandro-khakhva", locale).dateModified,
      );
    }
  });

  it("dates each species URL by its own locale", () => {
    for (const item of getCatalogSpecies()) {
      for (const locale of routing.locales) {
        const url = speciesPageUrl(locale, item.id);
        const entry = entries.find((candidate) => candidate.url === url);
        expect(entry?.lastModified, url).toBe(speciesUpdatedAt(item, locale));
      }
    }
  });

  it("never uses the build time as lastModified", () => {
    const now = Date.now();
    for (const entry of entries) {
      expect(
        now - Date.parse(String(entry.lastModified)),
        entry.url,
      ).toBeGreaterThan(60_000);
    }
  });

  it("has no duplicate URLs", () => {
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("lists only first-party images", () => {
    for (const entry of entries) {
      for (const image of entry.images ?? []) {
        expect(image, entry.url).toMatch(/^https:\/\/(cdn\.)?reptiles\.ge\//);
      }
    }
  });

  it("uses absolute https URLs on the apex domain only", () => {
    for (const url of urls) {
      expect(url, url).toMatch(/^https:\/\/reptiles\.ge(\/|$)/);
      expect(url, url).not.toContain("www.");
    }
  });

  it("never lists /ka-prefixed URLs", () => {
    expect(
      urls.some((url) => url.includes("/ka/") || url.endsWith("/ka")),
    ).toBe(false);
  });

  it("lists the home page of every locale", () => {
    expect(urls).toContain("https://reptiles.ge");
    expect(urls).toContain("https://reptiles.ge/en");
    expect(urls).toContain("https://reptiles.ge/ru");
    expect(urls).toContain("https://reptiles.ge/tr");
  });

  it("lists every published species in every locale", () => {
    const speciesUrls = urls.filter((url) => /\/(snakes|gvelebi)\//.test(url));
    expect(speciesUrls.length).toBeGreaterThan(0);
    const published = getCatalogSpecies().length;
    const perLocale = published * routing.locales.length;
    const speciesEntries = entries.filter((entry) => "datePublished" in entry);
    expect(speciesEntries.length).toBeGreaterThanOrEqual(perLocale);
  });

  it("does not list the unpublished Dolichophis caspius", () => {
    expect(urls.some((url) => url.includes("dolichophis-caspius"))).toBe(false);
  });

  it("gives every entry a parseable lastModified date", () => {
    for (const entry of entries) {
      expect(
        Number.isNaN(Date.parse(String(entry.lastModified))),
        entry.url,
      ).toBe(false);
    }
  });

  it("links alternates for every locale on language-aware entries", () => {
    const home = entries.find(
      (entry) => entry.url === "https://reptiles.ge/en",
    );
    const languages = home?.alternates?.languages ?? {};
    for (const locale of routing.locales) {
      expect(languages).toHaveProperty(locale);
    }
    expect(languages).toHaveProperty("x-default");
  });
});
