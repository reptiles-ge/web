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
  cdnOgImageUrl,
  localeAlternates,
  localePath,
  siteConfig,
} from "@/lib/site";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

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
  const raw = getSpeciesById(id);

  if (!raw) {
    return {
      title: locale === "en" ? "Species not found" : "სახეობა ვერ მოიძებნა",
      robots: { index: false, follow: false },
    };
  }

  const item = localizeSpecies(raw, locale);
  const title = `${item.commonName} (${item.scientificName})`;
  const description = item.overview.slice(0, 160);
  const path = `/species/${item.id}`;
  const url = absoluteUrl(localePath(locale, path));

  return {
    title: item.commonName,
    description,
    keywords: [
      item.commonName,
      item.scientificName,
      item.genus,
      item.family,
      item.location,
      "ქვეწარმავლები",
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
      images: [
        {
          url: cdnOgImageUrl(item.id),
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
      images: [cdnOgImageUrl(item.id)],
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
  const ogImage = cdnOgImageUrl(item.id);
  const galleryImages = item.gallery
    .map((photo) => photo.src)
    .filter((src) => src !== item.image)
    .slice(0, 3)
    .map(absoluteImageUrl);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${item.commonName} (${item.scientificName})`,
    description: item.description,
    image: [ogImage, ...galleryImages],
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: absoluteUrl("/"),
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: absoluteUrl("/"),
      logo: {
        "@type": "ImageObject",
        url: "https://cdn.reptiles.ge/logo.webp",
      },
    },
    inLanguage: locale,
    about: {
      "@type": "Taxon",
      name: item.scientificName,
      alternateName: item.commonName,
      taxonRank: "Species",
      parentTaxon: {
        "@type": "Taxon",
        name: item.genus,
        taxonRank: "Genus",
      },
    },
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
