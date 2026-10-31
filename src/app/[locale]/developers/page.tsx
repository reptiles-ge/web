import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { DevelopersPage } from "@/components/DevelopersPage";
import { HomeChildPageHead } from "@/components/HomeChildPageHead";
import { routing } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/pageMetadata";
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

  const t = await getTranslations({ locale, namespace: "developers" });
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
      <HomeChildPageHead
        locale={locale}
        name={t("brand")}
        page={developersJsonLd}
        path="/developers"
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
