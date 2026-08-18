"use client";

import { ClusterPageFrame } from "@/components/ClusterPageFrame";
import { Reveal } from "@/components/Reveal";
import { SpeciesIndexTable } from "@/components/SpeciesIndexTable";
import { isVenomousDanger } from "@/data/speciesAtlas";
import type { AppLocale } from "@/i18n/routing";
import type { ClusterGuideViewProps } from "@/lib/clusterGuides";
import { useLocale, useTranslations } from "next-intl";

export function SnakeSpeciesIndexPage({
  guideId,
  species,
  heroSrc,
}: ClusterGuideViewProps) {
  const t = useTranslations("snakeIndex");
  const locale = useLocale() as AppLocale;
  const venomousCount = species.filter((item) =>
    isVenomousDanger(item.danger),
  ).length;
  const familyCount = new Set(species.map((item) => item.family)).size;

  return (
    <ClusterPageFrame
      guideId={guideId}
      heroSrc={heroSrc}
      ctaHash="#index"
      stats={
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
                {venomousCount}
              </p>
              <p className="mt-2 text-[13px] text-muted-foreground">
                {t("statVenomous")}
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
          </div>
        </section>
      }
    >
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
        </div>
      </section>

      <section
        id="index"
        className="scroll-mt-28 border-t border-border bg-surface py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              {t("tableEyebrow")}
            </p>
            <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold leading-[1.05]">
              {t("tableTitle", { count: species.length })}
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {t("tableBody")}
            </p>
          </Reveal>
          <div className="mt-10">
            <SpeciesIndexTable species={species} locale={locale} />
          </div>
        </div>
      </section>
    </ClusterPageFrame>
  );
}
