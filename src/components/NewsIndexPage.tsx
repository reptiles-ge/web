import { ArrowRight, BookOpen } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { NewsArticle } from "@/data/news";
import type { AppLocale } from "@/i18n/routing";

import { CoverImage } from "@/components/CoverImage";
import { CoverImagePreload } from "@/components/CoverImagePreload";
import {
  NewsIndexBrowser,
  type NewsIndexBrowserItem,
} from "@/components/NewsIndexBrowser";
import {
  type NewsIndexEntry,
  NewsLeadCard,
  NewsListCard,
  NewsSideCard,
} from "@/components/NewsIndexCards";
import {
  newsLocalizedDek,
  newsLocalizedTitle,
  newsSourceName,
} from "@/data/news";
import { getAtlasStats } from "@/data/speciesAtlas";
import { Link } from "@/i18n/navigation";
import { formatContentDate, formatContentMonth } from "@/lib/formatDate";
import {
  GROUP_HUB_ILLUSTRATIONS,
  GROUP_HUBS,
  type GroupHubId,
} from "@/lib/groupHubs";
import {
  newsIndexDateFields,
  newsReadMinutes,
  newsSourceBadges,
} from "@/lib/news";
import { getNewsVisual, newsCategoryHub } from "@/lib/newsVisual";

