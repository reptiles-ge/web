import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { getNewsSummaries } from "@/lib/newsApi";
import { buildNewsFeedXml, NEWS_FEED_HEADERS } from "@/lib/newsFeed";

export async function newsFeedResponse(locale: AppLocale) {
  const [t, articles] = await Promise.all([
    getTranslations({ locale, namespace: "news" }),
    getNewsSummaries(),
  ]);
  return new Response(
    buildNewsFeedXml({
      articles,
      locale,
      subtitle: t("metaDescription"),
      title: t("metaTitle"),
    }),
    { headers: NEWS_FEED_HEADERS },
  );
}
