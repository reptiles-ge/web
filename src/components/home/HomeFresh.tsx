import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { CoverImage } from "@/components/CoverImage";
import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { TrackedSpeciesLink } from "@/components/home/TrackedSpeciesLink";
import { getNewsCopy, getPublishedNewsArticles } from "@/data/news";
import { getRecentlyUpdatedSpecies } from "@/data/speciesAtlas";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { Link } from "@/i18n/navigation";
import { formatContentDate } from "@/lib/formatDate";
import { newsArticleHref, newsIndexHref } from "@/lib/news";
import { getNewsVisual } from "@/lib/newsVisual";
import { getSpeciesCoverSrc } from "@/lib/speciesContent";

export async function HomeFresh({ locale }: { locale: AppLocale }) {
  const [t, tNews] = await Promise.all([
    getTranslations({ locale, namespace: "home.fresh" }),
    getTranslations({ locale, namespace: "news" }),
  ]);
  const [lead, ...rest] = getPublishedNewsArticles(locale);
  const updated = getRecentlyUpdatedSpecies(4).map((species) => ({
    cover: getSpeciesCoverSrc(species),
    species: localizeSpecies(species, locale),
  }));
  if (!lead && updated.length === 0) return null;
  const leadCopy = lead ? getNewsCopy(lead, locale) : null;
  const leadVisual = lead ? getNewsVisual(lead, locale) : null;

  return (
    <section className="bg-background py-11 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-[60px]">
        <div className="flex items-end justify-between gap-4">
          <HomeSectionHeading eyebrow={t("eyebrow")} title={t("title")} />
          <Link
            className="hidden min-h-11 items-center gap-1.5 text-[14px] font-medium text-foreground hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:inline-flex"
            href={newsIndexHref()}
          >
            {tNews("allNews")}
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <div className="mt-6 grid gap-5 lg:mt-11 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-[72px]">
          <div className="min-w-0">
            {lead && leadCopy ? (
              <Link
                className="group flex flex-col rounded-[24px] bg-card p-3 shadow-[0_16px_40px_rgba(14,20,17,0.06)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:flex-row lg:items-stretch lg:rounded-[32px]"
                href={newsArticleHref(lead.slug)}
              >
                {leadVisual ? (
                  <span className="relative block aspect-3/2 overflow-hidden rounded-[18px] bg-ink lg:order-2 lg:aspect-auto lg:w-[40%] lg:shrink-0 lg:rounded-[24px]">
                    <CoverImage
                      alt={leadVisual.alt}
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                      sizes="(max-width: 1023px) 100vw, 320px"
                      src={leadVisual.src}
                    />
                  </span>
                ) : null}
                <span className="block p-2 lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:p-5">
                  <time
                    className="text-[12px] text-muted-foreground"
                    dateTime={lead.publishedAt}
                  >
                    {formatContentDate(lead.publishedAt, locale)}
                  </time>
                  <h3 className="mt-2 max-w-[720px] font-display text-[19px] leading-snug font-semibold text-foreground lg:mt-2.5 lg:text-[26px] lg:leading-[1.22]">
                    {leadCopy.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 max-w-[680px] text-[14px] leading-[1.6] text-muted-foreground lg:mt-2.5 lg:text-[14.5px]">
                    {leadCopy.dek}
                  </p>
                </span>
              </Link>
            ) : null}
            {rest.length > 0 ? (
              <ul className="mt-2.5 space-y-2 lg:mt-3">
                {rest.slice(0, 4).map((article) => {
                  const copy = getNewsCopy(article, locale);
                  if (!copy) return null;
                  return (
                    <li key={article.slug}>
                      <Link
                        className="group flex min-h-[58px] items-center gap-3 rounded-[18px] bg-surface px-4 py-3 transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:gap-6 lg:rounded-[22px] lg:px-7 lg:py-[18px]"
                        href={newsArticleHref(article.slug)}
                      >
                        <span className="flex min-w-0 flex-1 flex-col gap-1 lg:flex-row lg:items-baseline lg:gap-6">
                          <time
                            className="shrink-0 text-[11.5px] text-muted-foreground lg:w-[150px] lg:text-[12.5px]"
                            dateTime={article.publishedAt}
                          >
                            {formatContentDate(article.publishedAt, locale)}
                          </time>
                          <span className="line-clamp-2 font-display text-[14.5px] leading-[1.4] font-medium text-foreground lg:text-[16px]">
                            {copy.title}
                          </span>
                        </span>
                        <ArrowRight
                          aria-hidden="true"
                          className="size-4 shrink-0 text-muted-foreground group-hover:text-primary"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : null}
            <Link
              className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-[14px] font-medium text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:hidden"
              href={newsIndexHref()}
            >
              <span className="border-b border-foreground/30 pb-0.5">
                {tNews("allNews")}
              </span>
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>

          {updated.length > 0 ? (
            <div className="rounded-[24px] bg-card px-5 pt-5 pb-2 shadow-[0_16px_40px_rgba(14,20,17,0.06)] lg:rounded-[32px] lg:px-[30px] lg:pt-7 lg:pb-3">
              <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                {t("updated")}
              </p>
              <ul className="mt-4 divide-y divide-border">
                {updated.map(({ cover, species }, index) => (
                  <li key={species.id}>
                    <TrackedSpeciesLink
                      className="group flex min-h-[69px] items-center gap-3 py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      locale={locale}
                      position={index + 1}
                      source="home_fresh"
                      speciesId={species.id}
                    >
                      <span className="relative size-14 shrink-0 overflow-hidden rounded-[12px] bg-ink sm:size-16">
                        {cover ? (
                          <CoverImage
                            alt=""
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="64px"
                            src={cover}
                          />
                        ) : null}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-[14px] leading-snug font-semibold text-foreground">
                          {species.commonName}
                        </span>
                        <span className="mt-0.5 block truncate text-[12px] text-muted-foreground italic">
                          {species.scientificName}
                        </span>
                      </span>
                      <time
                        className="shrink-0 text-[11px] text-muted-foreground"
                        dateTime={species.updatedAt}
                      >
                        {formatContentDate(species.updatedAt, locale)}
                      </time>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-4 shrink-0 text-muted-foreground group-hover:text-primary"
                      />
                    </TrackedSpeciesLink>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
