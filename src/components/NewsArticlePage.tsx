import { ArrowRight, ArrowUpRight, ChevronDown, FileText } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { NewsArticle } from "@/data/news";
import type { NewsSectionBlock } from "@/data/newsTypes";
import type { AppLocale } from "@/i18n/routing";
import type { GroupHubId } from "@/lib/groupHubs";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { ContentAttribution } from "@/components/ContentAttribution";
import { CoverImage } from "@/components/CoverImage";
import { CoverImagePreload } from "@/components/CoverImagePreload";
import { Logo } from "@/components/Logo";
import { NewsArticleToc } from "@/components/NewsArticleToc";
import { NewsRichText } from "@/components/NewsRichText";
import { NewsShareButtons } from "@/components/NewsShareButtons";
import {
  getNewsCopy,
  getPublishedNewsArticles,
  newsLocalizedTitle,
  newsPhotoBySrc,
  newsRelatedHubs,
  newsRelatedRegions,
  newsRelatedSpecies,
  newsSourceName,
} from "@/data/news";
import { getRegionHeroImage } from "@/data/regionImages";
import { localizeRegionText } from "@/data/regions";
import { getSpeciesById } from "@/data/species";
import { hasPhotoCredit } from "@/data/speciesMedia";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { Link } from "@/i18n/navigation";
import { isLocalAdminEnabled } from "@/lib/adminAccess";
import { contentEditorAttributes } from "@/lib/contentEditorAttributes";
import { formatContentDate, formatPhotoDate } from "@/lib/formatDate";
import {
  newsArticleHref,
  newsArticleUrl,
  newsIndexHref,
  newsReadMinutes,
} from "@/lib/news";
import {
  getNewsVisual,
  localizeNewsPhoto,
  newsCategoryHub,
  type NewsVisual,
} from "@/lib/newsVisual";
import { photoCreditSourceLabel } from "@/lib/photoCreditSource";
import { slugify } from "@/lib/slugify";
import { isPlaceholderMedia } from "@/lib/speciesContent";
import { regionHref, speciesHref, type SpeciesHref } from "@/lib/speciesRoutes";
import { hasMeaningfulUpdate } from "@/lib/structuredDataDates";

type AtlasLink = {
  href: `/${GroupHubId}` | ReturnType<typeof regionHref> | SpeciesHref;
  image: null | string;
  key: string;
  kind: string;
  title: string;
};

type Fact = {
  label: string;
  value: string;
};

type NewsArticlePageProps = {
  article: NewsArticle;
  locale: AppLocale;
};

const wrapClass =
  "mx-auto box-content max-w-[1320px] px-5 md:px-10 lg:px-[60px]";
const eyebrowClass =
  "text-[10.5px] font-semibold tracking-[0.16em] text-(--nw-muted) uppercase md:text-[11px]";
const focusClass =
  "focus-visible:ring-2 focus-visible:ring-(--nw-accent) focus-visible:ring-offset-4 focus-visible:ring-offset-background focus-visible:outline-none";

type NewsCopy = NonNullable<ReturnType<typeof getNewsCopy>>;

type NewsPartProps = {
  article: NewsArticle;
  copy: NewsCopy;
  editable: boolean;
  locale: AppLocale;
};

