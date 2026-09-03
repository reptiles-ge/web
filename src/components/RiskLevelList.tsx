"use client";

import { ArrowUpRight, Shield } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import type { DangerLevel, Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import { ClusterPathCard } from "@/components/ClusterPathCard";
import {
  CLUSTER_EYEBROW,
  CLUSTER_TITLE_GUIDE,
  ClusterSectionIntro,
} from "@/components/ClusterSectionIntro";
import { Reveal } from "@/components/Reveal";
import { SpeciesGuideList } from "@/components/SpeciesGuideRow";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { DANGER_LEVEL_HASH, DANGER_LEVEL_ORDER } from "@/lib/dangerLevels";

type RiskLevelListProps = {
  speciesByLevel: Record<DangerLevel, Species[]>;
};

export function RiskLevelList({ speciesByLevel }: RiskLevelListProps) {
  const t = useTranslations("riskToHumans");
  const tDanger = useTranslations("danger");
  const locale = useLocale() as AppLocale;

  return (
    <>
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
              <ClusterPathCard
                body={t("venomousBody")}
                cta={t("venomousCta")}
                eyebrow={t("venomousEyebrow")}
                href="/venomous-snakes"
                title={t("venomousTitle")}
              />
            </Reveal>
            <Reveal delay={60}>
              <ClusterPathCard
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
    </>
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

