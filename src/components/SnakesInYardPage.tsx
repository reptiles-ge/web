"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import type { AppLocale } from "@/i18n/routing";

import {
  CLUSTER_BODY,
  CLUSTER_EYEBROW,
  CLUSTER_FAQ_BODY,
  CLUSTER_FAQ_TITLE,
  CLUSTER_HERO_BODY,
  CLUSTER_HERO_EYEBROW,
  CLUSTER_TITLE_GUIDE,
  CLUSTER_TITLE_RELATED,
  ClusterSectionIntro,
} from "@/components/ClusterSectionIntro";
import { ContentAttribution } from "@/components/ContentAttribution";
import { CoverImage } from "@/components/CoverImage";
import { RelatedGuideGrid } from "@/components/RelatedGuideCards";
import { Reveal } from "@/components/Reveal";
import { Link } from "@/i18n/navigation";
import { getHubPageRelatedGuides } from "@/lib/clusterGuides";
import { cn } from "@/lib/cn";

type SnakesInYardPageProps = {
  coverSrc: string;
  heroSrc: string;
};

const ACTION_KEYS = [1, 2, 3] as const;
const MYTH_KEYS = [1, 2, 3, 4] as const;
const FAQ_KEYS = [1, 2, 3, 4, 5, 6] as const;
const AGENCY_PHONE = "0322721600";
const AGENCY_PHONE_DISPLAY = "032 272 16 00";
const EMERGENCY_PHONE = "112";

