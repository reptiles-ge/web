import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { GuideArticle } from "@/data/guideArticles";
import type { AppLocale } from "@/i18n/routing";

import { CoverImage } from "@/components/CoverImage";
import { guideArticleDatePublished } from "@/data/guideArticles";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { formatContentDate } from "@/lib/formatDate";

type GuideArticleRelatedBlockProps = {
  articles: readonly GuideArticle[];
  locale: AppLocale;
};

export async function GuideArticleRelatedBlock({
  articles,
  locale,
}: GuideArticleRelatedBlockProps) {
  if (articles.length === 0) return null;

  const t = await getTranslations({ locale, namespace: "groupHubShared" });

  return (
    <section className="border-t border-border bg-surface py-16 lg:py-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          {t("articlesEyebrow")}
        </p>
        <h2 className="mt-3 font-display text-display-title font-semibold text-foreground">
          {t("articlesTitle")}
        </h2>
        <ul
          className={cn(
            "mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-14",
            articles.length > 2 && "lg:grid-cols-3",
          )}
        >
          {articles.map((article) => (
            <li className="h-full" key={article.id}>
              <GuideArticleCard article={article} locale={locale} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

async function GuideArticleCard({
  article,
  locale,
}: {
  article: GuideArticle;
  locale: AppLocale;
}) {
  const [t, tNews] = await Promise.all([
    getTranslations({ locale, namespace: "groupHubShared" }),
    getTranslations({ locale, namespace: "news" }),
  ]);
  const copy = article.copy[locale];
  const datePublished = guideArticleDatePublished(article);

  return (
    <article className="h-full">
      <Link
        className="group flex h-full flex-col focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background focus-visible:outline-none"
        href={article.pathname}
      >
        <div className="relative aspect-16/10 overflow-hidden rounded-xl bg-ink">
          <CoverImage
            alt={article.hero.alt[locale]}
            className="object-cover object-center motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.03]"
            sizes="(max-width: 639px) 100vw, 50vw"
            src={article.hero.src}
          />
        </div>
        <div className="mt-5 flex flex-1 flex-col">
          <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
            <span>{t(`cluster.${article.messageKey}.eyebrow`)}</span>
            <span aria-hidden="true"> · </span>
            <time dateTime={datePublished}>
              {formatContentDate(datePublished, locale)}
            </time>
          </p>
          <h3 className="mt-2.5 font-display text-display-kicker font-semibold text-foreground group-hover:text-primary motion-safe:transition-colors">
            {copy.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-muted-foreground">
            {copy.description}
          </p>
          <span className="mt-auto inline-flex min-h-11 items-center gap-2 pt-5 text-[13px] font-medium text-foreground">
            <span className="border-b border-foreground/25 pb-0.5 transition-colors group-hover:border-foreground">
              {tNews("readArticle")}
            </span>
            <ArrowRight
              aria-hidden="true"
              className="size-4 text-muted-foreground group-hover:text-foreground motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </Link>
    </article>
  );
}
