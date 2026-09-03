"use client";

import { useLocale, useTranslations } from "next-intl";

import type { AppLocale } from "@/i18n/routing";
import type { ClusterGuideViewProps } from "@/lib/clusterGuides";

import { ClusterPageFrame } from "@/components/ClusterPageFrame";
import {
  CLUSTER_BODY,
  CLUSTER_EYEBROW,
  CLUSTER_TITLE_GUIDE,
  CLUSTER_TITLE_SECTION,
  ClusterSectionIntro,
  ClusterStat,
} from "@/components/ClusterSectionIntro";
import { Reveal } from "@/components/Reveal";
import { SpeciesIndexTable } from "@/components/SpeciesIndexTable";
import { SpeciesInlineLink } from "@/components/SpeciesInlineLink";
import { isVenomousDanger } from "@/data/speciesAtlas";

export function SnakeSpeciesIndexPage({
  guideId,
  heroSrc,
  species,
}: ClusterGuideViewProps) {
  const t = useTranslations("snakeIndex");
  const locale = useLocale() as AppLocale;
  const venomousCount = species.filter((item) =>
    isVenomousDanger(item.danger),
  ).length;
  const familyCount = new Set(species.map((item) => item.family)).size;

  return (
    <ClusterPageFrame
      ctaHash="#index"
      guideId={guideId}
      heroObjectClass="object-[50%_70%]"
      heroSrc={heroSrc}
      stats={
        <section className="border-b border-border bg-surface py-10 sm:py-12">
          <div className="mx-auto grid max-w-[1400px] gap-8 px-6 sm:grid-cols-3 sm:gap-6 lg:px-10">
            <ClusterStat label={t("statSpecies")} value={species.length} />
            <ClusterStat label={t("statVenomous")} value={venomousCount} />
            <ClusterStat label={t("statFamilies")} value={familyCount} />
          </div>
        </section>
      }
    >
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
                <p>
                  {t.rich("guideP2", {
                    kaznakovi: (chunks) => (
                      <SpeciesInlineLink id="vipera-kaznakovi">
                        {chunks}
                      </SpeciesInlineLink>
                    ),
                  })}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section
        className="scroll-mt-28 border-t border-border bg-surface py-20 lg:py-28"
        id="index"
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <ClusterSectionIntro
              body={t("tableBody")}
              bodyClassName={CLUSTER_BODY}
              eyebrow={t("tableEyebrow")}
              eyebrowClassName={CLUSTER_EYEBROW}
              title={t("tableTitle", { count: species.length })}
              titleClassName={CLUSTER_TITLE_SECTION}
            />
          </Reveal>
          <div className="mt-10">
            <SpeciesIndexTable locale={locale} species={species} />
          </div>
        </div>
      </section>
    </ClusterPageFrame>
  );
}
