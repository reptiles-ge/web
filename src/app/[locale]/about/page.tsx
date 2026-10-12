import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { AboutPage } from "@/components/AboutPage";
import { JsonLd } from "@/components/JsonLd";
import { routing } from "@/i18n/routing";
import { kaMetaDescriptionOverride } from "@/lib/kaMetaDescriptionOverrides";
import { buildPageMetadata } from "@/lib/pageMetadata";
import {
  absoluteUrl,
  localePath,
  SITE_OG_IMAGE_URL,
  siteEntityId,
} from "@/lib/site";
import { pageDateFields } from "@/lib/structuredDataDates";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function About({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "about" });
  const path = localePath(locale, "/about");
  const organization = { "@id": siteEntityId("organization") };

  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    ...pageDateFields("/about"),
    about: organization,
    description: kaMetaDescriptionOverride(locale, path, t("metaDescription")),
    inLanguage: locale,
    isPartOf: { "@id": siteEntityId("website") },
    mainEntity: organization,
    name: t("metaTitle"),
    url: absoluteUrl(path),
  };

  return (
    <>
      <JsonLd data={aboutJsonLd} />
      <AboutPage locale={locale} />
    </>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: "about" });
  const title = t("metaTitle");
  return buildPageMetadata({
    description: t("metaDescription"),
    locale,
    metadataTitle: { absolute: title },
    ogImageUrl: SITE_OG_IMAGE_URL,
    pagePath: "/about",
    title,
  });
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
