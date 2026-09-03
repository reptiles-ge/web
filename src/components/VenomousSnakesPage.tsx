"use client";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Plus,
  Shield,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import {
  CLUSTER_BODY,
  CLUSTER_EYEBROW,
  CLUSTER_FAQ_BODY,
  CLUSTER_FAQ_TITLE,
  CLUSTER_HERO_BODY,
  CLUSTER_HERO_EYEBROW,
  CLUSTER_HERO_TITLE,
  CLUSTER_TITLE_GUIDE,
  CLUSTER_TITLE_RELATED,
  CLUSTER_TITLE_SECTION,
  ClusterSectionIntro,
} from "@/components/ClusterSectionIntro";
import { ContentAttribution } from "@/components/ContentAttribution";
import { CoverImage } from "@/components/CoverImage";
import { QuizPracticeCta } from "@/components/QuizPracticeCta";
import { RelatedGuideGrid } from "@/components/RelatedGuideCards";
import { Reveal } from "@/components/Reveal";
import { SpeciesGuideList } from "@/components/SpeciesGuideRow";
import { SpeciesInlineLink } from "@/components/SpeciesInlineLink";
import { Link } from "@/i18n/navigation";
import {
  getHubPageRelatedGuides,
  getRearFangedSpecies,
  getViperSpecies,
} from "@/lib/clusterGuides";
import { cn } from "@/lib/cn";
import { speciesHref } from "@/lib/speciesRoutes";

type VenomousSnakesPageProps = {
  heroSrc: string;
  species: Species[];
};

