import { type AppLocale } from "@/i18n/routing";
import {
  absoluteUrl,
  localePath,
  siteEntityId,
  speciesPageUrl,
} from "@/lib/site";

type BreadcrumbCrumb = {
  item: string;
  name: string;
};

type ListedSpecies = {
  commonName: string;
  id: string;
  scientificName: string;
};

type SitePageLdInput = {
  about?: Record<string, unknown>;
  dates: Record<string, unknown>;
  description: string;
  locale: string;
  mainEntity?: Record<string, unknown>;
  name: string;
  type: "CollectionPage" | "WebPage";
  url: string;
};

export function breadcrumbListLd(crumbs: readonly BreadcrumbCrumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      item: crumb.item,
      name: crumb.name,
      position: index + 1,
    })),
  };
}

export function localePageUrl(
  locale: string,
  path: Parameters<typeof localePath>[1],
) {
  return absoluteUrl(localePath(locale, path));
}

export function sitePageLd({
  about,
  dates,
  description,
  locale,
  mainEntity,
  name,
  type,
  url,
}: SitePageLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    ...(about ? { about } : {}),
    author: { "@id": siteEntityId("organization") },
    ...dates,
    description,
    inLanguage: locale,
    isPartOf: { "@id": siteEntityId("website") },
    ...(mainEntity ? { mainEntity } : {}),
    name,
    publisher: { "@id": siteEntityId("organization") },
    url,
  };
}

export function speciesItemListLd(
  locale: AppLocale,
  species: readonly ListedSpecies[],
) {
  return {
    "@type": "ItemList",
    itemListElement: species.map((item, index) => ({
      "@type": "ListItem",
      name: `${item.commonName} (${item.scientificName})`,
      position: index + 1,
      url: speciesPageUrl(locale, item.id),
    })),
    numberOfItems: species.length,
  };
}
