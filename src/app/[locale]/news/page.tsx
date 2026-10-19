import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";
import { NewsIndexPage } from "@/components/NewsIndexPage";
import { type AppLocale, routing } from "@/i18n/routing";
import {
  newsIndexDateFields,
  newsIndexHref,
  newsIndexUrl,
  newsOgImageUrl,
} from "@/lib/news";
import { getNewsPage, newsListingJsonLd } from "@/lib/newsPages";
import { buildPageMetadata } from "@/lib/pageMetadata";
import { absoluteUrl, localePath } from "@/lib/site";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) return {};

  const locale = localeParam as AppLocale;
  const t = await getTranslations({ locale, namespace: "news" });
  return buildPageMetadata({
    description: t("metaDescription"),
    indexable: true,
    locale,
    ogImageUrl: newsOgImageUrl(),
    pagePath: newsIndexHref(),
    title: t("metaTitle"),
  });
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function NewsIndexRoute({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }

  const locale = localeParam as AppLocale;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "news" });
  const tShared = await getTranslations({
    locale,
    namespace: "groupHubShared",
  });
  const newsPage = getNewsPage(locale, 1);
  const articles = newsPage?.articles ?? [];
  const url = newsIndexUrl(locale);
  const jsonLd = newsListingJsonLd({
    articles,
    breadcrumbs: [
      {
        name: tShared("breadcrumbHome"),
        url: absoluteUrl(localePath(locale, "/")),
      },
      { name: t("breadcrumbNews"), url },
    ],
    dates: newsIndexDateFields(locale, articles),
    description: t("metaDescription"),
    locale,
    name: t("metaTitle"),
    url,
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <NewsIndexPage
        articles={articles}
        locale={locale}
        pageCount={newsPage?.pageCount ?? 1}
        total={newsPage?.total ?? 0}
      />
    </>
  );
}
