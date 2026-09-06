import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { AuthorPage } from "@/components/AuthorPage";
import { CoverImagePreload } from "@/components/CoverImagePreload";
import { JsonLd } from "@/components/JsonLd";
import { creditAuthorBio, creditAuthorName } from "@/data/creditAuthors";
import { getSpeciesById } from "@/data/species";
import { georgiaPlaceName, openGraphLocale } from "@/i18n/localeMeta";
import { type AppLocale, routing } from "@/i18n/routing";
import {
  creditAuthorAlternates,
  creditAuthorStaticParams,
  creditAuthorUrl,
  getCreditAuthorPhotos,
  getCreditAuthorSpeciesIds,
  resolvePublishedCreditAuthor,
} from "@/lib/creditAuthors";
import { AUTHOR_PORTRAIT_SIZES } from "@/lib/imageSizes";
import {
  absoluteUrl,
  localePath,
  siteConfig,
  siteEntityId,
} from "@/lib/site";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamicParams = false;

export default async function AuthorRoute({ params }: Props) {
  const { locale: localeParam, slug } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }

  const locale = localeParam as AppLocale;
  setRequestLocale(locale);

  const author = resolvePublishedCreditAuthor(slug);
  if (!author) notFound();

  const t = await getTranslations({ locale, namespace: "author" });
  const tShared = await getTranslations({
    locale,
    namespace: "groupHubShared",
  });
  const photos = getCreditAuthorPhotos(author);
  const name = creditAuthorName(author, locale);
  const bio = creditAuthorBio(author, locale);
  const url = creditAuthorUrl(locale, author.slug);
  const speciesIds = getCreditAuthorSpeciesIds(photos);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        item: absoluteUrl(localePath(locale, "/")),
        name: tShared("breadcrumbHome"),
        position: 1,
      },
      {
        "@type": "ListItem",
        item: url,
        name,
        position: 2,
      },
    ],
  };

  const pageLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    about: [
      {
        "@type": "Place",
        name: georgiaPlaceName(locale),
      },
      ...speciesIds.flatMap((id) => {
        const species = getSpeciesById(id);
        if (!species) return [];
        return [
          {
            "@type": "Taxon" as const,
            name: species.scientificName,
            taxonRank: "Species",
          },
        ];
      }),
    ],
    description: bio ?? t("metaDescription", {
      count: photos.length,
      name,
      species: speciesIds.length,
    }),
    inLanguage: locale,
    isPartOf: { "@id": siteEntityId("website") },
    mainEntity: {
      "@type": "Person",
      description: bio,
      image: author.portraitSrc,
      name,
      url,
    },
    name,
    url,
  };

  return (
    <>
      <CoverImagePreload sizes={AUTHOR_PORTRAIT_SIZES} src={author.portraitSrc} />
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={pageLd} />
      <AuthorPage author={author} locale={locale} photos={photos} />
    </>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    return {
      robots: { follow: false, index: false },
      title: "Author",
    };
  }

  const locale = localeParam as AppLocale;
  const author = resolvePublishedCreditAuthor(slug);
  if (!author) {
    const t = await getTranslations({ locale, namespace: "author" });
    return {
      robots: { follow: false, index: false },
      title: t("notFound"),
    };
  }

  const t = await getTranslations({ locale, namespace: "author" });
  const name = creditAuthorName(author, locale);
  const photos = getCreditAuthorPhotos(author);
  const title = t("metaTitle", { name });
  const description =
    creditAuthorBio(author, locale) ??
    t("metaDescription", {
      count: photos.length,
      name,
      species: getCreditAuthorSpeciesIds(photos).length,
    });
  const url = creditAuthorUrl(locale, author.slug);

  return {
    alternates: creditAuthorAlternates(locale, author.slug),
    description,
    openGraph: {
      description,
      images: [
        {
          alt: title,
          type: "image/jpeg",
          url: author.portraitSrc,
        },
      ],
      locale: openGraphLocale(locale),
      siteName: siteConfig.name,
      title,
      type: "profile",
      url,
    },
    robots: {
      follow: true,
      index: true,
    },
    title: { absolute: `${title} — ${siteConfig.name}` },
    twitter: {
      card: "summary",
      description,
      images: [author.portraitSrc],
      title,
    },
  };
}

export function generateStaticParams() {
  return creditAuthorStaticParams();
}