type NewsIndexPageProps = {
  articles: NewsArticle[];
  locale: AppLocale;
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

const CTA_TILES: ReadonlyArray<{ id: GroupHubId; mobile: boolean }> = [
  { id: "snakes", mobile: true },
  { id: "lizards", mobile: true },
  { id: "amphibians", mobile: false },
  { id: "birds", mobile: true },
  { id: "mammals", mobile: false },
  { id: "spiders", mobile: false },
];

const FEATURED_COUNT = 3;

const wrapClass =
  "mx-auto box-content max-w-[1320px] px-5 md:px-10 lg:px-[60px]";
const trustLinkClass =
  "inline-flex min-h-11 items-center gap-1.5 text-[14px] font-semibold text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white";
const eyebrowClass =
  "text-[10.5px] font-semibold tracking-[0.16em] text-(--nw-muted) md:text-[11px]";

export async function NewsIndexPage({ articles, locale }: NewsIndexPageProps) {
  const [t, tNav, tShared] = await Promise.all([
    getTranslations({ locale, namespace: "news" }),
    getTranslations({ locale, namespace: "nav" }),
    getTranslations({ locale, namespace: "groupHubShared" }),
  ]);

  const entries = articles.map((article) =>
    toEntry(article, locale, {
      readLabel: (minutes) => t("readTime", { minutes }),
      topicLabel: (hub) => tNav(hub),
    }),
  );
  const [lead, ...rest] = entries;
  const sides = rest.slice(0, FEATURED_COUNT - 1);
  const stats = getAtlasStats();
  const sourceBadges = newsSourceBadges(articles, locale);

  const chips = [
    { count: articles.length, id: "all", label: t("all") },
    ...TOPIC_ORDER.map((id) => ({
      count: articles.filter((article) => article.relatedHubIds.includes(id))
        .length,
      id,
      label: tNav(id),
    })).filter((chip) => chip.count > 0),
  ];

  const monthLabels: Record<string, string> = {};
  const items: NewsIndexBrowserItem[] = articles.map((article, index) => {
    const entry = entries[index];
    const monthKey = article.publishedAt.slice(0, 7);
    monthLabels[monthKey] ??= formatContentMonth(article.publishedAt, locale);
    return {
      card: <NewsListCard entry={entry} />,
      id: article.id,
      monthKey,
      searchText: [
        entry.title,
        entry.dek,
        ...article.sources.map((source) => newsSourceName(source, locale)),
      ]
        .join(" ")
        .toLocaleLowerCase(),
      topics: article.relatedHubIds,
    };
  });

  const articleWords = Array.from({ length: articles.length + 1 }, (_, count) =>
    t("articleWord", { count }),
  );

  const featured = lead ? (
    <section
      aria-labelledby="news-featured"
      className={`${wrapClass} pt-5 md:pt-10`}
    >
      <h2 className="sr-only" id="news-featured">
        {t("featured")}
      </h2>
      <div className="lg:grid lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-7">
        <NewsLeadCard
          entry={lead}
          labels={{
            featured: t("featured"),
            readArticle: t("readArticle"),
            source: t("sourceHeading"),
          }}
        />
        <div className="mt-3.5 flex flex-col gap-4 md:mt-8 lg:mt-0">
          <div className="hidden items-center px-1.5 pt-1 md:flex">
            <span className={eyebrowClass}>{t("latest")}</span>
          </div>
          {sides.length > 0 ? (
            <div className="-mx-5 flex snap-x snap-mandatory scroll-px-5 scrollbar-none gap-3 overflow-x-auto px-5 pb-1 md:mx-0 md:snap-none md:flex-col md:gap-4 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
              {sides.map((entry) => (
                <NewsSideCard entry={entry} key={entry.slug} />
              ))}
            </div>
          ) : null}
          <aside
            aria-labelledby="news-how-we-write"
            className="flex flex-1 flex-col justify-between gap-[18px] rounded-[28px] bg-(--nw-panel) p-6 text-white"
          >
            <span className="flex items-center gap-2.5">
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-white/10">
                <BookOpen
                  aria-hidden="true"
                  className="size-4"
                  strokeWidth={1.75}
                />
              </span>
              <span
                className="text-[11px] font-semibold tracking-[0.16em] text-white/60"
                id="news-how-we-write"
              >
                {t("howWeWriteEyebrow")}
              </span>
            </span>
            <p className="text-[17px] leading-[1.45] font-medium">
              {t("howWeWrite")}
            </p>
            {sourceBadges.length > 0 ? (
              <ul className="flex flex-wrap gap-1.5">
                {sourceBadges.map((tag) => (
                  <li
                    className="rounded-full bg-white/8 px-[11px] py-1.5 text-[12px] text-white/82"
                    key={tag}
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}
            <ul className="-my-2 flex flex-wrap gap-x-5">
              <li>
                <Link
                  className={trustLinkClass}
                  href={{ hash: "methodology", pathname: "/about" }}
                >
                  {t("methodologyLink")}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-3.5"
                    strokeWidth={1.75}
                  />
                </Link>
              </li>
              <li>
                <Link className={trustLinkClass} href="/contact">
                  {t("correctionsLink")}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-3.5"
                    strokeWidth={1.75}
                  />
                </Link>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  ) : null;

  return (
    <div className="editorial-page min-h-screen bg-background text-(--nw-ink) antialiased">
      {lead ? (
        <CoverImagePreload
          sizes="(max-width: 1023px) 100vw, 60vw"
          src={lead.src}
        />
      ) : null}
      <header className={`${wrapClass} pt-[107px] md:pt-[147px] md:pb-10`}>
        <nav aria-label="Breadcrumb" className="sr-only">
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
                    count: articles.length,
                    date: formatContentDate(
                      newsIndexDateFields(locale, articles).dateModified,
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
          <NewsIndexBrowser
            articleWords={articleWords}
            chips={chips}
            featured={featured}
            featuredCount={FEATURED_COUNT}
            items={items}
            labels={{
              clear: t("clear"),
              emptyCta: t("allNews"),
              emptyText: t("emptyText"),
              emptyTitle: t("emptyTitle"),
              emptyTitleShort: t("emptyTitleShort"),
              resetFilter: t("resetFilter"),
              resetFilterShort: t("resetFilterShort"),
              searchLabel: t("searchLabel"),
              searchPlaceholder: t("searchPlaceholder"),
              topicsLabel: t("topicsLabel"),
            }}
            monthLabels={monthLabels}
          />
        )}

        <section className={`${wrapClass} pt-12 pb-14 md:pt-24 md:pb-28`}>
          <div className="relative overflow-hidden rounded-[28px] bg-(--nw-surface) px-[22px] pt-7 pb-[22px] md:rounded-[36px] md:px-16 md:py-14 lg:grid lg:grid-cols-[minmax(0,1fr)_520px] lg:items-center lg:gap-12">
            <div>
              <span className={eyebrowClass}>{t("ctaEyebrow")}</span>
              <h2 className="mt-2.5 text-[26px] leading-[1.15] font-semibold tracking-[-0.012em] md:mt-3.5 md:text-[40px] md:leading-[1.1] md:tracking-[-0.015em]">
                {t("atlasCtaTitle")}
              </h2>
              <p className="mt-2.5 max-w-[460px] text-[14.5px] leading-[1.6] text-(--nw-muted) md:mt-3.5 md:text-[16px] md:leading-[1.65]">
                {t("atlasCtaBody")}
              </p>
              <Link
                className="mt-7 hidden h-[52px] items-center gap-2.5 rounded-full bg-(--nw-strong) px-6 text-[15px] font-medium text-(--nw-on-strong) md:inline-flex"
                href="/species"
              >
                {t("atlasCta")}
                <ArrowRight
                  aria-hidden="true"
                  className="size-4"
                  strokeWidth={1.75}
                />
              </Link>
            </div>
            <ul className="mt-[18px] grid grid-cols-3 gap-2 md:mt-10 md:gap-2.5 lg:mt-0">
              {CTA_TILES.map((tile) => (
                <li
                  className={tile.mobile ? "" : "hidden md:block"}
                  key={tile.id}
                >
                  <Link
                    className="group relative flex h-[92px] flex-col justify-end overflow-hidden rounded-2xl bg-[#151c18] px-[11px] py-2.5 text-white md:h-[120px] md:rounded-[20px] md:px-3.5 md:py-3"
                    href={GROUP_HUBS[tile.id].path}
                  >
                    <span className="absolute inset-0 opacity-75 [&_picture]:bg-transparent! [&_picture]:bg-none!">
                      <CoverImage
                        alt=""
                        aria-hidden
                        className="object-cover motion-safe:transition-transform motion-safe:duration-800 motion-safe:group-hover:scale-[1.04]"
                        sizes="(max-width: 767px) 33vw, 180px"
                        src={GROUP_HUB_ILLUSTRATIONS[tile.id]}
                      />
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-[70%] bg-linear-to-t from-[rgba(14,20,17,0.85)] to-transparent"
                    />
                    <span className="relative text-[15px] font-semibold tabular-nums md:text-[18px] md:leading-none">
                      {stats[tile.id]}
                    </span>
                    <span className="relative text-[12px] font-semibold md:mt-1 md:text-[13px]">
                      {tNav(tile.id)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              className="mt-3.5 flex h-[52px] items-center justify-center gap-2.5 rounded-full bg-(--nw-strong) text-[15px] font-medium text-(--nw-on-strong) md:hidden"
              href="/species"
            >
              {t("atlasCta")}
              <ArrowRight
                aria-hidden="true"
                className="size-4"
                strokeWidth={1.75}
              />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function toEntry(
  article: NewsArticle,
  locale: AppLocale,
  labels: {
    readLabel: (minutes: number) => string;
    topicLabel: (hub: GroupHubId) => string;
  },
): NewsIndexEntry {
  const hub = newsCategoryHub(article);
  const visual = getNewsVisual(article, locale);
  const minutes = newsReadMinutes(article, locale);
  return {
    alt: visual?.alt ?? "",
    dateLabel: formatContentDate(article.publishedAt, locale),
    dek: newsLocalizedDek(article, locale),
    illustrated: !visual,
    publishedAt: article.publishedAt,
    readLabel: labels.readLabel(minutes),
    slug: article.slug,
    source: article.sources[0]
      ? newsSourceName(article.sources[0], locale)
      : null,
    sourceMore: Math.max(0, article.sources.length - 1),
    src: visual?.src ?? GROUP_HUB_ILLUSTRATIONS[hub ?? "snakes"],
    title: newsLocalizedTitle(article, locale),
    topicLabel: hub ? labels.topicLabel(hub) : null,
  };
}
