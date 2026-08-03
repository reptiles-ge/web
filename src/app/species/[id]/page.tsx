import { JsonLd } from "@/components/JsonLd";
import { SpeciesProfile } from "@/components/SpeciesProfile";
import { getSpeciesById, species } from "@/data/species";
import {
  absoluteImageUrl,
  absoluteUrl,
  siteConfig,
} from "@/lib/site";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return species.map((item) => ({ id: item.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const item = getSpeciesById(id);

  if (!item) {
    return {
      title: "სახეობა ვერ მოიძებნა",
      robots: { index: false, follow: false },
    };
  }

  const title = `${item.commonName} (${item.scientificName})`;
  const description = item.overview.slice(0, 160);
  const url = absoluteUrl(`/species/${item.id}`);

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
    alternates: {
      canonical: `/species/${item.id}`,
    },
    openGraph: {
      type: "article",
      locale: siteConfig.locale,
      url,
      siteName: siteConfig.name,
      title,
      description,
      images: [
        {
          url: absoluteUrl(`/species/${item.id}/opengraph-image`),
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
      images: [absoluteUrl(`/species/${item.id}/opengraph-image`)],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function SpeciesPage({ params }: PageProps) {
  const { id } = await params;
  const item = getSpeciesById(id);

  if (!item) {
    notFound();
  }

  const related = species.filter((entry) => entry.id !== item.id).slice(0, 3);
  const pageUrl = absoluteUrl(`/species/${item.id}`);
  const ogImage = absoluteUrl(`/species/${item.id}/opengraph-image`);
  const galleryImages = item.gallery
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
        url: absoluteUrl("/images/logo.png"),
      },
    },
    inLanguage: siteConfig.language,
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
      <SpeciesProfile species={item} related={related} />
    </>
  );
}
