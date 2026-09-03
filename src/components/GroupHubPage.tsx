"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";
import type { GroupHubId } from "@/lib/groupHubs";

import {
  CLUSTER_BODY,
  CLUSTER_EYEBROW,
  CLUSTER_FAQ_BODY,
  CLUSTER_FAQ_TITLE,
  CLUSTER_TITLE_GUIDE,
  CLUSTER_TITLE_RELATED,
  CLUSTER_TITLE_SECTION,
  ClusterSectionIntro,
} from "@/components/ClusterSectionIntro";
import { ContentAttribution } from "@/components/ContentAttribution";
import { CoverImage } from "@/components/CoverImage";
import { QuizCtaLink } from "@/components/QuizPracticeCta";
import { RelatedGuideGrid } from "@/components/RelatedGuideCards";
import { Reveal } from "@/components/Reveal";
import { SpeciesGuideList } from "@/components/SpeciesGuideRow";
import { TurtlesHubSections } from "@/components/TurtlesHubSections";
import { isVenomousDanger } from "@/data/speciesAtlas";
import { Link } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";
import { HUB_CLUSTER_CARDS, splitHubSpecies } from "@/lib/clusterGuides";
import { cn } from "@/lib/cn";
import { GROUP_HUB_LIST } from "@/lib/groupHubs";
import { quizHref } from "@/lib/quizzes";

type GroupHubPageProps = {
  heroSrc: string;
  hubId: GroupHubId;
  species: Species[];
};

