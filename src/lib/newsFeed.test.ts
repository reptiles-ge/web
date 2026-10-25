import { Window } from "happy-dom";
import { describe, expect, it, vi } from "vitest";

import { getAllNewsArticles, getPublishedNewsArticles } from "@/data/news";
import { routing } from "@/i18n/routing";
import {
  newsArticleModifiedDateTime,
  newsArticleUrl,
  newsDateTime,
  newsIndexDateFields,
  newsIndexUrl,
} from "@/lib/news";
import {
  buildNewsFeedXml,
  escapeXml,
  NEWS_FEED_HEADERS,
  newsFeedPath,
  newsFeedUrl,
} from "@/lib/newsFeed";

vi.mock("@/i18n/navigation", () => ({
  getPathname({
    href,
    locale,
  }: {
    href: string | { params: { slug: string }; pathname: string };
    locale: string;
  }) {
    const path =
      typeof href === "string"
        ? href
        : href.pathname.replace("[slug]", href.params.slug);
    return locale === "ka" ? path : `/${locale}${path}`;
  },
}));

const article = getPublishedNewsArticles()[0];

function feed(locale: (typeof routing.locales)[number], articles?: never[]) {
  return buildNewsFeedXml({
    articles: articles ?? getPublishedNewsArticles(),
    locale,
    subtitle: "Subtitle",
    title: "Title",
  });
}

function parse(xml: string) {
  const window = new Window();
  return new window.DOMParser().parseFromString(xml, "application/xml");
}

describe("escapeXml", () => {
  it("escapes markup characters and drops characters XML cannot hold", () => {
    expect(escapeXml(`a & b < c > "d" 'e'`)).toBe(
      "a &amp; b &lt; c &gt; &quot;d&quot; &apos;e&apos;",
    );
    expect(escapeXml("a\u0000b\u0008c\u000Bd\tf\ng")).toBe("abcd\tf\ng");
  });
});

describe("newsFeedPath", () => {
  it("keeps Georgian unprefixed and prefixes other locales", () => {
    expect(newsFeedPath("ka")).toBe("/feed.xml");
    expect(newsFeedPath("en")).toBe("/en/feed.xml");
    expect(newsFeedUrl("ru")).toMatch(
      /^https:\/\/reptiles\.ge\/ru\/feed\.xml$/,
    );
  });
});

describe("buildNewsFeedXml", () => {
  it("is well-formed Atom with feed metadata for every locale", () => {
    for (const locale of routing.locales) {
      const xml = feed(locale);
      expect(xml.startsWith('<?xml version="1.0" encoding="utf-8"?>')).toBe(
        true,
      );
      const doc = parse(xml);
      const root = doc.documentElement;
      expect(root.nodeName).toBe("feed");
      expect(root.getAttribute("xmlns")).toBe("http://www.w3.org/2005/Atom");
      expect(root.getAttribute("xml:lang")).toBe(locale);
      expect(doc.querySelector("feed > id")?.textContent).toBe(
        newsIndexUrl(locale),
      );
      expect(
        doc.querySelector('feed > link[rel="self"]')?.getAttribute("href"),
      ).toBe(newsFeedUrl(locale));
      expect(doc.querySelector("feed > updated")?.textContent).toBe(
        newsIndexDateFields(getPublishedNewsArticles(locale)).dateModified,
      );
    }
  });

  it("lists each published article once, with localized canonical URLs and dates", () => {
    const published = getPublishedNewsArticles("en");
    const doc = parse(feed("en"));
    const entries = [...doc.querySelectorAll("entry")];
    expect(entries).toHaveLength(published.length);

    const ids = entries.map((entry) => entry.querySelector("id")?.textContent);
    expect(new Set(ids).size).toBe(ids.length);

    const first = entries[0];
    const expected = published[0];
    expect(first.querySelector("id")?.textContent).toBe(
      newsArticleUrl("en", expected.slug),
    );
    expect(first.querySelector("link")?.getAttribute("href")).toBe(
      newsArticleUrl("en", expected.slug),
    );
    expect(first.querySelector("title")?.textContent).toBe(
      expected.copy.en.title,
    );
    expect(first.querySelector("summary")?.textContent).toBe(
      expected.copy.en.dek,
    );
    expect(first.querySelector("published")?.textContent).toBe(
      newsDateTime(expected.publishedAt),
    );
    expect(first.querySelector("updated")?.textContent).toBe(
      newsArticleModifiedDateTime(expected),
    );
  });

  it("uses unprefixed Georgian article URLs", () => {
    const doc = parse(feed("ka"));
    expect(doc.querySelector("feed > id")?.textContent).toBe(
      "https://reptiles.ge/news",
    );
    for (const id of doc.querySelectorAll("entry > id")) {
      expect(id.textContent).toMatch(
        /^https:\/\/reptiles\.ge\/news\/[a-z0-9-]+$/,
      );
    }
    expect(parse(feed("en")).querySelector("entry > id")?.textContent).toMatch(
      /^https:\/\/reptiles\.ge\/en\/news\//,
    );
  });

  it("excludes drafts, duplicates and articles without the locale's copy", () => {
    const { en: _en, ...withoutEnglish } = article.copy;
    const xml = buildNewsFeedXml({
      articles: [
        article,
        article,
        { ...article, slug: "draft-story", status: "draft" },
        {
          ...article,
          copy: withoutEnglish as typeof article.copy,
          slug: "ka-only",
        },
      ],
      locale: "en",
      subtitle: "s",
      title: "t",
    });
    const doc = parse(xml);
    expect(doc.querySelectorAll("entry")).toHaveLength(1);
    expect(xml).not.toContain("draft-story");
    expect(xml).not.toContain("ka-only");
  });

  it("never includes a draft from the registry", () => {
    const drafts = getAllNewsArticles().filter(
      (item) => item.status !== "published",
    );
    const xml = feed("ka");
    for (const draft of drafts) {
      expect(xml).not.toContain(`/news/${draft.slug}<`);
    }
  });

  it("escapes titles and summaries", () => {
    const xml = buildNewsFeedXml({
      articles: [
        {
          ...article,
          copy: {
            ...article.copy,
            en: { ...article.copy.en, dek: "<b>x</b>", title: "A & B" },
          },
        },
      ],
      locale: "en",
      subtitle: "s & t",
      title: "<t>",
    });
    expect(xml).toContain("<title>&lt;t&gt;</title>");
    expect(xml).toContain("<subtitle>s &amp; t</subtitle>");
    expect(xml).toContain("<title>A &amp; B</title>");
    expect(xml).toContain("<summary>&lt;b&gt;x&lt;/b&gt;</summary>");
  });

  it("produces an empty but valid feed when nothing is published", () => {
    const doc = parse(feed("en", []));
    expect(doc.querySelectorAll("entry")).toHaveLength(0);
    expect(doc.querySelector("feed > updated")?.textContent).toBe(
      newsIndexDateFields([]).dateModified,
    );
  });
});

describe("NEWS_FEED_HEADERS", () => {
  it("serves Atom as UTF-8", () => {
    expect(NEWS_FEED_HEADERS["Content-Type"]).toBe(
      "application/atom+xml; charset=utf-8",
    );
  });
});
