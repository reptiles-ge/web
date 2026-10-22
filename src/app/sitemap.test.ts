import { beforeAll, describe, expect, it, vi } from "vitest";

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
  authorModifiedDate,
  pageModifiedDate,
  quizModifiedDate,
  regionModifiedDate,
} from "@/lib/structuredDataDates";

import sitemap from "./sitemap";

const PLACEHOLDER_DAY = "2026-09-16";
const PLACEHOLDER_PAGES = [
  "/about",
  "/contact",
  "/risk-to-humans",
  "/lizards/xvlikis-da-gvelxokeras-gansxvaveba",
  "/lizards/xvliki-sakhlshi",
  "/lizards/identifikacia",
  "/mammals/tura-ezoshi",
  "/snakes/didi-gvelebi",
] as const;

let entries: Awaited<ReturnType<typeof sitemap>>;
let urls: string[];
let datedEntries: typeof entries;

beforeAll(async () => {
  entries = await sitemap();
  urls = entries.map((entry) => entry.url);
  datedEntries = entries.filter((entry) => "lastModified" in entry);
});

describe("sitemap", () => {
  it("lists the legal pages in every locale with every hreflang alternate", () => {
    for (const path of ["/privacy", "/terms-and-conditions"] as const) {
      const legal = entries.filter((entry) => entry.url.endsWith(path));
      expect(legal.map((entry) => entry.url)).toEqual(
        routing.locales.map((locale) => absoluteUrl(localePath(locale, path))),
      );
      for (const entry of legal) {
        expect(Object.keys(entry.alternates?.languages ?? {}).sort()).toEqual(
          [...routing.locales, "x-default"].sort(),
        );
      }
    }
  });

  it("dates every locale of the species atlas like its structured data", async () => {
    for (const locale of routing.locales) {
      const url = `https://reptiles.ge${locale === "ka" ? "" : `/${locale}`}/species`;
      const entry = entries.find((item) => item.url === url);
      expect(entry?.lastModified ?? null, url).toBe(
        await pageModifiedDate("/species", locale),
      );
    }
  });

  it("dates hubs, regions, quizzes and contributors like their structured data", async () => {
    const byUrl = new Map(entries.map((entry) => [entry.url, entry]));
    for (const locale of routing.locales) {
      const hub = byUrl.get(absoluteUrl(localePath(locale, "/snakes")));
      expect(hub?.lastModified ?? null).toBe(
        await pageModifiedDate("/snakes", locale),
      );
      const region = byUrl.get(
        absoluteUrl(localePath(locale, regionHref("kakheti"))),
      );
      expect(region?.lastModified ?? null).toBe(
        await regionModifiedDate("kakheti", locale),
      );
      const quiz = byUrl.get(quizPageUrl(locale, "snake"));
      expect(quiz?.lastModified ?? null).toBe(
        await quizModifiedDate("snake", locale),
      );
      const author = byUrl.get(creditAuthorUrl(locale, "sandro-khakhva"));
      expect(author?.lastModified ?? null).toBe(
        await authorModifiedDate("sandro-khakhva", locale),
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
    for (const entry of datedEntries) {
      expect(
        now - Date.parse(String(entry.lastModified)),
        entry.url,
      ).toBeGreaterThan(60_000);
    }
  });

  it("never dates an entry later than the build time", () => {
    const now = Date.now();
    for (const entry of datedEntries) {
      expect(
        Date.parse(String(entry.lastModified)),
        entry.url,
      ).toBeLessThanOrEqual(now);
    }
  });

  it("never falls back to a placeholder date", () => {
    const placeholders = new Set(
      entries
        .map((entry) => (entry as { datePublished?: string }).datePublished)
        .filter((date) => date?.startsWith(PLACEHOLDER_DAY)),
    );
    for (const entry of datedEntries) {
      const lastModified = String(entry.lastModified);
      expect(placeholders.has(lastModified), entry.url).toBe(false);
      expect(lastModified, entry.url).not.toMatch(/^2026-01-01T00:00:00/);
    }
    for (const path of PLACEHOLDER_PAGES) {
      for (const locale of routing.locales) {
        const url = absoluteUrl(localePath(locale, path));
        const entry = entries.find((item) => item.url === url);
        expect(entry, url).toBeDefined();
        expect(String(entry?.lastModified ?? ""), url).not.toMatch(
          new RegExp(`^${PLACEHOLDER_DAY}`),
        );
      }
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

  it("gives every dated entry a parseable lastModified date", () => {
    for (const entry of datedEntries) {
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
