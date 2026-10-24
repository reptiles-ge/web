import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { DevelopersPage } from "@/components/DevelopersPage";
import { JsonLd } from "@/components/JsonLd";
import { routing } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/pageMetadata";
import { homeChildBreadcrumbLd } from "@/lib/pageStructuredData";
import {
  absoluteUrl,
  localePath,
  organizationRef,
  SITE_OG_IMAGE_URL,
  siteConfig,
  siteEntityId,
} from "@/lib/site";
import { pageDateFields } from "@/lib/structuredDataDates";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Developers({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const [t, tShared] = await Promise.all([
    getTranslations({ locale, namespace: "developers" }),
    getTranslations({ locale, namespace: "groupHubShared" }),
  ]);
  const url = absoluteUrl(localePath(locale, "/developers"));

  const developersJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    ...(await pageDateFields("/developers", locale)),
    description: t("metaDescription"),
    isPartOf: { "@id": siteEntityId("website") },
    name: `${t("metaTitle")} — ${siteConfig.titleBrand}`,
    publisher: organizationRef(),
    url,
  };

  return (
    <>
      <JsonLd
        data={[
          developersJsonLd,
          homeChildBreadcrumbLd(locale, "/developers", {
            home: tShared("breadcrumbHome"),
            name: t("brand"),
          }),
        ]}
      />
      <DevelopersPage locale={locale} />
    </>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: "developers" });
  return buildPageMetadata({
    description: t("metaDescription"),
    locale,
    ogImageUrl: SITE_OG_IMAGE_URL,
    pagePath: "/developers",
    title: t("metaTitle"),
  });
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
