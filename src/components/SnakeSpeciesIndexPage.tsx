import { getTranslations } from "next-intl/server";

import type { ClusterGuideViewProps } from "@/lib/clusterGuides";

import { ClusterGuideLead } from "@/components/ClusterGuideLead";
import { ClusterPageFrame } from "@/components/ClusterPageFrame";
import {
  ClusterIndexSection,
  ClusterStat,
  ClusterStatsBand,
} from "@/components/ClusterSectionIntro";
import { SpeciesIndexTable } from "@/components/SpeciesIndexTable";
import { SpeciesInlineLink } from "@/components/SpeciesInlineLink";
import { isVenomousDanger } from "@/data/speciesAtlas";
import { toSpeciesIndexRows } from "@/data/speciesCard";

export async function SnakeSpeciesIndexPage({
  guideId,
  heroSrc,
  locale,
  species,
}: ClusterGuideViewProps) {
  const t = await getTranslations({ locale, namespace: "snakeIndex" });
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
      locale={locale}
      stats={
        <ClusterStatsBand>
          <ClusterStat label={t("statSpecies")} value={species.length} />
          <ClusterStat label={t("statVenomous")} value={venomousCount} />
          <ClusterStat label={t("statFamilies")} value={familyCount} />
        </ClusterStatsBand>
      }
    >
      <ClusterGuideLead
        body={
          <>
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
          </>
        }
        eyebrow={t("guideEyebrow")}
        title={t("guideTitle")}
      />

      <ClusterIndexSection
        body={t("tableBody")}
        eyebrow={t("tableEyebrow")}
        title={t("tableTitle", { count: species.length })}
      >
        <SpeciesIndexTable
          locale={locale}
          species={toSpeciesIndexRows(species)}
        />
      </ClusterIndexSection>
    </ClusterPageFrame>
  );
}
