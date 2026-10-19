import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";
import { NewsArchivePage } from "@/components/NewsArchivePage";
import { type AppLocale, routing } from "@/i18n/routing";
import { formatContentDate } from "@/lib/formatDate";
import { newsIndexUrl, newsOgImageUrl } from "@/lib/news";
import {
  getNewsPage,
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

export const dynamicParams = false;

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
    alternates: newsArchiveAlternates(locale, newsPage.page),
  };
}

export function generateStaticParams() {
  return newsArchiveStaticParams();
}

export default async function NewsArchiveRoute({ params }: Props) {
  const resolved = await resolveArchivePage(params);
  if (!resolved) notFound();

  const { locale, newsPage } = resolved;
  setRequestLocale(locale);

  const [copy, t, tShared] = await Promise.all([
    archiveCopy(locale, newsPage),
    getTranslations({ locale, namespace: "news" }),
    getTranslations({ locale, namespace: "groupHubShared" }),
  ]);
  const url = newsPageUrl(locale, newsPage.page);
  const dateModified = newsPageDateModified(locale, newsPage.articles);
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

async function archiveCopy(locale: AppLocale, newsPage: NewsPage) {
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
  const newsPage = page ? getNewsPage(locale, page) : null;
  return newsPage ? { locale, newsPage } : null;
}
