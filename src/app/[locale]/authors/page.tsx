import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { AuthorIndexPage } from "@/components/AuthorIndexPage";
import { JsonLd } from "@/components/JsonLd";
import { creditAuthorName } from "@/data/creditAuthors";
import { openGraphLocale } from "@/i18n/localeMeta";
import { type AppLocale, routing } from "@/i18n/routing";
import {
  creditAuthorIndexAlternates,
  creditAuthorIndexUrl,
  creditAuthorUrl,
  getCreditAuthorCards,
} from "@/lib/creditAuthors";
import { kaMetaDescriptionOverride } from "@/lib/kaMetaDescriptionOverrides";
import {
  absoluteUrl,
  localePath,
  OG_IMAGE_TYPE,
  organizationJsonLd,
  siteConfig,
  siteEntityId,
} from "@/lib/site";
import { pageDateFields } from "@/lib/structuredDataDates";

type Props = {
  params: Promise<{ locale: string }>;
};

const CONTRIBUTORS_OG_IMAGE_PATH = "/og/images/contributors.jpg";

const orgLd = {
  "@context": "https://schema.org",
  ...organizationJsonLd(),
};

export default async function AuthorIndexRoute({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }

  const locale = localeParam as AppLocale;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "author" });
  const tShared = await getTranslations({
    locale,
    namespace: "groupHubShared",
  });
  const cards = getCreditAuthorCards();
  const url = creditAuthorIndexUrl(locale);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        item: absoluteUrl(localePath(locale, "/")),
        name: tShared("breadcrumbHome"),
        position: 1,
      },
      {
        "@type": "ListItem",
        item: url,
        name: t("index.breadcrumb"),
        position: 2,
      },
    ],
  };

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    ...pageDateFields("/authors"),
    description: t("index.metaDescription"),
    inLanguage: locale,
    isPartOf: { "@id": siteEntityId("website") },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: cards.map((card, index) => ({
        "@type": "ListItem",
        name: creditAuthorName(card.author, locale),
        position: index + 1,
        url: creditAuthorUrl(locale, card.author.slug),
      })),
      numberOfItems: cards.length,
    },
    name: t("index.metaTitle"),
    publisher: { "@id": siteEntityId("organization") },
    url,
  };

  return (
    <>
      <JsonLd data={[breadcrumbLd, collectionLd, orgLd]} />
      <AuthorIndexPage cards={cards} locale={locale} />
    </>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) return {};

  const locale = localeParam as AppLocale;
  const t = await getTranslations({ locale, namespace: "author" });
  const title = t("index.metaTitle");
  const url = creditAuthorIndexUrl(locale);
  const description = kaMetaDescriptionOverride(
    locale,
    new URL(url).pathname,
    t("index.metaDescription"),
  );
  const ogImageUrl = absoluteUrl(CONTRIBUTORS_OG_IMAGE_PATH);

  return {
    alternates: creditAuthorIndexAlternates(locale),
    description,
    openGraph: {
      description,
      images: [
        {
          alt: title,
          height: 630,
          type: OG_IMAGE_TYPE,
          url: ogImageUrl,
          width: 1200,
        },
      ],
      locale: openGraphLocale(locale),
      siteName: siteConfig.name,
      title,
      type: "website",
      url,
    },
    robots: {
      follow: true,
      index: true,
    },
    title,
    twitter: {
      card: "summary_large_image",
      description,
      images: [ogImageUrl],
      title,
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
