"use client";

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
import { SpeciesGuideList } from "@/components/SpeciesGuideRow";
import type { ClusterGuideViewProps } from "@/lib/clusterGuides";
import { CLUSTER_GUIDES } from "@/lib/clusterGuides";
import { useLocale, useTranslations } from "next-intl";
import type { AppLocale } from "@/i18n/routing";

export function ClusterGuidePage({
  guideId,
  species,
  heroSrc,
}: ClusterGuideViewProps) {
  const guide = CLUSTER_GUIDES[guideId];
  const t = useTranslations(guide.messageKey);
  const locale = useLocale() as AppLocale;
  const familyCount = new Set(species.map((item) => item.family)).size;

  return (
    <ClusterPageFrame
      guideId={guideId}
      heroSrc={heroSrc}
      ctaHash="#species"
      stats={
        <section className="border-b border-border bg-surface py-10 sm:py-12">
          <div className="mx-auto grid max-w-[1400px] gap-8 px-6 sm:grid-cols-3 sm:gap-6 lg:px-10">
            <ClusterStat value={species.length} label={t("statSpecies")} />
            <ClusterStat value={familyCount} label={t("statFamilies")} />
            <ClusterStat value={t("statExtraValue")} label={t("statExtra")} />
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
                title={t("guideTitle")}
                eyebrowClassName={CLUSTER_EYEBROW}
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
        </div>
      </section>

      <section
        id="species"
        className="scroll-mt-28 border-t border-border bg-surface py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <ClusterSectionIntro
              eyebrow={t("speciesEyebrow")}
              title={t("speciesTitle", { count: species.length })}
              body={t("speciesBody")}
              eyebrowClassName={CLUSTER_EYEBROW}
              titleClassName={CLUSTER_TITLE_SECTION}
              bodyClassName={CLUSTER_BODY}
            />
          </Reveal>
          <SpeciesGuideList species={species} locale={locale} source="guide" />
        </div>
      </section>
    </ClusterPageFrame>
  );
}
