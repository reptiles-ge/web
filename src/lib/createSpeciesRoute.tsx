import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound, permanentRedirect } from "next/navigation";

import type { GroupHubId } from "@/lib/groupHubs";

import { CoverImagePreload } from "@/components/CoverImagePreload";
import { JsonLd } from "@/components/JsonLd";
import { NewsRelatedBlock } from "@/components/NewsRelatedBlock";
import { SpeciesProfile } from "@/components/SpeciesProfile";
import { getPublishedNewsForSpecies } from "@/data/news";
import { getSpeciesAtlasMeta } from "@/data/speciesAtlas";
import { openGraphLocale } from "@/i18n/localeMeta";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { getPathname } from "@/i18n/navigation";
import { type AppLocale, routing } from "@/i18n/routing";
import { getHubIndexTitleKey } from "@/lib/clusterGuides";
import { galleryImageObjects } from "@/lib/photoMeta";
import {
  speciesAliasKeywords,
  speciesJsonLdKeywords,
  speciesSeoKeywords,
} from "@/lib/seoKeywords";
import {
  absoluteUrl,
  localePath,
  openGraphJpeg,
  organizationJsonLd,
  siteConfig,
  siteEntityId,
  speciesAlternates,
  speciesOgImageUrl,
  speciesPageUrl,
} from "@/lib/site";
import {
  buildSpeciesBreadcrumbs,
  getSpeciesParentHub,
} from "@/lib/speciesBreadcrumbs";
import { getSpeciesHeroSources, isPlaceholderBody } from "@/lib/speciesContent";
import {
  speciesFallbackDescriptionKey,
  speciesMetaDescription,
  speciesPageMetaTitle,
  speciesTitleIntentKey,
} from "@/lib/speciesMeta";
import { getRelatedSpecies } from "@/lib/speciesRelated";
import {
  getSpeciesPublicSlug,
  resolveSpeciesInHub,
  speciesHref,
  speciesStaticParams,
} from "@/lib/speciesRoutes";
import { SPECIES_SECTION_IDS } from "@/lib/toc";

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
        robots: { follow: false, index: false },
        title: "Species not found",
      };
    }

    const locale = localeParam as AppLocale;
    const t = await getTranslations({ locale, namespace: "speciesMeta" });
    const raw = resolveSpeciesInHub(hubId, slug);

    if (!raw) {
      return {
        robots: { follow: false, index: false },
        title: t("notFound"),
      };
    }

    const item = localizeSpecies(raw, locale);
    const group = getSpeciesAtlasMeta(raw.id).group;
    const title = speciesPageMetaTitle(
      raw.id,
      locale,
      item.commonName,
      item.scientificName,
      t(speciesTitleIntentKey(group, raw.danger)),
    );
    const description = isPlaceholderBody(item.overview)
      ? t(speciesFallbackDescriptionKey(group, raw.danger), {
          name: item.commonName,
          scientific: item.scientificName,
        })
      : speciesMetaDescription(item.overview);
    const url = speciesPageUrl(locale, item.id);
    const keywords = speciesSeoKeywords(item, locale);

    const ogImage = speciesOgImageUrl(item.id, item.image);
    const ogImageTag = openGraphJpeg(ogImage, title);

    return {
      alternates: speciesAlternates(locale, item.id),
      description,
      keywords,
      openGraph: {
        description,
        images: [ogImageTag],
        locale: openGraphLocale(locale),
        modifiedTime: raw.updatedAt,
        siteName: siteConfig.name,
        title,
        type: "article",
        url,
      },
      robots: {
        follow: true,
        index: true,
      },
      title: {
        absolute: title,
      },
      twitter: {
        card: "summary_large_image",
        description,
        images: [ogImage],
        title,
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
        getPathname({ href: speciesHref(raw.id, locale), locale }),
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
      groupLabel,
      homeLabel: tProfile("breadcrumbHome"),
      indexLabel: tHubs(getHubIndexTitleKey(parent.hubId)),
      species: item,
      venomousLabel: tProfile("breadcrumbVenomous"),
    });

    const pageUrl = speciesPageUrl(locale, item.id);
    const ogImage = speciesOgImageUrl(item.id, item.image);
    const photoObjects = galleryImageObjects(item.gallery, item, locale);
    const ogImageObject = {
      "@type": "ImageObject",
      contentUrl: ogImage,
      name: `${item.commonName} (${item.scientificName})`,
      url: ogImage,
    };

    const sameAs = raw.sources
      .map((source) => source.url)
      .filter((url): url is string => Boolean(url));

    const aliases = speciesAliasKeywords(item.id, locale);
    const taxon = {
      "@type": "Taxon",
      alternateName: [item.commonName, ...aliases].filter(
        (name, index, list) => list.indexOf(name) === index,
      ),
      name: item.scientificName,
      parentTaxon: {
        "@type": "Taxon",
        name: item.genus,
        taxonRank: "Genus",
      },
      taxonRank: "Species",
      ...(sameAs.length > 0 ? { sameAs } : {}),
    };

    const org = organizationJsonLd();

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      about: taxon,
      associatedMedia: photoObjects,
      author: org,
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
      dateModified: raw.updatedAt,
      description: item.description,
      headline: `${item.commonName} (${item.scientificName})`,
      image: [ogImageObject, ...photoObjects],
      inLanguage: locale,
      keywords: speciesJsonLdKeywords(item, locale),
      mainEntity: taxon,
      mainEntityOfPage: {
        "@id": pageUrl,
        "@type": "WebPage",
      },
      publisher: org,
    };

    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbCrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        item: crumb.href
          ? absoluteUrl(localePath(locale, crumb.href))
          : pageUrl,
        name: crumb.name,
        position: index + 1,
      })),
    };

    const galleryLd =
      photoObjects.length > 0
        ? {
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            about: taxon,
            associatedMedia: photoObjects,
            inLanguage: locale,
            name: `${item.commonName} ${tProfile("galleryTitle")}`,
            url: `${pageUrl}#${SPECIES_SECTION_IDS.gallery}`,
          }
        : null;

    const faqJsonLd =
      item.faq && item.faq.length > 0
        ? {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: item.faq.map((entry) => ({
              "@type": "Question",
              acceptedAnswer: {
                "@type": "Answer",
                text: entry.answer,
              },
              name: entry.question,
            })),
          }
        : null;

    const { desktopHeroSrc, mobileHeroSrc } = getSpeciesHeroSources(raw);

    return (
      <>
        {desktopHeroSrc ? (
          mobileHeroSrc ? (
            <>
              <CoverImagePreload
                media="(max-width: 1023px)"
                sizes="100vw"
                src={mobileHeroSrc}
              />
              <CoverImagePreload
                media="(min-width: 1024px)"
                sizes="100vw"
                src={desktopHeroSrc}
              />
            </>
          ) : (
            <CoverImagePreload sizes="100vw" src={desktopHeroSrc} />
          )
        ) : null}
        <JsonLd
          data={[jsonLd, breadcrumbLd, galleryLd, faqJsonLd].filter(
            (entry): entry is NonNullable<typeof entry> => Boolean(entry),
          )}
        />
        <SpeciesProfile
          related={related.map((item) => localizeSpecies(item, locale))}
          species={item}
        />
        <NewsRelatedBlock
          articles={getPublishedNewsForSpecies(raw.id)}
          locale={locale}
        />
      </>
    );
  }

  return {
    generateMetadata,
    generateStaticParams,
    Page,
  };
}
