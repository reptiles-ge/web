import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ClientMessagesProvider } from "@/components/ClientMessagesProvider";
import { CoverImagePreload } from "@/components/CoverImagePreload";
import { JsonLd } from "@/components/JsonLd";
import { SnakesInYardPage } from "@/components/SnakesInYardPage";
import { type AppLocale, routing } from "@/i18n/routing";
import { buildPageMetadata, type LocalePageProps } from "@/lib/pageMetadata";
import {
  breadcrumbListLd,
  localePageUrl,
  sitePageLd,
} from "@/lib/pageStructuredData";
import { absoluteUrl, localePath } from "@/lib/site";
import { pageDateFields } from "@/lib/structuredDataDates";

const PATH = "/snakes-in-the-yard";
const HERO_IMAGE = "/images/guides/snakes-in-the-yard-cover.jpg";
const WHY_IMAGE = "/images/guides/snakes-in-the-yard-why.jpg";

export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) return {};

  const locale = localeParam as AppLocale;
  const t = await getTranslations({ locale, namespace: "snakesInYard" });
  const title = t("metaTitle");
  const ogImageUrl = absoluteUrl(HERO_IMAGE);

  return buildPageMetadata({
    description: t("metaDescription"),
    indexable: true,
    keywords: t("keywords"),
    locale,
    ogImageUrl,
    openGraphImage: { alt: title, height: 572, url: ogImageUrl, width: 1024 },
    pagePath: PATH,
    title,
    type: "article",
  });
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function SnakesInYardRoute({ params }: LocalePageProps) {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }

  const locale = localeParam as AppLocale;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "snakesInYard" });
  const tSnakes = await getTranslations({ locale, namespace: "snakes" });
  const url = absoluteUrl(localePath(locale, PATH));

  const heroSrc = HERO_IMAGE;
  const coverSrc = WHY_IMAGE;

  const breadcrumbLd = breadcrumbListLd([
    { item: localePageUrl(locale, "/"), name: t("breadcrumbHome") },
    {
      item: localePageUrl(locale, "/snakes"),
      name: tSnakes("breadcrumbCurrent"),
    },
    { item: url, name: t("breadcrumbCurrent") },
  ]);

  const howToLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    description: t("metaDescription"),
    inLanguage: locale,
    name: t("title"),
    step: ([1, 2, 3] as const).map((n) => ({
      "@type": "HowToStep",
      name: t(`action${n}Title`),
      position: n,
      text: t(`action${n}Body`),
    })),
  };

  const dates = pageDateFields(PATH);
  const pageLd = sitePageLd({
    about: { "@type": "Thing", name: t("title") },
    dates,
    description: t("metaDescription"),
    locale,
    name: t("metaTitle"),
    type: "WebPage",
    url,
  });

  return (
    <>
      <CoverImagePreload sizes="100vw" src={heroSrc} />
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={pageLd} />
      <JsonLd data={howToLd} />
      <ClientMessagesProvider
        locale={locale}
        namespaces={[
          "card",
          "danger",
          "groupHubShared",
          "profile",
          "snakes",
          "snakesInYard",
        ]}
      >
        <SnakesInYardPage
          coverSrc={coverSrc}
          heroSrc={heroSrc}
          locale={locale}
          publishedAt={dates.datePublished}
          updatedAt={dates.dateModified}
        />
      </ClientMessagesProvider>
    </>
  );
}