export async function NewsArticlePage({
  article,
  locale,
}: NewsArticlePageProps) {
  const copy = getNewsCopy(article, locale);
  if (!copy) return null;
  const editable = locale === "ka" && isLocalAdminEnabled();
  const [t, facts, atlasLinks] = await Promise.all([
    getTranslations({ locale, namespace: "news" }),
    newsFacts(article, locale),
    newsAtlasLinks(article, locale),
  ]);
  const visual = getNewsVisual(article, locale);
  const tocItems = copy.sections.flatMap((section) => {
    const id = slugify(section.heading);
    return id ? [{ id, label: section.heading }] : [];
  });
  const showToc = tocItems.length >= 2;

  return (
    <div className="editorial-page min-h-screen bg-background text-(--nw-ink) antialiased">
      <NewsVisualPreload visual={visual} />
      <article>
        <NewsArticleHeader
          article={article}
          copy={copy}
          editable={editable}
          locale={locale}
          visual={visual}
        />
        <div className={`${wrapClass} pt-6 md:pt-14`}>
          <div className="mx-auto max-w-[700px] xl:grid xl:max-w-none xl:grid-cols-[220px_minmax(0,700px)_280px] xl:items-start xl:justify-between xl:gap-10">
            <aside className="hidden xl:sticky xl:top-28 xl:block">
              {showToc ? (
                <NewsArticleToc heading={t("tocHeading")} items={tocItems} />
              ) : null}
            </aside>
            <div className="min-w-0">
              <div className="xl:hidden">
                <NewsFacts facts={facts} heading={t("factsHeading")} />
                {showToc ? (
                  <NewsMobileToc
                    items={tocItems}
                    summary={t("tocSummary", { count: tocItems.length })}
                  />
                ) : null}
              </div>
              <NewsArticleBody
                article={article}
                copy={copy}
                editable={editable}
                locale={locale}
              />
              <NewsArticleSources article={article} locale={locale} />
            </div>
            <aside className="hidden xl:sticky xl:top-28 xl:flex xl:flex-col xl:gap-3">
              <NewsFacts facts={facts} heading={t("factsHeading")} sidebar />
              <NewsAtlasLinks label={t("relatedHeading")} links={atlasLinks} />
            </aside>
          </div>
        </div>
      </article>
      <NewsContinueReading
        article={article}
        atlasLinks={atlasLinks}
        locale={locale}
      />
      <ContentAttribution
        locale={locale}
        publishedAt={article.publishedAt}
        sourcesHref="#sources"
        updatedAt={article.updatedAt}
      />
    </div>
  );
}

function NewsArticleBlock({
  article,
  block,
  blockIndex,
  editable,
  locale,
  photoCreditLabel,
  photoFromAtlas,
  sectionIndex,
}: {
  article: NewsArticle;
  block: NewsSectionBlock;
  blockIndex: number;
  editable: boolean;
  locale: AppLocale;
  photoCreditLabel: string;
  photoFromAtlas: string;
  sectionIndex: number;
}) {
  if (block.type === "figure") {
    const photo = newsPhotoBySrc(article, block.src);
    return photo ? (
      <NewsFigure
        locale={locale}
        photoCreditLabel={photoCreditLabel}
        photoFromAtlas={photoFromAtlas}
        sizes="(max-width: 767px) 100vw, 700px"
        visual={localizeNewsPhoto(photo, locale)}
      />
    ) : null;
  }
  return (
    <p>
      <NewsRichText
        articleId={article.id}
        blockIndex={blockIndex}
        editable={editable}
        locale={locale}
        parts={block.parts}
        sectionIndex={sectionIndex}
      />
    </p>
  );
}

async function NewsArticleBody({
  article,
  copy,
  editable,
  locale,
}: NewsPartProps) {
  const t = await getTranslations({ locale, namespace: "news" });
  const editorId = editable ? article.id : undefined;
  const updatedLabel = newsUpdatedLabel(article, locale);

  return (
    <>
      <p
        className="mt-7 text-[18px] leading-[1.65] font-medium xl:mt-0 xl:text-[21px]"
        {...contentEditorAttributes("news", editorId, "lead")}
      >
        {copy.lead}
      </p>
      {copy.sections.map((section, sectionIndex) => (
        <section className="pt-10" key={section.heading}>
          <p
            aria-hidden="true"
            className="mb-2 text-[12.5px] font-bold text-(--nw-accent) tabular-nums"
          >
            {sectionNumber(sectionIndex)}
          </p>
          <AnchoredHeading
            anchorLabel={t("anchorLink")}
            as="h2"
            className="scroll-mt-36 text-[24px] leading-[1.2] font-semibold tracking-[-0.012em] md:text-[30px]"
            slugSource={section.heading}
          >
            <span
              {...contentEditorAttributes(
                "news",
                editorId,
                `sections.${sectionIndex}.heading`,
              )}
            >
              {section.heading}
            </span>
          </AnchoredHeading>
          <div className="mt-[18px] space-y-[22px] text-[16.5px] leading-[1.8] text-(--nw-soft) md:text-[18px]">
            {section.blocks.map((block, index) => (
              <NewsArticleBlock
                article={article}
                block={block}
                blockIndex={index}
                editable={editable}
                key={`${section.heading}:${index}`}
                locale={locale}
                photoCreditLabel={t("photoCredit")}
                photoFromAtlas={t("photoFromAtlas")}
                sectionIndex={sectionIndex}
              />
            ))}
          </div>
        </section>
      ))}
      <p className="mt-9 flex flex-wrap gap-x-2 gap-y-1 text-[12.5px] text-(--nw-muted) md:text-[13px]">
        <time dateTime={article.publishedAt}>
          {t("published", {
            date: formatContentDate(article.publishedAt, locale),
          })}
        </time>
        {article.updatedAt && updatedLabel ? (
          <>
            <span aria-hidden="true">·</span>
            <time dateTime={article.updatedAt}>
              {t("updated", { date: updatedLabel })}
            </time>
          </>
        ) : null}
      </p>
    </>
  );
}

