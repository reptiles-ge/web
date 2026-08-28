"use client";

import { ContentAttribution } from "@/components/ContentAttribution";
import { CoverImage } from "@/components/CoverImage";
import { QuizPracticeCta } from "@/components/QuizPracticeCta";
import { RelatedGuideGrid } from "@/components/RelatedGuideCards";
import { Reveal } from "@/components/Reveal";
import { SpeciesGuideList } from "@/components/SpeciesGuideRow";
import type { Species } from "@/data/species";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import {
  getHubPageRelatedGuides,
  getRearFangedSpecies,
  getViperSpecies,
} from "@/lib/clusterGuides";
import { speciesHref } from "@/lib/speciesRoutes";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Plus,
  Shield,
} from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

type VenomousSnakesPageProps = {
  species: Species[];
  heroSrc: string;
};

export function VenomousSnakesPage({
  species,
  heroSrc,
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
  const relatedGuides = getHubPageRelatedGuides("snakes", "/venomous-snakes").filter(
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
            src={heroSrc}
            alt={t("heroImageAlt")}
            priority
            sizes="100vw"
            className="object-cover object-[50%_35%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/92" />
          <div className="absolute inset-0 bg-[radial-gradient(100%_70%_at_50%_25%,transparent_25%,rgba(0,0,0,0.58)_100%)]" />

          <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <nav aria-label="Breadcrumb" className="mb-5 sm:mb-7">
                <ol className="flex flex-wrap items-center gap-2 text-[13px] text-white/55">
                  <li>
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 transition-colors hover:text-white"
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
                      href="/snakes"
                      className="transition-colors hover:text-white"
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
              <h1 className="mt-3 max-w-4xl font-display text-balance-tight text-[clamp(2.1rem,6vw,4.6rem)] font-semibold leading-[1.05] text-white sm:mt-4">
                {t("title")}
              </h1>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/65 sm:mt-6 sm:text-[16px]">
                {t("subtitle")}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3 sm:mt-11">
                <a
                  href="#species"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[14px] font-medium text-ink transition-opacity hover:opacity-90"
                >
                  {t("ctaSpecies")}
                  <ArrowRight className="size-4" />
                </a>
                <Link
                  href={{ pathname: "/species", query: { danger: "venomous" } }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-[14px] font-medium text-white/85 backdrop-blur-md transition-colors hover:border-white/35 hover:bg-white/10 hover:text-white"
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
              <p className="font-display text-[clamp(2rem,4vw,2.75rem)] font-semibold leading-none text-foreground">
                {species.length}
              </p>
              <p className="mt-2 text-[13px] text-muted-foreground">
                {t("statSpecies")}
              </p>
            </div>
            <div>
              <p className="font-display text-[clamp(2rem,4vw,2.75rem)] font-semibold leading-none text-foreground">
                {highCount}
              </p>
              <p className="mt-2 text-[13px] text-muted-foreground">
                {t("statHigh")}
              </p>
            </div>
            <div>
              <p className="font-display text-[clamp(2rem,4vw,2.75rem)] font-semibold leading-none text-foreground">
                {moderateCount}
              </p>
              <p className="mt-2 text-[13px] text-muted-foreground">
                {t("statModerate")}
              </p>
            </div>
          </div>
        </section>

        <QuizPracticeCta
          locale={locale}
          eyebrow={t("quizCtaEyebrow")}
          title={t("quizCtaTitle")}
          body={t("quizCtaBody")}
          cta={t("quizCta")}
          source="other"
        />

        <section id="species" className="scroll-mt-28 bg-background py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                {t("speciesEyebrow")}
              </p>
              <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold leading-[1.05]">
                {t("speciesTitle", { count: species.length })}
              </h2>
              <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                {t("speciesBody")}
              </p>
            </Reveal>

            {giurza ? (
              <Reveal delay={40}>
                <Link
                  href={speciesHref(giurza.id, locale)}
                  className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-border bg-card px-6 py-5 transition-colors hover:border-primary/25"
                >
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                      {t("featuredEyebrow")}
                    </p>
                    <p className="mt-2 font-display text-[22px] font-semibold text-foreground">
                      {giurza.commonName}
                    </p>
                    <p className="mt-1 text-[14px] italic text-muted-foreground">
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

            <div className="mt-14 space-y-16">
              <div>
                <h3 className="font-display text-[clamp(1.35rem,2.4vw,1.85rem)] font-semibold leading-tight">
                  {t("vipersTitle")}
                </h3>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                  {t("vipersBody")}
                </p>
                <SpeciesGuideList species={vipers} locale={locale} source="guide" />
              </div>
              {rearFanged.length > 0 ? (
                <div>
                  <h3 className="font-display text-[clamp(1.35rem,2.4vw,1.85rem)] font-semibold leading-tight">
                    {t("rearFangedTitle")}
                  </h3>
                  <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                    {t("rearFangedBody")}
                  </p>
                  <SpeciesGuideList species={rearFanged} locale={locale} source="guide" />
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-surface py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
              <Reveal>
                <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                  {t("safetyEyebrow")}
                </p>
                <h2 className="mt-5 font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-semibold leading-[1.05]">
                  {t("safetyTitle")}
                </h2>
                <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
                  {t("safetyLead")}
                </p>
                <p className="mt-4 inline-flex items-center gap-2 text-[13px] text-muted-foreground">
                  <Shield className="size-3.5 shrink-0" aria-hidden="true" />
                  {t("safetyDisclaimer")}
                </p>
              </Reveal>
              <ol className="space-y-0 divide-y divide-border border-y border-border">
                {([1, 2, 3, 4] as const).map((n, index) => (
                  <Reveal
                    key={n}
                    as="li"
                    delay={index * 50}
                    className="flex items-start gap-5 py-6"
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
                <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                  {t("yardEyebrow")}
                </p>
                <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-semibold leading-[1.05]">
                  {t("yardTitle")}
                </h2>
                <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                  {t("yardBody")}
                </p>
              </Reveal>
              <Reveal delay={80}>
                <Link
                  href="/snakes-in-the-yard"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-[14px] font-medium text-white transition-opacity hover:opacity-90 dark:text-ink"
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
                  href="/snakes/shxamiani-gvelis-amocnoba"
                  className="group flex min-h-[180px] flex-col justify-between bg-card p-7 transition-colors hover:bg-background sm:p-9"
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
                  href="/snakes/gvelis-nakbeni"
                  className="group flex min-h-[180px] flex-col justify-between bg-card p-7 transition-colors hover:bg-background sm:p-9"
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
                <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                  {t("lookalikesEyebrow")}
                </p>
                <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-semibold leading-[1.05]">
                  {t("lookalikesTitle")}
                </h2>
                <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                  {t("lookalikesBody")}
                </p>
              </Reveal>
              <Reveal delay={80}>
                <Link
                  href={{ pathname: "/species", query: { danger: "harmless" } }}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-[14px] font-medium text-white transition-opacity hover:opacity-90 dark:text-ink"
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
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                {t("relatedGuidesEyebrow")}
              </p>
              <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-semibold leading-[1.05]">
                {t("relatedGuidesTitle")}
              </h2>
              <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                {t("relatedGuidesBody")}
              </p>
            </Reveal>
            <RelatedGuideGrid cards={relatedGuides} locale={locale} />
          </div>
        </section>

        <FaqSection />

        <ContentAttribution />

        <section className="relative flex min-h-[70svh] items-center overflow-hidden bg-ink py-24">
          <Image
            src={heroSrc}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-50"
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/88" />
          <div className="relative mx-auto w-full max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-white/45">
                {t("ctaEyebrow")}
              </p>
              <h2 className="mt-5 max-w-3xl font-display text-[clamp(1.9rem,4.5vw,3.4rem)] font-semibold leading-[1.05] text-white">
                {t("ctaTitle")}
              </h2>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/60">
                {t("ctaBody")}
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/species"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[14px] font-medium text-ink transition-opacity hover:opacity-90"
                >
                  {t("ctaAllSpecies")}
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/regions"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-[14px] font-medium text-white/85 backdrop-blur-md transition-colors hover:border-white/35 hover:text-white"
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

function FaqSection() {
  const t = useTranslations("venomousSnakes");
  const [open, setOpen] = useState<number | null>(0);
  const items = [1, 2, 3, 4, 5] as const;

  return (
    <section className="border-t border-border bg-surface py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              {t("faqEyebrow")}
            </p>
            <h2 className="mt-5 font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.05]">
              {t("faqTitle")}
            </h2>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
              {t("faqIntro")}
            </p>
          </Reveal>
          <div>
            {items.map((n, index) => {
              const isOpen = open === index;
              return (
                <Reveal key={n} delay={index * 50}>
                  <div className="border-t border-border last:border-b">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? null : index)}
                      className="flex w-full items-start justify-between gap-6 py-6 text-left lg:py-7"
                    >
                      <span className="font-display text-[17px] font-medium leading-snug text-foreground sm:text-[19px]">
                        {t(`faq${n}Q`)}
                      </span>
                      <span
                        className={`mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border border-border transition-transform duration-300 ${
                          isOpen
                            ? "rotate-45 bg-ink text-ink-foreground"
                            : "text-foreground"
                        }`}
                      >
                        <Plus className="size-4" strokeWidth={1.75} />
                      </span>
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="pb-7 pr-12 text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
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
