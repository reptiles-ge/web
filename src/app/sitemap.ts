import type { MetadataRoute } from "next";

import { getPublishedCreditAuthors } from "@/data/creditAuthors";
import { getGuideArticles } from "@/data/guideArticles";
import { getPublishedNewsArticles } from "@/data/news";
import {
  sitemapAuthorDatePublished,
  sitemapPathDatePublished,
  sitemapQuizDatePublished,
  sitemapRegionDatePublished,
} from "@/data/pageLastModified";
import { regions } from "@/data/regions";
import { getCatalogSpecies } from "@/data/species";
import { speciesUpdatedAt } from "@/i18n/localizeSpecies";
import { type AppLocale, routing } from "@/i18n/routing";
import { CLUSTER_GUIDE_LIST } from "@/lib/clusterGuides";
import {
  creditAuthorAlternates,
  creditAuthorUrl,
  getCreditAuthorPhotos,
} from "@/lib/creditAuthors";
import { GROUP_HUB_LIST } from "@/lib/groupHubs";
import { LEGAL_PATHS } from "@/lib/legalPages";
import {
  newsArticleAlternates,
  newsArticleModifiedDateTime,
  newsArticleUrl,
  newsDateTime,
  newsIndexDateFields,
} from "@/lib/news";
import {
  getNewsPage,
  newsArchiveAlternates,
  newsArchivePages,
  newsPageDateModified,
  newsPageUrl,
} from "@/lib/newsPages";
import { liveQuizzes } from "@/lib/quizzes";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  quizAlternates,
  quizPageUrl,
  speciesAlternates,
  speciesPageUrl,
} from "@/lib/site";
import {
  creditAuthorPageImageUrls,
  guidePageImageUrls,
  speciesPageImageUrls,
} from "@/lib/sitemapImages";
import { regionHref } from "@/lib/speciesRoutes";
import {
  authorModifiedDate,
  pageModifiedDate,
  quizModifiedDate,
  regionModifiedDate,
} from "@/lib/structuredDataDates";

type SitemapEntry = MetadataRoute.Sitemap[number] & {
  datePublished?: string;
};

export default function sitemap(): MetadataRoute.Sitemap {
  const catalog = getCatalogSpecies();
  const entries: SitemapEntry[] = [];
  const seen = new Set<string>();

  function push(entry: SitemapEntry) {
    if (seen.has(entry.url)) return;
    seen.add(entry.url);
    const { lastModified, ...rest } = entry;
    entries.push(lastModified ? { ...rest, lastModified } : rest);
  }

  for (const locale of routing.locales) {
    push(pageEntry(locale, "/"));
    push(pageEntry(locale, "/contact"));
    push(pageEntry(locale, "/about"));
    push(pageEntry(locale, "/photo-use"));
    for (const path of Object.values(LEGAL_PATHS)) {
      push(pageEntry(locale, path));
    }
    push(pageEntry(locale, "/news", newsIndexDateFields(locale).dateModified));
    for (const page of newsArchivePages(locale)) {
      const newsPage = getNewsPage(locale, page);
      push({
        alternates: {
          languages: newsArchiveAlternates(locale, page).languages,
        },
        lastModified: toLastModified(
          newsPageDateModified(locale, newsPage?.articles ?? []),
        ),
        url: newsPageUrl(locale, page),
      });
    }
    for (const article of getGuideArticles()) {
      push({
        ...pageEntry(locale, article.pathname),
        images: guidePageImageUrls([article.hero.src]),
      });
    }
    push(pageEntry(locale, "/authors"));
    push(pageEntry(locale, "/species"));
    push(pageEntry(locale, "/venomous-snakes"));
    push(pageEntry(locale, "/snakes-in-the-yard"));
    push(pageEntry(locale, "/risk-to-humans"));
    push(pageEntry(locale, "/dangerous-animals"));
    push(pageEntry(locale, "/quiz"));
    for (const quiz of liveQuizzes()) {
      const { languages } = quizAlternates(locale, quiz.id);
      push({
        alternates: { languages },
        datePublished: sitemapQuizDatePublished(quiz.id),
        lastModified: toLastModified(quizModifiedDate(quiz.id, locale)),
        url: quizPageUrl(locale, quiz.id),
      });
    }

    for (const guide of CLUSTER_GUIDE_LIST) {
      const images = guidePageImageUrls([guide.heroImage]);
      push({
        ...pageEntry(locale, guide.pathname),
        ...(images.length > 0 ? { images } : {}),
      });
    }

    for (const hub of GROUP_HUB_LIST) {
      push(pageEntry(locale, hub.path));
    }

    push(pageEntry(locale, "/regions"));

    for (const region of regions) {
      push(
        pageEntry(
          locale,
          regionHref(region.id),
          regionModifiedDate(region.id, locale),
          sitemapRegionDatePublished(region.id),
        ),
      );
    }

    for (const item of catalog) {
      const { languages } = speciesAlternates(locale, item.id);
      const images = speciesPageImageUrls(item);
      push({
        alternates: { languages },
        datePublished: item.publishedAt,
        lastModified: toLastModified(speciesUpdatedAt(item, locale)),
        url: speciesPageUrl(locale, item.id),
        ...(images.length > 0 ? { images } : {}),
      });
    }

    for (const author of getPublishedCreditAuthors()) {
      const photos = getCreditAuthorPhotos(author);
      const { languages } = creditAuthorAlternates(locale, author.slug);
      const images = creditAuthorPageImageUrls(author.portraitSrc, photos);
      push({
        alternates: { languages },
        datePublished: sitemapAuthorDatePublished(author.slug),
        lastModified: toLastModified(authorModifiedDate(author.slug, locale)),
        url: creditAuthorUrl(locale, author.slug),
        ...(images.length > 0 ? { images } : {}),
      });
    }

    for (const article of getPublishedNewsArticles(locale)) {
      const { languages } = newsArticleAlternates(locale, article.slug);
      push({
        alternates: { languages },
        datePublished: newsDateTime(article.publishedAt),
        lastModified: toLastModified(newsArticleModifiedDateTime(article)),
        url: newsArticleUrl(locale, article.slug),
      });
    }
  }

  return entries;
}

function pageEntry(
  locale: AppLocale,
  href: Parameters<typeof localePath>[1],
  lastModified: null | string = pageModifiedDate(String(href), locale),
  datePublished?: string,
): SitemapEntry {
  const { languages } = localeAlternates(locale, href);
  return {
    alternates: { languages },
    datePublished: datePublished ?? sitemapPathDatePublished(String(href)),
    lastModified: toLastModified(lastModified),
    url: absoluteUrl(localePath(locale, href)),
  };
}

function toLastModified(isoDate: null | string | undefined) {
  if (!isoDate || Number.isNaN(Date.parse(isoDate))) return undefined;
  return isoDate;
}
