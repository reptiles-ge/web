import { CoverImage } from "@/components/CoverImage";
import type { NewsArticle } from "@/data/news";
import { newsLocalizedDek, newsLocalizedTitle } from "@/data/news";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { formatContentDate } from "@/lib/formatDate";
import { newsArticleHref } from "@/lib/news";
import { getNewsVisual, newsCategoryHub } from "@/lib/newsVisual";
import { ArrowRight } from "lucide-react";
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
  const Heading = featured ? "h2" : "h3";

  const meta = (
    <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
      {category ? <span>{category}</span> : null}
      {category ? <span aria-hidden="true"> · </span> : null}
      <time dateTime={article.publishedAt}>{dateLabel}</time>
    </p>
  );

  const cta = (
    <span
      className={
        featured
          ? "mt-8 inline-flex min-h-11 items-center gap-2 text-[14px] font-medium text-foreground"
          : "mt-auto inline-flex min-h-11 items-center gap-2 pt-5 text-[13px] font-medium text-foreground"
      }
    >
      <span className="border-b border-foreground/25 pb-0.5 transition-colors group-hover:border-foreground">
        {t("readArticle")}
      </span>
      <ArrowRight
        aria-hidden="true"
        className="size-4 text-muted-foreground motion-safe:transition-transform motion-safe:duration-300 group-hover:text-foreground motion-safe:group-hover:translate-x-0.5"
      />
    </span>
  );

  if (featured) {
    return (
      <article>
        <Link
          href={newsArticleHref(article.slug)}
          className="group grid gap-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end lg:gap-16"
        >
          {visual ? (
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-ink sm:aspect-[5/3] lg:aspect-[4/3]">
              <CoverImage
                src={visual.src}
                alt={visual.alt}
                sizes="(max-width: 1023px) 100vw, 58vw"
                priority
                className="object-cover object-center motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.03]"
              />
            </div>
          ) : null}
          <div className="lg:pb-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              {t("featured")}
            </p>
            <div className="mt-3">{meta}</div>
            <Heading className="mt-4 font-display text-balance-tight text-[clamp(1.65rem,3.2vw,2.6rem)] font-semibold leading-[1.1] text-foreground motion-safe:transition-colors group-hover:text-primary">
              {title}
            </Heading>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground sm:text-[17px]">
              {dek}
            </p>
            {cta}
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="h-full">
      <Link
        href={newsArticleHref(article.slug)}
        className="group flex h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        {visual ? (
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-ink">
            <CoverImage
              src={visual.src}
              alt={visual.alt}
              sizes="(max-width: 639px) 100vw, 50vw"
              className="object-cover object-center motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.03]"
            />
          </div>
        ) : null}
        <div
          className={
            visual ? "mt-5 flex flex-1 flex-col" : "flex flex-1 flex-col"
          }
        >
          {meta}
          <Heading className="mt-2.5 font-display text-[clamp(1.15rem,1.8vw,1.4rem)] font-semibold leading-[1.18] text-foreground motion-safe:transition-colors group-hover:text-primary">
            {title}
          </Heading>
          <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-muted-foreground">
            {dek}
          </p>
          {cta}
        </div>
      </Link>
    </article>
  );
}
