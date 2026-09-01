import { AnchoredHeading } from "@/components/AnchoredHeading";
import { ContentAttribution } from "@/components/ContentAttribution";
import { CoverImage } from "@/components/CoverImage";
import { CoverImagePreload } from "@/components/CoverImagePreload";
import { NewsParagraphs } from "@/components/NewsRichText";
import type { NewsArticle } from "@/data/news";
import {
  getNewsCopy,
  newsRelatedHubs,
  newsRelatedRegions,
  newsRelatedSpecies,
  newsSourceOrg,
} from "@/data/news";
import { getRegionHeroImage } from "@/data/regionImages";
import { localizeRegionText } from "@/data/regions";
import { getSpeciesById } from "@/data/species";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { formatContentDate } from "@/lib/formatDate";
import { newsIndexHref } from "@/lib/news";
import { getNewsVisual, newsCategoryHub } from "@/lib/newsVisual";
import {
  regionHref,
  speciesHref,
  type SpeciesHref,
} from "@/lib/speciesRoutes";
import type { GroupHubId } from "@/lib/groupHubs";
import { isPlaceholderMedia } from "@/lib/speciesContent";
import { speciesPhotoAlt } from "@/lib/speciesMeta";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

type NewsArticlePageProps = {
  article: NewsArticle;
  locale: AppLocale;
};

