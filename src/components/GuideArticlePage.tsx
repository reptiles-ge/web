import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type {
  GuideArticle,
  GuideArticleImage,
  GuideArticleSection,
} from "@/data/guideArticles";
import type { GuideArticleCopy } from "@/data/guideArticleTypes";

import { ContentAttribution } from "@/components/ContentAttribution";
import { CoverImage } from "@/components/CoverImage";
import { GuideFaqItems } from "@/components/GuideFaqItems";
import { GuideSources } from "@/components/GuideSources";
import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { SectionNav } from "@/components/SectionNav";
import { guideArticleSectionAnchor } from "@/data/guideArticles";
import { getSpeciesById } from "@/data/species";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { Link } from "@/i18n/navigation";
import { type AppLocale } from "@/i18n/routing";
import { isLocalAdminEnabled } from "@/lib/adminAccess";
import { contentEditorAttributes } from "@/lib/contentEditorAttributes";
import { formatContentDate } from "@/lib/formatDate";
import { GROUP_HUBS } from "@/lib/groupHubs";
import { speciesHref } from "@/lib/speciesRoutes";
import { hasMeaningfulUpdate } from "@/lib/structuredDataDates";

const IMAGE_SIZES = "(max-width: 1023px) 100vw, 1400px";

const DANGEROUS_ANIMALS_RELATED = new Set([
  "gyurza-bite",
  "scorpion-sting",
  "snake-bite",
  "tick-bite",
  "wasp-nest",
]);

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
  const editable = locale === "ka" && isLocalAdminEnabled();
  const sections = copy.sections.map((section, index) => ({
    anchor: guideArticleSectionAnchor(section.heading, locale),
    index,
    section,
  }));
  const relatedSpecies = (article.relatedSpeciesIds ?? [])
    .map((id) => getSpeciesById(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .map((item) => localizeSpecies(item, locale));

  return (
    <main className="min-h-screen bg-background">
      <article className="mx-auto max-w-[1400px] px-6 pt-30 pb-16 sm:pt-33 sm:pb-24 lg:px-10">
        <GuideArticleSectionNav
          items={sections.map(({ anchor, section }) => ({
            id: anchor,
            label: section.heading,
          }))}
          label={t("contents")}
        />
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
        <h1
          className="mt-5 font-display text-display-lead font-semibold text-foreground"
          {...contentEditorAttributes(
            "guide",
            editable ? article.id : undefined,
            "title",
          )}
        >
          {copy.title}
        </h1>
        {copy.intro ? (
          <p
            className="mt-6 max-w-3xl text-[17px] leading-[1.75] text-muted-foreground sm:text-[19px]"
            {...contentEditorAttributes(
              "guide",
              editable ? article.id : undefined,
              "intro",
            )}
          >
            <PhoneLinkedText>{copy.intro}</PhoneLinkedText>
          </p>
        ) : null}
        {copy.quickActions ? (
          <GuideQuickActions actions={copy.quickActions} locale={locale} />
        ) : null}
        {copy.notice ? (
          <aside className="mt-6 max-w-3xl rounded-card border-l-4 border-primary bg-card px-5 py-4 text-[15px] leading-[1.7] text-foreground sm:text-[16px]">
            <PhoneLinkedText>{copy.notice}</PhoneLinkedText>
          </aside>
        ) : null}
        {copy.quickSteps ? (
          <section
            aria-labelledby={`${article.id}-quick-steps`}
            className="mt-8 max-w-3xl"
          >
            <h2
              className="font-display text-xl font-semibold text-foreground"
              id={`${article.id}-quick-steps`}
            >
              {copy.quickSteps.heading}
            </h2>
            <ol className="mt-3 list-decimal space-y-2 pl-6 text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
              {copy.quickSteps.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </section>
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
          <GuideImageCredit image={article.hero} locale={locale} />
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
              {sections.map(({ anchor, index, section }) => (
                <li key={anchor}>
                  <a
                    className="text-foreground/80 underline decoration-border underline-offset-4 transition-colors hover:text-primary hover:decoration-primary/40"
                    {...contentEditorAttributes(
                      "guide",
                      editable ? article.id : undefined,
                      `sections.${index}.heading`,
                    )}
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
          {sections.map(({ anchor, index, section }) => (
            <GuideArticleSectionView
              anchor={anchor}
              article={article}
              editable={editable}
              index={index}
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
          <p
            className="mt-4 border-l-4 border-primary pl-5 text-[17px] leading-[1.75] text-foreground"
            {...contentEditorAttributes(
              "guide",
              editable ? article.id : undefined,
              "summary",
            )}
          >
            <PhoneLinkedText>{copy.summary}</PhoneLinkedText>
          </p>
        </aside>

        {copy.faq.length > 0 ? (
          <section className="mt-16 border-t border-border pt-10">
            <h2 className="font-display text-display-card font-semibold text-foreground">
              {t("faq")}
            </h2>
            <GuideFaqItems
              editable={editable}
              id={article.id}
              items={copy.faq}
            />
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
            {DANGEROUS_ANIMALS_RELATED.has(article.id) ? (
              <li className="flex">
                <Link
                  className="group flex w-full flex-col justify-between gap-6 rounded-card border border-border bg-card p-6 transition-colors hover:bg-background"
                  href="/dangerous-animals"
                >
                  <span className="font-display text-[18px] font-semibold text-foreground transition-colors group-hover:text-primary">
                    {tShared("cluster.dangerousAnimals.title")}
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 text-muted-foreground"
                  />
                </Link>
              </li>
            ) : null}
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
        locale={locale}
        publishedAt={dates.datePublished}
        sourcesHref="#sources"
        updatedAt={dates.dateModified}
      />
    </main>
  );
}

function GuideArticleSectionNav({
  items,
  label,
}: {
  items: Array<{ id: string; label: string }>;
  label: string;
}) {
  if (items.length <= 2) return null;

  return <SectionNav ariaLabel={label} floating items={items} />;
}

function GuideArticleSectionView({
  anchor,
  article,
  editable,
  index,
  locale,
  section,
}: {
  anchor: string;
  article: GuideArticle;
  editable: boolean;
  index: number;
  locale: AppLocale;
  section: GuideArticleSection;
}) {
  const image = section.image ? article.images?.[section.image] : undefined;
  const ListTag = section.list?.ordered ? "ol" : "ul";

  return (
    <section aria-labelledby={anchor}>
      <h2
        className="scroll-mt-40 font-display text-display-card font-semibold text-foreground"
        {...contentEditorAttributes(
          "guide",
          editable ? article.id : undefined,
          `sections.${index}.heading`,
        )}
        id={anchor}
      >
        {section.heading}
      </h2>
      <div className="mt-5 space-y-4 text-[16px] leading-[1.8] text-muted-foreground sm:text-[17px]">
        {section.paragraphs.map((paragraph, paragraphIndex) => (
          <p
            {...contentEditorAttributes(
              "guide",
              editable ? article.id : undefined,
              `sections.${index}.paragraphs.${paragraphIndex}`,
            )}
            key={paragraph}
          >
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
            {section.list.items.map((item, itemIndex) => (
              <li
                {...contentEditorAttributes(
                  "guide",
                  editable ? article.id : undefined,
                  `sections.${index}.list.items.${itemIndex}`,
                )}
                key={item}
              >
                <PhoneLinkedText>{item}</PhoneLinkedText>
              </li>
            ))}
          </ListTag>
        ) : null}
        {section.table ? (
          <div className="overflow-x-auto rounded-card border border-border">
            <table className="w-full min-w-[620px] border-collapse text-left text-sm">
              <thead className="bg-card text-foreground">
                <tr>
                  {section.table.headers.map((header) => (
                    <th
                      className="px-4 py-3 font-semibold"
                      key={header}
                      scope="col"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.table.rows.map((row) => (
                  <tr className="border-t border-border" key={row[0]}>
                    {row.map((cell, cellIndex) => (
                      <td className="px-4 py-3 align-top" key={cellIndex}>
                        <PhoneLinkedText>{cell}</PhoneLinkedText>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
          <GuideImageCredit image={image} locale={locale} />
        </figure>
      ) : null}
    </section>
  );
}

function GuideImageCredit({
  image,
  locale,
}: {
  image: GuideArticleImage;
  locale: AppLocale;
}) {
  if (!image.credit) return null;
  return (
    <figcaption className="mt-3 text-right text-[12px] text-muted-foreground">
      {image.creditUrl ? (
        <a href={image.creditUrl} rel="noopener noreferrer" target="_blank">
          {image.credit[locale]}
        </a>
      ) : (
        image.credit[locale]
      )}
      {image.license ? (
        <>
          {" · "}
          <a href={image.license.url} rel="noopener noreferrer" target="_blank">
            {image.license.name}
          </a>
        </>
      ) : null}
    </figcaption>
  );
}

function GuideQuickActions({
  actions,
  locale,
}: {
  actions: NonNullable<GuideArticleCopy["quickActions"]>;
  locale: AppLocale;
}) {
  return (
    <aside className="mt-5 rounded-card border border-border bg-card p-4 sm:p-6">
      <h2 className="font-display text-[17px] font-semibold text-foreground sm:text-[19px]">
        {actions.heading}
      </h2>
      {actions.links ? (
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {actions.links.map((link) => (
            <a
              className="font-semibold text-primary underline underline-offset-4"
              href={`#${guideArticleSectionAnchor(link.heading, locale)}`}
              key={link.heading}
            >
              {link.label}
            </a>
          ))}
        </div>
      ) : null}
      <ol className="mt-2 grid gap-x-8 gap-y-1 pl-5 text-[14px] leading-snug text-foreground/85 marker:font-semibold marker:text-primary sm:grid-cols-2 sm:gap-y-2 sm:text-[15px]">
        {actions.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
      <p className="mt-3 border-l-4 border-primary pl-3 text-sm font-semibold text-foreground">
        {actions.warning}
      </p>
    </aside>
  );
}
