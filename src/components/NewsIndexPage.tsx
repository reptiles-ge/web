import type { NewsArticle } from "@/data/news";
import { newsLocalizedDek, newsLocalizedTitle } from "@/data/news";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { formatContentDate } from "@/lib/formatDate";
import { newsArticleHref } from "@/lib/news";
import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

type NewsIndexPageProps = {
  articles: NewsArticle[];
  locale: AppLocale;
};

export async function NewsIndexPage({ articles, locale }: NewsIndexPageProps) {
  const t = await getTranslations({ locale, namespace: "news" });

  return (
    <div className="min-h-screen bg-background">
      <main>
        <header className="border-b border-border bg-background pt-[7.5rem] pb-12 sm:pt-[8.25rem] sm:pb-16">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
              {t("eyebrow")}
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-balance-tight text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.06] text-foreground">
              {t("h1")}
            </h1>
            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
              {t("intro")}
            </p>
          </div>
        </header>

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            {articles.length === 0 ? (
              <p className="text-[15px] text-muted-foreground">{t("empty")}</p>
            ) : (
              <ul className="grid gap-4">
                {articles.map((article) => (
                  <li key={article.id}>
                    <Link
                      href={newsArticleHref(article.slug)}
                      className="group block rounded-[24px] border border-border bg-card px-6 py-6 transition-colors hover:border-primary/25 sm:px-8 sm:py-7"
                    >
                      <time
                        dateTime={article.publishedAt}
                        className="text-[12px] text-muted-foreground"
                      >
                        {formatContentDate(article.publishedAt, locale)}
                      </time>
                      <h2 className="mt-3 max-w-3xl font-display text-[clamp(1.35rem,2.4vw,1.85rem)] font-semibold leading-[1.15] text-foreground transition-colors group-hover:text-primary">
                        {newsLocalizedTitle(article, locale)}
                      </h2>
                      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
                        {newsLocalizedDek(article, locale)}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-2 text-[14px] font-medium text-foreground">
                        {t("readArticle")}
                        <ArrowUpRight className="size-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
