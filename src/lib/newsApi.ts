import { cache } from "react";

import type {
  NewsArticle,
  NewsListArticle,
  NewsPhoto,
  NewsSource,
} from "@/data/newsTypes";
import type { AppLocale } from "@/i18n/routing";
import type { GroupHubId } from "@/lib/groupHubs";

import { createApiClient } from "@/lib/apiClient";
import { speciesFetchOptions } from "@/lib/speciesApiFetch";

type ApiPhoto = Omit<NewsPhoto, "alt"> & { alt: string };

const getNewsDetail = cache(async (slug: string, locale: AppLocale) => {
  const response = await createApiClient().v1.news[":slug"].$get(
    { header: { "x-locale": locale }, param: { slug } },
    speciesFetchOptions(["news", `news:${slug}`]),
  );
  if (!response.ok) {
    const status: number = response.status;
    if (status === 404) return null;
    throw new Error(`News API answered ${status} for ${slug}`);
  }
  return response.json();
});

export const getNewsList = cache(async (locale: AppLocale) => {
  const response = await createApiClient().v1.news.$get(
    { header: { "x-locale": locale }, query: {} },
    speciesFetchOptions(["news"]),
  );
  if (!response.ok) {
    throw new Error(`News API answered ${response.status}`);
  }
  return (await response.json()).data;
});

export const getNewsListArticles = cache(
  async (locale: AppLocale): Promise<NewsListArticle[]> =>
    (await getNewsList(locale)).map((item) => ({
      dek: item.dek,
      id: item.slug,
      ...(item.image
        ? {
            image: {
              ...item.image,
              alt: { [locale]: item.image.alt } as NewsPhoto["alt"],
            },
          }
        : {}),
      lead: item.lead,
      publishedAt: item.publishedAt,
      readMinutes: item.readMinutes,
      relatedHubIds: item.relatedHubIds as GroupHubId[],
      relatedRegionIds: item.relatedRegionIds,
      relatedSpeciesIds: item.relatedSpeciesIds,
      ...(item.series
        ? { series: item.series.id as NewsArticle["series"] & string }
        : {}),
      slug: item.slug,
      sources: item.sources,
      title: item.title,
      ...(item.updatedAt ? { updatedAt: item.updatedAt } : {}),
    })),
);

export const getNewsArticle = cache(
  async (slug: string): Promise<NewsArticle | null> => {
    const ka = await getNewsDetail(slug, "ka");
    if (!ka) return null;
    const details = await Promise.all(
      ka.data.locales.map(async (locale) => {
        const found = locale === "ka" ? ka : await getNewsDetail(slug, locale);
        if (found?.locale !== locale) {
          throw new Error(`News API has no ${locale} text for ${slug}`);
        }
        return [locale, found.data] as const;
      }),
    );
    const base = ka.data;
    const photo = (pick: (data: typeof base) => ApiPhoto | undefined) => {
      const kaPhoto = pick(base);
      if (!kaPhoto) return undefined;
      const alt = {} as NewsPhoto["alt"];
      for (const [locale, data] of details) alt[locale] = pick(data)!.alt;
      return { ...kaPhoto, alt } satisfies NewsPhoto;
    };
    const image = photo((data) => data.image);
    const gallery = base.gallery.map((_, index) =>
      photo((data) => data.gallery[index])!,
    );
    return {
      copy: Object.fromEntries(
        details.map(([locale, data]) => [
          locale,
          {
            dek: data.dek,
            lead: data.lead,
            metaDescription: data.metaDescription,
            metaTitle: data.metaTitle,
            sections: data.sections,
            title: data.title,
          },
        ]),
      ) as NewsArticle["copy"],
      ...(gallery.length > 0 ? { gallery } : {}),
      id: base.slug,
      ...(image ? { image } : {}),
      publishedAt: base.publishedAt,
      relatedHubIds: base.relatedHubIds as GroupHubId[],
      relatedRegionIds: base.relatedRegionIds,
      relatedSpeciesIds: base.relatedSpeciesIds,
      ...(base.series
        ? { series: base.series.id as NewsArticle["series"] & string }
        : {}),
      slug: base.slug,
      sources: base.sources.map((source, index) =>
        localizedSource(
          source.url,
          details.map(([locale, data]) => [locale, data.sources[index]!.name]),
        ),
      ),
      status: "published",
      ...(base.updatedAt ? { updatedAt: base.updatedAt } : {}),
    };
  },
);

function localizedSource(
  url: string,
  names: Array<readonly [AppLocale, string]>,
): NewsSource {
  const values = new Set(names.map(([, name]) => name));
  if (values.size === 1) return { name: names[0]![1], url };
  return {
    name: Object.fromEntries(names) as Record<AppLocale, string>,
    url,
  };
}
