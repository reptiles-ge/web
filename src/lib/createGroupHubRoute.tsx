import { GroupHubPage } from "@/components/GroupHubPage";
import { JsonLd } from "@/components/JsonLd";
import { getCatalogSpeciesByGroup } from "@/data/speciesAtlas";
import { images } from "@/data/species";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { isPlaceholderMedia } from "@/lib/speciesContent";
import { routing, type AppLocale } from "@/i18n/routing";
import {
  GROUP_HUBS,
  type GroupHubId,
} from "@/lib/groupHubs";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  siteConfig,
  siteEntityId,
  speciesOgImageUrl,
  speciesPageUrl,
  openGraphJpeg,
} from "@/lib/site";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export function createGroupHubRoute(hubId: GroupHubId) {
  const hub = GROUP_HUBS[hubId];

  async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale: localeParam } = await params;
    if (!hasLocale(routing.locales, localeParam)) return {};

    const locale = localeParam as AppLocale;
    const t = await getTranslations({ locale, namespace: hub.messageKey });
    const title = t("metaTitle");
    const description = t("metaDescription");
    const url = absoluteUrl(localePath(locale, hub.path));
    const catalog = getCatalogSpeciesByGroup(hub.group);
    const hero = catalog.find((item) => item.id === hub.heroSpeciesId) ?? catalog[0];
    const ogImage = speciesOgImageUrl(hub.heroSpeciesId, hero?.image);

    return {
      title,
      description,
      keywords: t("keywords")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      alternates: localeAlternates(locale, hub.path),
      openGraph: {
        title,
        description,
        url,
        type: "website",
        locale: locale === "en" ? "en_US" : siteConfig.locale,
        siteName: siteConfig.name,
        images: [openGraphJpeg(ogImage, title)],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage],
      },
      robots: {
        index: true,
        follow: true,
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

    const t = await getTranslations({ locale, namespace: hub.messageKey });
    const tShared = await getTranslations({
      locale,
      namespace: "groupHubShared",
    });

    const url = absoluteUrl(localePath(locale, hub.path));
    const species = getCatalogSpeciesByGroup(hub.group).map((item) =>
      localizeSpecies(item, locale),
    );
    const hero =
      species.find((item) => item.id === hub.heroSpeciesId) ?? species[0];
    const heroSrc =
      hero?.image && !isPlaceholderMedia(hero.image) ? hero.image : images.hero;

    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: tShared("breadcrumbHome"),
          item: absoluteUrl(localePath(locale, "/")),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: t("breadcrumbCurrent"),
          item: url,
        },
      ],
    };

    const collectionLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: t("metaTitle"),
      description: t("metaDescription"),
      url,
      isPartOf: { "@id": siteEntityId("website") },
      author: { "@id": siteEntityId("organization") },
      publisher: { "@id": siteEntityId("organization") },
      about: {
        "@type": "Place",
        name: locale === "en" ? "Georgia" : "საქართველო",
      },
      inLanguage: locale,
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: species.length,
        itemListElement: species.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: speciesPageUrl(locale, item.id),
          name: `${item.commonName} (${item.scientificName})`,
        })),
      },
    };

    const faqLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: ([1, 2, 3, 4, 5] as const).map((n) => ({
        "@type": "Question",
        name: t(`faq${n}Q`),
        acceptedAnswer: {
          "@type": "Answer",
          text:
            hubId === "snakes" && n === 5
              ? t.markup("faq5A", {
                  bite: (chunks) => chunks,
                  yard: (chunks) => chunks,
                })
              : t(`faq${n}A`),
        },
      })),
    };

    return (
      <>
        <JsonLd data={breadcrumbLd} />
        <JsonLd data={collectionLd} />
        <JsonLd data={faqLd} />
        <GroupHubPage hubId={hubId} species={species} heroSrc={heroSrc} />
      </>
    );
  }

  return {
    generateStaticParams: () =>
      routing.locales.map((locale) => ({ locale })),
    generateMetadata,
    Page,
  };
}