async function NewsArticleHeader({
  article,
  copy,
  editable,
  locale,
  visual,
}: NewsPartProps & { visual: NewsVisual | null }) {
  const [t, tNav, tShared] = await Promise.all([
    getTranslations({ locale, namespace: "news" }),
    getTranslations({ locale, namespace: "nav" }),
    getTranslations({ locale, namespace: "groupHubShared" }),
  ]);
  const hub = newsCategoryHub(article);
  const categoryHub = newsRelatedHubs(article).find((item) => item.id === hub);
  const editorId = editable ? article.id : undefined;

  return (
    <header className={`${wrapClass} pt-[92px] md:pt-[136px]`}>
      <div className="md:mx-auto md:max-w-[920px] md:text-center">
        <nav aria-label="Breadcrumb" className="sr-only">
          <ol>
            <li>
              <Link href="/">{tShared("breadcrumbHome")}</Link>
            </li>
            <li>
              <Link href={newsIndexHref()}>{t("breadcrumbNews")}</Link>
            </li>
            <li aria-current="page">{copy.title}</li>
          </ol>
        </nav>
        <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-(--nw-muted) tabular-nums md:justify-center md:gap-2.5 md:text-[13.5px]">
          {categoryHub ? (
            <Link
              className="inline-flex h-[26px] items-center rounded-full bg-(--nw-surface) px-2.5 text-[12px] font-semibold text-(--nw-accent) transition-opacity hover:opacity-80 md:h-7 md:px-3 md:text-[12.5px]"
              href={categoryHub.path}
            >
              {tNav(categoryHub.id)}
            </Link>
          ) : null}
          <span className="inline-flex items-center gap-2 whitespace-nowrap md:gap-2.5">
            <time dateTime={article.publishedAt}>
              {formatContentDate(article.publishedAt, locale)}
            </time>
            <span
              aria-hidden="true"
              className="size-[3px] rounded-full bg-(--nw-sep)"
            />
            <span>
              {t("readTime", { minutes: newsReadMinutes(article, locale) })}
            </span>
          </span>
        </div>
        <h1
          className="mt-3.5 text-[34px] leading-[1.12] font-semibold tracking-[-0.02em] text-balance md:mt-[22px] md:text-[48px] md:leading-[1.08] lg:text-[60px] lg:leading-[1.06] lg:tracking-[-0.028em]"
          {...contentEditorAttributes("news", editorId, "title")}
        >
          {copy.title}
        </h1>
        <p
          className="mt-3.5 text-[17px] leading-[1.55] text-(--nw-soft) md:mx-auto md:mt-[22px] md:max-w-[760px] md:text-[20px]"
          {...contentEditorAttributes("news", editorId, "dek")}
        >
          {copy.dek}
        </p>
        <div className="mt-[18px] flex items-center gap-2.5 md:mt-7 md:justify-center md:gap-3.5">
          <Logo className="size-7 shrink-0 md:size-8" size={32} />
          <span className="min-w-0 flex-1 text-[13px] md:flex md:flex-none md:items-center md:gap-3.5 md:text-[14px]">
            <Link className="font-semibold" href="/about" rel="author">
              {t("byline")}
            </Link>
            {article.sources.length > 0 ? (
              <>
                <span aria-hidden="true" className="md:hidden">
                  {" · "}
                </span>
                <span
                  aria-hidden="true"
                  className="hidden h-[22px] w-px bg-(--nw-line) md:block"
                />
                <a
                  className="inline-flex items-center gap-1.5 font-medium whitespace-nowrap text-(--nw-accent)"
                  href="#sources"
                >
                  <FileText
                    aria-hidden="true"
                    className="hidden size-[15px] md:block"
                    strokeWidth={1.75}
                  />
                  {t("sourceCount", { count: article.sources.length })}
                </a>
              </>
            ) : null}
          </span>
          <span
            aria-hidden="true"
            className="hidden h-[22px] w-px bg-(--nw-line) md:block"
          />
          <span className="shrink-0">
            <NewsShareButtons
              copiedLabel={t("linkCopied")}
              copyLabel={t("copyLink")}
              facebookLabel={t("shareFacebook")}
              url={newsArticleUrl(locale, article.slug)}
            />
          </span>
        </div>
      </div>
      {visual ? (
        <NewsFigure
          hero
          locale={locale}
          photoCreditLabel={t("photoCredit")}
          photoFromAtlas={t("photoFromAtlas")}
          priority
          sizes="(max-width: 1439px) 100vw, 1320px"
          visual={visual}
        />
      ) : null}
    </header>
  );
}

