import { AnchoredHeading } from "@/components/AnchoredHeading";
import { ContentAttribution } from "@/components/ContentAttribution";
import { NewsParagraphs } from "@/components/NewsRichText";
import type { NewsArticle } from "@/data/news";
import {
  getNewsCopy,
  newsRelatedHubs,
  newsRelatedRegions,
  newsRelatedSpecies,
  newsSourceOrg,
} from "@/data/news";
import { localizeRegionText } from "@/data/regions";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { formatContentDate } from "@/lib/formatDate";
import { newsIndexHref } from "@/lib/news";
import { regionHref, speciesHref } from "@/lib/speciesRoutes";
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
  const tHubs = await getTranslations({ locale, namespace: "groupHubShared" });
  const copy = getNewsCopy(article, locale);
  const dateLabel = formatContentDate(article.publishedAt, locale);
  const sourceOrg = newsSourceOrg(article);
  const species = newsRelatedSpecies(article).map((item) =>
    localizeSpecies(item, locale),
  );
  const regions = newsRelatedRegions(article);
  const hubs = newsRelatedHubs(article);

  return (
    <div className="min-h-screen bg-background">
      <main>
        <article>
          <header className="border-b border-border bg-background pt-[7.5rem] pb-12 sm:pt-[8.25rem] sm:pb-16">
            <div className="mx-auto max-w-[760px] px-6 lg:px-0">
              <Link
                href={newsIndexHref()}
                className="mb-8 inline-flex items-center gap-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="size-3.5" />
                {t("allNews")}
              </Link>
              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
                {t("eyebrow")}
              </p>
              <h1 className="mt-4 font-display text-balance-tight text-[clamp(1.85rem,4.2vw,3.15rem)] font-semibold leading-[1.08] text-foreground">
                {copy.title}
              </h1>
              <p className="mt-5 text-[15px] text-muted-foreground sm:text-[16px]">
                <time dateTime={article.publishedAt}>{dateLabel}</time>
                <span aria-hidden="true"> · </span>
                {t("editorialBy")}
              </p>
              <p className="mt-2 text-[13px] text-muted-foreground">
                {t("reportedBy", { source: sourceOrg })}
              </p>
            </div>
          </header>

          <div className="bg-background py-12 sm:py-16">
            <div className="mx-auto max-w-[760px] px-6 lg:px-0">
              <p className="text-[18px] leading-[1.7] text-foreground sm:text-[19px]">
                {copy.lead}
              </p>
              <p className="mt-6 rounded-2xl border border-border bg-card px-5 py-4 text-[14px] leading-relaxed text-muted-foreground">
                {t("editorialNote", { source: sourceOrg })}
              </p>

              {copy.sections.map((section) => (
                <section key={section.heading} className="mt-14 sm:mt-16">
                  <AnchoredHeading
                    as="h2"
                    slugSource={section.heading}
                    anchorLabel={t("anchorLink")}
                    className="font-display text-[clamp(1.45rem,2.6vw,1.9rem)] font-semibold leading-[1.15] text-foreground"
                  >
                    {section.heading}
                  </AnchoredHeading>
                  <div className="mt-5 space-y-5 text-[16px] leading-[1.75] text-muted-foreground sm:text-[17px]">
                    <NewsParagraphs
                      paragraphs={section.paragraphs}
                      locale={locale}
                    />
                  </div>
                </section>
              ))}

              <section className="mt-16 border-t border-border pt-10">
                <AnchoredHeading
                  as="h2"
                  id="sources"
                  anchorLabel={t("anchorLink")}
                  className="font-display text-[clamp(1.45rem,2.6vw,1.9rem)] font-semibold leading-[1.15] text-foreground"
                >
                  {t("sourceHeading")}
                </AnchoredHeading>
                <ul className="mt-5 space-y-3">
                  {article.sources.map((source) => (
                    <li key={source.url}>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex max-w-full items-start gap-2 text-[15px] font-medium text-foreground transition-colors hover:text-primary"
                      >
                        <span className="border-b border-foreground/20 pb-0.5 transition-colors group-hover:border-primary">
                          {source.name}
                        </span>
                        <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>

              {species.length > 0 || regions.length > 0 || hubs.length > 0 ? (
                <section className="mt-16 border-t border-border pt-10">
                  <h2 className="font-display text-[clamp(1.45rem,2.6vw,1.9rem)] font-semibold leading-[1.15] text-foreground">
                    {t("relatedHeading")}
                  </h2>
                  <ul className="mt-6 grid gap-3">
                    {hubs.map((hub) => (
                      <li key={hub.id}>
                        <Link
                          href={hub.path}
                          className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-card px-4 py-3.5 transition-colors hover:border-primary/25"
                        >
                          <span className="text-[15px] font-medium text-foreground transition-colors group-hover:text-primary">
                            {tHubs(`hubs.${hub.id}`)}
                          </span>
                          <ArrowUpRight className="size-4 text-muted-foreground" />
                        </Link>
                      </li>
                    ))}
                    {regions.map((region) => (
                      <li key={region.id}>
                        <Link
                          href={regionHref(region.id)}
                          className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-card px-4 py-3.5 transition-colors hover:border-primary/25"
                        >
                          <span className="text-[15px] font-medium text-foreground transition-colors group-hover:text-primary">
                            {localizeRegionText(region.name, locale)}
                          </span>
                          <ArrowUpRight className="size-4 text-muted-foreground" />
                        </Link>
                      </li>
                    ))}
                    {species.map((item) => (
                      <li key={item.id}>
                        <Link
                          href={speciesHref(item.id, locale)}
                          className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-card px-4 py-3.5 transition-colors hover:border-primary/25"
                        >
                          <span>
                            <span className="block text-[15px] font-medium text-foreground transition-colors group-hover:text-primary">
                              {item.commonName}
                            </span>
                            <span className="mt-0.5 block text-[12px] italic text-muted-foreground">
                              {item.scientificName}
                            </span>
                          </span>
                          <ArrowUpRight className="size-4 text-muted-foreground" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>
          </div>
        </article>
        <ContentAttribution sourcesHref="#sources" />
      </main>
    </div>
  );
}
