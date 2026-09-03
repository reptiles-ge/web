"use client";

import { useLocale, useTranslations } from "next-intl";

import type { AppLocale } from "@/i18n/routing";
import type { ClusterGuideViewProps } from "@/lib/clusterGuides";

import { ClusterGuideLead } from "@/components/ClusterGuideLead";
import { ClusterPageFrame } from "@/components/ClusterPageFrame";
import {
  CLUSTER_BODY,
  CLUSTER_EYEBROW,
  CLUSTER_TITLE_SECTION,
  ClusterSectionIntro,
  ClusterStat,
} from "@/components/ClusterSectionIntro";
import { Reveal } from "@/components/Reveal";
import { SpeciesGuideList } from "@/components/SpeciesGuideRow";
import { CLUSTER_GUIDES } from "@/lib/clusterGuides";

export function ClusterGuidePage({
  guideId,
  heroSrc,
  species,
}: ClusterGuideViewProps) {
  const guide = CLUSTER_GUIDES[guideId];
  const t = useTranslations(guide.messageKey);
  const locale = useLocale() as AppLocale;
  const familyCount = new Set(species.map((item) => item.family)).size;

  return (
    <ClusterPageFrame
      ctaHash="#species"
      guideId={guideId}
      heroSrc={heroSrc}
      stats={
        <section className="border-b border-border bg-surface py-10 sm:py-12">
          <div className="mx-auto grid max-w-[1400px] gap-8 px-6 sm:grid-cols-3 sm:gap-6 lg:px-10">
            <ClusterStat label={t("statSpecies")} value={species.length} />
            <ClusterStat label={t("statFamilies")} value={familyCount} />
            <ClusterStat label={t("statExtra")} value={t("statExtraValue")} />
          </div>
        </section>
      }
    >
      <ClusterGuideLead
        body={
          <>
            <p>{t("guideP1")}</p>
            <p>{t("guideP2")}</p>
          </>
        }
        eyebrow={t("guideEyebrow")}
        title={t("guideTitle")}
      />

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
          <SpeciesGuideList locale={locale} source="guide" species={species} />
        </div>
      </section>
    </ClusterPageFrame>
  );
}
