import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { SpeciesArticleLink, SpeciesReading } from "@/lib/speciesArticles";

import { CoverImage } from "@/components/CoverImage";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { ARTICLE_CARD_SIZES, ARTICLE_TEASER_SIZES } from "@/lib/imageSizes";

export async function SpeciesArticlesSection({
  articles,
  shortcuts,
}: Pick<SpeciesReading, "articles" | "shortcuts">) {
  if (articles.length === 0 && shortcuts.length === 0) return null;

  const [t, tHubs] = await Promise.all([
    getTranslations("profile"),
    getTranslations("groupHubShared"),
  ]);
  const single = articles.length === 1;

  return (
    <section
      className={cn(
        "border-t border-border bg-surface",
        articles.length > 0 ? "py-16 lg:py-20" : "py-10 lg:py-12",
      )}
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        {articles.length > 0 ? (
          <>
            <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
              {t("articlesEyebrow")}
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-display-card font-semibold">
              {t("articlesTitle")}
            </h2>
            <ul
              className={cn(
                "mt-8",
                single
                  ? "max-w-4xl"
                  : "-mx-6 flex snap-x snap-mandatory scroll-px-6 scrollbar-none gap-4 overflow-x-auto px-6 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3",
              )}
            >
              {articles.map((article) => (
                <li
                  className={cn(
                    !single && "w-[78%] shrink-0 snap-start sm:w-auto",
                  )}
                  key={article.href}
                >
                  <Link
                    className={cn(
                      "group flex h-full flex-col",
                      single && "sm:flex-row sm:items-center sm:gap-8",
                    )}
                    href={article.href}
                  >
                    <ArticleCover
                      className={cn(
                        "aspect-16/10 rounded-media",
                        single && "sm:w-1/2 sm:shrink-0",
                      )}
                      sizes={ARTICLE_CARD_SIZES}
                      src={article.image}
                      zoom
                    />
                    <span
                      className={cn(
                        "flex flex-1 flex-col",
                        single && "sm:py-2",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-5 text-[11px] tracking-[0.18em] text-muted-foreground uppercase",
                          single && "sm:mt-0",
                        )}
                      >
                        {tHubs(`cluster.${article.key}.eyebrow`)}
                      </span>
                      <span className="mt-2 font-display text-[19px] leading-snug font-semibold text-foreground transition-colors group-hover:text-primary sm:text-[21px]">
                        {tHubs(`cluster.${article.key}.title`)}
                      </span>
                      <span className="mt-2 line-clamp-3 flex-1 text-[14px] leading-relaxed text-muted-foreground">
                        {tHubs(`cluster.${article.key}.body`)}
                      </span>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground/70 group-hover:text-primary">
                        {tHubs(`cluster.${article.key}.cta`)}
                        <ArrowRight
                          aria-hidden="true"
                          className="size-3.5 transition-transform group-hover:translate-x-0.5"
                        />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : null}
        {shortcuts.length > 0 ? (
          <div
            className={cn(
              "flex flex-wrap items-center gap-2",
              articles.length > 0 && "mt-12 border-t border-border pt-6",
            )}
          >
            <span className="mr-2 text-[12px] text-muted-foreground">
              {t("articleShortcutsLabel")}
            </span>
            {shortcuts.map((shortcut) => (
              <Link
                className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3.5 py-1.5 text-[13px] font-medium text-foreground/80 transition-colors hover:border-primary/40 hover:text-primary"
                href={shortcut.href}
                key={shortcut.href}
              >
                {tHubs(`cluster.${shortcut.key}.title`)}
                <ArrowUpRight aria-hidden="true" className="size-3.5" />
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export async function SpeciesArticleTeaser({
  article,
}: {
  article: SpeciesArticleLink | undefined;
}) {
  if (!article) return null;

  const [t, tHubs] = await Promise.all([
    getTranslations("profile"),
    getTranslations("groupHubShared"),
  ]);

  return (
    <Link
      className="group mt-10 flex max-w-2xl items-center gap-4 rounded-card border border-border bg-card p-2.5 pr-4 transition-colors hover:border-primary/40 hover:bg-background sm:gap-5 sm:p-3 sm:pr-6"
      href={article.href}
    >
      <ArticleCover
        className="aspect-square w-24 shrink-0 rounded-[0.875rem] sm:aspect-4/3 sm:w-36"
        sizes={ARTICLE_TEASER_SIZES}
        src={article.image}
      />
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-medium tracking-[0.16em] text-primary uppercase">
          {t("articleTeaserLabel")}
        </span>
        <span className="mt-1.5 block font-display text-[17px] leading-snug font-semibold text-foreground transition-colors group-hover:text-primary sm:text-[19px]">
          {tHubs(`cluster.${article.key}.title`)}
        </span>
        <span className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground sm:text-[14px]">
          {tHubs(`cluster.${article.key}.body`)}
        </span>
      </span>
      <ArrowRight
        aria-hidden="true"
        className="hidden size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary sm:block"
      />
    </Link>
  );
}

function ArticleCover({
  className,
  sizes,
  src,
  zoom = false,
}: {
  className: string;
  sizes: string;
  src: null | string;
  zoom?: boolean;
}) {
  return (
    <span className={cn("relative block overflow-hidden bg-ink", className)}>
      {src ? (
        <CoverImage
          alt=""
          aria-hidden
          className={cn(
            "object-cover",
            zoom &&
              "transition-transform duration-700 group-hover:scale-[1.04]",
          )}
          sizes={sizes}
          src={src}
        />
      ) : null}
    </span>
  );
}
