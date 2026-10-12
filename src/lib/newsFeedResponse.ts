import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { buildNewsFeedXml, NEWS_FEED_HEADERS } from "@/lib/newsFeed";

export async function newsFeedResponse(locale: AppLocale) {
  const t = await getTranslations({ locale, namespace: "news" });
  return new Response(
    buildNewsFeedXml({
      locale,
      subtitle: t("metaDescription"),
      title: t("metaTitle"),
    }),
    { headers: NEWS_FEED_HEADERS },
  );
}
