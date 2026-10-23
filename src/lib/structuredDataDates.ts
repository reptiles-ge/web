import type { AppLocale } from "@/i18n/routing";

import {
  guideArticleModifiedAt,
  messageNamespaceModifiedAt,
  pageFileModifiedAt,
} from "@/data/contentDates.generated";
import {
  AUTHOR_MESSAGE_NAMESPACES,
  PAGE_MESSAGE_NAMESPACES,
  REGION_MESSAGE_NAMESPACES,
} from "@/data/pageContentSources";
import {
  sitemapAuthorDatePublished,
  sitemapAuthorLastModified,
  sitemapPathDatePublished,
  sitemapPathLastModified,
  sitemapQuizDatePublished,
  sitemapRegionDatePublished,
  sitemapRegionLastModified,
} from "@/data/pageLastModified";
import { getRegionById, getRegionSpecies, regions } from "@/data/regions";
import { getContributors } from "@/lib/authorsApi";
import { CLUSTER_GUIDE_LIST } from "@/lib/clusterGuides";
import {
  type CreditPhotoSource,
  getCreditAuthorPhotos,
  getCreditAuthorSpeciesIds,
} from "@/lib/creditAuthors";
import { formatContentDate } from "@/lib/formatDate";
import { GROUP_HUB_LIST } from "@/lib/groupHubs";
import { liveQuizzes } from "@/lib/quizzes";
import {
  type CatalogCard,
  getCreditPhotoCatalog,
  getSpeciesCatalog,
} from "@/lib/speciesCatalogApi";

type DateFields = { dateModified: string; datePublished: string };

let pathNamespaces: Map<string, readonly string[]> | null = null;

export async function atlasDateFields(locale: AppLocale) {
  return pageDateFields("/species", locale);
}

export async function authorDateFields(slug: string, locale: AppLocale) {
  return withFloor(
    await authorModifiedDate(slug, locale),
    sitemapAuthorDatePublished(slug),
  );
}

export async function authorModifiedDate(
  slug: string,
  locale: AppLocale,
  catalog?: readonly CatalogCard[],
  creditPhotos?: readonly CreditPhotoSource[],
) {
  return latestDate([
    sitemapAuthorLastModified(slug),
    messagesDate(AUTHOR_MESSAGE_NAMESPACES, locale),
    authorMembersDate(
      slug,
      catalog ?? (await getSpeciesCatalog(locale)),
      creditPhotos ?? (await getCreditPhotoCatalog()),
    ),
  ]);
}

export function hasMeaningfulUpdate(
  publishedAt: null | string | undefined,
  updatedAt: null | string | undefined,
) {
  if (!publishedAt || !updatedAt) return false;
  const published = Date.parse(publishedAt);
  const updated = Date.parse(updatedAt);
  if (Number.isNaN(published) || Number.isNaN(updated)) {
    return publishedAt !== updatedAt;
  }
  return (
    updated > published &&
    formatContentDate(publishedAt, "en") !== formatContentDate(updatedAt, "en")
  );
}

export async function pageDateFields(
  path: string,
  locale: AppLocale,
): Promise<DateFields> {
  return withFloor(
    await pageModifiedDate(path, locale),
    sitemapPathDatePublished(path),
  );
}

export async function pageModifiedDate(
  path: string,
  locale: AppLocale,
  catalog?: readonly CatalogCard[],
  creditPhotos?: readonly CreditPhotoSource[],
) {
  return latestDate([
    sitemapPathLastModified(path),
    guideArticleModifiedAt[path],
    pageFileModifiedAt[path],
    messagesDate(namespacesByPath().get(path) ?? [], locale),
    pageMembersDate(
      path,
      catalog ?? (await getSpeciesCatalog(locale)),
      path === "/authors"
        ? (creditPhotos ?? (await getCreditPhotoCatalog()))
        : [],
      path === "/authors"
        ? (await getContributors(locale)).map((author) => author.id)
        : [],
    ),
  ]);
}

export async function quizDateFields(id: string, locale: AppLocale) {
  return withFloor(
    await quizModifiedDate(id, locale),
    sitemapQuizDatePublished(id),
  );
}

