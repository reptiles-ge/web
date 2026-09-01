import { NewsArticleCard } from "@/components/NewsArticleCard";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import type { NewsArticle } from "@/data/news";
import { newsIndexHref } from "@/lib/news";
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
        <ul className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => (
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
    </section>
  );
}