export function VenomousSnakesPage({
  heroSrc,
  species,
}: VenomousSnakesPageProps) {
  const t = useTranslations("venomousSnakes");
  const tSnakes = useTranslations("snakes");
  const locale = useLocale() as AppLocale;
  const vipers = getViperSpecies(species);
  const rearFanged = getRearFangedSpecies(species);
  const highCount = species.filter((item) => item.danger === "High").length;
  const moderateCount = species.filter(
    (item) => item.danger === "Moderate",
  ).length;
  const giurza = species.find((item) => item.id === "macrovipera-lebetina");
  const kaznakovi = species.find((item) => item.id === "vipera-kaznakovi");
  const relatedGuides = getHubPageRelatedGuides(
    "snakes",
    "/venomous-snakes",
  ).filter(
    (card) =>
      card.kind === "quiz" ||
      (card.kind === "page" &&
        card.key !== "identify" &&
        card.key !== "bite" &&
        card.key !== "yard"),
  );

  return (
    <div className="min-h-screen bg-background">
      <main>
        <section
          className="relative flex min-h-[88svh] w-full flex-col justify-end overflow-hidden bg-ink pb-12 sm:pb-16 lg:min-h-[92svh] lg:pb-20"
          style={{
            paddingTop: "7rem",
          }}
        >
          <CoverImage
            alt={t("heroImageAlt")}
            className="object-cover object-[50%_35%]"
            priority
            sizes="100vw"
            src={heroSrc}
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/35 to-black/92" />
          <div className="absolute inset-0 bg-[radial-gradient(100%_70%_at_50%_25%,transparent_25%,rgba(0,0,0,0.58)_100%)]" />

          <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <nav aria-label="Breadcrumb" className="mb-5 sm:mb-7">
                <ol className="flex flex-wrap items-center gap-2 text-[13px] text-white/55">
                  <li>
                    <Link
                      className="inline-flex items-center gap-2 transition-colors hover:text-white"
                      href="/"
                    >
                      <ArrowLeft className="size-3.5" />
                      {t("breadcrumbHome")}
                    </Link>
                  </li>
                  <li aria-hidden="true" className="text-white/30">
                    /
                  </li>
                  <li>
                    <Link
                      className="transition-colors hover:text-white"
                      href="/snakes"
                    >
                      {tSnakes("breadcrumbCurrent")}
                    </Link>
                  </li>
                  <li aria-hidden="true" className="text-white/30">
                    /
                  </li>
                  <li className="text-white/80">{t("breadcrumbCurrent")}</li>
                </ol>
              </nav>

              <p className="font-display text-[clamp(1.15rem,2.4vw,1.65rem)] font-semibold tracking-tight text-white/90">
                Reptiles
              </p>
              <h1 className="text-balance-tight mt-3 max-w-4xl font-display text-[clamp(2.1rem,6vw,4.6rem)] leading-[1.05] font-semibold text-white sm:mt-4">
                {t("title")}
              </h1>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/65 sm:mt-6 sm:text-[16px]">
                {t("subtitle")}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3 sm:mt-11">
                <a
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[14px] font-medium text-ink transition-opacity hover:opacity-90"
                  href="#species"
                >
                  {t("ctaSpecies")}
                  <ArrowRight className="size-4" />
                </a>
                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-[14px] font-medium text-white/85 backdrop-blur-md transition-colors hover:border-white/35 hover:bg-white/10 hover:text-white"
                  href={{ pathname: "/species", query: { danger: "venomous" } }}
                >
                  {t("ctaAtlas")}
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="border-b border-border bg-surface py-10 sm:py-12">
          <div className="mx-auto grid max-w-[1400px] gap-8 px-6 sm:grid-cols-3 sm:gap-6 lg:px-10">
            <div>
              <p className="font-display text-[clamp(2rem,4vw,2.75rem)] leading-none font-semibold text-foreground">
                {species.length}
              </p>
              <p className="mt-2 text-[13px] text-muted-foreground">
                {t("statSpecies")}
              </p>
            </div>
            <div>
              <p className="font-display text-[clamp(2rem,4vw,2.75rem)] leading-none font-semibold text-foreground">
                {highCount}
              </p>
              <p className="mt-2 text-[13px] text-muted-foreground">
                {t("statHigh")}
              </p>
            </div>
            <div>
              <p className="font-display text-[clamp(2rem,4vw,2.75rem)] leading-none font-semibold text-foreground">
                {moderateCount}
              </p>
              <p className="mt-2 text-[13px] text-muted-foreground">
                {t("statModerate")}
              </p>
            </div>
          </div>
        </section>

        <QuizPracticeCta
          body={t("quizCtaBody")}
          cta={t("quizCta")}
          eyebrow={t("quizCtaEyebrow")}
          locale={locale}
          source="other"
          title={t("quizCtaTitle")}
        />

        <section
          className="scroll-mt-28 bg-background py-20 lg:py-28"
          id="species"
        >
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <ClusterSectionIntro
                body={t("speciesBody")}
                bodyClassName={CLUSTER_BODY}
                eyebrow={t("speciesEyebrow")}
                eyebrowClassName={CLUSTER_EYEBROW}
                title={t("speciesTitle", { count: species.length })}
                titleClassName={CLUSTER_TITLE_SECTION}
              />
            </Reveal>

            {giurza || kaznakovi ? (
              <div className="mt-10 grid gap-4 md:grid-cols-2">
                {giurza ? (
                  <Reveal delay={40}>
                    <Link
                      className="flex h-full flex-wrap items-center justify-between gap-4 rounded-[24px] border border-border bg-card px-6 py-5 transition-colors hover:border-primary/25"
                      href={speciesHref(giurza.id, locale)}
                    >
                      <div>
                        <p className="text-[11px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
                          {t("featuredEyebrow")}
                        </p>
                        <p className="mt-2 font-display text-[22px] font-semibold text-foreground">
                          {giurza.commonName}
                        </p>
                        <p className="mt-1 text-[14px] text-muted-foreground italic">
                          {giurza.scientificName}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-primary">
                        {t("openProfile")}
                        <ArrowUpRight className="size-3.5" />
                      </span>
                    </Link>
                  </Reveal>
                ) : null}
                {kaznakovi ? (
                  <Reveal delay={60}>
                    <Link
                      className="flex h-full flex-wrap items-center justify-between gap-4 rounded-[24px] border border-border bg-card px-6 py-5 transition-colors hover:border-primary/25"
                      href={speciesHref(kaznakovi.id, locale)}
                    >
                      <div>
                        <p className="text-[11px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
                          {t("featuredWestEyebrow")}
                        </p>
                        <p className="mt-2 font-display text-[22px] font-semibold text-foreground">
                          {kaznakovi.commonName}
                        </p>
                        <p className="mt-1 text-[14px] text-muted-foreground italic">
                          {kaznakovi.scientificName}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-primary">
                        {t("openProfile")}
                        <ArrowUpRight className="size-3.5" />
                      </span>
                    </Link>
                  </Reveal>
                ) : null}
              </div>
            ) : null}

            <div className="mt-14 space-y-16">
              <div>
                <h3 className="font-display text-[clamp(1.35rem,2.4vw,1.85rem)] leading-tight font-semibold">
                  {t("vipersTitle")}
                </h3>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                  {t.rich("vipersBody", {
                    kaznakovi: (chunks) => (
                      <SpeciesInlineLink id="vipera-kaznakovi">
                        {chunks}
                      </SpeciesInlineLink>
                    ),
                  })}
                </p>
                <SpeciesGuideList
                  locale={locale}
                  source="guide"
                  species={vipers}
                />
              </div>
              {rearFanged.length > 0 ? (
                <div>
                  <h3 className="font-display text-[clamp(1.35rem,2.4vw,1.85rem)] leading-tight font-semibold">
                    {t("rearFangedTitle")}
                  </h3>
                  <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                    {t("rearFangedBody")}
                  </p>
                  <SpeciesGuideList
                    locale={locale}
                    source="guide"
                    species={rearFanged}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-surface py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
              <Reveal>
                <ClusterSectionIntro
                  body={t("safetyLead")}
                  bodyClassName="mt-5 text-[15px] leading-relaxed text-muted-foreground"
                  eyebrow={t("safetyEyebrow")}
                  eyebrowClassName={CLUSTER_EYEBROW}
                  title={t("safetyTitle")}
                  titleClassName={CLUSTER_TITLE_GUIDE}
                >
                  <p className="mt-4 inline-flex items-center gap-2 text-[13px] text-muted-foreground">
                    <Shield aria-hidden="true" className="size-3.5 shrink-0" />
                    {t("safetyDisclaimer")}
                  </p>
                </ClusterSectionIntro>
              </Reveal>
              <ol className="space-y-0 divide-y divide-border border-y border-border">
                {([1, 2, 3, 4] as const).map((n, index) => (
                  <Reveal
                    as="li"
                    className="flex items-start gap-5 py-6"
                    delay={index * 50}
                    key={n}
                  >
                    <span className="mt-0.5 text-[11px] tracking-[0.18em] text-muted-foreground">
                      {String(n).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="font-display text-[18px] font-medium text-foreground sm:text-[20px]">
                        {t(`safetyStep${n}Title`)}
                      </p>
                      <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground sm:text-[15px]">
                        {t(`safetyStep${n}Body`)}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-surface py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
              <Reveal>
                <ClusterSectionIntro
                  body={t("yardBody")}
                  bodyClassName={CLUSTER_BODY}
                  eyebrow={t("yardEyebrow")}
                  eyebrowClassName={CLUSTER_EYEBROW}
                  title={t("yardTitle")}
                  titleClassName={CLUSTER_TITLE_RELATED}
                />
              </Reveal>
              <Reveal delay={80}>
                <Link
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-[14px] font-medium text-white transition-opacity hover:opacity-90 dark:text-ink"
                  href="/snakes-in-the-yard"
                >
                  {t("yardCta")}
                  <ArrowUpRight className="size-4" />
                </Link>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-background py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="grid gap-px overflow-hidden rounded-[24px] bg-border/80 sm:grid-cols-2">
              <Reveal>
                <Link
                  className="group flex min-h-[180px] flex-col justify-between bg-card p-7 transition-colors hover:bg-background sm:p-9"
                  href="/snakes/shxamiani-gvelis-amocnoba"
                >
                  <span className="text-[11px] tracking-[0.2em] text-muted-foreground">
                    {t("idEyebrow")}
                  </span>
                  <div className="mt-6">
                    <p className="font-display text-[20px] font-semibold text-foreground transition-colors group-hover:text-primary sm:text-[22px]">
                      {t("idTitle")}
                    </p>
                    <p className="mt-2 max-w-xl text-[14px] text-muted-foreground">
                      {t("idBody")}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground/70 group-hover:text-primary">
                      {t("idCta")}
                      <ArrowUpRight className="size-3.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
              <Reveal delay={60}>
                <Link
                  className="group flex min-h-[180px] flex-col justify-between bg-card p-7 transition-colors hover:bg-background sm:p-9"
                  href="/snakes/gvelis-nakbeni"
                >
                  <span className="text-[11px] tracking-[0.2em] text-muted-foreground">
                    {t("biteEyebrow")}
                  </span>
                  <div className="mt-6">
                    <p className="font-display text-[20px] font-semibold text-foreground transition-colors group-hover:text-primary sm:text-[22px]">
                      {t("biteTitle")}
                    </p>
                    <p className="mt-2 max-w-xl text-[14px] text-muted-foreground">
                      {t("biteBody")}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground/70 group-hover:text-primary">
                      {t("biteCta")}
                      <ArrowUpRight className="size-3.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="bg-background py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
              <Reveal>
                <ClusterSectionIntro
                  body={t("lookalikesBody")}
                  bodyClassName={CLUSTER_BODY}
                  eyebrow={t("lookalikesEyebrow")}
                  eyebrowClassName={CLUSTER_EYEBROW}
                  title={t("lookalikesTitle")}
                  titleClassName={CLUSTER_TITLE_RELATED}
                />
              </Reveal>
              <Reveal delay={80}>
                <Link
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-[14px] font-medium text-white transition-opacity hover:opacity-90 dark:text-ink"
                  href={{ pathname: "/species", query: { danger: "harmless" } }}
                >
                  {t("lookalikesCta")}
                  <ArrowUpRight className="size-4" />
                </Link>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-background py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <ClusterSectionIntro
                body={t("relatedGuidesBody")}
                bodyClassName={CLUSTER_BODY}
                eyebrow={t("relatedGuidesEyebrow")}
                eyebrowClassName={CLUSTER_EYEBROW}
                title={t("relatedGuidesTitle")}
                titleClassName={CLUSTER_TITLE_RELATED}
              />
            </Reveal>
            <RelatedGuideGrid cards={relatedGuides} locale={locale} />
          </div>
        </section>

        <FaqSection />

        <ContentAttribution />

        <section className="relative flex min-h-[70svh] items-center overflow-hidden bg-ink py-24">
          <CoverImage
            alt=""
            aria-hidden
            className="object-cover opacity-50"
            sizes="100vw"
            src={heroSrc}
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/75 via-black/60 to-black/88" />
          <div className="relative mx-auto w-full max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <ClusterSectionIntro
                body={t("ctaBody")}
                bodyClassName={CLUSTER_HERO_BODY}
                eyebrow={t("ctaEyebrow")}
                eyebrowClassName={CLUSTER_HERO_EYEBROW}
                title={t("ctaTitle")}
                titleClassName={CLUSTER_HERO_TITLE}
              />
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[14px] font-medium text-ink transition-opacity hover:opacity-90"
                  href="/species"
                >
                  {t("ctaAllSpecies")}
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-[14px] font-medium text-white/85 backdrop-blur-md transition-colors hover:border-white/35 hover:text-white"
                  href="/regions"
                >
                  {t("ctaRegions")}
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </div>
  );
}

const FAQ_ITEMS = [1, 2, 3, 4, 5] as const;

function FaqSection() {
  const t = useTranslations("venomousSnakes");
  const [open, setOpen] = useState<null | number>(0);
  const items = FAQ_ITEMS;

  return (
    <section className="border-t border-border bg-surface py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <Reveal>
            <ClusterSectionIntro
              body={t("faqIntro")}
              bodyClassName={CLUSTER_FAQ_BODY}
              eyebrow={t("faqEyebrow")}
              eyebrowClassName={CLUSTER_EYEBROW}
              title={t("faqTitle")}
              titleClassName={CLUSTER_FAQ_TITLE}
            />
          </Reveal>
          <div>
            {items.map((n, index) => {
              const isOpen = open === index;
              return (
                <Reveal delay={index * 50} key={n}>
                  <div className="border-t border-border last:border-b">
                    <button
                      aria-expanded={isOpen}
                      className="flex w-full items-start justify-between gap-6 py-6 text-left lg:py-7"
                      onClick={() => setOpen(isOpen ? null : index)}
                      type="button"
                    >
                      <span className="font-display text-[17px] leading-snug font-medium text-foreground sm:text-[19px]">
                        {t(`faq${n}Q`)}
                      </span>
                      <span
                        className={cn(
                          "mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border border-border transition-transform duration-300",
                          isOpen
                            ? "rotate-45 bg-ink text-ink-foreground"
                            : "text-foreground",
                        )}
                      >
                        <Plus className="size-4" strokeWidth={1.75} />
                      </span>
                    </button>
                    <div
                      className={cn(
                        "grid transition-[grid-template-rows] duration-300 ease-out",
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="pr-12 pb-7 text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
                          {t(`faq${n}A`)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
