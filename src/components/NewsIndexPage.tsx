import { getTranslations } from "next-intl/server";

import type { NewsListArticle } from "@/data/newsTypes";
import type { AppLocale } from "@/i18n/routing";
import type { GroupHubId } from "@/lib/groupHubs";
import type { NewsTopicFacets } from "@/lib/newsBrowserQuery";

import { CoverImagePreload } from "@/components/CoverImagePreload";
import { NewsIndexBrowser } from "@/components/NewsIndexBrowser";
import {
  NewsAtlasCta,
  NewsFeaturedBlock,
} from "@/components/NewsIndexSections";
import { NewsPagination } from "@/components/NewsPagination";
import { OptimizedImageScope } from "@/components/OptimizedImageScope";
import { Link } from "@/i18n/navigation";
import { formatContentDate } from "@/lib/formatDate";
import { newsIndexDateFields, newsSourceBadges } from "@/lib/news";
import { newsBrowserEntries } from "@/lib/newsBrowserItems";

type NewsIndexPageProps = {
  articles: NewsListArticle[];
  facets: NewsTopicFacets;
  locale: AppLocale;
  pageCount: number;
  total: number;
};

const TOPIC_ORDER: readonly GroupHubId[] = [
  "snakes",
  "lizards",
  "turtles",
  "amphibians",
  "birds",
  "mammals",
  "spiders",
  "scorpions",
  "insects",
];

const FEATURED_COUNT = 3;

const wrapClass =
  "mx-auto box-content max-w-[1320px] px-5 md:px-10 lg:px-[60px]";
const eyebrowClass =
  "text-[10.5px] font-semibold tracking-[0.16em] text-(--nw-muted) md:text-[11px]";

export async function NewsIndexPage({
  articles,
  facets,
  locale,
  pageCount,
  total,
}: NewsIndexPageProps) {
  const [t, tNav, tShared, { items, monthLabels }] = await Promise.all([
    getTranslations({ locale, namespace: "news" }),
    getTranslations({ locale, namespace: "nav" }),
    getTranslations({ locale, namespace: "groupHubShared" }),
    newsBrowserEntries(articles, locale),
  ]);

  const [lead, ...rest] = items.map((item) => item.entry);

  const chips = [
    { id: "all" as const, label: t("all") },
    ...TOPIC_ORDER.filter((id) => facets.hub[id] > 0).map((id) => ({
      id,
      label: tNav(id),
    })),
  ];

  const articleWords = Array.from({ length: total + 1 }, (_, count) =>
    t("articleWord", { count }),
  );

  return (
    <div className="editorial-page min-h-screen bg-background text-(--nw-ink) antialiased">
      {lead ? (
        <CoverImagePreload
          sizes="(max-width: 1023px) 100vw, 60vw"
          src={lead.src}
        />
      ) : null}
      <header className={`${wrapClass} pt-[107px] md:pt-[147px] md:pb-10`}>
        <nav aria-label={tNav("breadcrumbAria")} className="sr-only">
          <ol>
            <li>
              <Link href="/">{tShared("breadcrumbHome")}</Link>
            </li>
            <li>{t("breadcrumbNews")}</li>
          </ol>
        </nav>
        <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_470px] xl:items-end xl:gap-20">
          <div>
            {lead ? (
              <div className="flex items-center gap-[9px] md:gap-2.5">
                <span
                  aria-hidden="true"
                  className="size-[7px] rounded-full bg-(--nw-accent) shadow-[0_0_0_4px_rgba(47,107,79,0.16)] md:size-2"
                />
                <span className={eyebrowClass}>
                  {t("status", {
                    count: total,
                    date: formatContentDate(
                      newsIndexDateFields(articles).dateModified,
                      locale,
                    ),
                  })}
                </span>
              </div>
            ) : null}
            <h1 className="mt-3.5 font-display text-[52px] leading-none font-semibold tracking-[-0.03em] md:mt-[18px] md:text-[88px] md:leading-[0.95] md:tracking-[-0.035em] xl:text-[104px]">
              {t("h1")}
            </h1>
          </div>
          <div className="mt-3.5 max-w-[640px] md:mt-6 xl:mt-0 xl:pb-2">
            <p className="text-[16px] leading-[1.55] text-(--nw-soft) md:text-[18px] md:text-(--nw-ink)">
              {t("intro")}
            </p>
            <p className="mt-3.5 hidden text-[14px] leading-[1.7] text-(--nw-muted) md:block">
              {t("introNote")}
            </p>
          </div>
        </div>
      </header>

      <div>
        {articles.length === 0 ? (
          <p className={`${wrapClass} pt-10 text-[15px] text-(--nw-muted)`}>
            {t("empty")}
          </p>
        ) : (
          <OptimizedImageScope srcs={items.map((item) => item.entry.src)}>
            <NewsIndexBrowser
              articleWords={articleWords}
              chips={chips}
              featured={
                lead ? (
                  <NewsFeaturedBlock
                    lead={lead}
                    locale={locale}
                    sides={rest.slice(0, FEATURED_COUNT - 1)}
                    sourceBadges={newsSourceBadges(articles, locale)}
                  />
                ) : null
              }
              featuredCount={FEATURED_COUNT}
              initial={{
                facets,
                items,
                monthLabels,
                page: 1,
                pageCount,
                total,
              }}
              labels={{
                clear: t("clear"),
                emptyCta: t("allNews"),
                emptyText: t("emptyText"),
                emptyTitle: t("emptyTitle"),
                emptyTitleShort: t("emptyTitleShort"),
                newer: t("newerArticles"),
                older: t("olderArticles"),
                pages: Array.from({ length: pageCount }, (_, index) =>
                  t("pageNumber", { page: index + 1 }),
                ),
                pagination: t("paginationLabel"),
                resetFilter: t("resetFilter"),
                resetFilterShort: t("resetFilterShort"),
                searchLabel: t("searchLabel"),
                searchPlaceholder: t("searchPlaceholder"),
                topicsLabel: t("topicsLabel"),
              }}
              locale={locale}
              pagination={
                <NewsPagination
                  current={1}
                  locale={locale}
                  pageCount={pageCount}
                />
              }
            />
          </OptimizedImageScope>
        )}

        <NewsAtlasCta locale={locale} />
      </div>
    </div>
  );
}