export async function NewsArticlePage({
  article,
  locale,
}: NewsArticlePageProps) {
  const t = await getTranslations({ locale, namespace: "news" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tShared = await getTranslations({
    locale,
    namespace: "groupHubShared",
  });
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
  const hasRelated = species.length > 0 || regions.length > 0 || hubs.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {visual ? (
        <CoverImagePreload
          src={visual.src}
          sizes="(max-width: 1023px) 100vw, 1400px"
        />
      ) : null}
      <main>
        <article className="mx-auto max-w-[1400px] px-6 pt-[7.5rem] pb-16 sm:pt-[8.25rem] sm:pb-20 lg:px-10">
          <header>
            <nav aria-label="Breadcrumb" className="mb-8 sm:mb-10">
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
                <li>
                  <Link
                    href={newsIndexHref()}
                    className="inline-flex min-h-11 items-center transition-colors hover:text-foreground"
                  >
                    {t("breadcrumbNews")}
                  </Link>
                </li>
                <li aria-hidden="true" className="text-border">
                  /
                </li>
                <li
                  aria-current="page"
                  className="min-w-0 max-w-[min(100%,42rem)] text-foreground"
                >
                  {copy.title}
                </li>
              </ol>
            </nav>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              {category ? <span>{category}</span> : null}
              {category ? <span aria-hidden="true"> · </span> : null}
              <time dateTime={article.publishedAt}>{dateLabel}</time>
            </p>
            <h1 className="mt-5 max-w-4xl font-display text-balance-tight text-[clamp(1.95rem,4.8vw,3.35rem)] font-semibold leading-[1.08] text-foreground">
              {copy.title}
            </h1>
            <p className="mt-5 max-w-3xl text-[17px] leading-[1.65] text-foreground sm:text-[19px]">
              {copy.dek}
            </p>
          </header>

          {visual ? (
            <figure className="mt-10 lg:mt-14">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] bg-surface sm:aspect-[2/1]">
                <CoverImage
                  src={visual.src}
                  alt={visual.alt}
                  sizes="(max-width: 1023px) 100vw, 1400px"
                  priority
                  className="object-cover object-center"
                />
              </div>
              <figcaption className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
                {t("photoFromAtlas")} {visual.alt}
              </figcaption>
            </figure>
          ) : null}

          <div className="max-w-3xl pt-10 sm:pt-12">
            <p className="text-[17px] leading-[1.75] text-muted-foreground sm:text-[18px]">
              {copy.lead}
            </p>

            {copy.sections.map((section) => (
              <section key={section.heading} className="mt-14 sm:mt-16">
                <AnchoredHeading
                  as="h2"
                  slugSource={section.heading}
                  anchorLabel={t("anchorLink")}
                  className="font-display text-[clamp(1.4rem,2.4vw,1.8rem)] font-semibold leading-[1.15] text-foreground"
                >
                  {section.heading}
                </AnchoredHeading>
                <div className="mt-5 space-y-5 text-[16px] leading-[1.8] text-muted-foreground sm:text-[17px]">
                  <NewsParagraphs
                    paragraphs={section.paragraphs}
                    locale={locale}
                  />
                </div>
              </section>
            ))}

            {primarySource ? (
              <aside className="mt-16 border-t border-border pt-10 sm:mt-20">
                <AnchoredHeading
                  as="h2"
                  id="sources"
                  anchorLabel={t("anchorLink")}
                  className="font-display text-[clamp(1.4rem,2.4vw,1.8rem)] font-semibold leading-[1.15] text-foreground"
                >
                  {t("sourceHeading")}
                </AnchoredHeading>
                <div className="mt-7">
                  <p className="font-display text-[clamp(1.35rem,2.2vw,1.7rem)] font-semibold leading-snug text-foreground">
                    {sourceOrg}
                  </p>
                  <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-muted-foreground">
                    {t("editorialNote", { source: sourceOrg })}
                  </p>
                  <a
                    href={primarySource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex min-h-11 items-center gap-2 text-[14px] font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {t("sourceVisit")}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 text-muted-foreground"
                    />
                    <span className="sr-only"> ({primarySource.name})</span>
                  </a>
                </div>
                {moreSources.length > 0 ? (
                  <ul className="mt-8 space-y-2">
                    {moreSources.map((source) => (
                      <li key={source.url}>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex max-w-full items-start gap-2 text-[14px] text-muted-foreground transition-colors hover:text-foreground"
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
              <h2 className="font-display text-[clamp(1.4rem,2.4vw,1.8rem)] font-semibold leading-[1.15] text-foreground">
                {t("relatedHeading")}
              </h2>
              <ul className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                {species.map((item) => (
                  <li key={item.id}>
                    <RelatedAtlasCard
                      href={speciesHref(item.id, locale)}
                      title={item.commonName}
                      subtitle={item.scientificName}
                      image={
                        isPlaceholderMedia(item.image) ? null : item.image
                      }
                      imageAlt={speciesPhotoAlt(
                        item.commonName,
                        item.scientificName,
                        item.location,
                        item.imageCredit,
                      )}
                    />
                  </li>
                ))}
                {regions.map((region) => (
                  <li key={region.id}>
                    <RelatedAtlasCard
                      href={regionHref(region.id)}
                      title={localizeRegionText(region.name, locale)}
                      image={getRegionHeroImage(region.id)}
                      imageAlt={localizeRegionText(region.name, locale)}
                    />
                  </li>
                ))}
                {hubs.map((relatedHub) => {
                  const hero = getSpeciesById(relatedHub.heroSpeciesId);
                  return (
                    <li key={relatedHub.id}>
                      <RelatedAtlasCard
                        href={relatedHub.path}
                        title={tNav(relatedHub.id)}
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
                      />
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          <p className="mt-16 sm:mt-20">
            <Link
              href={newsIndexHref()}
              className="inline-flex min-h-11 items-center gap-2 text-[14px] font-medium text-foreground transition-colors hover:text-primary"
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

function RelatedAtlasCard({
  href,
  title,
  subtitle,
  image,
  imageAlt,
}: {
  href: SpeciesHref | ReturnType<typeof regionHref> | `/${GroupHubId}`;
  title: string;
  subtitle?: string;
  image: string | null;
  imageAlt: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-[4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      {image ? (
        <div className="relative aspect-[16/10] overflow-hidden rounded-[16px] bg-surface">
          <CoverImage
            src={image}
            alt={imageAlt}
            sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 33vw"
            className="object-cover object-center motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.03]"
          />
        </div>
      ) : null}
      <p className="mt-3 font-display text-[17px] font-semibold leading-snug text-foreground motion-safe:transition-colors group-hover:text-primary">
        {title}
      </p>
      {subtitle ? (
        <p className="mt-1 text-[13px] italic text-muted-foreground">{subtitle}</p>
      ) : null}
    </Link>
  );
}
