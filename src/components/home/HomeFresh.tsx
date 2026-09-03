import { CoverImage } from "@/components/CoverImage";
import { TrackedSpeciesLink } from "@/components/home/TrackedSpeciesLink";
import { getNewsCopy, getPublishedNewsArticles } from "@/data/news";
import { getRecentlyUpdatedSpecies } from "@/data/speciesAtlas";
import type { Species } from "@/data/species";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import type { AppLocale } from "@/i18n/routing";
import { formatContentDate } from "@/lib/formatDate";
import { newsArticleHref, newsIndexHref } from "@/lib/news";
import { getNewsVisual } from "@/lib/newsVisual";
import { isPlaceholderMedia } from "@/lib/speciesContent";
import { speciesImageAlt } from "@/lib/speciesMeta";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

export async function HomeFresh() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("home.fresh");
  const tNews = await getTranslations("news");
  const articles = getPublishedNewsArticles();
  const [lead, ...rest] = articles;
  const updated: Species[] = [];
  for (const item of getRecentlyUpdatedSpecies(4)) {
    const localized = localizeSpecies(item, locale);
    if (!isPlaceholderMedia(localized.image)) updated.push(localized);
  }

  if (!lead && updated.length === 0) return null;

  const leadCopy = lead ? getNewsCopy(lead, locale) : null;
  const leadVisual = lead ? getNewsVisual(lead, locale) : null;

  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              {t("eyebrow")}
            </p>
            <h2 className="mt-4 font-display text-balance-tight text-[clamp(1.65rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              {t("title")}
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>
          {lead ? (
            <Link
              href={newsIndexHref()}
              className="inline-flex min-h-11 items-center gap-1.5 text-[13px] font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
            >
              {tNews("allNews")}
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          ) : null}
        </div>

        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-20">
          {lead && leadCopy ? (
            <article>
              <Link
                href={newsArticleHref(lead.slug)}
                className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
              >
                {leadVisual ? (
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface">
                    <CoverImage
                      src={leadVisual.src}
                      alt={leadVisual.alt}
                      sizes="(max-width: 1023px) 100vw, 60vw"
                      className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.03]"
                    />
                  </div>
                ) : null}
                <p className="mt-5 text-[12px] text-muted-foreground">
                  <time dateTime={lead.publishedAt}>
                    {formatContentDate(lead.publishedAt, locale)}
                  </time>
                </p>
                <h3 className="mt-2 font-display text-[clamp(1.35rem,2.4vw,1.85rem)] font-semibold leading-[1.15] text-foreground transition-colors group-hover:text-primary">
                  {leadCopy.title}
                </h3>
                <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                  {leadCopy.dek}
                </p>
              </Link>
              {rest.length > 0 ? (
                <ul className="mt-8 space-y-4 border-t border-border pt-6">
                  {rest.map((article) => {
                    const copy = getNewsCopy(article, locale);
                    return (
                      <li key={article.slug}>
                        <Link
                          href={newsArticleHref(article.slug)}
                          className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
                        >
                          <p className="text-[12px] text-muted-foreground">
                            <time dateTime={article.publishedAt}>
                              {formatContentDate(article.publishedAt, locale)}
                            </time>
                          </p>
                          <p className="mt-1 font-display text-[16px] font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                            {copy.title}
                          </p>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </article>
          ) : null}

          {updated.length > 0 ? (
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                {t("updated")}
              </p>
              <ul className="mt-5 divide-y divide-border border-y border-border">
                {updated.map((species, index) => {
                  const cover = !isPlaceholderMedia(species.mobileImage)
                    ? species.mobileImage
                    : species.image;

                  return (
                    <li key={species.id}>
                      <TrackedSpeciesLink
                        speciesId={species.id}
                        locale={locale}
                        source="home_fresh"
                        position={index + 1}
                        className="group flex items-center gap-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
                      >
                        <span className="relative size-16 shrink-0 overflow-hidden bg-ink sm:size-[4.5rem]">
                          <CoverImage
                            src={cover ?? species.image}
                            alt={speciesImageAlt(
                              species.commonName,
                              species.scientificName,
                              species.location,
                            )}
                            sizes="72px"
                            className="object-cover"
                          />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-display text-[16px] font-semibold text-foreground">
                            {species.commonName}
                          </span>
                          <span className="mt-0.5 block truncate text-[13px] italic text-muted-foreground">
                            {species.scientificName}
                          </span>
                          <time
                            dateTime={species.updatedAt}
                            className="mt-1 block text-[12px] text-muted-foreground/80"
                          >
                            {formatContentDate(species.updatedAt, locale)}
                          </time>
                        </span>
                      </TrackedSpeciesLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
