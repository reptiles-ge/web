import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import type { NewsListArticle } from "@/data/newsTypes";

import { JsonLd } from "@/components/JsonLd";
import { NewsArchivePage } from "@/components/NewsArchivePage";
import { type AppLocale, routing } from "@/i18n/routing";
import { formatContentDate } from "@/lib/formatDate";
import { newsIndexUrl, newsOgImageUrl } from "@/lib/news";
import { getNewsListArticles } from "@/lib/newsApi";
import {
  getNewsListPage,
  getNewsListPageCounts,
  newsArchiveAlternates,
  newsArchiveHref,
  newsArchiveStaticParams,
  newsListingJsonLd,
  type NewsPage,
  newsPageDateModified,
  newsPageUrl,
  parseNewsArchivePage,
} from "@/lib/newsPages";
import { buildPageMetadata } from "@/lib/pageMetadata";
import { absoluteUrl, localePath } from "@/lib/site";

type Props = {
  params: Promise<{ locale: string; page: string }>;
};

export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = await resolveArchivePage(params);
  if (!resolved) return {};

  const { locale, newsPage } = resolved;
  const copy = await archiveCopy(locale, newsPage);
  const metadata = buildPageMetadata({
    description: copy.description,
    indexable: true,
    locale,
    ogImageUrl: newsOgImageUrl(),
    pagePath: newsArchiveHref(newsPage.page),
    title: copy.title,
  });
  return {
    ...metadata,
    alternates: newsArchiveAlternates(
      locale,
      newsPage.page,
      await getNewsListPageCounts(),
    ),
  };
}

export async function generateStaticParams() {
  return newsArchiveStaticParams(await getNewsListPageCounts());
}

export default async function NewsArchiveRoute({ params }: Props) {
  const resolved = await resolveArchivePage(params);
  if (!resolved) notFound();

  const { locale, newsPage } = resolved;
  setRequestLocale(locale);

  const [copy, t, tShared, all] = await Promise.all([
    archiveCopy(locale, newsPage),
    getTranslations({ locale, namespace: "news" }),
    getTranslations({ locale, namespace: "groupHubShared" }),
    getNewsListArticles(locale),
  ]);
  const url = newsPageUrl(locale, newsPage.page);
  const dateModified = newsPageDateModified(all[0], newsPage.articles);
  const jsonLd = newsListingJsonLd({
    articles: newsPage.articles,
    breadcrumbs: [
      {
        name: tShared("breadcrumbHome"),
        url: absoluteUrl(localePath(locale, "/")),
      },
      { name: t("breadcrumbNews"), url: newsIndexUrl(locale) },
      { name: t("pageNumber", { page: newsPage.page }), url },
    ],
    dates: dateModified ? { dateModified } : {},
    description: copy.description,
    locale,
    name: copy.title,
    url,
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <NewsArchivePage locale={locale} newsPage={newsPage} />
    </>
  );
}

async function archiveCopy(
  locale: AppLocale,
  newsPage: NewsPage<NewsListArticle>,
) {
  const t = await getTranslations({ locale, namespace: "news" });
  const newest = newsPage.articles[0]?.publishedAt ?? "";
  const oldest = newsPage.articles.at(-1)?.publishedAt ?? "";
  return {
    description: t("archiveMetaDescription", {
      newest: formatContentDate(newest, locale),
      oldest: formatContentDate(oldest, locale),
      page: newsPage.page,
      pageCount: newsPage.pageCount,
    }),
    title: t("archiveMetaTitle", { page: newsPage.page }),
  };
}

async function resolveArchivePage(params: Props["params"]) {
  const { locale: localeParam, page: pageParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) return null;
  const locale = localeParam as AppLocale;
  const page = parseNewsArchivePage(pageParam);
  const newsPage = page ? await getNewsListPage(locale, page) : null;
  return newsPage ? { locale, newsPage } : null;
}
