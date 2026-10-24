import type { ComponentType, ReactNode } from "react";

import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  FlaskConical,
  Mountain,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { ClientMessagesProvider } from "@/components/ClientMessagesProvider";
import {
  DevelopersAccessForm,
  DevelopersDocsButton,
} from "@/components/DevelopersAccessForm";
import { codeClass, JsonKey, JsonString } from "@/components/DevelopersCode";
import { DevelopersCodeSample } from "@/components/DevelopersCodeSample";
import { Logo } from "@/components/Logo";
import { getAtlasStats } from "@/data/speciesAtlas";
import { routing } from "@/i18n/routing";
import { API_ORIGIN } from "@/lib/apiClient";
import { cn } from "@/lib/cn";
import { CONTACT_EMAIL } from "@/lib/site";
import { getSpeciesProfile } from "@/lib/speciesProfileApi";
import { getSpeciesPublicSlug } from "@/lib/speciesSlugTable";

const API_DOCS_URL = `${API_ORIGIN}/v1/docs`;

const SAMPLE_SPECIES_ID = "macrovipera-lebetina";

const ENDPOINTS = [
  { key: "list", path: "/v1/species" },
  { key: "detail", path: "/v1/species/{slug}" },
  { key: "records", path: "/v1/species/{slug}/field-records" },
  { key: "news", path: "/v1/news" },
] as const;

const USES: ReadonlyArray<{
  icon: ComponentType<{ "aria-hidden"?: boolean; className?: string }>;
  key: "education" | "research" | "tourism";
}> = [
  { icon: Mountain, key: "tourism" },
  { icon: BookOpen, key: "education" },
  { icon: FlaskConical, key: "research" },
];

const TERMS = ["credit", "languages", "verified", "safety"] as const;

const wrapClass =
  "mx-auto box-content max-w-[1320px] px-4 md:px-10 lg:px-[60px]";
const eyebrowClass =
  "text-[10.5px] font-semibold tracking-[0.16em] text-(--nw-muted) md:text-[11px]";
const h2Class =
  "mt-2.5 text-[28px] leading-[1.12] font-semibold tracking-[-0.015em] md:mt-3.5 md:text-[40px] md:leading-[1.1] md:tracking-[-0.018em]";
const linkClass =
  "inline-flex items-center gap-2 text-[14px] font-semibold text-(--nw-accent) hover:underline md:text-[15px]";

export async function DevelopersPage({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "developers" });
  const docsButton = (
    <DevelopersDocsButton
      href={API_DOCS_URL}
      label={t("docs")}
      newTab={t("newTab")}
    />
  );

  return (
    <div className="editorial-page min-h-screen bg-background text-(--nw-ink) antialiased">
      <DevelopersHero locale={locale} />
      <DevelopersEndpoints locale={locale} />
      <DevelopersUses locale={locale} />
      <DevelopersTerms locale={locale} />
      <section
        className={`${wrapClass} scroll-mt-20 pt-11 pb-14 md:pt-[104px] md:pb-28`}
        id="request"
      >
        <div className="lg:grid lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-start lg:gap-16">
          <div className="px-1 md:px-0 lg:sticky lg:top-24">
            <p className={eyebrowClass}>{t("access.eyebrow")}</p>
            <h2 className={h2Class}>{t("access.title")}</h2>
            <p className="mt-2.5 text-[14.5px] leading-[1.6] text-(--nw-muted) md:hidden">
              {t("access.bodyShort")}
            </p>
            <p className="mt-4 hidden text-[16px] leading-[1.7] text-(--nw-muted) md:block">
              {t("access.body")}
            </p>
            <ol className="mt-7 hidden list-none p-0 lg:block">
              {(["stepRequest", "stepReview", "stepKey"] as const).map(
                (key, index) => (
                  <li
                    className="flex gap-3.5 border-t border-(--nw-rule) py-3.5 text-[15px] last:border-b"
                    key={key}
                  >
                    <b className="w-[22px] shrink-0 text-(--nw-accent)">
                      {index + 1}
                    </b>
                    {t(`access.${key}`)}
                  </li>
                ),
              )}
            </ol>
          </div>
          <div className="mt-4 rounded-[26px] bg-(--nw-card) px-[18px] py-[22px] md:px-10 md:py-9 lg:mt-0 lg:rounded-[32px] lg:shadow-[0_1px_2px_rgba(14,20,17,0.04),0_20px_50px_rgba(14,20,17,0.06)]">
            <ClientMessagesProvider
              locale={locale}
              namespaces={["developers.form"]}
            >
              <DevelopersAccessForm
                docsLink={docsButton}
                email={CONTACT_EMAIL}
              />
            </ClientMessagesProvider>
          </div>
        </div>
      </section>
    </div>
  );
}

