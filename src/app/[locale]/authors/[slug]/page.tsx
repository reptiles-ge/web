import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import type { ContributorProfile } from "@/data/authors";

import { AuthorPage } from "@/components/AuthorPage";
import { ClientMessagesProvider } from "@/components/ClientMessagesProvider";
import { CoverImagePreload } from "@/components/CoverImagePreload";
import { JsonLd } from "@/components/JsonLd";
import { getPublishedNewsForCreditAuthor } from "@/data/news";
import { SPECIES_PROFILE_CLIENT_MESSAGE_NAMESPACES } from "@/i18n/clientMessages";
import { georgiaPlaceName, openGraphLocale } from "@/i18n/localeMeta";
import { type AppLocale, routing } from "@/i18n/routing";
import { getContributor, getContributors } from "@/lib/authorsApi";
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
} from "@/lib/creditAuthors";
import { AUTHOR_PORTRAIT_SIZES } from "@/lib/imageSizes";
import { kaMetaDescriptionOverride } from "@/lib/kaMetaDescriptionOverrides";
import { sentenceMetaDescription } from "@/lib/metaDescription";
import { INDEXABLE_ROBOTS } from "@/lib/robots";
import { absoluteUrl, localePath, siteConfig, siteEntityId } from "@/lib/site";
import {
  getCreditPhotoCatalog,
  getSpeciesCatalog,
} from "@/lib/speciesCatalogApi";
import { authorDateFields } from "@/lib/structuredDataDates";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamicParams = true;

export default async function AuthorRoute({ params }: Props) {
  const { locale: localeParam, slug } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }

  const locale = localeParam as AppLocale;
  setRequestLocale(locale);

  const author = await getContributor(slug, locale);
  if (!author) notFound();

  const [t, tShared, creditPhotos, catalog] = await Promise.all([
    getTranslations({ locale, namespace: "author" }),
    getTranslations({ locale, namespace: "groupHubShared" }),
    getCreditPhotoCatalog(),
    getSpeciesCatalog(locale),
  ]);
  const photos = getCreditAuthorPhotos(author, creditPhotos);
  const byId = new Map(catalog.map((item) => [item.id, item]));
  const name = author.name;
  const bio = author.bio;
  const url = creditAuthorUrl(locale, author.id);
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
        const species = byId.get(id);
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
    ...(await authorDateFields(author, locale)),
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
      robots: null,
      title: "Author",
    };
  }

  const locale = localeParam as AppLocale;
  const author = await getContributor(slug, locale);
  if (!author) {
    const t = await getTranslations({ locale, namespace: "author" });
    return {
      robots: null,
      title: t("notFound"),
    };
  }

  const [t, creditPhotos] = await Promise.all([
    getTranslations({ locale, namespace: "author" }),
    getCreditPhotoCatalog(),
  ]);
  const name = author.name;
  const photos = getCreditAuthorPhotos(author, creditPhotos);
  const title = creditAuthorMetaTitle(author, locale, name, t);
  const fallbackDescription = sentenceMetaDescription(
    (locale === "ka" ? undefined : author.metaDescription) ??
      author.bio ??
      t("metaDescription", {
        count: photos.length,
        name,
        species: getCreditAuthorSpeciesIds(photos).length,
      }),
  );
  const url = creditAuthorUrl(locale, author.id);
  const description = kaMetaDescriptionOverride(
    locale,
    new URL(url).pathname,
    fallbackDescription,
  );
  const portrait = creditAuthorPortraitImage(author);

  return {
    alternates: creditAuthorAlternates(locale, author.id),
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
      type: author.kind === "person" ? "profile" : "website",
      url,
    },
    robots: INDEXABLE_ROBOTS,
    title: { absolute: `${title} — ${siteConfig.titleBrand}` },
    twitter: {
      card: "summary",
      description,
      images: [portrait.url],
      title,
    },
  };
}

export async function generateStaticParams() {
  return creditAuthorStaticParams(await getContributors(routing.defaultLocale));
}

function creditAuthorMetaTitle(
  author: ContributorProfile,
  locale: AppLocale,
  name: string,
  t: Awaited<ReturnType<typeof getTranslations<"author">>>,
) {
  if (author.kind !== "person") return t("metaTitle", { name });
  return t("metaTitleWithRole", {
    name,
    role: t(`roles.${author.role}`).toLocaleLowerCase(locale),
  });
}