export async function quizModifiedDate(
  id: string,
  locale: AppLocale,
  catalog?: readonly CatalogCard[],
) {
  const quiz = liveQuizzes().find((item) => item.id === id);
  return latestDate([
    messagesDate(quiz ? [quiz.messageNamespace] : [], locale),
    quizMembersDate(id, catalog ?? (await getSpeciesCatalog(locale))),
  ]);
}

export async function regionDateFields(id: string, locale: AppLocale) {
  return withFloor(
    await regionModifiedDate(id, locale),
    sitemapRegionDatePublished(id),
  );
}

export async function regionModifiedDate(
  id: string,
  locale: AppLocale,
  catalog?: readonly CatalogCard[],
) {
  return latestDate([
    sitemapRegionLastModified(id),
    messagesDate(REGION_MESSAGE_NAMESPACES, locale),
    regionMembersDate(id, catalog ?? (await getSpeciesCatalog(locale))),
  ]);
}

function authorMembersDate(
  slug: string,
  catalog: readonly CatalogCard[],
  creditPhotos: readonly CreditPhotoSource[],
) {
  const ids = new Set(
    getCreditAuthorSpeciesIds(
      getCreditAuthorPhotos({ id: slug }, creditPhotos),
    ),
  );
  return speciesDate(catalog.filter((item) => ids.has(item.id)));
}

function laterDate(base: string, candidate: null | string | undefined) {
  if (!candidate) return base;
  const candidateTime = Date.parse(candidate);
  if (Number.isNaN(candidateTime)) return base;
  return candidateTime > Date.parse(base) ? candidate : base;
}

function latestDate(values: Array<null | string | undefined>) {
  let latest: null | string = null;
  for (const value of values) {
    if (!value || Number.isNaN(Date.parse(value))) continue;
    latest = latest ? laterDate(latest, value) : value;
  }
  return latest;
}

function membersForPath(path: string, catalog: readonly CatalogCard[]) {
  if (path === "/" || path === "/species") return catalog;
  const hub = GROUP_HUB_LIST.find((item) => item.path === path);
  if (hub) return catalog.filter((item) => item.group === hub.group);
  const guide = CLUSTER_GUIDE_LIST.find(
    (item) => item.schema === "collection" && item.pathname === path,
  );
  return guide ? catalog.filter(guide.matches) : null;
}

function messagesDate(namespaces: readonly string[], locale: AppLocale) {
  const dates = messageNamespaceModifiedAt[locale] ?? {};
  return latestDate(namespaces.map((namespace) => dates[namespace]));
}

function namespacesByPath() {
  if (pathNamespaces) return pathNamespaces;
  const map = new Map<string, readonly string[]>(
    Object.entries(PAGE_MESSAGE_NAMESPACES),
  );
  for (const guide of CLUSTER_GUIDE_LIST) {
    map.set(guide.pathname, [guide.messageKey]);
  }
  for (const hub of GROUP_HUB_LIST) {
    map.set(hub.path, [hub.messageKey]);
  }
  pathNamespaces = map;
  return map;
}

function pageMembersDate(
  path: string,
  catalog: readonly CatalogCard[],
  creditPhotos: readonly CreditPhotoSource[],
  authorIds: readonly string[],
) {
  if (path === "/regions") {
    return latestDate(
      regions.map((region) => regionMembersDate(region.id, catalog)),
    );
  }
  if (path === "/authors") {
    return latestDate(
      authorIds.map((id) => authorMembersDate(id, catalog, creditPhotos)),
    );
  }
  if (path === "/quiz") {
    return latestDate(
      liveQuizzes().map((quiz) => quizMembersDate(quiz.id, catalog)),
    );
  }
  const members = membersForPath(path, catalog);
  return members ? speciesDate(members) : null;
}

function quizMembersDate(id: string, catalog: readonly CatalogCard[]) {
  const quiz = liveQuizzes().find((item) => item.id === id);
  if (!quiz) return null;
  return speciesDate(catalog.filter((item) => item.group === quiz.group));
}

function regionMembersDate(id: string, catalog: readonly CatalogCard[]) {
  const region = getRegionById(id);
  return region ? speciesDate(getRegionSpecies(region, catalog)) : null;
}

function speciesDate(items: readonly CatalogCard[]) {
  return latestDate(items.map((item) => item.updatedAt));
}

function withFloor(
  dateModified: null | string,
  datePublished: string,
): DateFields {
  return {
    dateModified: laterDate(datePublished, dateModified),
    datePublished,
  };
}
