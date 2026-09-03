import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { NewsArticle } from "@/data/news";
import type { AppLocale } from "@/i18n/routing";
import type { GroupHubId } from "@/lib/groupHubs";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { ContentAttribution } from "@/components/ContentAttribution";
import { CoverImage } from "@/components/CoverImage";
import { CoverImagePreload } from "@/components/CoverImagePreload";
import { NewsRichText } from "@/components/NewsRichText";
import {
  getNewsCopy,
  newsPhotoBySrc,
  newsRelatedHubs,
  newsRelatedRegions,
  newsRelatedSpecies,
  newsSourceOrg,
} from "@/data/news";
import { getRegionHeroImage } from "@/data/regionImages";
import { localizeRegionText } from "@/data/regions";
import { getSpeciesById, hasPhotoCredit } from "@/data/species";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { Link } from "@/i18n/navigation";
import { formatContentDate, formatPhotoDate } from "@/lib/formatDate";
import { newsIndexHref } from "@/lib/news";
import {
  getNewsVisual,
  localizeNewsPhoto,
  newsCategoryHub,
  type NewsVisual,
} from "@/lib/newsVisual";
import { isPlaceholderMedia } from "@/lib/speciesContent";
import { speciesPhotoAlt } from "@/lib/speciesMeta";
import { regionHref, speciesHref, type SpeciesHref } from "@/lib/speciesRoutes";

type NewsArticlePageProps = {
  article: NewsArticle;
  locale: AppLocale;
};

