import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { NewsArticle } from "@/data/news";
import type { AppLocale } from "@/i18n/routing";

import { CoverImagePreload } from "@/components/CoverImagePreload";
import { NewsArticleCard } from "@/components/NewsArticleCard";
import { Link } from "@/i18n/navigation";
import { getNewsVisual } from "@/lib/newsVisual";

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
          sizes="(max-width: 1023px) 100vw, 58vw"
          src={featuredVisual.src}
        />
      ) : null}
      <main>
        <header className="pt-30 pb-12 sm:pt-33 sm:pb-16 lg:pb-20">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <nav aria-label="Breadcrumb" className="mb-8 sm:mb-10">
              <ol className="flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
                <li>
                  <Link
                    className="inline-flex min-h-11 items-center transition-colors hover:text-foreground"
                    href="/"
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
            <h1 className="text-balance-tight max-w-3xl font-display text-[clamp(2.15rem,5.5vw,3.75rem)] leading-[1.05] font-semibold text-foreground">
              {t("h1")}
            </h1>
            <p className="mt-6 max-w-2xl text-[17px] leading-snug text-foreground/90 sm:text-[18px]">
              {t("intro")}
            </p>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {t("introBody")}
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
                  <div className="mt-16 border-t border-border pt-14 sm:mt-20 sm:pt-16 lg:mt-24 lg:pt-20">
                    <h2 className="font-display text-[clamp(1.35rem,2.4vw,1.85rem)] leading-[1.15] font-semibold text-foreground">
                      {t("moreStories")}
                    </h2>
                    <ul className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-14 lg:mt-12">
                      {rest.map((article) => (
                        <li className="h-full" key={article.id}>
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

        <section className="border-t border-border bg-background py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <h2 className="text-balance-tight max-w-xl font-display text-[clamp(1.55rem,2.8vw,2.15rem)] leading-[1.15] font-semibold text-foreground">
              {t("atlasCtaTitle")}
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              {t("atlasCtaBody")}
            </p>
            <Link
              className="group mt-8 inline-flex min-h-11 items-center gap-2 text-[14px] font-medium text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:outline-none"
              href="/species"
            >
              <span className="border-b border-foreground/25 pb-0.5 transition-colors group-hover:border-foreground">
                {t("atlasCta")}
              </span>
              <ArrowRight
                aria-hidden="true"
                className="size-4 text-muted-foreground group-hover:text-foreground motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
