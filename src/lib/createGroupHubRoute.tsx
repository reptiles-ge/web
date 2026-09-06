import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { CoverImagePreload } from "@/components/CoverImagePreload";
import { GroupHubPage } from "@/components/GroupHubPage";
import { JsonLd } from "@/components/JsonLd";
import { NewsRelatedBlock } from "@/components/NewsRelatedBlock";
import { getPublishedNewsForHub } from "@/data/news";
import { images } from "@/data/speciesMedia";
import { getCatalogSpeciesByGroup } from "@/data/speciesAtlas";
import { georgiaPlaceName, openGraphLocale } from "@/i18n/localeMeta";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { type AppLocale, routing } from "@/i18n/routing";
import { GROUP_HUBS, type GroupHubId } from "@/lib/groupHubs";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  openGraphJpeg,
  siteConfig,
  siteEntityId,
  speciesOgImageUrl,
  speciesPageUrl,
} from "@/lib/site";
import { isPlaceholderMedia } from "@/lib/speciesContent";

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
    const hero =
      catalog.find((item) => item.id === hub.heroSpeciesId) ?? catalog[0];
    const ogImage = speciesOgImageUrl(hub.heroSpeciesId, hero?.image);

    return {
      alternates: localeAlternates(locale, hub.path),
      description,
      keywords: t("keywords")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      openGraph: {
        description,
        images: [openGraphJpeg(ogImage, title)],
        locale: openGraphLocale(locale),
        siteName: siteConfig.name,
        title,
        type: "website",
        url,
      },
      robots: {
        follow: true,
        index: true,
      },
      title,
      twitter: {
        card: "summary_large_image",
        description,
        images: [ogImage],
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
          item: absoluteUrl(localePath(locale, "/")),
          name: tShared("breadcrumbHome"),
          position: 1,
        },
        {
          "@type": "ListItem",
          item: url,
          name: t("breadcrumbCurrent"),
          position: 2,
        },
      ],
    };

    const collectionLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      about: {
        "@type": "Place",
        name: georgiaPlaceName(locale),
      },
      author: { "@id": siteEntityId("organization") },
      description: t("metaDescription"),
      inLanguage: locale,
      isPartOf: { "@id": siteEntityId("website") },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: species.map((item, index) => ({
          "@type": "ListItem",
          name: `${item.commonName} (${item.scientificName})`,
          position: index + 1,
          url: speciesPageUrl(locale, item.id),
        })),
        numberOfItems: species.length,
      },
      name: t("metaTitle"),
      publisher: { "@id": siteEntityId("organization") },
      url,
    };

    const faqIndices =
      hubId === "turtles"
        ? ([1, 2, 3, 4, 5, 6, 7, 8] as const)
        : ([1, 2, 3, 4, 5] as const);

    const mainEntity: Array<{
      "@type": "Question";
      acceptedAnswer: { "@type": "Answer"; text: string };
      name: string;
    }> = [];
    for (const n of faqIndices) {
      if (!t.has(`faq${n}Q`)) continue;
      mainEntity.push({
        "@type": "Question",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            hubId === "snakes" && n === 5
              ? t.markup("faq5A", {
                  bite: (chunks) => chunks,
                  yard: (chunks) => chunks,
                })
              : hubId === "turtles" && n === 4
                ? t.markup("faq4A", {
                    identify: (chunks) => chunks,
                  })
                : t(`faq${n}A`),
        },
        name: t(`faq${n}Q`),
      });
    }

    const faqLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity,
    };

    return (
      <>
        <CoverImagePreload sizes="100vw" src={heroSrc} />
        <JsonLd data={breadcrumbLd} />
        <JsonLd data={collectionLd} />
        <JsonLd data={faqLd} />
        <GroupHubPage heroSrc={heroSrc} hubId={hubId} species={species} />
        <NewsRelatedBlock
          articles={getPublishedNewsForHub(hubId)}
          locale={locale}
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