function AttributionBadge({ label }: { label: ReactNode }) {
  return (
    <span className="inline-flex h-11 items-center gap-2.5 rounded-full bg-white pr-4 pl-2 text-[13.5px] text-[#1a211c] shadow-[0_0_0_1px_#e3e9e1]">
      <Logo alt="" size={28} />
      {label} <b className="font-bold">Reptiles.ge</b>
    </span>
  );
}

async function DevelopersEndpoints({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "developers" });
  const docsLink = (className: string) => (
    <a
      className={cn(linkClass, className)}
      href={API_DOCS_URL}
      rel="noopener noreferrer"
      target="_blank"
    >
      {t("endpoints.docsLink")}
      <ArrowRight aria-hidden="true" className="size-[15px]" />
      <span className="sr-only"> {t("newTab")}</span>
    </a>
  );

  return (
    <section className={`${wrapClass} pt-11 md:pt-[104px]`}>
      <div className="px-1 md:px-0 lg:grid lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)] lg:items-start lg:gap-20">
        <div>
          <p className={eyebrowClass}>{t("endpoints.eyebrow")}</p>
          <h2 className={h2Class}>{t("endpoints.title")}</h2>
          <p className="mt-4 hidden text-[16px] leading-[1.7] text-(--nw-muted) md:block">
            {t.rich("endpoints.intro", {
              code: (chunks) => (
                <code className="rounded-md bg-(--nw-surface) px-[7px] py-0.5 text-[14px]">
                  {chunks}
                </code>
              ),
            })}
          </p>
          {docsLink("mt-6 hidden lg:inline-flex")}
        </div>
        <ul className="mt-3.5 list-none border-b border-(--nw-line) p-0 md:mt-8 lg:mt-0">
          {ENDPOINTS.map(({ key, path }) => (
            <li
              className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-2.5 border-t border-(--nw-line) py-3.5 lg:grid-cols-[52px_minmax(0,1fr)] lg:items-start lg:gap-x-3.5 lg:py-[18px]"
              key={key}
            >
              <span className="inline-flex h-[22px] w-fit items-center rounded-md bg-(--nw-surface) px-2 font-mono text-[11px] font-bold text-(--nw-accent) lg:mt-0.5">
                GET
              </span>
              <span className="font-mono text-[13.5px] font-semibold break-all text-(--nw-ink) lg:text-[15px]">
                {path}
              </span>
              <span className="col-span-2 mt-1.5 text-[13.5px] leading-[1.55] text-(--nw-muted) lg:col-span-1 lg:col-start-2 lg:text-[14.5px]">
                {t(`endpoints.${key}`)}
              </span>
            </li>
          ))}
        </ul>
        {docsLink("mt-3.5 lg:hidden")}
      </div>
    </section>
  );
}

