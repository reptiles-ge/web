import type { ReactNode } from "react";

import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Camera,
  Search,
  ShieldCheck,
  SquareCheckBig,
  TriangleAlert,
  X,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { BrandText } from "@/components/BrandName";
import { CoverImage } from "@/components/CoverImage";
import { creditAuthorName } from "@/data/creditAuthors";
import { getAtlasStats } from "@/data/speciesAtlas";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getCreditAuthorCards } from "@/lib/creditAuthors";
import {
  GROUP_HUB_ILLUSTRATIONS,
  GROUP_HUBS,
  type GroupHubId,
} from "@/lib/groupHubs";

const SOURCE_LINKS = [
  {
    href: "https://doi.org/10.3897/caucasiana.5.e189214",
    key: "tarkhnishvili" as const,
  },
  {
    href: "https://doi.org/10.1080/09397140.2021.1957208",
    key: "iankoshvili" as const,
  },
];

const PILLARS = [
  { icon: Search, key: "discover" },
  { icon: BookOpen, key: "understand" },
  { icon: ShieldCheck, key: "protect" },
] as const;

const NOT_INFERRED = ["regions", "sizes", "iucn", "redList"] as const;

const COLLAGE_DESKTOP: ReadonlyArray<{
  offset: string;
  tiles: ReadonlyArray<{ height: string; id: GroupHubId }>;
}> = [
  {
    offset: "pt-16",
    tiles: [
      { height: "h-[250px]", id: "snakes" },
      { height: "h-[180px]", id: "amphibians" },
    ],
  },
  {
    offset: "",
    tiles: [
      { height: "h-[200px]", id: "birds" },
      { height: "h-[250px]", id: "lizards" },
    ],
  },
  {
    offset: "pt-28",
    tiles: [
      { height: "h-[220px]", id: "mammals" },
      { height: "h-[170px]", id: "spiders" },
    ],
  },
];

const COLLAGE_MOBILE: ReadonlyArray<{ id: GroupHubId; offset: string }> = [
  { id: "snakes", offset: "mt-7" },
  { id: "birds", offset: "" },
  { id: "amphibians", offset: "mt-12" },
];

const CATEGORY_HUBS: readonly GroupHubId[] = [
  "snakes",
  "lizards",
  "turtles",
  "amphibians",
  "birds",
  "mammals",
  "spiders",
  "scorpions",
  "insects",
];

const AVATAR_LIMIT = { desktop: 8, mobile: 6 };

const wrapClass =
  "mx-auto box-content max-w-[1320px] px-5 md:px-10 lg:px-[60px]";
const eyebrowClass =
  "text-[10.5px] font-semibold tracking-[0.16em] text-(--nw-muted) md:text-[11px]";
const h2Class =
  "mt-3 text-[28px] leading-[1.12] font-semibold tracking-[-0.015em] md:mt-4 md:text-[40px] md:leading-[1.1] md:tracking-[-0.018em]";
const darkButtonClass =
  "inline-flex h-[52px] items-center justify-center gap-2.5 rounded-full bg-(--nw-strong) px-6 text-[15px] font-medium text-(--nw-on-strong) transition-opacity hover:opacity-90";

export async function AboutPage({ locale }: { locale: AppLocale }) {
  return (
    <div className="editorial-page min-h-screen bg-background text-(--nw-ink) antialiased">
      <AboutHero locale={locale} />
      <AboutCompany locale={locale} />
      <AboutPillars locale={locale} />
      <AboutMethod locale={locale} />
      <AboutExplore locale={locale} />
      <AboutContribute locale={locale} />
    </div>
  );
}

