import { CoverImage } from "@/components/CoverImage";
import type { NewsArticle } from "@/data/news";
import { newsLocalizedDek, newsLocalizedTitle } from "@/data/news";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { formatContentDate } from "@/lib/formatDate";
import { newsArticleHref } from "@/lib/news";
import { newsCategoryHub, getNewsVisual } from "@/lib/newsVisual";
import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

type NewsArticleCardProps = {
  article: NewsArticle;
  locale: AppLocale;
  variant?: "featured" | "grid";
};

export async function NewsArticleCard({
  article,
  locale,
  variant = "grid",
}: NewsArticleCardProps) {
  const t = await getTranslations({ locale, namespace: "news" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const title = newsLocalizedTitle(article, locale);
  const dek = newsLocalizedDek(article, locale);
  const dateLabel = formatContentDate(article.publishedAt, locale);
  const hub = newsCategoryHub(article);
  const category = hub ? tNav(hub) : null;
  const visual = getNewsVisual(article, locale);
  const featured = variant === "featured";

  const meta = (
    <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
      {category ? <span>{category}</span> : null}
      {category ? <span aria-hidden="true"> · </span> : null}
      <time dateTime={article.publishedAt}>{dateLabel}</time>
    </p>
  );

  const Heading = featured ? "h2" : "h3";

  return (
    <article>
      <Link
        href={newsArticleHref(article.slug)}
        className={
          featured
            ? "group grid overflow-hidden rounded-[24px] bg-card ring-1 ring-border/80 transition-[ring-color] hover:ring-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:grid-cols-[1.12fr_0.88fr]"
            : "group block rounded-[4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        }
      >
        {visual ? (
          <div
            className={
              featured
                ? "relative aspect-[16/10] overflow-hidden bg-muted lg:aspect-auto lg:min-h-[32rem]"
                : "relative aspect-[16/10] overflow-hidden rounded-[20px] bg-muted"
            }
          >
            <CoverImage
              src={visual.src}
              alt={visual.alt}
              sizes={
                featured
                  ? "(max-width: 1023px) 100vw, 58vw"
                  : "(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 33vw"
              }
              priority={featured}
              className="object-cover object-center motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.03]"
            />
          </div>
        ) : featured ? (
          <div className="bg-surface aspect-[16/10] lg:aspect-auto lg:min-h-[32rem]" />
        ) : null}
        <div
          className={
            featured
              ? "flex flex-col justify-center px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14"
              : visual
                ? "mt-5"
                : ""
          }
        >
          {featured ? (
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              {t("featured")}
            </p>
          ) : null}
          <div className={featured ? "mt-4" : ""}>{meta}</div>
          <Heading
            className={
              featured
                ? "mt-4 font-display text-balance-tight text-[clamp(1.55rem,2.8vw,2.45rem)] font-semibold leading-[1.12] text-foreground motion-safe:transition-colors group-hover:text-primary"
                : "mt-2.5 font-display text-[clamp(1.2rem,2vw,1.45rem)] font-semibold leading-[1.18] text-foreground motion-safe:transition-colors group-hover:text-primary"
            }
          >
            {title}
          </Heading>
          <p
            className={
              featured
                ? "mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]"
                : "mt-2 line-clamp-3 text-[14px] leading-relaxed text-muted-foreground"
            }
          >
            {dek}
          </p>
          <span
            className={
              featured
                ? "mt-7 inline-flex min-h-11 items-center gap-2 text-[14px] font-medium text-foreground"
                : "mt-4 inline-flex min-h-10 items-center gap-2 text-[13px] font-medium text-foreground/80 group-hover:text-primary"
            }
          >
            {t("readArticle")}
            <ArrowUpRight className="size-4 text-muted-foreground motion-safe:transition-transform motion-safe:duration-300 group-hover:text-primary motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </article>
  );
}