export function SnakesInYardPage({ coverSrc, heroSrc }: SnakesInYardPageProps) {
  const t = useTranslations("snakesInYard");
  const tSnakes = useTranslations("snakes");
  const locale = useLocale() as AppLocale;
  const relatedGuides = getHubPageRelatedGuides(
    "snakes",
    "/snakes-in-the-yard",
  );

  return (
    <div className="min-h-screen bg-background">
      <main>
        <section
          className="relative flex min-h-[88svh] w-full flex-col justify-end overflow-hidden bg-ink pb-12 sm:pb-16 lg:min-h-[92svh] lg:pb-20"
          style={{ paddingTop: "7rem" }}
        >
          <CoverImage
            alt={t("heroImageAlt")}
            className="object-cover object-[50%_45%]"
            priority
            sizes="100vw"
            src={heroSrc}
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/40 to-black/92" />
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
              <h1 className="text-balance-tight mt-3 max-w-4xl font-display text-[clamp(2.1rem,6vw,4.4rem)] leading-[1.05] font-semibold text-white sm:mt-4">
                {t("title")}
              </h1>
              <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/65 sm:mt-6 sm:text-[16px]">
                {t("subtitle")}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3 sm:mt-11">
                <a
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[14px] font-medium text-ink transition-opacity hover:opacity-90"
                  href="#actions"
                >
                  {t("ctaActions")}
                  <ArrowRight className="size-4" />
                </a>
                <a
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-[14px] font-medium text-white/85 backdrop-blur-md transition-colors hover:border-white/35 hover:bg-white/10 hover:text-white"
                  href="#myths"
                >
                  {t("ctaMyths")}
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="border-b border-border bg-surface py-16 sm:py-20 lg:py-24">
          <div className="mx-auto grid max-w-[1400px] gap-12 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-10">
            <Reveal>
              <ClusterSectionIntro
                body={t("whyLead")}
                bodyClassName="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]"
                eyebrow={t("whyEyebrow")}
                eyebrowClassName={CLUSTER_EYEBROW}
                title={t("whyTitle")}
                titleClassName="mt-5 font-display text-[clamp(1.75rem,3.4vw,2.6rem)] font-semibold leading-[1.05]"
              />
              <div className="mt-10 grid gap-px overflow-hidden rounded-[24px] bg-border/80 sm:grid-cols-2">
                <div className="bg-card p-7 sm:p-8">
                  <p className="font-display text-[13px] font-medium tracking-[0.18em] text-primary">
                    01
                  </p>
                  <h3 className="mt-4 font-display text-[1.25rem] font-semibold text-foreground">
                    {t("whyShelterTitle")}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                    {t("whyShelterBody")}
                  </p>
                </div>
                <div className="bg-card p-7 sm:p-8">
                  <p className="font-display text-[13px] font-medium tracking-[0.18em] text-primary">
                    02
                  </p>
                  <h3 className="mt-4 font-display text-[1.25rem] font-semibold text-foreground">
                    {t("whyFoodTitle")}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                    {t("whyFoodBody")}
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <figure className="relative aspect-4/5 overflow-hidden rounded-[28px] bg-ink sm:aspect-5/6">
                <CoverImage
                  alt={t("coverImageAlt")}
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 44vw"
                  src={coverSrc}
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 to-transparent px-6 pt-16 pb-5 text-[13px] leading-snug text-white/75">
                  {t("coverCaption")}
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </section>

        <section
          className="scroll-mt-28 bg-background py-20 lg:py-28"
          id="actions"
        >
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <ClusterSectionIntro
                body={t("actionsLead")}
                bodyClassName={CLUSTER_BODY}
                eyebrow={t("actionsEyebrow")}
                eyebrowClassName={CLUSTER_EYEBROW}
                title={t("actionsTitle")}
                titleClassName="mt-5 max-w-3xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold leading-[1.05]"
              />
            </Reveal>

            <ol className="mt-14 space-y-0 divide-y divide-border border-y border-border">
              {ACTION_KEYS.map((n, index) => (
                <Reveal
                  as="li"
                  className="grid gap-6 py-8 sm:grid-cols-[5.5rem_1fr] sm:gap-10 sm:py-10 lg:grid-cols-[7rem_1fr]"
                  delay={index * 50}
                  key={n}
                >
                  <span className="font-display text-[clamp(2rem,3vw,2.5rem)] leading-none font-semibold text-primary/80">
                    {String(n).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-[clamp(1.25rem,2.2vw,1.65rem)] font-semibold text-foreground">
                      {t(`action${n}Title`)}
                    </h3>
                    <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
                      {t(`action${n}Body`)}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        <section
          className="scroll-mt-28 border-t border-border bg-surface py-20 lg:py-28"
          id="myths"
        >
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
              <Reveal>
                <ClusterSectionIntro
                  body={t("mythsLead")}
                  bodyClassName="mt-5 text-[15px] leading-relaxed text-muted-foreground"
                  eyebrow={t("mythsEyebrow")}
                  eyebrowClassName={CLUSTER_EYEBROW}
                  title={t("mythsTitle")}
                  titleClassName={CLUSTER_TITLE_GUIDE}
                />
              </Reveal>
              <ul className="divide-y divide-border border-y border-border">
                {MYTH_KEYS.map((n, index) => (
                  <Reveal
                    as="li"
                    className="flex items-start gap-4 py-5 sm:gap-5 sm:py-6"
                    delay={index * 40}
                    key={n}
                  >
                    <span
                      aria-hidden
                      className="mt-0.5 text-[13px] font-medium text-destructive"
                    >
                      —
                    </span>
                    <p className="font-display text-[17px] leading-snug font-medium text-foreground sm:text-[19px]">
                      {t(`myth${n}`)}
                    </p>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-background py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <ClusterSectionIntro
                body={t("appearBody")}
                bodyClassName={CLUSTER_BODY}
                eyebrow={t("appearEyebrow")}
                eyebrowClassName={CLUSTER_EYEBROW}
                title={t("appearTitle")}
                titleClassName={CLUSTER_TITLE_RELATED}
              />
            </Reveal>

            <div className="mt-12 grid gap-px overflow-hidden rounded-[28px] bg-border/80 sm:grid-cols-2">
              <Reveal>
                <div className="flex h-full flex-col justify-between bg-card p-7 sm:p-9">
                  <div>
                    <p className="text-[11px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
                      {t("contactBiteEyebrow")}
                    </p>
                    <h3 className="mt-4 font-display text-[clamp(1.25rem,2.2vw,1.55rem)] font-semibold text-foreground">
                      {t("contactBiteTitle")}
                    </h3>
                    <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground sm:text-[15px]">
                      {t("contactBiteBody")}
                    </p>
                  </div>
                  <a
                    className="mt-8 inline-flex items-center gap-2 self-start rounded-full bg-primary px-5 py-3 text-[14px] font-medium text-white transition-opacity hover:opacity-90 dark:text-ink"
                    href={`tel:${EMERGENCY_PHONE}`}
                  >
                    {t("contactBiteCta")}
                    <span className="font-display tracking-wide">
                      {EMERGENCY_PHONE}
                    </span>
                  </a>
                  <Link
                    className="mt-3 inline-flex items-center gap-2 self-start text-[13px] font-medium text-foreground/70 transition-colors hover:text-primary"
                    href="/snakes/gvelis-nakbeni"
                  >
                    {t("contactBiteGuideCta")}
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={60}>
                <div className="flex h-full flex-col justify-between bg-card p-7 sm:p-9">
                  <div>
                    <p className="text-[11px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
                      {t("contactAgencyEyebrow")}
                    </p>
                    <h3 className="mt-4 font-display text-[clamp(1.25rem,2.2vw,1.55rem)] font-semibold text-foreground">
                      {t("contactAgencyTitle")}
                    </h3>
                    <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground sm:text-[15px]">
                      {t("contactAgencyBody")}
                    </p>
                  </div>
                  <a
                    className="mt-8 inline-flex items-center gap-2 self-start rounded-full border border-border bg-background px-5 py-3 text-[14px] font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                    href={`tel:${AGENCY_PHONE}`}
                  >
                    {t("contactAgencyCta")}
                    <span className="font-display tracking-wide">
                      {AGENCY_PHONE_DISPLAY}
                    </span>
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-surface py-20 lg:py-28">
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

        <section className="relative flex min-h-[60svh] items-center overflow-hidden bg-ink py-24">
          <CoverImage
            alt=""
            aria-hidden
            className="object-cover opacity-45"
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
                titleClassName="mt-5 max-w-3xl font-display text-[clamp(1.9rem,4.5vw,3.2rem)] font-semibold leading-[1.05] text-white"
              />
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[14px] font-medium text-ink transition-opacity hover:opacity-90"
                  href="/species"
                >
                  {t("ctaAtlas")}
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-[14px] font-medium text-white/85 backdrop-blur-md transition-colors hover:border-white/35 hover:text-white"
                  href="/venomous-snakes"
                >
                  {t("ctaVenomous")}
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
  const t = useTranslations("snakesInYard");
  const [open, setOpen] = useState<null | number>(0);

  return (
    <section className="border-t border-border bg-background py-24 lg:py-32">
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
            {FAQ_KEYS.map((n, index) => {
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
