import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { ClusterGuideViewProps } from "@/lib/clusterGuides";

import { ClusterContentSection } from "@/components/ClusterContentSection";
import { ClusterGuideLead } from "@/components/ClusterGuideLead";
import { ClusterPageFrame } from "@/components/ClusterPageFrame";
import { ClusterFamilyStatsBand } from "@/components/ClusterSectionIntro";
import { SpeciesIndexTable } from "@/components/SpeciesIndexTable";
import { toSpeciesIndexRows } from "@/data/speciesCard";
import { Link } from "@/i18n/navigation";

export async function FrogSpeciesIndexPage({
  guideId,
  heroSrc,
  locale,
  species,
}: ClusterGuideViewProps) {
  const t = await getTranslations({ locale, namespace: "amphibianFrogsIndex" });
  const guideP3 = t.has("guideP3") ? t("guideP3") : null;

  return (
    <ClusterPageFrame
      ctaHash="#index"
      guideId={guideId}
      heroSrc={heroSrc}
      locale={locale}
      stats={<ClusterFamilyStatsBand species={species} t={t} />}
    >
      <ClusterGuideLead
        body={
          <>
            <p>{t("guideP1")}</p>
            <p>{t("guideP2")}</p>
            {guideP3 ? <p>{guideP3}</p> : null}
            <Link
              className="inline-flex items-center gap-2 text-[14px] font-medium text-foreground"
              href="/amphibians/bayayi"
            >
              {t("guideCta")}
              <ArrowUpRight className="size-3.5" />
            </Link>
          </>
        }
        eyebrow={t("guideEyebrow")}
        title={t("guideTitle")}
      />

      <ClusterContentSection
        body={t("tableBody")}
        eyebrow={t("tableEyebrow")}
        id="index"
        title={t("tableTitle", { count: species.length })}
      >
        <div className="mt-10">
          <SpeciesIndexTable
            locale={locale}
            showDangerFilter={false}
            species={toSpeciesIndexRows(species)}
          />
        </div>
      </ClusterContentSection>
    </ClusterPageFrame>
  );
}
