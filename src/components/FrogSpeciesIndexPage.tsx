"use client";

import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import type { AppLocale } from "@/i18n/routing";
import type { ClusterGuideViewProps } from "@/lib/clusterGuides";

import { ClusterContentSection } from "@/components/ClusterContentSection";
import { ClusterGuideLead } from "@/components/ClusterGuideLead";
import { ClusterPageFrame } from "@/components/ClusterPageFrame";
import {
  ClusterStat,
} from "@/components/ClusterSectionIntro";
import { SpeciesIndexTable } from "@/components/SpeciesIndexTable";
import { Link } from "@/i18n/navigation";

export function FrogSpeciesIndexPage({
  guideId,
  heroSrc,
  species,
}: ClusterGuideViewProps) {
  const t = useTranslations("amphibianFrogsIndex");
  const locale = useLocale() as AppLocale;
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
            species={species}
          />
        </div>
      </ClusterContentSection>
    </ClusterPageFrame>
  );
}