export async function NewsArticlePage({
  article,
  locale,
}: NewsArticlePageProps) {
  const [t, tNav, tShared] = await Promise.all([
    getTranslations({ locale, namespace: "news" }),
    getTranslations({ locale, namespace: "nav" }),
    getTranslations({
      locale,
      namespace: "groupHubShared",
    }),
  ]);
  const copy = getNewsCopy(article, locale);
  const dateLabel = formatContentDate(article.publishedAt, locale);
  const sourceOrg = newsSourceOrg(article);
  const hub = newsCategoryHub(article);
  const category = hub ? tNav(hub) : null;
  const visual = getNewsVisual(article, locale);
  const primarySource = article.sources[0];
  const moreSources = article.sources.slice(1);
  const species = newsRelatedSpecies(article).map((item) =>
    localizeSpecies(item, locale),
  );
  const regions = newsRelatedRegions(article);
  const hubs = newsRelatedHubs(article);
  const hasRelated =
    species.length > 0 || regions.length > 0 || hubs.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {visual ? (
        <CoverImagePreload
          sizes="(max-width: 1023px) 100vw, 1400px"
          src={visual.src}
        />
      ) : null}
      <main>
        <article className="mx-auto max-w-[1400px] px-6 pt-30 pb-16 sm:pt-33 sm:pb-20 lg:px-10">
          <header>
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
                <li>
                  <Link
                    className="inline-flex min-h-11 items-center transition-colors hover:text-foreground"
                    href={newsIndexHref()}
                  >
                    {t("breadcrumbNews")}
                  </Link>
                </li>
                <li aria-hidden="true" className="text-border">
                  /
                </li>
                <li
                  aria-current="page"
                  className="max-w-[min(100%,42rem)] min-w-0 text-foreground"
                >
                  {copy.title}
                </li>
              </ol>
            </nav>
            <p className="text-[11px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
              {category ? <span>{category}</span> : null}
              {category ? <span aria-hidden="true"> · </span> : null}
              <time dateTime={article.publishedAt}>{dateLabel}</time>
            </p>
            <h1 className="text-balance-tight mt-5 font-display text-[clamp(1.95rem,4.8vw,3.35rem)] leading-[1.08] font-semibold text-foreground">
              {copy.title}
            </h1>
            <p className="mt-5 text-[17px] leading-[1.65] text-foreground sm:text-[19px]">
              {copy.dek}
            </p>
          </header>

          {visual ? (
            <NewsFigure
              locale={locale}
              photoCreditLabel={t("photoCredit")}
              photoFromAtlas={t("photoFromAtlas")}
              priority
              sizes="(max-width: 1023px) 100vw, 1400px"
              visual={visual}
            />
          ) : null}

          <div className="pt-10 sm:pt-12">
            <p className="text-[17px] leading-[1.75] text-muted-foreground sm:text-[18px]">
              {copy.lead}
            </p>

            {copy.sections.map((section) => (
              <section className="mt-14 sm:mt-16" key={section.heading}>
                <AnchoredHeading
                  anchorLabel={t("anchorLink")}
                  as="h2"
                  className="font-display text-[clamp(1.4rem,2.4vw,1.8rem)] leading-[1.15] font-semibold text-foreground"
                  slugSource={section.heading}
                >
                  {section.heading}
                </AnchoredHeading>
                <div className="mt-5 space-y-5 text-[16px] leading-[1.8] text-muted-foreground sm:text-[17px]">
                  {section.blocks.map((block, index) => {
                    if (block.type === "figure") {
                      const photo = newsPhotoBySrc(article, block.src);
                      if (!photo) return null;
                      return (
                        <NewsFigure
                          compact
                          key={block.src}
                          locale={locale}
                          photoCreditLabel={t("photoCredit")}
                          photoFromAtlas={t("photoFromAtlas")}
                          sizes="(max-width: 1023px) 100vw, 1400px"
                          visual={localizeNewsPhoto(photo, locale)}
                        />
                      );
                    }
                    return (
                      <p key={`p:${section.heading}:${index}`}>
                        <NewsRichText locale={locale} parts={block.parts} />
                      </p>
                    );
                  })}
                </div>
              </section>
            ))}

            {primarySource ? (
              <aside className="mt-16 border-t border-border pt-10 sm:mt-20">
                <AnchoredHeading
                  anchorLabel={t("anchorLink")}
                  as="h2"
                  className="font-display text-[clamp(1.4rem,2.4vw,1.8rem)] leading-[1.15] font-semibold text-foreground"
                  id="sources"
                >
                  {t("sourceHeading")}
                </AnchoredHeading>
                <a
                  className="group mt-6 inline-flex min-h-11 max-w-full items-center gap-2 font-display text-[clamp(1.35rem,2.2vw,1.7rem)] leading-snug font-semibold text-foreground transition-colors hover:text-primary"
                  href={primarySource.url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {sourceOrg}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 shrink-0 text-muted-foreground group-hover:text-primary motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
                  />
                </a>
                {moreSources.length > 0 ? (
                  <ul className="mt-6 space-y-2">
                    {moreSources.map((source) => (
                      <li key={source.url}>
                        <a
                          className="group inline-flex max-w-full items-start gap-2 text-[14px] text-muted-foreground transition-colors hover:text-foreground"
                          href={source.url}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <span className="border-b border-border pb-0.5 transition-colors group-hover:border-foreground/40">
                            {source.name}
                          </span>
                          <ArrowUpRight
                            aria-hidden="true"
                            className="mt-0.5 size-3.5 shrink-0"
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </aside>
            ) : null}
          </div>

          {hasRelated ? (
            <section className="mt-16 border-t border-border pt-10 sm:mt-20">
              <h2 className="font-display text-[clamp(1.4rem,2.4vw,1.8rem)] leading-[1.15] font-semibold text-foreground">
                {t("relatedHeading")}
              </h2>
              <ul className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                {species.map((item) => (
                  <li key={item.id}>
                    <RelatedAtlasCard
                      href={speciesHref(item.id, locale)}
                      image={isPlaceholderMedia(item.image) ? null : item.image}
                      imageAlt={speciesPhotoAlt(
                        item.commonName,
                        item.scientificName,
                        item.location,
                        item.imageCredit,
                      )}
                      subtitle={item.scientificName}
                      title={item.commonName}
                    />
                  </li>
                ))}
                {regions.map((region) => (
                  <li key={region.id}>
                    <RelatedAtlasCard
                      href={regionHref(region.id)}
                      image={getRegionHeroImage(region.id)}
                      imageAlt={localizeRegionText(region.name, locale)}
                      title={localizeRegionText(region.name, locale)}
                    />
                  </li>
                ))}
                {hubs.map((relatedHub) => {
                  const hero = getSpeciesById(relatedHub.heroSpeciesId);
                  return (
                    <li key={relatedHub.id}>
                      <RelatedAtlasCard
                        href={relatedHub.path}
                        image={
                          hero && !isPlaceholderMedia(hero.image)
                            ? hero.image
                            : null
                        }
                        imageAlt={
                          hero
                            ? speciesPhotoAlt(
                                localizeSpecies(hero, locale).commonName,
                                hero.scientificName,
                                localizeSpecies(hero, locale).location,
                                hero.imageCredit,
                              )
                            : ""
                        }
                        title={tNav(relatedHub.id)}
                      />
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          <p className="mt-16 sm:mt-20">
            <Link
              className="inline-flex min-h-11 items-center gap-2 text-[14px] font-medium text-foreground transition-colors hover:text-primary"
              href={newsIndexHref()}
            >
              <ArrowLeft aria-hidden="true" className="size-3.5" />
              {t("allNews")}
            </Link>
          </p>
        </article>
        <ContentAttribution sourcesHref="#sources" />
      </main>
    </div>
  );
}

function NewsFigure({
  compact = false,
  locale,
  photoCreditLabel,
  photoFromAtlas,
  priority = false,
  sizes,
  visual,
}: {
  compact?: boolean;
  locale: AppLocale;
  photoCreditLabel: string;
  photoFromAtlas: string;
  priority?: boolean;
  sizes: string;
  visual: NewsVisual;
}) {
  const dateLabel = visual.credit?.date
    ? formatPhotoDate(visual.credit.date, locale)
    : null;
  const photographer = visual.credit?.photographer;
  const creditMeta = [photographer, visual.credit?.location, dateLabel].filter(
    Boolean,
  );

  return (
    <figure className={compact ? "py-3 sm:py-4" : "mt-10 lg:mt-14"}>
      {visual.plate ? (
        <CoverImage
          alt={visual.alt}
          className={
            compact
              ? "h-auto w-full rounded-[20px] bg-surface"
              : "h-auto w-full rounded-[24px] bg-surface"
          }
          fill={false}
          priority={priority}
          sizes={sizes}
          src={visual.src}
        />
      ) : (
        <div
          className={
            compact
              ? "relative aspect-16/10 overflow-hidden rounded-[20px] bg-surface"
              : "relative aspect-16/10 overflow-hidden rounded-[24px] bg-surface sm:aspect-2/1"
          }
        >
          <CoverImage
            alt={visual.alt}
            className="object-cover object-center"
            priority={priority}
            sizes={sizes}
            src={visual.src}
          />
        </div>
      )}
      <figcaption className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
        {visual.fromAtlas ? `${photoFromAtlas} ` : null}
        {visual.alt}
        <NewsFigureCredit
          credit={visual.credit}
          creditMeta={creditMeta}
          dateLabel={dateLabel}
          photographer={photographer}
          photoCreditLabel={photoCreditLabel}
        />
      </figcaption>
    </figure>
  );
}

function NewsFigureCredit({
  credit,
  creditMeta,
  dateLabel,
  photographer,
  photoCreditLabel,
}: {
  credit: NewsVisual["credit"];
  creditMeta: string[];
  dateLabel: null | string;
  photographer: string | undefined;
  photoCreditLabel: string;
}) {
  if (!hasPhotoCredit(credit) || creditMeta.length === 0) return null;
  return (
    <>
      {" "}
      {photographer ? (
        credit.url ? (
          <a
            className="text-foreground/80 underline decoration-foreground/20 underline-offset-[3px] transition-colors hover:decoration-primary"
            href={credit.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            {photoCreditLabel} {photographer}
          </a>
        ) : (
          <span>
            {photoCreditLabel} {photographer}
          </span>
        )
      ) : null}
      {credit.location || dateLabel ? (
        <span>
          {photographer ? " · " : null}
          {[credit.location, dateLabel].filter(Boolean).join(" · ")}
        </span>
      ) : null}
    </>
  );
}

function RelatedAtlasCard({
  href,
  image,
  imageAlt,
  subtitle,
  title,
}: {
  href: `/${GroupHubId}` | ReturnType<typeof regionHref> | SpeciesHref;
  image: null | string;
  imageAlt: string;
  subtitle?: string;
  title: string;
}) {
  return (
    <Link
      className="group block rounded-[4px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background focus-visible:outline-none"
      href={href}
    >
      {image ? (
        <div className="relative aspect-16/10 overflow-hidden rounded-[16px] bg-surface">
          <CoverImage
            alt={imageAlt}
            className="object-cover object-center motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.03]"
            sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 33vw"
            src={image}
          />
        </div>
      ) : null}
      <p className="mt-3 font-display text-[17px] leading-snug font-semibold text-foreground group-hover:text-primary motion-safe:transition-colors">
        {title}
      </p>
      {subtitle ? (
        <p className="mt-1 text-[13px] text-muted-foreground italic">
          {subtitle}
        </p>
      ) : null}
    </Link>
  );
}