export function GroupHubPage({ heroSrc, hubId, species }: GroupHubPageProps) {
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
  const extraItems = readStatExtraItems(t);

  return (
    <div className="min-h-screen bg-background">
      <main>
        <section
          className="relative flex min-h-[88svh] w-full flex-col justify-end overflow-hidden bg-ink pb-12 sm:pb-16 lg:min-h-[92svh] lg:pb-20"
          style={{ paddingTop: "7rem" }}
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
                  href="/species"
                >
                  {tShared("ctaAllSpecies")}
                </Link>
                {hubId === "snakes" ? (
                  <QuizCtaLink
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-[14px] font-medium text-white/85 backdrop-blur-md transition-colors hover:border-white/35 hover:bg-white/10 hover:text-white"
                    href={quizHref("snake", locale)}
                    quizId="snake"
                    source="hub"
                  >
                    {tSnakes("ctaQuiz")}
                    <ArrowUpRight className="size-4" />
                  </QuizCtaLink>
                ) : null}
                {hubId === "turtles" ? (
                  <Link
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-[14px] font-medium text-white/85 backdrop-blur-md transition-colors hover:border-white/35 hover:bg-white/10 hover:text-white"
                    href="/turtles/identifikacia"
                  >
                    {t("ctaIdentify")}
                    <ArrowUpRight className="size-4" />
                  </Link>
                ) : null}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="border-b border-border bg-surface py-10 sm:py-12">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div
              className={cn(
                "grid gap-8 sm:gap-6",
                extraItems ? "sm:grid-cols-2" : "sm:grid-cols-3",
              )}
            >
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
                  {familyCount}
                </p>
                <p className="mt-2 text-[13px] text-muted-foreground">
                  {t("statFamilies")}
                </p>
              </div>
              {extraItems ? null : (
                <div>
                  <p className="font-display text-[clamp(2rem,4vw,2.75rem)] leading-none font-semibold text-foreground">
                    {hubId === "snakes" ? venomousCount : t("statExtraValue")}
                  </p>
                  <p className="mt-2 text-[13px] text-muted-foreground">
                    {t("statExtra")}
                  </p>
                </div>
              )}
            </div>
            {extraItems ? (
              <div className="mt-8 border-t border-border pt-8">
                <ul className="flex flex-wrap gap-2">
                  {extraItems.map((item) => (
                    <li
                      className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1.5 text-[13px] leading-tight font-medium text-foreground"
                      key={item}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-[13px] text-muted-foreground">
                  {t("statExtra")}
                </p>
              </div>
            ) : null}
          </div>
        </section>

        <section className="bg-background py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
              <Reveal>
                <ClusterSectionIntro
                  eyebrow={t("guideEyebrow")}
                  eyebrowClassName={CLUSTER_EYEBROW}
                  title={t("guideTitle")}
                  titleClassName={CLUSTER_TITLE_GUIDE}
                />
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
              className="mt-14"
              locale={locale}
              species={species}
            />
          </div>
        </section>

        <section
          className="scroll-mt-28 border-t border-border bg-surface py-20 lg:py-28"
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

            <div className="mt-14 space-y-16">
              {sections.map((section) => (
                <div key={section.key}>
                  <h3 className="font-display text-[clamp(1.35rem,2.4vw,1.85rem)] leading-tight font-semibold">
                    {t(`section.${section.key}.title` as "speciesTitle", {
                      count: section.items.length,
                    })}
                  </h3>
                  <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                    {t(
                      `section.${section.key}.body` as Parameters<typeof t>[0],
                    )}
                  </p>
                  <SpeciesGuideList
                    locale={locale}
                    source="hub"
                    species={section.items}
                  />
                </div>
              ))}
            </div>

            {hubId === "turtles" ? (
              <Reveal delay={80}>
                <Link
                  className="mt-10 inline-flex items-center gap-2 text-[14px] font-medium text-foreground transition-colors hover:text-primary"
                  href="/turtles/saxeoebebi"
                >
                  {t("speciesIndexCta")}
                  <ArrowUpRight className="size-4" />
                </Link>
              </Reveal>
            ) : null}
          </div>
        </section>

        {hubId === "turtles" ? <TurtlesHubSections /> : null}

        <section className="bg-background py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <ClusterSectionIntro
                body={tShared("relatedBody")}
                bodyClassName={CLUSTER_BODY}
                eyebrow={tShared("relatedEyebrow")}
                eyebrowClassName={CLUSTER_EYEBROW}
                title={tShared("relatedTitle")}
                titleClassName={CLUSTER_TITLE_RELATED}
              />
            </Reveal>
            <div className="mt-12 grid gap-px overflow-hidden rounded-[24px] bg-border/80 sm:grid-cols-2 lg:grid-cols-3">
              {relatedHubs.map((hub, index) => (
                <Reveal className="contents" delay={index * 50} key={hub.id}>
                  <Link
                    className="group flex h-full min-h-[160px] flex-col justify-between bg-card p-7 transition-colors hover:bg-background"
                    href={hub.path}
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
              <p className="text-[11px] font-medium tracking-[0.32em] text-white/45 uppercase">
                {t("ctaEyebrow")}
              </p>
              <h2 className="mt-5 max-w-3xl font-display text-[clamp(1.9rem,4.5vw,3.4rem)] leading-[1.05] font-semibold text-white">
                {t("ctaTitle")}
              </h2>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/60">
                {t("ctaBody")}
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[14px] font-medium text-ink transition-opacity hover:opacity-90"
                  href="/species"
                >
                  {tShared("ctaAllSpecies")}
                  <ArrowRight className="size-4" />
                </Link>
                {hubId === "turtles" ? (
                  <Link
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-[14px] font-medium text-white/85 backdrop-blur-md transition-colors hover:border-white/35 hover:text-white"
                    href="/turtles/identifikacia"
                  >
                    {t("ctaIdentify")}
                    <ArrowUpRight className="size-4" />
                  </Link>
                ) : null}
                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-[14px] font-medium text-white/85 backdrop-blur-md transition-colors hover:border-white/35 hover:text-white"
                  href="/regions"
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

function readStatExtraItems(
  t: ReturnType<typeof useTranslations>,
): null | string[] {
  if (!t.has("statExtraItems")) return null;
  const items = t.raw("statExtraItems");
  if (
    Array.isArray(items) &&
    items.length > 0 &&
    items.every((item) => typeof item === "string")
  ) {
    return items;
  }
  return null;
}

const faqLinkClassName = "text-foreground underline-offset-4 hover:underline";

function FaqSection({ hubId }: { hubId: GroupHubId }) {
  const t = useTranslations(hubId);
  const [open, setOpen] = useState<null | number>(0);
  const items = useMemo(() => hubFaqIndices(hubId, t), [hubId, t]);

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
                      onClick={() => {
                        const next = isOpen ? null : index;
                        setOpen(next);
                        if (next !== null) {
                          trackEvent("faq_open", {
                            entity_id: hubId,
                            faq_index: next,
                            page_type: "hub",
                          });
                        }
                      }}
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
                          {hubId === "snakes" && n === 5 ? (
                            <SnakesFaq5Answer />
                          ) : hubId === "turtles" && n === 4 ? (
                            <TurtlesFaq4Answer />
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

function hubFaqIndices(
  hubId: GroupHubId,
  t: ReturnType<typeof useTranslations>,
) {
  const max = hubId === "turtles" ? 8 : 5;
  const indices: number[] = [];
  for (let n = 1; n <= max; n += 1) {
    if (t.has(`faq${n}Q`)) indices.push(n);
  }
  return indices;
}

function SnakesFaq5Answer() {
  const t = useTranslations("snakes");

  return t.rich("faq5A", {
    bite: (chunks) => (
      <Link className={faqLinkClassName} href="/snakes/gvelis-nakbeni">
        {chunks}
      </Link>
    ),
    yard: (chunks) => (
      <Link className={faqLinkClassName} href="/snakes-in-the-yard">
        {chunks}
      </Link>
    ),
  });
}

function TurtlesFaq4Answer() {
  const t = useTranslations("turtles");

  return t.rich("faq4A", {
    identify: (chunks) => (
      <Link className={faqLinkClassName} href="/turtles/identifikacia">
        {chunks}
      </Link>
    ),
  });
}
