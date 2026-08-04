import { JsonLd } from "@/components/JsonLd";
import { SpeciesProfile } from "@/components/SpeciesProfile";
import {
  catalogSpeciesIds,
  getFeaturedSpecies,
  getSpeciesById,
} from "@/data/species";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { routing, type AppLocale } from "@/i18n/routing";
import {
  absoluteImageUrl,
  absoluteUrl,
  localeAlternates,
  localePath,
  organizationJsonLd,
  siteConfig,
  speciesOgImageUrl,
} from "@/lib/site";
import {
  speciesMetaDescription,
  speciesMetaTitle,
} from "@/lib/speciesMeta";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    catalogSpeciesIds.map((id) => ({ locale, id })),
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: localeParam, id } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    return {
      title: "Species not found",
      robots: { index: false, follow: false },
    };
  }

  const locale = localeParam as AppLocale;
  const t = await getTranslations({ locale, namespace: "speciesMeta" });
  const raw = getSpeciesById(id);

  if (!raw) {
    return {
      title: t("notFound"),
      robots: { index: false, follow: false },
    };
  }

  const item = localizeSpecies(raw, locale);
  const title = speciesMetaTitle(
    item.commonName,
    item.scientificName,
    raw.danger,
    t("titleIntentVenomous"),
    t("titleIntentHarmless"),
  );
  const description = speciesMetaDescription(
    item.overview,
    t("descriptionCta"),
  );
  const path = `/species/${item.id}`;
  const url = absoluteUrl(localePath(locale, path));

  return {
    title,
    description,
    keywords: [
      item.commonName,
      item.scientificName,
      item.genus,
      item.family,
      item.location,
      locale === "en" ? "reptiles" : "ქვეწარმავლები",
      siteConfig.name,
    ],
    alternates: localeAlternates(locale, path),
    openGraph: {
      type: "article",
      locale: locale === "en" ? "en_US" : siteConfig.locale,
      url,
      siteName: siteConfig.name,
      title,
      description,
      modifiedTime: raw.updatedAt,
      publishedTime: raw.updatedAt,
      images: [
        {
          url: speciesOgImageUrl(item.id),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [speciesOgImageUrl(item.id)],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function SpeciesPage({ params }: PageProps) {
  const { locale: localeParam, id } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }

  const locale = localeParam as AppLocale;
  setRequestLocale(locale);

  const raw = getSpeciesById(id);
  if (!raw) {
    notFound();
  }

  const item = localizeSpecies(raw, locale);
  const related = getFeaturedSpecies()
    .filter((entry) => entry.id !== raw.id)
    .slice(0, 3);

  const pageUrl = absoluteUrl(localePath(locale, `/species/${item.id}`));
  const ogImage = speciesOgImageUrl(item.id);
  const galleryImages = item.gallery
    .map((photo) => photo.src)
    .filter((src) => src !== item.image)
    .slice(0, 3)
    .map(absoluteImageUrl);

  const sameAs = raw.sources
    .map((source) => source.url)
    .filter((url): url is string => Boolean(url));

  const taxon = {
    "@type": "Taxon",
    name: item.scientificName,
    alternateName: item.commonName,
    taxonRank: "Species",
    parentTaxon: {
      "@type": "Taxon",
      name: item.genus,
      taxonRank: "Genus",
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  const org = organizationJsonLd();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${item.commonName} (${item.scientificName})`,
    description: item.description,
    image: [ogImage, ...galleryImages],
    datePublished: raw.updatedAt,
    dateModified: raw.updatedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    mainEntity: taxon,
    about: taxon,
    author: org,
    publisher: {
      ...org,
      logo: {
        "@type": "ImageObject",
        url: "https://cdn.reptiles.ge/logo.webp",
      },
    },
    citation: raw.sources.map((source) =>
      source.url
        ? {
            "@type": "CreativeWork",
            name: source.name,
            url: source.url,
          }
        : {
            "@type": "CreativeWork",
            name: source.name,
          },
    ),
    inLanguage: locale,
  };

  const faqJsonLd =
    item.faq && item.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: item.faq.map((entry) => ({
            "@type": "Question",
            name: entry.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: entry.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <JsonLd data={faqJsonLd ? [jsonLd, faqJsonLd] : jsonLd} />
      <SpeciesProfile species={raw} related={related} />
    </>
  );
}
