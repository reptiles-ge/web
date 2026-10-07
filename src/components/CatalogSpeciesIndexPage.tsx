import type { ReactNode } from "react";

import { getTranslations } from "next-intl/server";

import { ClusterGuideLead } from "@/components/ClusterGuideLead";
import { ClusterPageFrame } from "@/components/ClusterPageFrame";
import {
  ClusterIndexSection,
  ClusterStat,
  ClusterStatsBand,
} from "@/components/ClusterSectionIntro";
import { SpeciesIndexTable } from "@/components/SpeciesIndexTable";
import { toSpeciesIndexRows } from "@/data/speciesCard";
import {
  CLUSTER_GUIDES,
  type ClusterGuideViewProps,
} from "@/lib/clusterGuides";

export async function CatalogSpeciesIndexPage({
  guideId,
  heroSrc,
  locale,
  species,
}: ClusterGuideViewProps) {
  const messageKey = CLUSTER_GUIDES[guideId].messageKey;
  if (
    messageKey !== "birdIndex" &&
    messageKey !== "insectIndex" &&
    messageKey !== "mammalIndex" &&
    messageKey !== "spiderIndex" &&
    messageKey !== "turtleIndex"
  ) {
    return null;
  }
  const t = await getTranslations({ locale, namespace: messageKey });
  const guideP3 = t.has("guideP3") ? t("guideP3") : null;
  const familyCount = new Set(species.map((item) => item.family)).size;
  const introducedCount = species.filter(
    (item) => item.id === "trachemys-scripta",
  ).length;
  const middleStat: { label: string; value: ReactNode } =
    messageKey === "turtleIndex"
      ? { label: t("statIntroduced"), value: introducedCount }
      : { label: t("statFamilies"), value: familyCount };
  const lastStat: { label: string; value: ReactNode } =
    messageKey === "turtleIndex"
      ? { label: t("statFamilies"), value: familyCount }
      : { label: t("statExtra"), value: t("statExtraValue") };

  return (
    <ClusterPageFrame
      ctaHash="#index"
      guideId={guideId}
      heroSrc={heroSrc}
      locale={locale}
      stats={
        <ClusterStatsBand>
          <ClusterStat label={t("statSpecies")} value={species.length} />
          <ClusterStat label={middleStat.label} value={middleStat.value} />
          <ClusterStat label={lastStat.label} value={lastStat.value} />
        </ClusterStatsBand>
      }
    >
      <ClusterGuideLead
        body={
          <>
            <p>{t("guideP1")}</p>
            <p>{t("guideP2")}</p>
            {guideP3 ? <p>{guideP3}</p> : null}
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
          showDangerFilter={false}
          species={toSpeciesIndexRows(species)}
        />
      </ClusterIndexSection>
    </ClusterPageFrame>
  );
}
