import { JsonLd } from "@/components/JsonLd";
import { RegionProfile } from "@/components/RegionProfile";
import {
  getRegionById,
  getRegionSpecies,
  localizeRegionText,
  regions,
} from "@/data/regions";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { routing, type AppLocale } from "@/i18n/routing";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  siteConfig,
} from "@/lib/site";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    regions.map((region) => ({ locale, id: region.id })),
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: localeParam, id } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    return {
      title: "Region not found",
      robots: { index: false, follow: false },
    };
  }

  const locale = localeParam as AppLocale;
  const t = await getTranslations({ locale, namespace: "regions" });
  const region = getRegionById(id);

  if (!region) {
    return {
      title: t("notFound"),
      robots: { index: false, follow: false },
    };
  }

  const name = localizeRegionText(region.name, locale);
  const nameIn = localizeRegionText(region.nameIn, locale);
  const title = t("regionMetaTitle", { name, nameIn });
  const description = t("regionMetaDescription", {
    name,
    nameIn,
    count: region.speciesIds.length,
  });
  const path = `/regions/${region.id}`;
  const url = absoluteUrl(localePath(locale, path));

  return {
    title,
    description,
    keywords: [
      name,
      locale === "en" ? "Georgia reptiles" : "საქართველოს ქვეწარმავლები",
      locale === "en" ? "snakes" : "გველები",
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
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RegionPage({ params }: PageProps) {
  const { locale: localeParam, id } = await params;
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
  const name = localizeRegionText(region.name, locale);
  const nameIn = localizeRegionText(region.nameIn, locale);
  const description = localizeRegionText(region.description, locale);
  const pageUrl = absoluteUrl(localePath(locale, `/regions/${region.id}`));
  const species = getRegionSpecies(region).map((item) =>
    localizeSpecies(item, locale),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("regionMetaTitle", { name, nameIn }),
    description: t("regionMetaDescription", {
      name,
      nameIn,
      count: species.length,
    }),
    url: pageUrl,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: absoluteUrl("/"),
    },
    about: {
      "@type": "Place",
      name,
      description,
      containedInPlace: {
        "@type": "Country",
        name: locale === "en" ? "Georgia" : "საქართველო",
      },
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: species.length,
      itemListElement: species.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(localePath(locale, `/species/${item.id}`)),
        name: `${item.commonName} (${item.scientificName})`,
      })),
    },
    inLanguage: locale,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: siteConfig.name,
        item: absoluteUrl(localePath(locale, "/")),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("metaTitle"),
        item: absoluteUrl(localePath(locale, "/regions")),
      },
      {
        "@type": "ListItem",
        position: 3,
        name,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <JsonLd data={[jsonLd, breadcrumbJsonLd]} />
      <RegionProfile region={region} />
    </>
  );
}
