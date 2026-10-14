import type { AppLocale } from "@/i18n/routing";

import {
  guideArticleModifiedAt,
  messageNamespaceModifiedAt,
  pageFileModifiedAt,
} from "@/data/contentDates.generated";
import {
  getPublishedCreditAuthorBySlug,
  getPublishedCreditAuthors,
} from "@/data/creditAuthors";
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
import { getCatalogSpecies, type Species } from "@/data/species";
import { getSpeciesAtlasMeta } from "@/data/speciesAtlasMeta";
import { speciesUpdatedAt } from "@/i18n/localizeSpecies";
import { CLUSTER_GUIDE_LIST } from "@/lib/clusterGuides";
import {
  getCreditAuthorPhotos,
  getCreditAuthorSpeciesIds,
} from "@/lib/creditAuthors";
import { formatContentDate } from "@/lib/formatDate";
import { GROUP_HUB_LIST } from "@/lib/groupHubs";
import { liveQuizzes } from "@/lib/quizzes";

type DateFields = { dateModified: string; datePublished: string };

const memo = new Map<string, null | string>();
let pathMembers: Map<string, Species[]> | null = null;
let pathNamespaces: Map<string, readonly string[]> | null = null;

export function atlasDateFields(locale: AppLocale) {
  return pageDateFields("/species", locale);
}

export function authorDateFields(slug: string, locale: AppLocale) {
  return withFloor(
    authorModifiedDate(slug, locale),
    sitemapAuthorDatePublished(slug),
  );
}

export function authorModifiedDate(slug: string, locale: AppLocale) {
  return latestDate([
    sitemapAuthorLastModified(slug),
    messagesDate(AUTHOR_MESSAGE_NAMESPACES, locale),
    authorMembersDate(slug, locale),
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

export function pageDateFields(path: string, locale: AppLocale): DateFields {
  return withFloor(
    pageModifiedDate(path, locale),
    sitemapPathDatePublished(path),
  );
}

export function pageModifiedDate(path: string, locale: AppLocale) {
  return latestDate([
    sitemapPathLastModified(path),
    guideArticleModifiedAt[path],
    pageFileModifiedAt[path],
    messagesDate(namespacesByPath().get(path) ?? [], locale),
    pageMembersDate(path, locale),
  ]);
}

export function quizDateFields(id: string, locale: AppLocale) {
  return withFloor(quizModifiedDate(id, locale), sitemapQuizDatePublished(id));
}

export function quizModifiedDate(id: string, locale: AppLocale) {
  const quiz = liveQuizzes().find((item) => item.id === id);
  return latestDate([
    messagesDate(quiz ? [quiz.messageNamespace] : [], locale),
    quizMembersDate(id, locale),
  ]);
}

export function regionDateFields(id: string, locale: AppLocale) {
  return withFloor(
    regionModifiedDate(id, locale),
    sitemapRegionDatePublished(id),
  );
}

export function regionModifiedDate(id: string, locale: AppLocale) {
  return latestDate([
    sitemapRegionLastModified(id),
    messagesDate(REGION_MESSAGE_NAMESPACES, locale),
    regionMembersDate(id, locale),
  ]);
}

function authorMembersDate(slug: string, locale: AppLocale) {
  return memoized(`author:${slug}:${locale}`, () => {
    const author = getPublishedCreditAuthorBySlug(slug);
    if (!author) return null;
    const ids = new Set(
      getCreditAuthorSpeciesIds(getCreditAuthorPhotos(author)),
    );
    return speciesDate(
      getCatalogSpecies().filter((item) => ids.has(item.id)),
      locale,
    );
  });
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

function membersByPath() {
  if (pathMembers) return pathMembers;
  const catalog = getCatalogSpecies();
  const map = new Map<string, Species[]>();
  map.set("/", catalog);
  map.set("/species", catalog);
  for (const guide of CLUSTER_GUIDE_LIST) {
    if (guide.schema !== "collection") continue;
    map.set(guide.pathname, catalog.filter(guide.matches));
  }
  for (const hub of GROUP_HUB_LIST) {
    map.set(
      hub.path,
      catalog.filter(
        (item) => getSpeciesAtlasMeta(item.id).group === hub.group,
      ),
    );
  }
  pathMembers = map;
  return map;
}

function memoized(key: string, compute: () => null | string) {
  if (!memo.has(key)) memo.set(key, compute());
  return memo.get(key) ?? null;
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

function pageMembersDate(path: string, locale: AppLocale) {
  return memoized(`path:${path}:${locale}`, () => {
    if (path === "/regions") {
      return latestDate(
        regions.map((region) => regionMembersDate(region.id, locale)),
      );
    }
    if (path === "/authors") {
      return latestDate(
        getPublishedCreditAuthors().map((author) =>
          authorMembersDate(author.slug, locale),
        ),
      );
    }
    if (path === "/quiz") {
      return latestDate(
        liveQuizzes().map((quiz) => quizMembersDate(quiz.id, locale)),
      );
    }
    const members = membersByPath().get(path);
    return members ? speciesDate(members, locale) : null;
  });
}

function quizMembersDate(id: string, locale: AppLocale) {
  return memoized(`quiz:${id}:${locale}`, () => {
    const quiz = liveQuizzes().find((item) => item.id === id);
    if (!quiz) return null;
    return speciesDate(
      getCatalogSpecies().filter(
        (item) => getSpeciesAtlasMeta(item.id).group === quiz.group,
      ),
      locale,
    );
  });
}

function regionMembersDate(id: string, locale: AppLocale) {
  return memoized(`region:${id}:${locale}`, () => {
    const region = getRegionById(id);
    return region ? speciesDate(getRegionSpecies(region), locale) : null;
  });
}

function speciesDate(items: Species[], locale: AppLocale) {
  return latestDate(items.map((item) => speciesUpdatedAt(item, locale)));
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
