import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { AuthorPage } from "@/components/AuthorPage";
import { ClientMessagesProvider } from "@/components/ClientMessagesProvider";
import { CoverImagePreload } from "@/components/CoverImagePreload";
import { JsonLd } from "@/components/JsonLd";
import {
  type CreditAuthor,
  creditAuthorBio,
  creditAuthorKind,
  creditAuthorName,
} from "@/data/creditAuthors";
import { getPublishedNewsForCreditAuthor } from "@/data/news";
import { getSpeciesById } from "@/data/species";
import { SPECIES_PROFILE_CLIENT_MESSAGE_NAMESPACES } from "@/i18n/clientMessages";
import { georgiaPlaceName, openGraphLocale } from "@/i18n/localeMeta";
import { type AppLocale, routing } from "@/i18n/routing";
import {
  creditAuthorAlternates,
  creditAuthorEntityJsonLd,
  creditAuthorIndexUrl,
  creditAuthorPageSchemaType,
  creditAuthorPortraitImage,
  creditAuthorStaticParams,
  creditAuthorUrl,
  getCreditAuthorPhotos,
  getCreditAuthorSpeciesIds,
  resolvePublishedCreditAuthor,
} from "@/lib/creditAuthors";
import { AUTHOR_PORTRAIT_SIZES } from "@/lib/imageSizes";
import { kaMetaDescriptionOverride } from "@/lib/kaMetaDescriptionOverrides";
import { sentenceMetaDescription } from "@/lib/metaDescription";
import { absoluteUrl, localePath, siteConfig, siteEntityId } from "@/lib/site";
import { authorDateFields } from "@/lib/structuredDataDates";

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
  const indexUrl = creditAuthorIndexUrl(locale);
  const speciesIds = getCreditAuthorSpeciesIds(photos);
  const relatedNews = getPublishedNewsForCreditAuthor(author, locale);

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
        item: indexUrl,
        name: t("index.breadcrumb"),
        position: 2,
      },
      {
        "@type": "ListItem",
        item: url,
        name,
        position: 3,
      },
    ],
  };

  const pageLd = {
    "@context": "https://schema.org",
    "@type": creditAuthorPageSchemaType(author),
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
    description:
      bio ??
      t("metaDescription", {
        count: photos.length,
        name,
        species: speciesIds.length,
      }),
    ...authorDateFields(author.slug),
    inLanguage: locale,
    isPartOf: { "@id": siteEntityId("website") },
    mainEntity: creditAuthorEntityJsonLd(author, locale, {
      description: bio,
      jobTitle: author.jobTitle ? t(`jobTitles.${author.jobTitle}`) : undefined,
    }),
    name,
    url,
  };

  return (
    <>
      <CoverImagePreload
        sizes={AUTHOR_PORTRAIT_SIZES}
        src={author.portraitSrc}
      />
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={pageLd} />
      <ClientMessagesProvider
        locale={locale}
        namespaces={SPECIES_PROFILE_CLIENT_MESSAGE_NAMESPACES}
      >
        <AuthorPage
          author={author}
          locale={locale}
          photos={photos}
          relatedNews={relatedNews}
        />
      </ClientMessagesProvider>
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
  const title = creditAuthorMetaTitle(author, locale, name, t);
  const fallbackDescription = sentenceMetaDescription(
    (locale === "ka" ? undefined : author.metaDescription?.[locale]) ??
      creditAuthorBio(author, locale) ??
      t("metaDescription", {
        count: photos.length,
        name,
        species: getCreditAuthorSpeciesIds(photos).length,
      }),
  );
  const url = creditAuthorUrl(locale, author.slug);
  const description = kaMetaDescriptionOverride(
    locale,
    new URL(url).pathname,
    fallbackDescription,
  );
  const portrait = creditAuthorPortraitImage(author);

  return {
    alternates: creditAuthorAlternates(locale, author.slug),
    description,
    openGraph: {
      description,
      images: [
        {
          alt: title,
          type: portrait.type,
          url: portrait.url,
        },
      ],
      locale: openGraphLocale(locale),
      siteName: siteConfig.name,
      title,
      type: creditAuthorKind(author) === "person" ? "profile" : "website",
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
      images: [portrait.url],
      title,
    },
  };
}

export function generateStaticParams() {
  return creditAuthorStaticParams();
}

function creditAuthorMetaTitle(
  author: CreditAuthor,
  locale: AppLocale,
  name: string,
  t: Awaited<ReturnType<typeof getTranslations<"author">>>,
) {
  if (creditAuthorKind(author) !== "person") return t("metaTitle", { name });
  return t("metaTitleWithRole", {
    name,
    role: t(`roles.${author.role}`).toLocaleLowerCase(locale),
  });
}
