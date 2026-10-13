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
import { homeChildBreadcrumbLd } from "@/lib/pageStructuredData";
import {
  isIndexableLegalLocale,
  LEGAL_PATHS,
  legalAlternates,
} from "@/lib/legalPages";
import { INDEXABLE_ROBOTS, NOINDEX_FOLLOW_ROBOTS } from "@/lib/robots";
import {
  absoluteUrl,
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
      alternates: legalAlternates(locale, path),
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
      robots: isIndexableLegalLocale(locale)
        ? INDEXABLE_ROBOTS
        : NOINDEX_FOLLOW_ROBOTS,
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

    const [t, tFooter, tShared] = await Promise.all([
      getTranslations({ locale, namespace: "legal" }),
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
      ...pageDateFields(path),
      description: title("metaDescription"),
      inLanguage: locale,
      isPartOf: { "@id": siteEntityId("website") },
      name: `${title("metaTitle")} — ${siteConfig.name}`,
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
