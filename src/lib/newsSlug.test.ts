import { describe, expect, it } from "vitest";

import { getAllNewsArticles } from "@/data/news";
import { newsSlugs } from "@/data/newsPublish";
import { pathnames } from "@/i18n/pathnames";
import { routing } from "@/i18n/routing";
import { getNewsPage, newsArchiveStaticParams } from "@/lib/newsPages";
import {
  NEWS_ARCHIVE_SEGMENT,
  NEWS_RESERVED_SLUGS,
  newsSlugIssue,
} from "@/lib/newsSlug";

function localizedPaths(internal: keyof typeof pathnames) {
  const value = pathnames[internal];
  return typeof value === "string"
    ? [value]
    : routing.locales.map((locale) => value[locale]);
}

describe("news slugs never shadow news archive URLs", () => {
  it("accepts every registered news slug", () => {
    for (const slug of newsSlugs) {
      expect(newsSlugIssue(slug), slug).toBeNull();
    }
    for (const article of getAllNewsArticles()) {
      expect(NEWS_RESERVED_SLUGS, article.slug).not.toContain(article.slug);
    }
  });

  it("rejects the archive segment, number-only slugs and malformed slugs", () => {
    expect(newsSlugIssue(NEWS_ARCHIVE_SEGMENT)).toMatch(/reserved/);
    expect(newsSlugIssue("2026")).toMatch(/letter/);
    for (const slug of ["", "Page", "page/2", "a--b", "-a", "a_b", "ა"]) {
      expect(newsSlugIssue(slug), slug).toMatch(/lowercase/);
    }
  });

  it("reserves the first segment of every static news route", () => {
    const newsRoutes = (
      Object.keys(pathnames) as Array<keyof typeof pathnames>
    ).filter(
      (internal) =>
        internal.startsWith("/news/") && internal !== "/news/[slug]",
    );
    expect(newsRoutes).toContain("/news/page/[page]");
    for (const internal of newsRoutes) {
      for (const path of localizedPaths(internal)) {
        const segment = path.split("/")[2] ?? "";
        expect(segment.startsWith("["), path).toBe(false);
        expect(NEWS_RESERVED_SLUGS, path).toContain(segment);
      }
    }
  });

  it("emits no empty archive page for today's articles", () => {
    for (const param of newsArchiveStaticParams()) {
      expect(
        getNewsPage(param.locale, Number(param.page))?.articles.length,
        `${param.locale} ${param.page}`,
      ).toBeGreaterThan(0);
    }
  });
});
