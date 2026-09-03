"use client";

import { ArrowRight, ArrowUpRight, Plus, Shield } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { type ComponentProps, useState } from "react";

import type { DangerLevel, Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import {
  CLUSTER_EYEBROW,
  CLUSTER_FAQ_BODY,
  CLUSTER_FAQ_TITLE,
  CLUSTER_HERO_BODY,
  CLUSTER_HERO_EYEBROW,
  CLUSTER_HERO_TITLE,
  CLUSTER_TITLE_GUIDE,
  ClusterSectionIntro,
} from "@/components/ClusterSectionIntro";
import { ContentAttribution } from "@/components/ContentAttribution";
import { Reveal } from "@/components/Reveal";
import { SpeciesGuideList } from "@/components/SpeciesGuideRow";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { DANGER_LEVEL_HASH, DANGER_LEVEL_ORDER } from "@/lib/dangerLevels";

type RiskToHumansPageProps = {
  harmlessCount: number;
  harmlessExamples: Species[];
  high: Species[];
  moderate: Species[];
};

const FAQ_ITEMS = [1, 2, 3, 4, 5] as const;

export function RiskToHumansPage({
  harmlessCount,
  harmlessExamples,
  high,
  moderate,
}: RiskToHumansPageProps) {
  const t = useTranslations("riskToHumans");
  const tDanger = useTranslations("danger");
  const locale = useLocale() as AppLocale;
  const speciesByLevel: Record<DangerLevel, Species[]> = {
    Harmless: harmlessExamples,
    High: high,
    Moderate: moderate,
  };
  const countByLevel: Record<DangerLevel, number> = {
    Harmless: harmlessCount,
    High: high.length,
    Moderate: moderate.length,
  };

  return (
    <div className="min-h-screen bg-background">
      <main>
        <section className="bg-background pt-28 pb-10 sm:pt-32 sm:pb-14 lg:pb-16">
          <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <nav aria-label="Breadcrumb" className="mb-5 sm:mb-7">
                <ol className="flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
                  <li>
                    <Link
                      className="transition-colors hover:text-foreground"
                      href="/"
                    >
                      {t("breadcrumbHome")}
                    </Link>
                  </li>
                  <li aria-hidden="true" className="text-border">
                    /
                  </li>
                  <li>
                    <Link
                      className="transition-colors hover:text-foreground"
                      href="/species"
                    >
                      {t("breadcrumbSpecies")}
                    </Link>
                  </li>
                  <li aria-hidden="true" className="text-border">
                    /
                  </li>
                  <li className="text-foreground">{t("breadcrumbCurrent")}</li>
                </ol>
              </nav>

              <h1 className="text-balance-tight max-w-4xl font-display text-[clamp(2.1rem,6vw,4.6rem)] leading-[1.05] font-semibold text-foreground">
                {t("title")}
              </h1>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:mt-6 sm:text-[16px]">
                {t("subtitle")}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3 sm:mt-11">
                {DANGER_LEVEL_ORDER.map((level) => {
                  const tone = levelTone(level);
                  return (
                    <a
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full px-3.5 py-2 transition-opacity hover:opacity-80",
                        tone.chip,
                      )}
                      href={`#${DANGER_LEVEL_HASH[level]}`}
                      key={level}
                    >
                      <span
                        aria-hidden="true"
                        className={cn("size-1.5 rounded-full", tone.dot)}
                      />
                      <span
                        className={cn(
                          "text-[12px] font-semibold tracking-wide",
                          tone.value,
                        )}
                      >
                        {tDanger(level)}
                      </span>
                    </a>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="border-b border-border bg-surface py-10 sm:py-12">
          <div className="mx-auto grid max-w-[1400px] gap-8 px-6 sm:grid-cols-3 sm:gap-6 lg:px-10">
            {DANGER_LEVEL_ORDER.map((level) => (
              <a
                className="group block"
                href={`#${DANGER_LEVEL_HASH[level]}`}
                key={level}
              >
                <p className="font-display text-[clamp(2rem,4vw,2.75rem)] leading-none font-semibold text-foreground">
                  {countByLevel[level]}
                </p>
                <p className="mt-2 text-[13px] text-muted-foreground transition-colors group-hover:text-foreground">
                  {t(`stat${level}`)}
                </p>
              </a>
            ))}
          </div>
        </section>

        <section
          className="scroll-mt-28 bg-background py-20 lg:py-28"
          id="content"
        >
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
              <Reveal>
                <ClusterSectionIntro
                  body={t("scaleLead")}
                  bodyClassName="mt-5 text-[15px] leading-relaxed text-muted-foreground"
                  eyebrow={t("scaleEyebrow")}
                  eyebrowClassName={CLUSTER_EYEBROW}
                  title={t("scaleTitle")}
                  titleClassName={CLUSTER_TITLE_GUIDE}
                >
                  <p className="mt-4 inline-flex items-start gap-2 text-[13px] leading-relaxed text-muted-foreground">
                    <Shield
                      aria-hidden="true"
                      className="mt-0.5 size-3.5 shrink-0"
                    />
                    {t("scaleDisclaimer")}
                  </p>
                </ClusterSectionIntro>
              </Reveal>
              <ol className="space-y-0 divide-y divide-border border-y border-border">
                {DANGER_LEVEL_ORDER.map((level, index) => {
                  const tone = levelTone(level);
                  return (
                    <Reveal
                      as="li"
                      className="flex items-start gap-5 py-6"
                      delay={index * 50}
                      key={level}
                    >
                      <span className="mt-0.5 text-[11px] tracking-[0.18em] text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <a
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wider",
                            tone.chip,
                          )}
                          href={`#${DANGER_LEVEL_HASH[level]}`}
                        >
                          <span
                            aria-hidden="true"
                            className={cn("size-1.5 rounded-full", tone.dot)}
                          />
                          {tDanger(level)}
                        </a>
                        <p className="mt-3 font-display text-[18px] font-medium text-foreground sm:text-[20px]">
                          {t(`scale${level}Title`)}
                        </p>
                        <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground sm:text-[15px]">
                          {t(`scale${level}Body`)}
                        </p>
                      </div>
                    </Reveal>
                  );
                })}
              </ol>
            </div>
          </div>
        </section>

        {DANGER_LEVEL_ORDER.map((level, index) => {
          const tone = levelTone(level);
          const species = speciesByLevel[level];
          const isSurface = index % 2 === 0;

          return (
            <section
              className={cn(
                "scroll-mt-28 border-t border-border py-20 lg:py-28",
                isSurface ? "bg-surface" : "bg-background",
              )}
              id={DANGER_LEVEL_HASH[level]}
              key={level}
            >
              <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
                <Reveal>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wider",
                      tone.chip,
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn("size-1.5 rounded-full", tone.dot)}
                    />
                    {tDanger(level)}
                  </span>
                  <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.05] font-semibold">
                    {t(`${level}Title`)}
                  </h2>
                  <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                    {t(`${level}Lead`)}
                  </p>
                </Reveal>

                <ol className="mt-10 max-w-2xl divide-y divide-border border-y border-border">
                  {([1, 2, 3] as const).map((n) => (
                    <li className="py-5" key={n}>
                      <p className="font-display text-[17px] font-medium text-foreground">
                        {t(`${level}Point${n}Title`)}
                      </p>
                      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                        {t(`${level}Point${n}Body`)}
                      </p>
                    </li>
                  ))}
                </ol>

                <div className="mt-14">
                  <h3 className="font-display text-[clamp(1.35rem,2.4vw,1.85rem)] leading-tight font-semibold">
                    {level === "Harmless"
                      ? t("HarmlessSpeciesTitle")
                      : t("speciesTitle", { count: species.length })}
                  </h3>
                  <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                    {t(`${level}SpeciesBody`)}
                  </p>
                  {species.length > 0 ? (
                    <SpeciesGuideList
                      locale={locale}
                      source="guide"
                      species={species}
                    />
                  ) : null}
                  {level === "Harmless" ? (
                    <Link
                      className="mt-8 inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-[14px] font-medium text-foreground transition-colors hover:border-primary/30"
                      href={{
                        pathname: "/species",
                        query: { danger: "harmless" },
                      }}
                    >
                      {t("HarmlessAtlasCta")}
                      <ArrowUpRight className="size-4" />
                    </Link>
                  ) : null}
                  {level === "High" ? (
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-[14px] font-medium text-white dark:text-ink"
                        href="/venomous-snakes"
                      >
                        {t("linkVenomous")}
                        <ArrowUpRight className="size-4" />
                      </Link>
                      <Link
                        className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-[14px] font-medium text-foreground"
                        href="/snakes/gvelis-nakbeni"
                      >
                        {t("linkBite")}
                        <ArrowUpRight className="size-4" />
                      </Link>
                    </div>
                  ) : null}
                </div>
              </div>
            </section>
          );
        })}

        <section className="border-t border-border bg-background py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="grid gap-px overflow-hidden rounded-[24px] bg-border/80 sm:grid-cols-2">
              <Reveal>
                <PathCard
                  body={t("venomousBody")}
                  cta={t("venomousCta")}
                  eyebrow={t("venomousEyebrow")}
                  href="/venomous-snakes"
                  title={t("venomousTitle")}
                />
              </Reveal>
              <Reveal delay={60}>
                <PathCard
                  body={t("idBody")}
                  cta={t("idCta")}
                  eyebrow={t("idEyebrow")}
                  href="/snakes/shxamiani-gvelis-amocnoba"
                  title={t("idTitle")}
                />
              </Reveal>
            </div>
          </div>
        </section>

        <FaqSection />

        <ContentAttribution />

        <section className="border-t border-border bg-ink py-20 lg:py-28">
          <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-10">
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
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-[14px] font-medium text-white/85 transition-colors hover:border-white/35 hover:text-white"
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
  const t = useTranslations("riskToHumans");
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

function levelTone(level: DangerLevel) {
  switch (level) {
    case "High":
      return {
        chip: "bg-destructive/15 text-destructive",
        dot: "bg-destructive",
        value: "text-destructive",
      };
    case "Moderate":
      return {
        chip: "bg-gold/20 text-gold",
        dot: "bg-gold",
        value: "text-gold",
      };
    default:
      return {
        chip: "bg-primary/15 text-primary",
        dot: "bg-primary",
        value: "text-primary",
      };
  }
}

function PathCard({
  body,
  cta,
  eyebrow,
  href,
  title,
}: {
  body: string;
  cta: string;
  eyebrow: string;
  href: ComponentProps<typeof Link>["href"];
  title: string;
}) {
  return (
    <Link
      className="group flex min-h-[180px] flex-col justify-between bg-card p-7 transition-colors hover:bg-background sm:p-9"
      href={href}
    >
      <span className="text-[11px] tracking-[0.2em] text-muted-foreground">
        {eyebrow}
      </span>
      <div className="mt-6">
        <p className="font-display text-[20px] font-semibold text-foreground transition-colors group-hover:text-primary sm:text-[22px]">
          {title}
        </p>
        <p className="mt-2 max-w-xl text-[14px] text-muted-foreground">
          {body}
        </p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground/70 group-hover:text-primary">
          {cta}
          <ArrowUpRight className="size-3.5" />
        </span>
      </div>
    </Link>
  );
}
