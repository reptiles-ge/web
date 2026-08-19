import { JsonLd } from "@/components/JsonLd";
import { SpeciesProfile } from "@/components/SpeciesProfile";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { getPathname } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import type { GroupHubId } from "@/lib/groupHubs";
import { getHubIndexTitleKey } from "@/lib/clusterGuides";
import { getRelatedSpecies } from "@/lib/speciesRelated";
import {
  buildSpeciesBreadcrumbs,
  getSpeciesParentHub,
} from "@/lib/speciesBreadcrumbs";
import {
  getSpeciesPublicSlug,
  resolveSpeciesInHub,
  speciesHref,
  speciesStaticParams,
} from "@/lib/speciesRoutes";
import {
  absoluteUrl,
  localePath,
  organizationJsonLd,
  siteConfig,
  siteEntityId,
  speciesAlternates,
  speciesOgImageUrl,
  speciesPageUrl,
} from "@/lib/site";
import { getSpeciesAtlasMeta, isVenomousDanger } from "@/data/speciesAtlas";
import { isPlaceholderBody } from "@/lib/speciesContent";
import {
  speciesMetaDescription,
  speciesMetaTitle,
  speciesTitleIntentKey,
} from "@/lib/speciesMeta";
import { galleryImageObjects } from "@/lib/photoMeta";
import {
  speciesAliasKeywords,
  speciesJsonLdKeywords,
  speciesSeoKeywords,
} from "@/lib/seoKeywords";
import { SPECIES_SECTION_IDS } from "@/lib/toc";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function createSpeciesHubRoute(hubId: GroupHubId) {
  function generateStaticParams() {
    return speciesStaticParams(hubId);
  }

  async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale: localeParam, slug } = await params;
    if (!hasLocale(routing.locales, localeParam)) {
      return {
        title: "Species not found",
        robots: { index: false, follow: false },
      };
    }

    const locale = localeParam as AppLocale;
    const t = await getTranslations({ locale, namespace: "speciesMeta" });
    const raw = resolveSpeciesInHub(hubId, slug);

    if (!raw) {
      return {
        title: t("notFound"),
        robots: { index: false, follow: false },
      };
    }

    const item = localizeSpecies(raw, locale);
    const group = getSpeciesAtlasMeta(raw.id).group;
    const title = speciesMetaTitle(
      item.commonName,
      item.scientificName,
      t(speciesTitleIntentKey(group, raw.danger)),
    );
    const description = isPlaceholderBody(item.overview)
      ? group === "snake" && isVenomousDanger(raw.danger)
        ? t("descriptionVenomous", {
            name: item.commonName,
            scientific: item.scientificName,
          })
        : t("descriptionDefault", {
            name: item.commonName,
            scientific: item.scientificName,
          })
      : speciesMetaDescription(item.overview);
    const url = speciesPageUrl(locale, item.id);
    const keywords = speciesSeoKeywords(item, locale);

    return {
      title: {
        absolute: title,
      },
      description,
      keywords,
      alternates: speciesAlternates(locale, item.id),
      openGraph: {
        type: "article",
        locale: locale === "en" ? "en_US" : siteConfig.locale,
        url,
        siteName: siteConfig.name,
        title,
        description,
        modifiedTime: raw.updatedAt,
        images: [
          {
            url: speciesOgImageUrl(item.id, item.image),
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
        images: [speciesOgImageUrl(item.id, item.image)],
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  }

  async function Page({ params }: PageProps) {
    const { locale: localeParam, slug } = await params;
    if (!hasLocale(routing.locales, localeParam)) {
      notFound();
    }

    const locale = localeParam as AppLocale;
    setRequestLocale(locale);

    const raw = resolveSpeciesInHub(hubId, slug);
    if (!raw) {
      notFound();
    }

    const expectedSlug = getSpeciesPublicSlug(raw.id, locale);
    if (slug !== expectedSlug) {
      permanentRedirect(
        getPathname({ locale, href: speciesHref(raw.id, locale) }),
      );
    }

    const item = localizeSpecies(raw, locale);
    const related = getRelatedSpecies(raw.id);
    const tProfile = await getTranslations({ locale, namespace: "profile" });
    const tHubs = await getTranslations({
      locale,
      namespace: "groupHubShared",
    });
    const parent = getSpeciesParentHub(item);
    const groupLabel = parent.hubId
      ? tHubs(`hubs.${parent.hubId}`)
      : tHubs("hubs.snakes");
    const breadcrumbCrumbs = buildSpeciesBreadcrumbs({
      species: item,
      homeLabel: tProfile("breadcrumbHome"),
      venomousLabel: tProfile("breadcrumbVenomous"),
      groupLabel,
      indexLabel: tHubs(getHubIndexTitleKey(parent.hubId)),
    });

    const pageUrl = speciesPageUrl(locale, item.id);
    const ogImage = speciesOgImageUrl(item.id, item.image);
    const photoObjects = galleryImageObjects(item.gallery, item, locale);
    const ogImageObject = {
      "@type": "ImageObject",
      contentUrl: ogImage,
      url: ogImage,
      name: `${item.commonName} (${item.scientificName})`,
    };

    const sameAs = raw.sources
      .map((source) => source.url)
      .filter((url): url is string => Boolean(url));

    const aliases = speciesAliasKeywords(item.id, locale);
    const taxon = {
      "@type": "Taxon",
      name: item.scientificName,
      alternateName: [item.commonName, ...aliases].filter(
        (name, index, list) => list.indexOf(name) === index,
      ),
      taxonRank: "Species",
      parentTaxon: {
        "@type": "Taxon",
        name: item.genus,
        taxonRank: "Genus",
      },
      ...(sameAs.length > 0 ? { sameAs } : {}),
    };

    const org = organizationJsonLd();

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${item.commonName} (${item.scientificName})`,
      description: item.description,
      keywords: speciesJsonLdKeywords(item, locale),
      image: [ogImageObject, ...photoObjects],
      associatedMedia: photoObjects,
      dateModified: raw.updatedAt,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": pageUrl,
      },
      mainEntity: taxon,
      about: taxon,
      author: { "@id": siteEntityId("organization") },
      publisher: org,
      citation: raw.sources.map((source) =>
        source.url
          ? {
              "@type": "CreativeWork",
              name: source.name,
              url: source.url,
            }
          : {
              "@type": "CreativeWork",
              name: source.name,
            },
      ),
      inLanguage: locale,
    };

    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbCrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: crumb.href
          ? absoluteUrl(localePath(locale, crumb.href))
          : pageUrl,
      })),
    };

    const galleryLd =
      photoObjects.length > 0
        ? {
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            name: `${item.commonName} ${tProfile("galleryTitle")}`,
            url: `${pageUrl}#${SPECIES_SECTION_IDS.gallery}`,
            about: taxon,
            inLanguage: locale,
            associatedMedia: photoObjects,
          }
        : null;

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
        <JsonLd
          data={[jsonLd, breadcrumbLd, galleryLd, faqJsonLd].filter(
            (entry): entry is NonNullable<typeof entry> => Boolean(entry),
          )}
        />
        <SpeciesProfile species={raw} related={related} />
      </>
    );
  }

  return {
    generateStaticParams,
    generateMetadata,
    Page,
  };
}
