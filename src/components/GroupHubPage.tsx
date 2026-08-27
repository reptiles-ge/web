"use client";

import { ContentAttribution } from "@/components/ContentAttribution";
import { RelatedGuideGrid } from "@/components/RelatedGuideCards";
import { Reveal } from "@/components/Reveal";
import { SpeciesGuideList } from "@/components/SpeciesGuideRow";
import type { Species } from "@/data/species";
import { isVenomousDanger } from "@/data/speciesAtlas";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import {
  HUB_CLUSTER_CARDS,
  splitHubSpecies,
} from "@/lib/clusterGuides";
import { quizHref } from "@/lib/quizzes";
import type { GroupHubId } from "@/lib/groupHubs";
import { GROUP_HUB_LIST } from "@/lib/groupHubs";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

type GroupHubPageProps = {
  hubId: GroupHubId;
  species: Species[];
  heroSrc: string;
};

export function GroupHubPage({ hubId, species, heroSrc }: GroupHubPageProps) {
  const t = useTranslations(hubId);
  const tShared = useTranslations("groupHubShared");
  const tSnakes = useTranslations("snakes");
  const locale = useLocale() as AppLocale;
  const venomousCount = species.filter((item) =>
    isVenomousDanger(item.danger),
  ).length;
  const familyCount = new Set(species.map((item) => item.family)).size;
  const relatedHubs = GROUP_HUB_LIST.filter((hub) => hub.id !== hubId);
  const clusterCards = HUB_CLUSTER_CARDS[hubId];
  const sections = splitHubSpecies(hubId, species);

  return (
    <div className="min-h-screen bg-background">
      <main>
        <section
          className="relative flex min-h-[88svh] w-full flex-col justify-end overflow-hidden bg-ink pb-12 sm:pb-16 lg:min-h-[92svh] lg:pb-20"
          style={{ paddingTop: "7rem" }}
        >
          <Image
            src={heroSrc}
            alt={t("heroImageAlt")}
            fill
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
                      {tShared("breadcrumbHome")}
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
                  href="/species"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-[14px] font-medium text-white/85 backdrop-blur-md transition-colors hover:border-white/35 hover:bg-white/10 hover:text-white"
                >
                  {tShared("ctaAllSpecies")}
                </Link>
                {hubId === "snakes" ? (
                  <Link
                    href={quizHref("snake", locale)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-[14px] font-medium text-white/85 backdrop-blur-md transition-colors hover:border-white/35 hover:bg-white/10 hover:text-white"
                  >
                    {tSnakes("ctaQuiz")}
                    <ArrowUpRight className="size-4" />
                  </Link>
                ) : null}
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
                {familyCount}
              </p>
              <p className="mt-2 text-[13px] text-muted-foreground">
                {t("statFamilies")}
              </p>
            </div>
            <div>
              <p className="font-display text-[clamp(2rem,4vw,2.75rem)] font-semibold leading-none text-foreground">
                {hubId === "snakes" ? venomousCount : t("statExtraValue")}
              </p>
              <p className="mt-2 text-[13px] text-muted-foreground">
                {t("statExtra")}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-background py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
              <Reveal>
                <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                  {t("guideEyebrow")}
                </p>
                <h2 className="mt-5 font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-semibold leading-[1.05]">
                  {t("guideTitle")}
                </h2>
              </Reveal>
              <Reveal delay={60}>
                <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                  <p>{t("guideP1")}</p>
                  <p>{t("guideP2")}</p>
                </div>
              </Reveal>
            </div>

            <RelatedGuideGrid
              cards={clusterCards}
              locale={locale}
              species={species}
              className="mt-14"
            />
          </div>
        </section>

        <section
          id="species"
          className="scroll-mt-28 border-t border-border bg-surface py-20 lg:py-28"
        >
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

            <div className="mt-14 space-y-16">
              {sections.map((section) => (
                <div key={section.key}>
                  <h3 className="font-display text-[clamp(1.35rem,2.4vw,1.85rem)] font-semibold leading-tight">
                    {t(
                      `section.${section.key}.title` as Parameters<
                        typeof t
                      >[0],
                      { count: section.items.length },
                    )}
                  </h3>
                  <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                    {t(
                      `section.${section.key}.body` as Parameters<typeof t>[0],
                    )}
                  </p>
                  <SpeciesGuideList
                    species={section.items}
                    locale={locale}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-background py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                {tShared("relatedEyebrow")}
              </p>
              <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-semibold leading-[1.05]">
                {tShared("relatedTitle")}
              </h2>
              <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                {tShared("relatedBody")}
              </p>
            </Reveal>
            <div className="mt-12 grid gap-px overflow-hidden rounded-[24px] bg-border/80 sm:grid-cols-2 lg:grid-cols-3">
              {relatedHubs.map((hub, index) => (
                <Reveal key={hub.id} delay={index * 50} className="contents">
                  <Link
                    href={hub.path}
                    className="group flex h-full min-h-[160px] flex-col justify-between bg-card p-7 transition-colors hover:bg-background"
                  >
                    <span className="text-[11px] tracking-[0.2em] text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-8 inline-flex items-center gap-1.5 font-display text-[18px] font-semibold text-foreground transition-colors group-hover:text-primary">
                      {tShared(`hubs.${hub.id}`)}
                      <ArrowUpRight className="size-4 opacity-50" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <FaqSection hubId={hubId} />

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
                  {tShared("ctaAllSpecies")}
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/regions"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-[14px] font-medium text-white/85 backdrop-blur-md transition-colors hover:border-white/35 hover:text-white"
                >
                  {tShared("ctaRegions")}
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </div>
  );
}

const faqLinkClassName =
  "text-foreground underline-offset-4 hover:underline";

function SnakesFaq5Answer() {
  const t = useTranslations("snakes");

  return t.rich("faq5A", {
    bite: (chunks) => (
      <Link href="/snakes/gvelis-nakbeni" className={faqLinkClassName}>
        {chunks}
      </Link>
    ),
    yard: (chunks) => (
      <Link href="/snakes-in-the-yard" className={faqLinkClassName}>
        {chunks}
      </Link>
    ),
  });
}

function FaqSection({ hubId }: { hubId: GroupHubId }) {
  const t = useTranslations(hubId);
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
                          {hubId === "snakes" && n === 5 ? (
                            <SnakesFaq5Answer />
                          ) : (
                            t(`faq${n}A`)
                          )}
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