async function NewsArticleSources({ article, locale }: NewsArticlePageProps) {
  if (article.sources.length === 0) return null;

  const t = await getTranslations({ locale, namespace: "news" });
  const sourceHeading =
    article.sources.length > 1 ? t("sourceHeadingPlural") : t("sourceHeading");

  return (
    <aside className="mt-7 border-t-2 border-(--nw-ink) pt-6 md:mt-10 md:pt-8">
      <AnchoredHeading
        anchorLabel={t("anchorLink")}
        as="h2"
        className="text-[22px] font-semibold md:text-[26px]"
        id="sources"
      >
        {sourceHeading}
      </AnchoredHeading>
      <ol className="mt-3 md:mt-[18px]">
        {article.sources.map((source, index) => {
          const domain = sourceDomain(source.url);
          return (
            <li className="border-t border-(--nw-line)" key={source.url}>
              <a
                className="group grid grid-cols-[32px_minmax(0,1fr)_auto] items-start gap-3 py-4"
                href={source.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="text-[13px] font-bold text-(--nw-sep) tabular-nums">
                  {sectionNumber(index)}
                </span>
                <span className="text-[14px] leading-normal md:text-[15px]">
                  <span className="transition-colors group-hover:text-(--nw-accent)">
                    {newsSourceName(source, locale)}
                  </span>
                  {domain ? (
                    <span className="mt-1 block text-[12.5px] text-(--nw-muted)">
                      {domain}
                    </span>
                  ) : null}
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="mt-0.5 size-[15px] text-(--nw-sep) transition-colors group-hover:text-(--nw-accent)"
                  strokeWidth={1.75}
                />
              </a>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}

async function newsAtlasLinks(
  article: NewsArticle,
  locale: AppLocale,
): Promise<AtlasLink[]> {
  const [t, tNav] = await Promise.all([
    getTranslations({ locale, namespace: "news" }),
    getTranslations({ locale, namespace: "nav" }),
  ]);
  return [
    ...newsRelatedSpecies(article).map((item) => {
      const species = localizeSpecies(item, locale);
      return {
        href: speciesHref(species.id, locale),
        image: isPlaceholderMedia(species.image) ? null : species.image,
        key: `species:${species.id}`,
        kind: t("speciesProfile"),
        title: species.commonName,
      };
    }),
    ...newsRelatedRegions(article).map((region) => ({
      href: regionHref(region.id),
      image: getRegionHeroImage(region.id),
      key: `region:${region.id}`,
      kind: t("regionPage"),
      title: localizeRegionText(region.name, locale),
    })),
    ...newsRelatedHubs(article).map((item) => {
      const hero = getSpeciesById(item.heroSpeciesId);
      return {
        href: item.path,
        image: hero && !isPlaceholderMedia(hero.image) ? hero.image : null,
        key: `hub:${item.id}`,
        kind: t("hubPage"),
        title: tNav(item.id),
      };
    }),
  ];
}

function NewsAtlasLinks({
  label,
  links,
}: {
  label: string;
  links: AtlasLink[];
}) {
  if (links.length === 0) return null;
  return (
    <nav aria-label={label}>
      <ul className="flex flex-col gap-2 xl:gap-3">
        {links.map((link) => (
          <li key={link.key}>
            <Link
              className={`group flex items-center gap-3 rounded-[20px] bg-(--nw-card) py-2.5 pr-3.5 pl-2.5 ${focusClass}`}
              href={link.href}
            >
              <span className="relative size-14 shrink-0 overflow-hidden rounded-[14px] bg-(--nw-cover) xl:size-[52px]">
                {link.image ? (
                  <CoverImage
                    alt=""
                    className="object-cover object-center"
                    sizes="56px"
                    src={link.image}
                  />
                ) : null}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-semibold transition-colors group-hover:text-(--nw-accent)">
                  {link.title}
                </span>
                <span className="block text-[12.5px] text-(--nw-muted)">
                  {link.kind}
                </span>
              </span>
              <ArrowRight
                aria-hidden="true"
                className="size-[15px] shrink-0 text-(--nw-sep)"
                strokeWidth={1.75}
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function NewsContinueCard({
  article,
  dark = false,
  eyebrow,
  footer,
  locale,
}: {
  article: NewsArticle;
  dark?: boolean;
  eyebrow: null | string;
  footer: string;
  locale: AppLocale;
}) {
  const visual = getNewsVisual(article, locale);
  const dateLabel = formatContentDate(article.publishedAt, locale);
  return (
    <Link
      className={`group grid h-full grid-cols-[88px_minmax(0,1fr)] items-center gap-3.5 rounded-[22px] p-2.5 md:grid-cols-[220px_minmax(0,1fr)] md:gap-[22px] md:rounded-[28px] md:p-3.5 ${
        dark ? "bg-(--nw-panel) text-white" : "bg-(--nw-card) text-(--nw-ink)"
      } ${focusClass}`}
      href={newsArticleHref(article.slug)}
      prefetch={false}
    >
      <span className="news-ill relative aspect-square overflow-hidden rounded-[16px] md:aspect-4/3 md:rounded-[20px]">
        {visual ? (
          <CoverImage
            alt=""
            className="object-cover object-center motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-[1.04]"
            sizes="(max-width: 767px) 88px, 220px"
            src={visual.src}
          />
        ) : null}
      </span>
      <span className="flex min-w-0 flex-col gap-1.5 pr-1 md:gap-2.5 md:pr-2.5">
        <span
          className={`text-[12px] md:text-[12.5px] ${dark ? "text-white/60" : "text-(--nw-muted)"}`}
        >
          {eyebrow ? (
            <b
              className={`font-semibold ${dark ? "text-white/60" : "text-(--nw-accent)"}`}
            >
              {eyebrow}
            </b>
          ) : null}
          {eyebrow ? " · " : null}
          <time dateTime={article.publishedAt}>{dateLabel}</time>
        </span>
        <span className="line-clamp-3 text-[16px] leading-[1.3] font-semibold md:text-[20px]">
          {newsLocalizedTitle(article, locale)}
        </span>
        <span
          className={`inline-flex items-center gap-2 text-[13px] ${
            dark ? "font-semibold" : "text-(--nw-muted)"
          }`}
        >
          {footer}
          {dark ? (
            <ArrowRight
              aria-hidden="true"
              className="size-3.5 motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5"
              strokeWidth={1.75}
            />
          ) : null}
        </span>
      </span>
    </Link>
  );
}

async function NewsContinueReading({
  article,
  atlasLinks,
  locale,
}: {
  article: NewsArticle;
  atlasLinks: AtlasLink[];
  locale: AppLocale;
}) {
  const [t, tNav] = await Promise.all([
    getTranslations({ locale, namespace: "news" }),
    getTranslations({ locale, namespace: "nav" }),
  ]);
  const { next, related } = pickContinueReading(article, locale);
  const relatedHubId = related ? newsCategoryHub(related) : undefined;

  return (
    <section
      aria-labelledby="news-continue-heading"
      className={`${wrapClass} pt-11 pb-14 md:pt-[104px] md:pb-28`}
    >
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className={eyebrowClass}>{t("continueReading")}</p>
          <h2
            className="mt-3.5 text-[24px] leading-[1.1] font-semibold tracking-[-0.015em] md:text-[36px]"
            id="news-continue-heading"
          >
            {t("relatedNewsHeading")}
          </h2>
        </div>
        <Link
          className="hidden items-center gap-2 text-[14px] font-semibold whitespace-nowrap transition-colors hover:text-(--nw-accent) md:inline-flex"
          href={newsIndexHref()}
        >
          {t("allNews")}
          <ArrowRight
            aria-hidden="true"
            className="size-[15px]"
            strokeWidth={1.75}
          />
        </Link>
      </div>
      <div className="mt-5 xl:hidden">
        <NewsAtlasLinks label={t("relatedHeading")} links={atlasLinks} />
      </div>
      <ul className="mt-2 grid gap-2 md:mt-7 md:gap-4 lg:grid-cols-2">
        {related ? (
          <li>
            <NewsContinueCard
              article={related}
              eyebrow={relatedHubId ? tNav(relatedHubId) : null}
              footer={t("readTime", {
                minutes: newsReadMinutes(related, locale),
              })}
              locale={locale}
            />
          </li>
        ) : null}
        {next ? (
          <li>
            <NewsContinueCard
              article={next}
              dark
              eyebrow={t("nextArticle")}
              footer={t("read")}
              locale={locale}
            />
          </li>
        ) : null}
      </ul>
      <Link
        className="mt-2 flex h-[50px] items-center justify-center rounded-full border border-(--nw-line) bg-(--nw-card) text-[14.5px] font-medium md:hidden"
        href={newsIndexHref()}
      >
        {t("allNews")}
      </Link>
    </section>
  );
}

async function newsFacts(
  article: NewsArticle,
  locale: AppLocale,
): Promise<Fact[]> {
  const [t, tNav] = await Promise.all([
    getTranslations({ locale, namespace: "news" }),
    getTranslations({ locale, namespace: "nav" }),
  ]);
  const facts: Fact[] = [
    {
      label: t("factPublished"),
      value: formatContentDate(article.publishedAt, locale),
    },
  ];
  const updatedLabel = newsUpdatedLabel(article, locale);
  if (updatedLabel) {
    facts.push({ label: t("factUpdated"), value: updatedLabel });
  }
  const regions = newsRelatedRegions(article);
  if (regions.length > 0) {
    facts.push({
      label: t("factPlace"),
      value: regions
        .map((region) => localizeRegionText(region.name, locale))
        .join(", "),
    });
  }
  if (article.relatedHubIds.length > 0) {
    facts.push({
      label: t("factTopic"),
      value: article.relatedHubIds.map((id) => tNav(id)).join(", "),
    });
  }
  return facts;
}

function NewsFacts({
  facts,
  heading,
  sidebar = false,
}: {
  facts: Fact[];
  heading: string;
  sidebar?: boolean;
}) {
  return (
    <section
      className={
        sidebar
          ? "rounded-[24px] bg-(--nw-card) px-[22px] pt-5 pb-2.5"
          : "rounded-[20px] bg-(--nw-card) px-[18px] pt-4 pb-1.5"
      }
    >
      <h2 className={eyebrowClass}>{heading}</h2>
      <dl
        className={
          sidebar
            ? "mt-2.5"
            : "mt-1.5 grid grid-cols-2 gap-x-3.5 [&>div:nth-child(-n+2)]:border-t-0"
        }
      >
        {facts.map((fact) => (
          <div
            className="flex flex-col gap-[3px] border-t border-(--nw-line-soft) py-3 first:border-t-0"
            key={fact.label}
          >
            <dt className="text-[12px] text-(--nw-muted)">{fact.label}</dt>
            <dd className="text-[14.5px] leading-[1.4] font-semibold">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function NewsFigure({
  hero = false,
  locale,
  photoCreditLabel,
  photoFromAtlas,
  priority = false,
  sizes,
  visual,
}: {
  hero?: boolean;
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
    (item): item is string => Boolean(item),
  );
  const frameClass = hero
    ? "-mx-5 overflow-hidden bg-(--nw-cover) md:mx-0 md:rounded-[36px]"
    : "overflow-hidden rounded-[22px] bg-(--nw-cover)";

  return (
    <figure className={hero ? "mt-5 md:mt-11" : "py-2"}>
      {visual.plate ? (
        <div className={`media-placeholder ${frameClass}`}>
          <CoverImage
            alt={visual.alt}
            className="h-auto w-full"
            fill={false}
            priority={priority}
            sizes={sizes}
            src={visual.src}
          />
        </div>
      ) : (
        <div
          className={`relative ${frameClass} ${hero ? "aspect-3/2 md:aspect-[2.13/1]" : "aspect-16/10"}`}
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
      <figcaption
        className={
          hero
            ? "mt-2.5 text-[12px] leading-normal text-(--nw-muted) md:mx-auto md:mt-3.5 md:flex md:max-w-[920px] md:justify-between md:gap-6 md:text-[13px]"
            : "mt-3 text-[12px] leading-normal text-(--nw-muted) md:text-[13px]"
        }
      >
        <span>
          {visual.fromAtlas ? `${photoFromAtlas} ` : null}
          {visual.alt}
        </span>
        <NewsFigureCredit
          credit={visual.credit}
          creditMeta={creditMeta}
          dateLabel={dateLabel}
          hero={hero}
          photoCreditLabel={photoCreditLabel}
          photographer={photographer}
        />
      </figcaption>
    </figure>
  );
}

function NewsFigureCredit({
  credit,
  creditMeta,
  dateLabel,
  hero,
  photoCreditLabel,
  photographer,
}: {
  credit: NewsVisual["credit"];
  creditMeta: string[];
  dateLabel: null | string;
  hero: boolean;
  photoCreditLabel: string;
  photographer: string | undefined;
}) {
  const sourceLabel = photoCreditSourceLabel(credit?.url);
  if (!hasPhotoCredit(credit) || creditMeta.length === 0) return null;
  return (
    <span className={hero ? "md:shrink-0 md:text-right" : undefined}>
      {" "}
      {photographer ? (
        <span>
          {photoCreditLabel} {photographer}
          {sourceLabel && credit.url ? (
            <>
              {" · "}
              <a
                className="inline-flex items-center gap-0.5 text-(--nw-ink) underline decoration-(--nw-line) underline-offset-[3px] transition-colors hover:decoration-(--nw-accent)"
                href={credit.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                {sourceLabel}
                <ArrowUpRight aria-hidden="true" className="size-[0.85em]" />
              </a>
            </>
          ) : null}
        </span>
      ) : null}
      {credit.location || dateLabel ? (
        <span>
          {photographer ? " · " : null}
          {[credit.location, dateLabel].filter(Boolean).join(" · ")}
        </span>
      ) : null}
    </span>
  );
}

function NewsMobileToc({
  items,
  summary,
}: {
  items: Array<{ id: string; label: string }>;
  summary: string;
}) {
  return (
    <details className="group mt-2 rounded-[20px] bg-(--nw-card) px-[18px]">
      <summary className="flex h-[52px] cursor-pointer list-none items-center justify-between text-[14.5px] font-semibold [&::-webkit-details-marker]:hidden">
        {summary}
        <ChevronDown
          aria-hidden="true"
          className="size-4 text-(--nw-muted) transition-transform group-open:rotate-180"
          strokeWidth={1.75}
        />
      </summary>
      <ol className="pb-2">
        {items.map((item, index) => (
          <li key={item.id}>
            <a
              className="flex gap-3 border-t border-(--nw-line-soft) py-2.5 text-[14px] leading-[1.4] text-(--nw-muted)"
              href={`#${item.id}`}
            >
              <span className="w-[22px] shrink-0 text-[12px] font-bold text-(--nw-sep) tabular-nums">
                {sectionNumber(index)}
              </span>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </details>
  );
}

function newsUpdatedLabel(article: NewsArticle, locale: AppLocale) {
  return article.updatedAt &&
    hasMeaningfulUpdate(article.publishedAt, article.updatedAt)
    ? formatContentDate(article.updatedAt, locale)
    : null;
}

function NewsVisualPreload({ visual }: { visual: NewsVisual | null }) {
  if (!visual) return null;
  return (
    <CoverImagePreload
      sizes="(max-width: 1439px) 100vw, 1320px"
      src={visual.src}
    />
  );
}

function pickContinueReading(article: NewsArticle, locale: AppLocale) {
  const articles = getPublishedNewsArticles(locale);
  const index = articles.findIndex((item) => item.id === article.id);
  const next =
    articles.length > 1 ? articles[(index + 1) % articles.length] : undefined;
  const candidates = articles.filter(
    (item) => item.id !== article.id && item.id !== next?.id,
  );
  const topics = new Set([
    ...article.relatedSpeciesIds.map((id) => `species:${id}`),
    ...article.relatedRegionIds.map((id) => `region:${id}`),
    ...article.relatedHubIds.map((id) => `hub:${id}`),
  ]);
  const related =
    candidates.find((item) => sharesTopic(item, topics)) ?? candidates[0];
  return { next, related };
}

function sectionNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

function sharesTopic(article: NewsArticle, topics: ReadonlySet<string>) {
  return (
    article.relatedSpeciesIds.some((id) => topics.has(`species:${id}`)) ||
    article.relatedRegionIds.some((id) => topics.has(`region:${id}`)) ||
    article.relatedHubIds.some((id) => topics.has(`hub:${id}`))
  );
}

function sourceDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}
