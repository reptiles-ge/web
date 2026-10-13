import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ClientMessagesProvider } from "@/components/ClientMessagesProvider";
import { ContentAttribution } from "@/components/ContentAttribution";
import { CoverImagePreload } from "@/components/CoverImagePreload";
import { JsonLd } from "@/components/JsonLd";
import { NewsRelatedBlock } from "@/components/NewsRelatedBlock";
import { RegionProfile } from "@/components/RegionProfile";
import { getPublishedNewsForRegion } from "@/data/news";
import { getRegionContent } from "@/data/regionContent";
import { getRegionHeroImage } from "@/data/regionImages";
import {
  getRegionById,
  getRegionSpecies,
  isRegionCardVenomous,
  localizeRegionText,
  localizeRegionTextIfPresent,
  regions,
  toRegionSpeciesCard,
} from "@/data/regions";
import {
  georgiaPlaceName,
  georgiaReptilesLabel,
  openGraphLocale,
  pickLocalized,
} from "@/i18n/localeMeta";
import { type AppLocale, routing } from "@/i18n/routing";
import { isLocalAdminEnabled } from "@/lib/adminAccess";
import { faqPageJsonLd } from "@/lib/faqJsonLd";
import { kaMetaDescriptionOverride } from "@/lib/kaMetaDescriptionOverrides";
import { speciesItemListLd } from "@/lib/pageStructuredData";
import { INDEXABLE_ROBOTS } from "@/lib/robots";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  openGraphJpeg,
  siteConfig,
  siteEntityId,
} from "@/lib/site";
import { regionHref } from "@/lib/speciesRoutes";
import { regionDateFields } from "@/lib/structuredDataDates";

type PageProps = {
  params: Promise<{ id: string; locale: string }>;
};

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id, locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    return {
      robots: null,
      title: "Region not found",
    };
  }

  const locale = localeParam as AppLocale;
  const t = await getTranslations({ locale, namespace: "regions" });
  const region = getRegionById(id);

  if (!region) {
    return {
      robots: null,
      title: t("notFound"),
    };
  }

  const name = localizeRegionText(region.name, locale);
  const nameIn = localizeRegionText(region.nameIn, locale);
  const content = getRegionContent(region.id);
  const titleArgs = {
    name: localizeRegionText(content.titleName ?? region.name, locale),
    nameIn: localizeRegionText(content.titleNameIn ?? region.nameIn, locale),
  };
  const fullTitle = t("regionMetaTitle", titleArgs);
  const title =
    fullTitle.length <= 60 ? fullTitle : t("regionMetaTitleShort", titleArgs);
  const fallbackDescription =
    (content.metaDescription
      ? localizeRegionTextIfPresent(content.metaDescription, locale)
      : null) ??
    t("regionMetaDescription", {
      count: region.speciesIds.length,
      name,
      nameIn,
    });
  const path = regionHref(region.id);
  const publicPath = localePath(locale, path);
  const description = kaMetaDescriptionOverride(
    locale,
    publicPath,
    fallbackDescription,
  );
  const ogImageSrc = getRegionHeroImage(region.id);
  const ogImage = openGraphJpeg(ogImageSrc, title);

  return {
    alternates: localeAlternates(locale, path),
    description,
    keywords: [
      name,
      nameIn,
      georgiaReptilesLabel(locale),
      pickLocalized(
        {
          en: "regions of Georgia",
          ka: "საქართველოს რეგიონები",
          ru: "регионы Грузии",
          tr: "Gürcistan bölgeleri",
        },
        locale,
      ),
      localizeRegionTextIfPresent(content.biome, locale),
    ].filter((item): item is string => Boolean(item)),
    openGraph: {
      description,
      images: [ogImage],
      locale: openGraphLocale(locale),
      siteName: siteConfig.name,
      title,
      type: "article",
      url: absoluteUrl(publicPath),
    },
    robots: INDEXABLE_ROBOTS,
    title: { absolute: title },
    twitter: {
      card: "summary_large_image",
      description,
      images: [ogImageSrc],
      title,
    },
  };
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    regions.map((region) => ({ id: region.id, locale })),
  );
}

export default async function RegionPage({ params }: PageProps) {
  const { id, locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }

  const locale = localeParam as AppLocale;
  setRequestLocale(locale);

  const region = getRegionById(id);
  if (!region) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "regions" });
  const content = getRegionContent(region.id);
  const name = localizeRegionText(region.name, locale);
  const nameIn = localizeRegionText(region.nameIn, locale);
  const overview =
    localizeRegionTextIfPresent(content.overview, locale) ?? name;
  const pageUrl = absoluteUrl(localePath(locale, regionHref(region.id)));
  const dates = regionDateFields(region.id, locale);
  const species = getRegionSpecies(region).map((item) =>
    toRegionSpeciesCard(item, locale),
  );
  const venomous = species.filter(isRegionCardVenomous);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    about: {
      "@type": "Place",
      containedInPlace: {
        "@type": "Country",
        name: georgiaPlaceName(locale),
      },
      description: overview,
      name,
    },
    author: { "@id": siteEntityId("organization") },
    ...regionDateFields(region.id, locale),
    description: overview,
    inLanguage: locale,
    isPartOf: { "@id": siteEntityId("website") },
    mainEntity: speciesItemListLd(locale, species),
    name: t("regionMetaTitle", { name, nameIn }),
    publisher: { "@id": siteEntityId("organization") },
    url: pageUrl,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        item: absoluteUrl(localePath(locale, "/")),
        name: t("breadcrumbHome"),
        position: 1,
      },
      {
        "@type": "ListItem",
        item: absoluteUrl(localePath(locale, "/regions")),
        name: t("allRegions"),
        position: 2,
      },
      {
        "@type": "ListItem",
        item: pageUrl,
        name,
        position: 3,
      },
    ],
  };

  const faqItems = content.faq.flatMap((entry) => {
    const question = localizeRegionTextIfPresent(entry.question, locale);
    const answer = localizeRegionTextIfPresent(entry.answer, locale);
    if (!question || !answer) return [];
    return [{ answer, question }];
  });

  const faqJsonLd = faqPageJsonLd(faqItems);

  return (
    <>
      <CoverImagePreload sizes="100vw" src={getRegionHeroImage(region.id)} />
      <JsonLd
        data={
          faqJsonLd
            ? [jsonLd, breadcrumbJsonLd, faqJsonLd]
            : [jsonLd, breadcrumbJsonLd]
        }
      />
      <ClientMessagesProvider
        locale={locale}
        namespaces={["card", "danger", "groupHubShared", "map", "regions"]}
      >
        <RegionProfile
          attribution={
            <ContentAttribution
              locale={locale}
              publishedAt={dates.datePublished}
              updatedAt={dates.dateModified}
            />
          }
          editable={locale === "ka" && isLocalAdminEnabled()}
          region={region}
          species={species}
          venomous={venomous}
        />
      </ClientMessagesProvider>
      <NewsRelatedBlock
        articles={getPublishedNewsForRegion(region.id, locale)}
        locale={locale}
      />
    </>
  );
}