async function AboutCompany({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <section className={`${wrapClass} pt-14 md:pt-[120px]`}>
      <div className="lg:grid lg:grid-cols-[440px_minmax(0,1fr)] lg:gap-20">
        <div>
          <p className={eyebrowClass}>{t("companyEyebrow")}</p>
          <h2 className={h2Class}>{t("companyTitle")}</h2>
          <blockquote className="mt-[22px] border-l-[3px] border-(--nw-accent) pl-4 md:mt-10 md:border-t-2 md:border-l-0 md:pt-7 md:pl-0">
            <p className="text-[21px] leading-[1.3] font-semibold text-(--nw-accent) md:text-[28px] md:leading-tight md:tracking-[-0.012em]">
              {t("quote")}
            </p>
          </blockquote>
        </div>
        <div className="mt-[22px] flex flex-col gap-3.5 lg:mt-0 lg:gap-5 lg:pt-1.5">
          <p className="text-[16px] leading-[1.7] md:text-[20px] md:leading-[1.6]">
            {t("companyBody1")}
          </p>
          <p className="text-[15.5px] leading-[1.7] text-(--nw-soft) md:text-[17px] md:leading-[1.75]">
            {t("companyBody2")}
          </p>
          <p className="text-[15.5px] leading-[1.7] text-(--nw-soft) md:text-[17px] md:leading-[1.75]">
            {t("companyBody3")}
          </p>
          <p className="text-[15.5px] leading-[1.7] text-(--nw-soft) md:text-[17px] md:leading-[1.75]">
            {t("companyTeam")}
          </p>
          <div className="mt-1 flex items-start gap-3 rounded-[18px] bg-(--nw-danger-bg) p-4 text-[14px] leading-[1.55] text-(--nw-danger-fg) md:mt-2 md:gap-3.5 md:rounded-[20px] md:px-[22px] md:py-5 md:text-[15px] md:leading-[1.6]">
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-(--nw-danger-dot) text-white md:size-9">
              <TriangleAlert
                aria-hidden="true"
                className="size-4 md:size-[17px]"
              />
            </span>
            <p className="pt-1 md:pt-1.5">
              {t.rich("safetyNote", {
                b: (chunks) => (
                  <a
                    className="relative font-bold underline-offset-2 after:absolute after:-inset-x-2 after:-inset-y-3.5 hover:underline"
                    href="tel:112"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

async function AboutContribute({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "about" });
  const authors = getCreditAuthorCards().map((card) => card.author);

  return (
    <section className={`${wrapClass} py-14 md:pt-[120px] md:pb-28`}>
      <div className="rounded-[28px] bg-(--nw-panel) px-[22px] py-7 text-white md:grid md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-12 md:rounded-[36px] md:px-16 md:py-14">
        <div>
          <p className="text-[10.5px] font-semibold tracking-[0.16em] text-white/55 md:text-[11px]">
            {t("contributeEyebrow")}
          </p>
          <h2 className="mt-3 text-[26px] leading-[1.15] font-semibold md:mt-3.5 md:text-[40px] md:leading-[1.1] md:tracking-[-0.018em]">
            {t("contributeTitle")}
          </h2>
          <p className="mt-3 max-w-[560px] text-[14.5px] leading-[1.65] text-white/72 md:mt-3.5 md:text-[16.5px]">
            {t("contributeBody")}
          </p>
          <Link
            className="mt-8 hidden h-[52px] items-center gap-2.5 rounded-full bg-white px-6 text-[15px] font-semibold text-[#1a211c] transition-opacity hover:opacity-90 md:inline-flex"
            href="/contact"
          >
            {t("contributeCta")}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
        {authors.length > 0 ? (
          <Link
            className="mt-5 flex items-center gap-3 md:mt-0 md:flex-col md:items-end md:gap-3.5"
            href="/authors"
          >
            <span aria-hidden="true" className="flex">
              {authors.slice(0, AVATAR_LIMIT.desktop).map((author, index) => (
                <span
                  className={`relative size-10 overflow-hidden rounded-full border-2 border-(--nw-panel) bg-[#2f6b4f] md:size-[52px] md:border-[3px] ${
                    index > 0 ? "-ml-2.5 md:-ml-3" : ""
                  } ${index >= AVATAR_LIMIT.mobile ? "max-md:hidden" : ""}`}
                  key={author.id}
                  title={creditAuthorName(author, locale)}
                >
                  <CoverImage
                    alt=""
                    aria-hidden
                    className={`object-cover ${author.portraitClass ?? "object-[50%_18%]"}`}
                    sizes="52px"
                    src={author.portraitSrc}
                  />
                </span>
              ))}
              {authors.length > AVATAR_LIMIT.desktop ? (
                <span className="-ml-3 hidden size-[52px] items-center justify-center rounded-full border-[3px] border-(--nw-panel) bg-white text-[13px] font-bold text-[#1a211c] md:inline-flex">
                  +{authors.length - AVATAR_LIMIT.desktop}
                </span>
              ) : null}
            </span>
            <span className="text-[13px] text-white/72 md:text-[14px]">
              <span className="md:hidden">
                {t("contributorsShort", { count: authors.length })}
              </span>
              <span className="hidden md:inline">
                {t("contributorsJoin", { count: authors.length })} →
              </span>
            </span>
          </Link>
        ) : null}
        <Link
          className="mt-5 flex h-[52px] items-center justify-center gap-2.5 rounded-full bg-white text-[15px] font-semibold text-[#1a211c] md:hidden"
          href="/contact"
        >
          {t("contributeCta")}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </section>
  );
}

async function AboutExplore({ locale }: { locale: AppLocale }) {
  const [t, tNav] = await Promise.all([
    getTranslations({ locale, namespace: "about" }),
    getTranslations({ locale, namespace: "nav" }),
  ]);
  const stats = getAtlasStats();

  return (
    <section className={`${wrapClass} pt-14 md:pt-[120px]`}>
      <div className="lg:grid lg:grid-cols-[440px_minmax(0,1fr)] lg:items-start lg:gap-20">
        <div className="lg:sticky lg:top-28">
          <p className={eyebrowClass}>{t("exploreEyebrow")}</p>
          <h2 className={h2Class}>{t("exploreTitle")}</h2>
          <p className="mt-3 text-[15px] leading-[1.65] text-(--nw-muted) md:mt-4 md:text-[16px] md:leading-[1.7]">
            {t("exploreBody")}
          </p>
          <Link
            className={`${darkButtonClass} mt-7 hidden md:inline-flex`}
            href="/species"
          >
            {t("atlasCtaCount", { count: stats.total })}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
        <div className="mt-4 md:mt-8 lg:mt-0">
          <ul className="flex flex-col gap-2 md:grid md:grid-cols-2 md:gap-2.5 xl:grid-cols-3">
            {CATEGORY_HUBS.map((id) => (
              <li key={id}>
                <Link
                  className="group flex items-center gap-3.5 rounded-[20px] bg-(--nw-card) py-2 pr-3.5 pl-2 motion-safe:transition-[translate,box-shadow] motion-safe:duration-200 md:py-2.5 md:pr-[18px] md:pl-2.5 md:hover:shadow-[0_14px_32px_rgba(14,20,17,0.09)] md:motion-safe:hover:-translate-y-0.5"
                  href={GROUP_HUBS[id].path}
                >
                  <span className="relative size-12 shrink-0 overflow-hidden rounded-xl md:size-14 md:rounded-[14px] [&_picture]:bg-transparent! [&_picture]:bg-none!">
                    <CoverImage
                      alt=""
                      aria-hidden
                      className="object-cover"
                      sizes="56px"
                      src={GROUP_HUB_ILLUSTRATIONS[id]}
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold md:text-[16px]">
                      {t(`exploreLinks.${id}`)}
                    </span>
                    <span className="mt-0.5 block text-[12.5px] text-(--nw-muted) md:mt-[3px] md:text-[13px]">
                      {tNav("speciesCount", { count: stats[id] })}
                    </span>
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="hidden size-4 text-(--nw-sep) transition-colors group-hover:text-(--nw-accent) md:block"
                  />
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mt-2 flex flex-col gap-2 md:mt-2.5 md:grid md:grid-cols-2 md:gap-2.5">
            <li>
              <CalloutLink
                dotClass="bg-(--nw-danger-dot)"
                href="/venomous-snakes"
                toneClass="bg-(--nw-danger-bg) text-(--nw-danger-fg)"
              >
                {t("exploreLinks.venomous")}
              </CalloutLink>
            </li>
            <li>
              <CalloutLink
                dotClass="bg-(--nw-warn-dot)"
                href="/dangerous-animals"
                toneClass="bg-(--nw-warn-bg) text-(--nw-warn-fg)"
              >
                {t("exploreLinks.dangerous")}
              </CalloutLink>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

async function AboutHero({ locale }: { locale: AppLocale }) {
  const [t, tNav] = await Promise.all([
    getTranslations({ locale, namespace: "about" }),
    getTranslations({ locale, namespace: "nav" }),
  ]);
  const stats = getAtlasStats();
  const contributors = getCreditAuthorCards().length;
  const languages = routing.locales.length;
  const statItems = [
    { label: t("stats.species", { count: stats.total }), value: stats.total },
    {
      label: t("stats.regions", { count: stats.regions }),
      value: stats.regions,
    },
    {
      label: t("stats.contributors", { count: contributors }),
      value: contributors,
    },
    {
      label: t("stats.languages", { count: languages }),
      shortLabel: t("stats.languagesShort", { count: languages }),
      value: languages,
    },
  ];

  return (
    <section className={`${wrapClass} pt-[107px] md:pt-[147px]`}>
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:items-center lg:gap-14 xl:grid-cols-[minmax(0,1fr)_600px] xl:gap-[72px]">
        <div>
          <span className="inline-flex h-[26px] items-center rounded-full bg-(--nw-surface) px-[11px] text-[12px] font-semibold text-(--nw-accent) md:h-7 md:px-3 md:text-[12.5px]">
            {t("eyebrow")}
          </span>
          <h1 className="mt-[18px] font-display text-[42px] leading-[1.04] font-semibold tracking-tight md:mt-6 md:text-[64px] md:leading-none md:tracking-[-0.03em] xl:text-[76px]">
            <BrandText text={t("title")} />
          </h1>
          <p className="mt-4 max-w-[520px] text-[16.5px] leading-[1.55] text-(--nw-soft) md:mt-6 md:text-[19px]">
            {t("subtitle")}
          </p>
          <div className="mt-9 hidden gap-2.5 md:flex">
            <Link className={darkButtonClass} href="/species">
              {t("atlasCta")}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <a
              className="inline-flex h-[52px] items-center rounded-full border border-border bg-(--nw-card) px-[22px] text-[15px] font-medium transition-colors hover:border-(--nw-accent)"
              href="#methodology"
            >
              {t("methodCta")}
            </a>
          </div>
          <Link
            className={`${darkButtonClass} mt-6 flex w-full md:hidden`}
            href="/species"
          >
            {t("atlasCta")}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
        <div
          aria-hidden="true"
          className="mt-6 grid grid-cols-3 items-start gap-2 lg:hidden"
        >
          {COLLAGE_MOBILE.map((tile) => (
            <CollageTile
              className={`h-[150px] ${tile.offset}`}
              count={stats[tile.id]}
              id={tile.id}
              key={tile.id}
              label={tNav(tile.id)}
            />
          ))}
        </div>
        <div
          aria-hidden="true"
          className="hidden grid-cols-3 items-start gap-3 lg:grid"
        >
          {COLLAGE_DESKTOP.map((column) => (
            <div
              className={`flex flex-col gap-3 ${column.offset}`}
              key={column.tiles[0].id}
            >
              {column.tiles.map((tile) => (
                <CollageTile
                  className={tile.height}
                  count={stats[tile.id]}
                  id={tile.id}
                  key={tile.id}
                  label={tNav(tile.id)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-2 md:mt-[72px] md:grid-cols-4 md:gap-0 md:border-y md:border-(--nw-rule)">
        {statItems.map((item, index) => (
          <div
            className={`flex flex-col-reverse rounded-[18px] bg-(--nw-card) p-4 md:rounded-none md:bg-transparent md:px-0 md:py-7 ${
              index > 0 ? "md:border-l md:border-(--nw-rule) md:pl-8" : ""
            }`}
            key={item.label}
          >
            <dt className="mt-1.5 text-[12.5px] text-(--nw-muted) md:mt-2 md:text-[14px]">
              {item.shortLabel ? (
                <>
                  <span className="md:hidden">{item.shortLabel}</span>
                  <span className="hidden md:inline">{item.label}</span>
                </>
              ) : (
                item.label
              )}
            </dt>
            <dd className="text-[30px] leading-none font-semibold md:text-[44px] md:tracking-[-0.02em]">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

async function AboutMethod({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <section
      className={`${wrapClass} scroll-mt-28 pt-14 md:pt-[120px]`}
      id="methodology"
    >
      <div className="lg:grid lg:grid-cols-[440px_minmax(0,1fr)] lg:items-end lg:gap-20">
        <div>
          <p className={eyebrowClass}>{t("methodEyebrow")}</p>
          <h2 className={h2Class}>{t("methodTitle")}</h2>
        </div>
        <p className="mt-3.5 text-[15.5px] leading-[1.7] text-(--nw-soft) md:text-[17px] lg:mt-0">
          {t("methodLead")}
        </p>
      </div>
      <div className="mt-5 flex flex-col gap-2 md:mt-10 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-[1.15fr_1fr_1fr]">
        <div className="flex flex-col rounded-3xl bg-(--nw-panel) p-[22px] text-white md:col-span-2 md:rounded-[30px] md:p-8 lg:col-span-1">
          <h3 className="text-[10.5px] font-semibold tracking-[0.16em] text-white/55 md:text-[11px]">
            {t("methodCardTitle")}
          </h3>
          <ul className="mt-3.5 flex flex-wrap gap-1.5 md:mt-[22px] md:gap-2">
            {NOT_INFERRED.map((key) => (
              <li
                className="inline-flex h-8 items-center gap-1.5 rounded-full bg-white/8 px-3 text-[12.5px] text-white/86 md:h-9 md:gap-2 md:px-3.5 md:text-[13.5px]"
                key={key}
              >
                <X
                  aria-hidden="true"
                  className="hidden size-[13px] text-[#e38b7e] md:block"
                />
                {t(`notInferred.${key}`)}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[14px] leading-[1.65] text-white/74 md:mt-6 md:text-[15px] md:leading-[1.7]">
            {t("methodCardBody")}
          </p>
        </div>
        <MethodCard
          icon={<SquareCheckBig aria-hidden="true" className="size-5" />}
          title={t("sourcesCardTitle")}
        >
          <p>{t("sourcesCardBody")}</p>
          <div className="min-h-5 flex-1" />
          <ul className="mt-3.5 flex flex-wrap gap-1.5 md:mt-0 md:gap-2">
            {SOURCE_LINKS.map((source) => (
              <li key={source.key}>
                <a
                  className="inline-flex h-[34px] items-center gap-2 rounded-full bg-(--nw-wash) px-3.5 text-[13px] font-semibold text-(--nw-ink) transition-colors hover:text-(--nw-accent)"
                  href={source.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {t(`sources.${source.key}`)}
                  <ArrowUpRight aria-hidden="true" className="size-[13px]" />
                </a>
              </li>
            ))}
          </ul>
        </MethodCard>
        <MethodCard
          icon={<Camera aria-hidden="true" className="size-5" />}
          title={t("photosCardTitle")}
        >
          <p>{t("photosCardBody")}</p>
          <div className="min-h-5 flex-1" />
          <Link
            className="mt-3.5 inline-flex items-center gap-2 self-start text-[14px] font-semibold text-(--nw-ink) transition-colors hover:text-(--nw-accent) md:mt-0"
            href="/authors"
          >
            {t("contributors")}
            <ArrowRight aria-hidden="true" className="size-[15px]" />
          </Link>
        </MethodCard>
      </div>
    </section>
  );
}

async function AboutPillars({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <section className={`${wrapClass} pt-12 md:pt-[120px]`}>
      <ul className="flex flex-col gap-2 md:grid md:grid-cols-3 md:gap-4">
        {PILLARS.map((pillar, index) => (
          <li
            className="flex gap-4 rounded-3xl bg-(--nw-card) p-5 md:flex-col md:gap-0 md:rounded-[30px] md:p-8"
            key={pillar.key}
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex size-11 items-center justify-center rounded-[14px] bg-(--nw-surface) text-(--nw-accent) md:size-[52px] md:rounded-[18px]">
                <pillar.icon
                  aria-hidden="true"
                  className="size-5 md:size-[22px]"
                />
              </span>
              <span className="hidden text-[13px] font-semibold text-(--nw-sep) tabular-nums md:inline">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="min-w-0">
              <h3 className="text-[20px] font-semibold md:mt-10 md:text-[30px] md:leading-[1.1] md:tracking-[-0.015em]">
                {t(`pillars.${pillar.key}.title`)}
              </h3>
              <p className="mt-1.5 text-[14.5px] leading-[1.6] text-(--nw-muted) md:mt-3 md:text-[15.5px] md:leading-[1.65]">
                {t(`pillars.${pillar.key}.body`)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CalloutLink({
  children,
  dotClass,
  href,
  toneClass,
}: {
  children: ReactNode;
  dotClass: string;
  href: "/dangerous-animals" | "/venomous-snakes";
  toneClass: string;
}) {
  return (
    <Link
      className={`group flex items-center gap-3 rounded-[18px] px-[18px] py-4 md:gap-3.5 md:rounded-[20px] md:px-[22px] md:py-5 ${toneClass}`}
      href={href}
    >
      <span
        aria-hidden="true"
        className={`size-[9px] shrink-0 rounded-full md:size-2.5 ${dotClass}`}
      />
      <span className="flex-1 text-[15px] font-semibold md:text-[16px]">
        {children}
      </span>
      <ArrowRight
        aria-hidden="true"
        className="hidden size-4 group-hover:translate-x-0.5 motion-safe:transition-transform md:block"
      />
    </Link>
  );
}

function CollageTile({
  className,
  count,
  id,
  label,
}: {
  className: string;
  count: number;
  id: GroupHubId;
  label: string;
}) {
  return (
    <span
      className={`relative flex flex-col justify-end overflow-hidden rounded-[20px] bg-[#151c18] px-4 py-3.5 text-white md:rounded-[28px] ${className}`}
    >
      <span className="absolute inset-0 [&_picture]:bg-transparent! [&_picture]:bg-none!">
        <CoverImage
          alt=""
          aria-hidden
          className="object-cover"
          sizes="(max-width: 1023px) 33vw, 200px"
          src={GROUP_HUB_ILLUSTRATIONS[id]}
        />
      </span>
      <span className="absolute inset-x-0 bottom-0 h-[60%] bg-linear-to-t from-[rgba(14,20,17,0.8)] to-transparent" />
      <span className="relative text-[15px] leading-none font-semibold tabular-nums md:text-[22px]">
        {count}
      </span>
      <span className="relative mt-1 text-[12.5px] font-semibold md:text-[14px]">
        {label}
      </span>
    </span>
  );
}

function MethodCard({
  children,
  icon,
  title,
}: {
  children: ReactNode;
  icon: ReactNode;
  title: string;
}) {
  return (
    <div className="flex flex-col rounded-3xl bg-(--nw-card) p-[22px] text-[14.5px] leading-[1.65] text-(--nw-muted) md:rounded-[30px] md:p-8 md:text-[15px] md:leading-[1.7]">
      <span className="hidden size-12 items-center justify-center rounded-2xl bg-(--nw-surface) text-(--nw-accent) md:inline-flex">
        {icon}
      </span>
      <h3 className="mb-2 text-[19px] font-semibold text-(--nw-ink) md:mt-[22px] md:mb-3 md:text-[22px]">
        {title}
      </h3>
      {children}
    </div>
  );
}
