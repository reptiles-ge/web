import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";
import { PhotoUsePage } from "@/components/PhotoUsePage";
import { routing } from "@/i18n/routing";
import { faqPageJsonLd } from "@/lib/faqJsonLd";
import { photoUsePageUrl } from "@/lib/imageRights";
import { buildPageMetadata } from "@/lib/pageMetadata";
import { homeChildBreadcrumbLd } from "@/lib/pageStructuredData";
import { PHOTO_USE_FAQ } from "@/lib/photoUse";
import {
  organizationRef,
  SITE_OG_IMAGE_URL,
  siteConfig,
  siteEntityId,
} from "@/lib/site";
import { pageDateFields } from "@/lib/structuredDataDates";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: "photoUse" });
  return buildPageMetadata({
    description: t("metaDescription"),
    locale,
    ogImageUrl: SITE_OG_IMAGE_URL,
    pagePath: "/photo-use",
    title: t("metaTitle"),
  });
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function PhotoUse({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const [t, tFooter, tShared] = await Promise.all([
    getTranslations({ locale, namespace: "photoUse" }),
    getTranslations({ locale, namespace: "footer" }),
    getTranslations({ locale, namespace: "groupHubShared" }),
  ]);

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    ...(await pageDateFields("/photo-use", locale)),
    about: organizationRef(),
    description: t("metaDescription"),
    inLanguage: locale,
    isPartOf: { "@id": siteEntityId("website") },
    name: `${t("metaTitle")} — ${siteConfig.name}`,
    publisher: organizationRef(),
    url: photoUsePageUrl(locale),
  };

  const faqJsonLd = faqPageJsonLd(
    PHOTO_USE_FAQ.map((key) => ({
      answer: t.markup(`faq.${key}.a`, { terms: (chunks) => chunks }),
      question: t(`faq.${key}.q`),
    })),
  );

  return (
    <>
      <JsonLd
        data={[
          pageJsonLd,
          ...(faqJsonLd ? [faqJsonLd] : []),
          homeChildBreadcrumbLd(locale, "/photo-use", {
            home: tShared("breadcrumbHome"),
            name: tFooter("photoUse"),
          }),
        ]}
      />
      <PhotoUsePage locale={locale} />
    </>
  );
}
