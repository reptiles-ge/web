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
import { kaMetaDescriptionOverride } from "@/lib/kaMetaDescriptionOverrides";
import { LEGAL_PATHS } from "@/lib/legalPages";
import { homeChildBreadcrumbLd } from "@/lib/pageStructuredData";
import { INDEXABLE_ROBOTS } from "@/lib/robots";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  openGraphJpeg,
  SITE_OG_IMAGE_URL,
  siteConfig,
  siteEntityId,
} from "@/lib/site";
import { pageDateFields } from "@/lib/structuredDataDates";

type Props = {
  params: Promise<{ locale: string }>;
};

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
    const path = LEGAL_PATHS[documentId];
    const publicPath = localePath(locale, path);
    const description = kaMetaDescriptionOverride(
      locale,
      publicPath,
      t("metaDescription"),
    );
    const url = absoluteUrl(publicPath);

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
      robots: INDEXABLE_ROBOTS,
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

    const [tFooter, tShared] = await Promise.all([
      getTranslations({ locale, namespace: "footer" }),
      getTranslations({ locale, namespace: "groupHubShared" }),
    ]);
    const title = await getTranslations({
      locale,
      namespace: `legal.${documentId}`,
    });
    const path = LEGAL_PATHS[documentId];
    const url = absoluteUrl(localePath(locale, path));

    const webPageJsonLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      ...(await pageDateFields(path, locale)),
      description: title("metaDescription"),
      inLanguage: locale,
      isPartOf: { "@id": siteEntityId("website") },
      name: `${title("metaTitle")} — ${siteConfig.titleBrand}`,
      url,
    };

    return (
      <>
        <JsonLd
          data={[
            webPageJsonLd,
            homeChildBreadcrumbLd(locale, path, {
              home: tShared("breadcrumbHome"),
              name: tFooter(documentId),
            }),
          ]}
        />
        <LegalDocumentPage documentId={documentId} locale={locale} />
      </>
    );
  }

  return {
    generateMetadata,
    generateStaticParams: () => routing.locales.map((locale) => ({ locale })),
    Page,
  };
}
