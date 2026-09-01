import { CoverImagePreload } from "@/components/CoverImagePreload";
import { NewsArticleCard } from "@/components/NewsArticleCard";
import { Link } from "@/i18n/navigation";
import type { NewsArticle } from "@/data/news";
import type { AppLocale } from "@/i18n/routing";
import { getNewsVisual } from "@/lib/newsVisual";
import { getTranslations } from "next-intl/server";

type NewsIndexPageProps = {
  articles: NewsArticle[];
  locale: AppLocale;
};

export async function NewsIndexPage({ articles, locale }: NewsIndexPageProps) {
  const t = await getTranslations({ locale, namespace: "news" });
  const tShared = await getTranslations({
    locale,
    namespace: "groupHubShared",
  });
  const featured = articles[0];
  const rest = articles.slice(1);
  const featuredVisual = featured ? getNewsVisual(featured, locale) : null;

  return (
    <div className="min-h-screen bg-background">
      {featuredVisual ? (
        <CoverImagePreload
          src={featuredVisual.src}
          sizes="(max-width: 1023px) 100vw, 1400px"
        />
      ) : null}
      <main>
        <header className="pt-[7.5rem] pb-10 sm:pt-[8.25rem] sm:pb-12">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8">
              <ol className="flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
                <li>
                    <Link
                      href="/"
                      className="inline-flex min-h-11 items-center transition-colors hover:text-foreground"
                    >
                      {tShared("breadcrumbHome")}
                    </Link>
                </li>
                <li aria-hidden="true" className="text-border">
                  /
                </li>
                <li className="text-foreground">{t("breadcrumbNews")}</li>
              </ol>
            </nav>
            <h1 className="max-w-3xl font-display text-balance-tight text-[clamp(2.15rem,5.5vw,3.75rem)] font-semibold leading-[1.05] text-foreground">
              {t("h1")}
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-[17px]">
              {t("intro")}
            </p>
          </div>
        </header>

        <section className="pb-20 sm:pb-24 lg:pb-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            {articles.length === 0 ? (
              <p className="text-[15px] text-muted-foreground">{t("empty")}</p>
            ) : (
              <>
                {featured ? (
                  <NewsArticleCard
                    article={featured}
                    locale={locale}
                    variant="featured"
                  />
                ) : null}
                {rest.length > 0 ? (
                  <div className="mt-16 border-t border-border pt-14 sm:mt-20 sm:pt-16">
                    <h2 className="font-display text-[clamp(1.35rem,2.4vw,1.85rem)] font-semibold leading-[1.15] text-foreground">
                      {t("moreStories")}
                    </h2>
                    <ul className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
                      {rest.map((article) => (
                        <li key={article.id}>
                          <NewsArticleCard
                            article={article}
                            locale={locale}
                            variant="grid"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
