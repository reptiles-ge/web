import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";
import type { NewsPage } from "@/lib/newsPages";

import { NewsListCard } from "@/components/NewsIndexCards";
import { NewsMonthSection } from "@/components/NewsMonthSection";
import { NewsPagination } from "@/components/NewsPagination";
import { Link } from "@/i18n/navigation";
import { formatContentDate, formatContentMonth } from "@/lib/formatDate";
import { newsIndexHref } from "@/lib/news";
import { toNewsIndexEntry } from "@/lib/newsIndexEntry";
import { groupNewsByMonth } from "@/lib/newsMonthGroups";

const wrapClass =
  "mx-auto box-content max-w-[1320px] px-5 md:px-10 lg:px-[60px]";
const crumbLinkClass =
  "underline decoration-(--nw-line) underline-offset-4 hover:text-(--nw-ink)";

export async function NewsArchivePage({
  locale,
  newsPage,
}: {
  locale: AppLocale;
  newsPage: NewsPage;
}) {
  const [t, tNav, tShared] = await Promise.all([
    getTranslations({ locale, namespace: "news" }),
    getTranslations({ locale, namespace: "nav" }),
    getTranslations({ locale, namespace: "groupHubShared" }),
  ]);
  const { articles, first, last, page, pageCount, total } = newsPage;
  const newest = articles[0];
  const oldest = articles.at(-1);

  const monthLabels: Record<string, string> = {};
  const items = articles.map((article) => {
    const monthKey = article.publishedAt.slice(0, 7);
    monthLabels[monthKey] ??= formatContentMonth(article.publishedAt, locale);
    const entry = toNewsIndexEntry(article, locale, {
      readLabel: (minutes) => t("readTime", { minutes }),
      topicLabel: (hub) => tNav(hub),
    });
    return { card: <NewsListCard entry={entry} />, id: article.id, monthKey };
  });

  return (
    <div className="editorial-page min-h-screen bg-background pb-14 text-(--nw-ink) antialiased md:pb-28">
      <header className={`${wrapClass} pt-[107px] md:pt-[147px]`}>
        <nav aria-label={tNav("breadcrumbAria")}>
          <ol className="flex flex-wrap items-center gap-2 text-[13px] font-medium text-(--nw-muted)">
            <li>
              <Link className={crumbLinkClass} href="/">
                {tShared("breadcrumbHome")}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link className={crumbLinkClass} href={newsIndexHref()}>
                {t("breadcrumbNews")}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{t("pageNumber", { page })}</li>
          </ol>
        </nav>
        <h1 className="mt-4 font-display text-[40px] leading-none font-semibold tracking-[-0.03em] md:mt-6 md:text-[64px] md:tracking-[-0.035em]">
          {t("archiveH1", { page })}
        </h1>
        {newest && oldest ? (
          <p className="mt-4 max-w-[640px] text-[16px] leading-[1.55] text-(--nw-soft) md:mt-6 md:text-[18px]">
            {t("archiveIntro", {
              first,
              last,
              newest: formatContentDate(newest.publishedAt, locale),
              oldest: formatContentDate(oldest.publishedAt, locale),
              total,
            })}
          </p>
        ) : null}
      </header>

      {groupNewsByMonth(items).map((month) => (
        <NewsMonthSection
          countLabel={t("articleWord", { count: month.items.length })}
          heading={monthLabels[month.key]}
          items={month.items}
          key={month.key}
        />
      ))}

      <NewsPagination current={page} locale={locale} pageCount={pageCount} />
    </div>
  );
}
