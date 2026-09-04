"use client";

import { useTranslations } from "next-intl";

import type { DangerLevel, SpeciesStat } from "@/data/species";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { Link } from "@/i18n/navigation";
import { dangerPageHref } from "@/lib/dangerLevels";
import { isPlaceholderBody } from "@/lib/speciesContent";
import { SPECIES_SECTION_IDS } from "@/lib/toc";

type SpeciesProfileFactsProps = {
  checklistNote?: null | string;
  danger?: DangerLevel;
  dangerValue: null | string;
  displayStats: SpeciesStat[];
  interaction?: string;
  linkDangerStats: boolean;
};

export function SpeciesProfileFacts({
  checklistNote,
  danger,
  dangerValue,
  displayStats,
  interaction,
  linkDangerStats,
}: SpeciesProfileFactsProps) {
  const t = useTranslations("profile");

  if (displayStats.length === 0 && !checklistNote) {
    return null;
  }

  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
          {t("atAGlance")}
        </p>
        <AnchoredHeading
          anchorLabel={t("anchorLink")}
          className="mt-5 max-w-2xl font-display text-display-title"
          id={SPECIES_SECTION_IDS.atAGlance}
        >
          {t("atAGlanceTitle")}
        </AnchoredHeading>
        {displayStats.length > 0 ? (
          <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-media bg-border md:grid-cols-3">
            {displayStats.map((stat) => (
              <div className="bg-background p-6 lg:p-8" key={stat.label}>
                <p className="text-[10px] tracking-[0.22em] text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-3 font-display text-[20px] leading-tight font-medium lg:text-[24px]">
                  <SpeciesProfileStatValue
                    danger={danger}
                    dangerValue={dangerValue}
                    linkDangerStats={linkDangerStats}
                    value={stat.value}
                  />
                </p>
              </div>
            ))}
          </div>
        ) : null}
        {checklistNote ? (
          <p className="mt-6 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
            {checklistNote}
          </p>
        ) : null}
        {interaction && !isPlaceholderBody(interaction) ? (
          <p className="mt-8 max-w-2xl text-[15px] leading-relaxed text-foreground/80 sm:text-[16px]">
            <span className="font-medium text-foreground">
              {t("interaction")}
            </span>
            {": "}
            {interaction}
          </p>
        ) : null}
      </div>
    </section>
  );
}

function SpeciesProfileStatValue({
  danger,
  dangerValue,
  linkDangerStats,
  value,
}: {
  danger?: DangerLevel;
  dangerValue: null | string;
  linkDangerStats: boolean;
  value: string;
}) {
  if (linkDangerStats && dangerValue && value === dangerValue) {
    return (
      <Link
        className="transition-colors hover:text-primary"
        href={dangerPageHref(danger)}
      >
        {value}
      </Link>
    );
  }

  return value;
}
