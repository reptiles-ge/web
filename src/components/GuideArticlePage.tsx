import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { GuideArticle, GuideArticleSection } from "@/data/guideArticles";

import { ContentAttribution } from "@/components/ContentAttribution";
import { CoverImage } from "@/components/CoverImage";
import { GuideFaqItems } from "@/components/GuideFaqItems";
import { GuideSources } from "@/components/GuideSources";
import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { guideArticleSectionAnchor } from "@/data/guideArticles";
import { getSpeciesById } from "@/data/species";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { Link } from "@/i18n/navigation";
import { type AppLocale } from "@/i18n/routing";
import { formatContentDate } from "@/lib/formatDate";
import { GROUP_HUBS } from "@/lib/groupHubs";
import { speciesHref } from "@/lib/speciesRoutes";
import { hasMeaningfulUpdate } from "@/lib/structuredDataDates";

const IMAGE_SIZES = "(max-width: 1023px) 100vw, 1400px";

type GuideArticlePageProps = {
  article: GuideArticle;
  dates: { dateModified: string; datePublished: string };
  locale: AppLocale;
  related: readonly GuideArticle[];
};

export async function GuideArticlePage({
  article,
  dates,
  locale,
  related,
}: GuideArticlePageProps) {
  const parent = GROUP_HUBS[article.parentHub];
  const [t, tShared, tParent, tNews] = await Promise.all([
    getTranslations({ locale, namespace: "guideArticle" }),
    getTranslations({ locale, namespace: "groupHubShared" }),
    getTranslations({ locale, namespace: parent.messageKey }),
    getTranslations({ locale, namespace: "news" }),
  ]);
  const copy = article.copy[locale];
  const parentLabel = tParent("breadcrumbCurrent");
  const sections = copy.sections.map((section) => ({
    anchor: guideArticleSectionAnchor(section.heading, locale),
    section,
  }));
  const relatedSpecies = (article.relatedSpeciesIds ?? [])
    .map((id) => getSpeciesById(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .map((item) => localizeSpecies(item, locale));

  return (
    <main className="min-h-screen bg-background">
      <article className="mx-auto max-w-[1400px] px-6 pt-30 pb-16 sm:pt-33 sm:pb-24 lg:px-10">
        <nav aria-label="Breadcrumb" className="sr-only">
          <ol className="flex flex-wrap gap-x-2 gap-y-1">
            <li>
              <Link className="hover:text-foreground" href="/">
                {tShared("breadcrumbHome")}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link className="hover:text-foreground" href={parent.path}>
                {parentLabel}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-foreground">
              {copy.title}
            </li>
          </ol>
        </nav>
        <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
          <Link
            className="transition-colors hover:text-foreground"
            href={parent.path}
          >
            {parentLabel}
          </Link>
          <span aria-hidden="true"> · </span>
          <time dateTime={dates.datePublished}>
            {tNews("published", {
              date: formatContentDate(dates.datePublished, locale),
            })}
          </time>
          {hasMeaningfulUpdate(dates.datePublished, dates.dateModified) ? (
            <>
              <span aria-hidden="true"> · </span>
              <time dateTime={dates.dateModified}>
                {tNews("updated", {
                  date: formatContentDate(dates.dateModified, locale),
                })}
              </time>
            </>
          ) : null}
        </p>
        <h1 className="mt-5 font-display text-display-lead font-semibold text-foreground">
          {copy.title}
        </h1>
        {copy.intro ? (
          <p className="mt-6 max-w-3xl text-[17px] leading-[1.75] text-muted-foreground sm:text-[19px]">
            <PhoneLinkedText>{copy.intro}</PhoneLinkedText>
          </p>
        ) : null}
        <figure className="mt-10">
          <CoverImage
            alt={article.hero.alt[locale]}
            className="h-auto w-full rounded-card"
            fill={false}
            priority
            sizes={IMAGE_SIZES}
            src={article.hero.src}
          />
        </figure>

        {sections.length > 2 ? (
          <nav
            aria-labelledby={`${article.id}-contents`}
            className="mt-12 border-y border-border py-7"
          >
            <h2
              className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase"
              id={`${article.id}-contents`}
            >
              {t("contents")}
            </h2>
            <ol className="mt-4 grid gap-x-10 gap-y-2.5 text-[15px] leading-snug sm:grid-cols-2">
              {sections.map(({ anchor, section }) => (
                <li key={anchor}>
                  <a
                    className="text-foreground/80 underline decoration-border underline-offset-4 transition-colors hover:text-primary hover:decoration-primary/40"
                    href={`#${anchor}`}
                  >
                    {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <div className="mt-16 space-y-14">
          {sections.map(({ anchor, section }) => (
            <GuideArticleSectionView
              anchor={anchor}
              article={article}
              key={anchor}
              locale={locale}
              section={section}
            />
          ))}
        </div>

        <aside
          aria-labelledby={`${article.id}-summary`}
          className="mt-16 rounded-card border border-border bg-card p-6 sm:p-8"
        >
          <h2
            className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase"
            id={`${article.id}-summary`}
          >
            {t("summary")}
          </h2>
          <p className="mt-4 border-l-4 border-primary pl-5 text-[17px] leading-[1.75] text-foreground">
            <PhoneLinkedText>{copy.summary}</PhoneLinkedText>
          </p>
        </aside>

        {copy.faq.length > 0 ? (
          <section className="mt-16 border-t border-border pt-10">
            <h2 className="font-display text-display-card font-semibold text-foreground">
              {t("faq")}
            </h2>
            <GuideFaqItems items={copy.faq} />
          </section>
        ) : null}

        <section className="mt-16 border-t border-border pt-10">
          <h2 className="font-display text-display-card font-semibold text-foreground">
            {t("related")}
          </h2>
          <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <li className="flex" key={item.id}>
                <Link
                  className="group flex w-full flex-col justify-between gap-6 rounded-card border border-border bg-card p-6 transition-colors hover:bg-background"
                  href={item.pathname}
                >
                  <span className="font-display text-[18px] font-semibold text-foreground transition-colors group-hover:text-primary">
                    {item.copy[locale].title}
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 text-muted-foreground"
                  />
                </Link>
              </li>
            ))}
            <li className="flex">
              <Link
                className="group flex w-full flex-col justify-between gap-6 rounded-card border border-border bg-card p-6 transition-colors hover:bg-background"
                href={parent.path}
              >
                <span className="font-display text-[18px] font-semibold text-foreground transition-colors group-hover:text-primary">
                  {tShared(`hubs.${article.parentHub}`)}
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 text-muted-foreground"
                />
              </Link>
            </li>
          </ul>
          {relatedSpecies.length > 0 ? (
            <>
              <h3 className="mt-10 text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                {t("relatedSpecies")}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2.5 text-[15px]">
                {relatedSpecies.map((item) => (
                  <li key={item.id}>
                    <Link
                      className="text-foreground/80 underline decoration-border underline-offset-4 transition-colors hover:text-primary hover:decoration-primary/40"
                      href={speciesHref(item.id, locale)}
                    >
                      {item.commonName}{" "}
                      <i className="text-muted-foreground">
                        {item.scientificName}
                      </i>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </section>

        <GuideSources
          heading={t("sources")}
          locale={locale}
          sources={article.sources}
        />
      </article>
      <ContentAttribution
        publishedAt={dates.datePublished}
        sourcesHref="#sources"
        updatedAt={dates.dateModified}
      />
    </main>
  );
}

function GuideArticleSectionView({
  anchor,
  article,
  locale,
  section,
}: {
  anchor: string;
  article: GuideArticle;
  locale: AppLocale;
  section: GuideArticleSection;
}) {
  const image = section.image ? article.images?.[section.image] : undefined;
  const ListTag = section.list?.ordered ? "ol" : "ul";

  return (
    <section aria-labelledby={anchor}>
      <h2
        className="scroll-mt-28 font-display text-display-card font-semibold text-foreground"
        id={anchor}
      >
        {section.heading}
      </h2>
      <div className="mt-5 space-y-4 text-[16px] leading-[1.8] text-muted-foreground sm:text-[17px]">
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph}>
            <PhoneLinkedText>{paragraph}</PhoneLinkedText>
          </p>
        ))}
        {section.list ? (
          <ListTag
            className={
              section.list.ordered
                ? "list-decimal space-y-2 pl-6"
                : "list-disc space-y-2 pl-6"
            }
          >
            {section.list.items.map((item) => (
              <li key={item}>
                <PhoneLinkedText>{item}</PhoneLinkedText>
              </li>
            ))}
          </ListTag>
        ) : null}
      </div>
      {image ? (
        <figure className="mt-7">
          <CoverImage
            alt={image.alt[locale]}
            className="h-auto w-full rounded-card"
            fill={false}
            sizes={IMAGE_SIZES}
            src={image.src}
          />
        </figure>
      ) : null}
    </section>
  );
}
