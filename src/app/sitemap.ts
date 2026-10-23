import type { MetadataRoute } from "next";

import { getGuideArticles } from "@/data/guideArticles";
import { getPublishedNewsArticles } from "@/data/news";
import {
  sitemapAuthorDatePublished,
  sitemapPathDatePublished,
  sitemapQuizDatePublished,
  sitemapRegionDatePublished,
} from "@/data/pageLastModified";
import { regions } from "@/data/regions";
import { type AppLocale, routing } from "@/i18n/routing";
import { getContributors } from "@/lib/authorsApi";
import { CLUSTER_GUIDE_LIST } from "@/lib/clusterGuides";
import {
  creditAuthorAlternates,
  creditAuthorUrl,
  type CreditPhotoSource,
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
import {
  type CatalogCard,
  getCreditPhotoCatalog,
  getSpeciesCatalog,
} from "@/lib/speciesCatalogApi";
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: SitemapEntry[] = [];
  const seen = new Set<string>();

  function push(entry: SitemapEntry) {
    if (seen.has(entry.url)) return;
    seen.add(entry.url);
    const { lastModified, ...rest } = entry;
    entries.push(lastModified ? { ...rest, lastModified } : rest);
  }

  const [catalogs, creditPhotos, contributors] = await Promise.all([
    Promise.all(routing.locales.map((locale) => getSpeciesCatalog(locale))),
    getCreditPhotoCatalog(),
    getContributors(routing.defaultLocale),
  ]);
  const photosById = new Map(creditPhotos.map((item) => [item.id, item]));
  const pending: Array<Promise<SitemapEntry> | SitemapEntry> = [];
  const add = (entry: Promise<SitemapEntry> | SitemapEntry) =>
    pending.push(entry);

  routing.locales.forEach((locale, index) => {
    const cards = catalogs[index] ?? [];
    const page = (
      href: Parameters<typeof localePath>[1],
      lastModified?: null | string,
      datePublished?: string,
    ) =>
      pageEntry(
        { cards, creditPhotos, locale },
        href,
        lastModified,
        datePublished,
      );
    add(page("/"));
    add(page("/contact"));
    add(page("/about"));
    add(page("/photo-use"));
    for (const path of Object.values(LEGAL_PATHS)) add(page(path));
    add(page("/news", newsIndexDateFields(locale).dateModified));
    for (const newsPageNumber of newsArchivePages(locale)) {
      const newsPage = getNewsPage(locale, newsPageNumber);
      add({
        alternates: {
          languages: newsArchiveAlternates(locale, newsPageNumber).languages,
        },
        lastModified: toLastModified(
          newsPageDateModified(locale, newsPage?.articles ?? []),
        ),
        url: newsPageUrl(locale, newsPageNumber),
      });
    }
    for (const article of getGuideArticles()) {
      add(
        page(article.pathname).then((entry) => ({
          ...entry,
          images: guidePageImageUrls([article.hero.src]),
        })),
      );
    }
    add(page("/authors"));
    add(page("/species"));
    add(page("/venomous-snakes"));
    add(page("/snakes-in-the-yard"));
    add(page("/risk-to-humans"));
    add(page("/dangerous-animals"));
    add(page("/quiz"));
    for (const quiz of liveQuizzes()) {
      const { languages } = quizAlternates(locale, quiz.id);
      add(
        quizModifiedDate(quiz.id, locale, cards).then((date) => ({
          alternates: { languages },
          datePublished: sitemapQuizDatePublished(quiz.id),
          lastModified: toLastModified(date),
          url: quizPageUrl(locale, quiz.id),
        })),
      );
    }

    for (const guide of CLUSTER_GUIDE_LIST) {
      const images = guidePageImageUrls([guide.heroImage]);
      add(
        page(guide.pathname).then((entry) => ({
          ...entry,
          ...(images.length > 0 ? { images } : {}),
        })),
      );
    }

    for (const hub of GROUP_HUB_LIST) add(page(hub.path));

    add(page("/regions"));

    for (const region of regions) {
      add(
        regionModifiedDate(region.id, locale, cards).then((date) =>
          page(
            regionHref(region.id),
            date,
            sitemapRegionDatePublished(region.id),
          ),
        ),
      );
    }

    for (const item of cards) {
      const { languages } = speciesAlternates(locale, item.id);
      const photos = photosById.get(item.id);
      const images = photos ? speciesPageImageUrls(photos) : [];
      add({
        alternates: { languages },
        datePublished: item.publishedAt,
        lastModified: toLastModified(item.updatedAt),
        url: speciesPageUrl(locale, item.id),
        ...(images.length > 0 ? { images } : {}),
      });
    }

    for (const author of contributors) {
      const photos = getCreditAuthorPhotos(author, creditPhotos);
      const { languages } = creditAuthorAlternates(locale, author.id);
      const images = creditAuthorPageImageUrls(author.portraitSrc, photos);
      add(
        authorModifiedDate(author.id, locale, cards, creditPhotos).then(
          (date) => ({
            alternates: { languages },
            datePublished: sitemapAuthorDatePublished(author.id),
            lastModified: toLastModified(date),
            url: creditAuthorUrl(locale, author.id),
            ...(images.length > 0 ? { images } : {}),
          }),
        ),
      );
    }

    for (const article of getPublishedNewsArticles(locale)) {
      const { languages } = newsArticleAlternates(locale, article);
      add({
        alternates: { languages },
        datePublished: newsDateTime(article.publishedAt),
        lastModified: toLastModified(newsArticleModifiedDateTime(article)),
        url: newsArticleUrl(locale, article.slug),
      });
    }
  });

  for (const entry of await Promise.all(pending)) push(entry);
  return entries;
}

async function pageEntry(
  {
    cards,
    creditPhotos,
    locale,
  }: {
    cards: readonly CatalogCard[];
    creditPhotos: readonly CreditPhotoSource[];
    locale: AppLocale;
  },
  href: Parameters<typeof localePath>[1],
  lastModified?: null | string,
  datePublished?: string,
): Promise<SitemapEntry> {
  const { languages } = localeAlternates(locale, href);
  return {
    alternates: { languages },
    datePublished: datePublished ?? sitemapPathDatePublished(String(href)),
    lastModified: toLastModified(
      lastModified === undefined
        ? await pageModifiedDate(String(href), locale, cards, creditPhotos)
        : lastModified,
    ),
    url: absoluteUrl(localePath(locale, href)),
  };
}

function toLastModified(isoDate: null | string | undefined) {
  if (!isoDate || Number.isNaN(Date.parse(isoDate))) return undefined;
  return isoDate;
}
