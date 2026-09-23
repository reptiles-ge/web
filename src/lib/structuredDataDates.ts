import {
  sitemapAuthorDatePublished,
  sitemapAuthorLastModified,
  sitemapPathDatePublished,
  sitemapPathLastModified,
  sitemapQuizDatePublished,
  sitemapQuizLastModified,
  sitemapRegionDatePublished,
  sitemapRegionLastModified,
} from "@/data/pageLastModified";
import { formatContentDate } from "@/lib/formatDate";

export function authorDateFields(slug: string) {
  return {
    dateModified: sitemapAuthorLastModified(slug),
    datePublished: sitemapAuthorDatePublished(slug),
  };
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

export function pageDateFields(path: string) {
  return {
    dateModified: sitemapPathLastModified(path),
    datePublished: sitemapPathDatePublished(path),
  };
}

export function quizDateFields(id: string) {
  return {
    dateModified: sitemapQuizLastModified(id),
    datePublished: sitemapQuizDatePublished(id),
  };
}

export function regionDateFields(id: string) {
  return {
    dateModified: sitemapRegionLastModified(id),
    datePublished: sitemapRegionDatePublished(id),
  };
}
