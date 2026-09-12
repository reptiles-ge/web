import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";
import {
  type LegalDocumentId,
  LegalDocumentPage,
} from "@/components/LegalDocumentPage";
import { openGraphLocale } from "@/i18n/localeMeta";
import { type AppLocale, routing } from "@/i18n/routing";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  openGraphJpeg,
  SITE_OG_IMAGE_URL,
  siteConfig,
  siteEntityId,
} from "@/lib/site";

type Props = {
  params: Promise<{ locale: string }>;
};

const legalPaths = {
  privacy: "/privacy",
  terms: "/terms",
} as const;

export function createLegalRoute(documentId: LegalDocumentId) {
  async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale: localeParam } = await params;
    if (!hasLocale(routing.locales, localeParam)) return {};

    const locale = localeParam as AppLocale;
    const t = await getTranslations({
      locale,
      namespace: `legal.${documentId}`,
    });
    const title = t("metaTitle");
    const description = t("metaDescription");
    const path = legalPaths[documentId];
    const url = absoluteUrl(localePath(locale, path));

    return {
      alternates: localeAlternates(locale, path),
      description,
      openGraph: {
        description,
        images: [openGraphJpeg(SITE_OG_IMAGE_URL, title)],
        locale: openGraphLocale(locale),
        siteName: siteConfig.name,
        title,
        type: "website",
        url,
      },
      title,
      twitter: {
        card: "summary_large_image",
        description,
        images: [SITE_OG_IMAGE_URL],
        title,
      },
    };
  }

  async function Page({ params }: Props) {
    const { locale: localeParam } = await params;
    if (!hasLocale(routing.locales, localeParam)) {
      notFound();
    }

    const locale = localeParam as AppLocale;
    setRequestLocale(locale);

    const t = await getTranslations({ locale, namespace: "legal" });
    const title = await getTranslations({
      locale,
      namespace: `legal.${documentId}`,
    });
    const path = legalPaths[documentId];
    const url = absoluteUrl(localePath(locale, path));

    const webPageJsonLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      description: title("metaDescription"),
      inLanguage: locale,
      isPartOf: { "@id": siteEntityId("website") },
      name: `${title("metaTitle")} — ${siteConfig.name}`,
      url,
    };

    return (
      <>
        <JsonLd data={webPageJsonLd} />
        <LegalDocumentPage
          documentId={documentId}
          locale={locale}
          notice={t("canonicalNotice")}
        />
      </>
    );
  }

  return {
    generateMetadata,
    generateStaticParams: () => routing.locales.map((locale) => ({ locale })),
    Page,
  };
}
