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
import { routing } from "@/i18n/routing";
import { atlasDateFields } from "@/lib/structuredDataDates";

import sitemap from "./sitemap";

const entries = sitemap();
const urls = entries.map((entry) => entry.url);

describe("sitemap", () => {
  it("dates every locale of the species atlas like its structured data", () => {
    const atlas = entries.filter((entry) =>
      /\/(?:(?:en|ru|tr)\/)?species$/.test(entry.url),
    );
    expect(atlas).toHaveLength(routing.locales.length);
    for (const entry of atlas) {
      expect(entry.lastModified).toBe(atlasDateFields().dateModified);
    }
  });

  it("has no duplicate URLs", () => {
    expect(new Set(urls).size).toBe(urls.length);
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
