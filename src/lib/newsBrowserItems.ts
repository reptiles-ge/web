import { getTranslations } from "next-intl/server";

import type { NewsIndexEntry } from "@/components/NewsIndexCards";
import type { NewsListArticle } from "@/data/newsTypes";
import type { AppLocale } from "@/i18n/routing";

import { formatContentMonth } from "@/lib/formatDate";
import { toNewsIndexEntry } from "@/lib/newsIndexEntry";
import { loadNewsVisuals } from "@/lib/newsVisualLoader";

export type NewsBrowserEntry = {
  entry: NewsIndexEntry;
  id: string;
  monthKey: string;
};

export async function newsBrowserEntries(
  articles: readonly NewsListArticle[],
  locale: AppLocale,
) {
  const [t, tNav, visuals] = await Promise.all([
    getTranslations({ locale, namespace: "news" }),
    getTranslations({ locale, namespace: "nav" }),
    loadNewsVisuals(articles, locale),
  ]);
  const monthLabels: Record<string, string> = {};
  const items = articles.map((article, index): NewsBrowserEntry => {
    const monthKey = article.publishedAt.slice(0, 7);
    monthLabels[monthKey] ??= formatContentMonth(article.publishedAt, locale);
    return {
      entry: toNewsIndexEntry(
        article,
        locale,
        {
          readLabel: (minutes) => t("readTime", { minutes }),
          topicLabel: (hub) => tNav(hub),
        },
        visuals[index],
      ),
      id: article.id,
      monthKey,
    };
  });
  return { items, monthLabels };
}
