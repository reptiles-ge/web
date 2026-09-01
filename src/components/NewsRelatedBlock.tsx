import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import type { NewsArticle } from "@/data/news";
import { newsLocalizedDek, newsLocalizedTitle } from "@/data/news";
import { formatContentDate } from "@/lib/formatDate";
import { newsArticleHref, newsIndexHref } from "@/lib/news";
import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

type NewsRelatedBlockProps = {
  articles: NewsArticle[];
  locale: AppLocale;
};

export async function NewsRelatedBlock({
  articles,
  locale,
}: NewsRelatedBlockProps) {
  if (articles.length === 0) return null;

  const t = await getTranslations({ locale, namespace: "news" });

  return (
    <section className="border-t border-border bg-background py-16 lg:py-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
              {t("eyebrow")}
            </p>
            <h2 className="mt-3 font-display text-[clamp(1.5rem,3vw,2.1rem)] font-semibold leading-[1.1] text-foreground">
              {t("relatedNewsHeading")}
            </h2>
          </div>
          <Link
            href={newsIndexHref()}
            className="text-[13px] font-medium text-primary transition-opacity hover:opacity-80"
          >
            {t("allNews")}
          </Link>
        </div>
        <ul className="mt-8 grid gap-3">
          {articles.map((article) => (
            <li key={article.id}>
              <Link
                href={newsArticleHref(article.slug)}
                className="group flex items-start justify-between gap-4 rounded-2xl border border-border bg-card px-5 py-4 transition-colors hover:border-primary/25"
              >
                <span>
                  <time
                    dateTime={article.publishedAt}
                    className="text-[12px] text-muted-foreground"
                  >
                    {formatContentDate(article.publishedAt, locale)}
                  </time>
                  <span className="mt-1.5 block text-[16px] font-medium leading-snug text-foreground transition-colors group-hover:text-primary">
                    {newsLocalizedTitle(article, locale)}
                  </span>
                  <span className="mt-1.5 block max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
                    {newsLocalizedDek(article, locale)}
                  </span>
                </span>
                <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
