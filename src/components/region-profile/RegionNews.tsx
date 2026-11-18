import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { NewsListArticle } from "@/data/newsTypes";
import type { AppLocale } from "@/i18n/routing";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { NewsSideCard } from "@/components/NewsIndexCards";
import {
  eyebrowClass,
  focusClass,
  wrapClass,
} from "@/components/regions-index/shared";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { newsBrowserEntries } from "@/lib/newsBrowserItems";
import { newsIndexHref } from "@/lib/newsHrefs";
import { REGION_SECTION_IDS } from "@/lib/toc";

import { arrowLinkClass, regionH2Class } from "./classes";

export async function RegionNews({
  articles,
  locale,
}: {
  articles: NewsListArticle[];
  locale: AppLocale;
}) {
  if (articles.length === 0) return null;

  const [t, { items }] = await Promise.all([
    getTranslations({ locale, namespace: "news" }),
    newsBrowserEntries(articles, locale),
  ]);

  return (
    <section className="pt-12 lg:pt-[104px]">
      <div className={wrapClass}>
        <div className="lg:flex lg:items-end lg:justify-between">
          <div>
            <p className={eyebrowClass}>{t("eyebrow")}</p>
            <AnchoredHeading
              anchorLabel={t("anchorLink")}
              className={regionH2Class}
              id={REGION_SECTION_IDS.news}
            >
              {t("relatedNewsHeading")}
            </AnchoredHeading>
          </div>
          <Link
            className={cn(arrowLinkClass, focusClass, "hidden lg:inline-flex")}
            href={newsIndexHref()}
          >
            {t("allNews")}
            <ArrowRight
              aria-hidden="true"
              className="size-[15px]"
              strokeWidth={1.75}
            />
          </Link>
        </div>
        <div className="mt-4 flex flex-col gap-2 lg:mt-7 lg:grid lg:grid-cols-2 lg:gap-4">
          {items.map(({ entry }) => (
            <NewsSideCard className="min-w-0" entry={entry} key={entry.slug} />
          ))}
        </div>
      </div>
    </section>
  );
}