async function DevelopersHero({ locale }: { locale: AppLocale }) {
  const [t, stats, profile] = await Promise.all([
    getTranslations({ locale, namespace: "developers" }),
    getAtlasStats(locale),
    getSpeciesProfile(SAMPLE_SPECIES_ID, locale),
  ]);
  const slug = getSpeciesPublicSlug(SAMPLE_SPECIES_ID, locale);
  const numberLocale = locale === "ka" ? "en-US" : locale;
  const statItems = [
    { count: stats.total, key: "species" },
    { count: stats.regions, key: "regions" },
    { count: stats.photos, key: "photos" },
    { count: routing.locales.length, key: "languages" },
  ] as const;
  const fields: ReadonlyArray<readonly [string, string]> = profile
    ? [
        ["id", SAMPLE_SPECIES_ID],
        ["slug", slug],
        ["commonName", profile.species.commonName],
        ["scientificName", profile.species.scientificName],
        ["group", profile.group],
        ["danger", profile.species.danger ?? ""],
        ["image", profile.species.image],
      ].filter((field): field is [string, string] => Boolean(field[1]))
    : [];

  return (
    <section className="bg-[#0e1411] pb-7 text-white md:pb-[88px]">
      <div
        className={`${wrapClass} pt-24 md:pt-[148px] xl:grid xl:grid-cols-[minmax(0,1fr)_600px] xl:items-center xl:gap-16`}
      >
        <div className="px-1 md:px-0">
          <div className="flex flex-wrap items-center gap-2 md:gap-2.5">
            <span className="inline-flex h-[26px] items-center rounded-full bg-[rgba(127,194,155,0.14)] px-[11px] text-[12px] font-semibold text-[#7fc29b] md:h-7 md:px-3 md:text-[12.5px]">
              {t("brand")}
            </span>
            <span className="inline-flex h-[26px] items-center rounded-full border border-white/18 px-[9px] font-mono text-[11px] text-white/70 md:h-7 md:px-2.5 md:text-[11.5px]">
              {t("version")}
            </span>
          </div>
          <h1 className="mt-[18px] text-[38px] leading-[1.06] font-semibold tracking-tight md:mt-6 md:text-[64px] md:leading-[1.02] md:tracking-[-0.03em]">
            {t("title")}
          </h1>
          <p className="mt-3.5 text-[16px] leading-[1.6] text-white/74 md:hidden">
            {t("bodyShort")}
          </p>
          <p className="mt-[22px] hidden max-w-[540px] text-[18px] leading-[1.6] text-white/74 md:block">
            {t("body")}
          </p>
          <div className="mt-[22px] flex flex-col gap-2 md:mt-[34px] md:flex-row md:gap-2.5">
            <a
              className="inline-flex h-[52px] items-center justify-center gap-2.5 rounded-full bg-white text-[15px] font-semibold text-[#0e1411] transition-opacity hover:opacity-90 md:h-[54px] md:px-[26px] md:text-[15.5px]"
              href={API_DOCS_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              <BookOpen aria-hidden="true" className="size-[17px]" />
              {t("docs")}
              <ArrowUpRight aria-hidden="true" className="size-[15px]" />
              <span className="sr-only"> {t("newTab")}</span>
            </a>
            <a
              className="inline-flex h-[52px] items-center justify-center rounded-full border border-white/24 text-[15px] font-medium text-white transition-colors hover:bg-white/8 md:h-[54px] md:px-6 md:text-[15.5px]"
              href="#request"
            >
              {t("requestAccess")}
            </a>
          </div>
          <dl
            aria-label={t("statsLabel")}
            className="mt-6 grid max-w-[560px] grid-cols-4 gap-2 md:mt-12 md:gap-5"
          >
            {statItems.map(({ count, key }) => (
              <div className="flex flex-col-reverse" key={key}>
                <dt className="text-[11.5px] text-white/60 md:mt-1 md:text-[13px]">
                  {t(`stats.${key}`, { count })}
                </dt>
                <dd className="m-0 text-[22px] font-semibold md:text-[30px] md:tracking-[-0.02em]">
                  {count.toLocaleString(numberLocale)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="-mx-2 mt-[26px] md:mx-0 md:mt-12 xl:mt-0">
          <ClientMessagesProvider
            locale={locale}
            namespaces={["developers.sample"]}
          >
            <DevelopersCodeSample
              apiOrigin={API_ORIGIN}
              locale={locale}
              response={
                fields.length > 0 ? (
                  <JsonResponse fields={fields} locale={locale} />
                ) : null
              }
              slug={slug}
            />
          </ClientMessagesProvider>
        </div>
      </div>
    </section>
  );
}

async function DevelopersTerms({ locale }: { locale: AppLocale }) {
  const [t, profile] = await Promise.all([
    getTranslations({ locale, namespace: "developers" }),
    getSpeciesProfile(SAMPLE_SPECIES_ID, locale),
  ]);
  const photographer = profile?.species.imageCredit?.photographer;

  return (
    <section className={`${wrapClass} pt-11 md:pt-[104px]`}>
      <div className="grid gap-2 lg:grid-cols-2 lg:items-stretch lg:gap-3">
        <div className="rounded-[26px] bg-(--nw-panel) px-[22px] py-6 text-white md:rounded-[32px] md:px-10 md:py-9">
          <p className={cn(eyebrowClass, "text-white/55")}>
            {t("terms.eyebrow")}
          </p>
          <h2 className="mt-2 text-[22px] leading-[1.2] font-semibold md:mt-3 md:text-[30px] md:leading-[1.15]">
            {t("terms.title")}
          </h2>
          <ul className="mt-3.5 list-none p-0 md:mt-[22px]">
            {TERMS.map((key) => (
              <li
                className="flex gap-3.5 border-t border-white/10 py-4"
                key={key}
              >
                <span className="inline-flex size-[26px] shrink-0 items-center justify-center rounded-full bg-[rgba(127,194,155,0.16)] text-[#7fc29b]">
                  <Check
                    aria-hidden="true"
                    className="size-[13px]"
                    strokeWidth={2.6}
                  />
                </span>
                <span>
                  <span className="block text-[15px] font-semibold md:text-[16px]">
                    {t(`terms.${key}.title`)}
                  </span>
                  <span className="mt-1 block text-[13.5px] leading-[1.55] text-white/68 md:text-[14px]">
                    {t(`terms.${key}.body`)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[26px] bg-(--nw-surface) p-[22px] md:rounded-[32px] md:px-10 md:py-9 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className={cn(eyebrowClass, "hidden md:block")}>
              {t("badge.eyebrow")}
            </p>
            <h2 className="text-[18px] font-semibold md:mt-3 md:text-[30px] md:leading-[1.15]">
              {t("badge.title")}
            </h2>
            <p className="mt-1.5 text-[13.5px] leading-[1.55] text-(--nw-soft) md:hidden">
              {t("badge.bodyShort")}
            </p>
            <p className="mt-3.5 hidden text-[15.5px] leading-[1.65] text-(--nw-soft) md:block">
              {t("badge.body")}
            </p>
          </div>
          <div className="mt-3.5 md:mt-7 md:rounded-[22px] md:bg-(--nw-card) md:p-7">
            <p className="hidden text-[12.5px] text-(--nw-muted) md:block">
              {t("badge.preview")}
            </p>
            <div className="flex flex-wrap items-center gap-3 md:mt-3.5">
              <AttributionBadge label={t("badge.data")} />
              {photographer ? (
                <span className="hidden text-[13px] text-(--nw-muted) md:inline">
                  · {t("badge.photo", { name: photographer })}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

async function DevelopersUses({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "developers" });

  return (
    <section className={`${wrapClass} pt-11 md:pt-[104px]`}>
      <div className="px-1 md:px-0">
        <p className={eyebrowClass}>{t("uses.eyebrow")}</p>
        <h2 className={h2Class}>{t("uses.title")}</h2>
      </div>
      <ul className="mt-3.5 flex list-none flex-col gap-2 p-0 md:mt-7 md:grid md:grid-cols-3 md:gap-3">
        {USES.map(({ icon: Icon, key }) => (
          <li
            className="flex gap-3.5 rounded-[20px] bg-(--nw-card) p-[18px] md:block md:rounded-[28px] md:p-7"
            key={key}
          >
            <span className="inline-flex size-[42px] shrink-0 items-center justify-center rounded-[14px] bg-(--nw-surface) text-(--nw-accent) md:size-12 md:rounded-2xl">
              <Icon aria-hidden className="size-[21px]" />
            </span>
            <span className="block">
              <span className="block text-[16.5px] font-semibold md:mt-[22px] md:text-[20px]">
                {t(`uses.${key}.title`)}
              </span>
              <span className="mt-1 block text-[13.5px] leading-[1.55] text-(--nw-muted) md:mt-2 md:text-[14.5px] md:leading-[1.6]">
                {t(`uses.${key}.body`)}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function JsonResponse({
  fields,
  locale,
}: {
  fields: ReadonlyArray<readonly [string, string]>;
  locale: AppLocale;
}) {
  return (
    <pre
      className={cn(codeClass, "px-4 pt-4 pb-5 text-white/82 md:px-6")}
      tabIndex={0}
    >
      {"{\n  "}
      <JsonKey>&quot;data&quot;</JsonKey>
      {": {\n"}
      {fields.map(([key, value]) => (
        <span key={key}>
          {"    "}
          <JsonKey>&quot;{key}&quot;</JsonKey>:{" "}
          <JsonString>&quot;{value}&quot;</JsonString>
          {",\n"}
        </span>
      ))}
      {"    …\n  },\n  "}
      <JsonKey>&quot;locale&quot;</JsonKey>:{" "}
      <JsonString>&quot;{locale}&quot;</JsonString>
      {"\n}"}
    </pre>
  );
}
