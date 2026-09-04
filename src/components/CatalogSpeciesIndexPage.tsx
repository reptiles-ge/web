import { getLocale, getTranslations } from "next-intl/server";

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
import { SpeciesIndexTable } from "@/components/SpeciesIndexTable";

export async function CatalogSpeciesIndexPage({
  guideId,
  heroSrc,
  messageKey,
  species,
}: ClusterGuideViewProps & {
  messageKey: "birdIndex" | "mammalIndex";
}) {
  const t = await getTranslations(messageKey);
  const locale = (await getLocale()) as AppLocale;
  const familyCount = new Set(species.map((item) => item.family)).size;

  return (
    <ClusterPageFrame
      ctaHash="#index"
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
        id="index"
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div>
            <ClusterSectionIntro
              body={t("tableBody")}
              bodyClassName={CLUSTER_BODY}
              eyebrow={t("tableEyebrow")}
              eyebrowClassName={CLUSTER_EYEBROW}
              title={t("tableTitle", { count: species.length })}
              titleClassName={CLUSTER_TITLE_SECTION}
            />
          </div>
          <div className="mt-10">
            <SpeciesIndexTable
              locale={locale}
              showDangerFilter={false}
              species={species}
            />
          </div>
        </div>
      </section>
    </ClusterPageFrame>
  );
}

export function BirdSpeciesIndexPage(props: ClusterGuideViewProps) {
  return <CatalogSpeciesIndexPage {...props} messageKey="birdIndex" />;
}

export function MammalSpeciesIndexPage(props: ClusterGuideViewProps) {
  return <CatalogSpeciesIndexPage {...props} messageKey="mammalIndex" />;
}
