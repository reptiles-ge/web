import { ClusterGuidePage } from "@/components/ClusterGuidePage";
import { LizardComparePage } from "@/components/LizardComparePage";
import { LizardIdentifyPage } from "@/components/LizardIdentifyPage";
import { LizardSpeciesIndexPage } from "@/components/LizardSpeciesIndexPage";
import { SnakeBitePage } from "@/components/SnakeBitePage";
import { SnakeIdentifyPage } from "@/components/SnakeIdentifyPage";
import { SnakeLargestPage } from "@/components/SnakeLargestPage";
import { SnakeRangePage } from "@/components/SnakeRangePage";
import { SnakeSpeciesIndexPage } from "@/components/SnakeSpeciesIndexPage";
import { JsonLd } from "@/components/JsonLd";
import { getCatalogSpecies } from "@/data/species";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { routing, type AppLocale } from "@/i18n/routing";
import {
  CLUSTER_GUIDES,
  type ClusterGuideId,
  type ClusterGuideViewProps,
} from "@/lib/clusterGuides";
import { GROUP_HUBS } from "@/lib/groupHubs";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  siteConfig,
  speciesOgImageUrl,
  speciesPageUrl,
} from "@/lib/site";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import type { ComponentType } from "react";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

const CLUSTER_PAGES: Record<
  ClusterGuideId,
  ComponentType<ClusterGuideViewProps>
> = {
  "amphibian-frogs": ClusterGuidePage,
  "snake-index": SnakeSpeciesIndexPage,
  "snake-identify": SnakeIdentifyPage,
  "snake-bite": SnakeBitePage,
  "snake-range": SnakeRangePage,
  "snake-largest": SnakeLargestPage,
  "lizard-index": LizardSpeciesIndexPage,
  "lizard-identify": LizardIdentifyPage,
  "lizard-glass": LizardComparePage,
};

export function createClusterGuideRoute(guideId: ClusterGuideId) {
  const guide = CLUSTER_GUIDES[guideId];
  const parent = GROUP_HUBS[guide.parentHub];
  const PageView = CLUSTER_PAGES[guideId];

  async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale: localeParam } = await params;
    if (!hasLocale(routing.locales, localeParam)) return {};

    const locale = localeParam as AppLocale;
    const t = await getTranslations({ locale, namespace: guide.messageKey });
    const title = t("metaTitle");
    const description = t("metaDescription");
    const url = absoluteUrl(localePath(locale, guide.pathname));
    const catalog = getCatalogSpecies().filter(guide.matches);
    const hero =
      catalog.find((item) => item.id === guide.heroSpeciesId) ?? catalog[0];
    const ogImage = speciesOgImageUrl(guide.heroSpeciesId, hero?.image);

    return {
      title,
      description,
      keywords: t("keywords")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      alternates: localeAlternates(locale, guide.pathname),
      openGraph: {
        title,
        description,
        url,
        type: "website",
        locale: locale === "en" ? "en_US" : siteConfig.locale,
        siteName: siteConfig.name,
        images: [
          {
            url: ogImage,
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

    const t = await getTranslations({ locale, namespace: guide.messageKey });
    const tShared = await getTranslations({
      locale,
      namespace: "groupHubShared",
    });
    const tParent = await getTranslations({
      locale,
      namespace: parent.messageKey,
    });

    const url = absoluteUrl(localePath(locale, guide.pathname));
    const species = getCatalogSpecies()
      .filter(guide.matches)
      .map((item) => localizeSpecies(item, locale));
    const hero =
      species.find((item) => item.id === guide.heroSpeciesId) ?? species[0];
    const heroSrc = hero?.image ?? "";

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
          name: tParent("breadcrumbCurrent"),
          item: absoluteUrl(localePath(locale, parent.path)),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: t("breadcrumbCurrent"),
          item: url,
        },
      ],
    };

    const pageLd =
      guide.schema === "collection"
        ? {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: t("metaTitle"),
            description: t("metaDescription"),
            url,
            isPartOf: {
              "@type": "WebSite",
              name: siteConfig.name,
              url: absoluteUrl("/"),
            },
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
          }
        : {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: t("metaTitle"),
            description: t("metaDescription"),
            url,
            isPartOf: {
              "@type": "WebSite",
              name: siteConfig.name,
              url: absoluteUrl("/"),
            },
            about: {
              "@type": "Place",
              name: locale === "en" ? "Georgia" : "საქართველო",
            },
            inLanguage: locale,
          };

    const faqNumbers = Array.from(
      { length: guide.faqCount },
      (_, index) => index + 1,
    );
    const faqLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqNumbers.map((n) => ({
        "@type": "Question",
        name: t(`faq${n}Q` as Parameters<typeof t>[0]),
        acceptedAnswer: {
          "@type": "Answer",
          text: t(`faq${n}A` as Parameters<typeof t>[0]),
        },
      })),
    };

    return (
      <>
        <JsonLd data={breadcrumbLd} />
        <JsonLd data={pageLd} />
        <JsonLd data={faqLd} />
        <PageView guideId={guideId} species={species} heroSrc={heroSrc} />
      </>
    );
  }

  return {
    generateStaticParams: () => routing.locales.map((locale) => ({ locale })),
    generateMetadata,
    Page,
  };
}
