import { getLocale, getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";
import type { ClusterGuideViewProps } from "@/lib/clusterGuides";

import { ClusterContentSection } from "@/components/ClusterContentSection";
import { ClusterGuideLead } from "@/components/ClusterGuideLead";
import { ClusterPageFrame } from "@/components/ClusterPageFrame";
import {
  CLUSTER_BODY,
  CLUSTER_EYEBROW,
  CLUSTER_TITLE_SECTION,
  ClusterSectionIntro,
  ClusterStat,
} from "@/components/ClusterSectionIntro";
import { SpeciesGuideList } from "@/components/SpeciesGuideRow";
import { Link } from "@/i18n/navigation";

export async function DarevskiaGuidePage({
  guideId,
  heroSrc,
  species,
}: ClusterGuideViewProps) {
  const t = await getTranslations("lizardDarevskia");
  const locale = (await getLocale()) as AppLocale;
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

      <ClusterContentSection
        body={t("colourBody")}
        eyebrow={t("colourEyebrow")}
        title={t("colourTitle")}
      >
        <Link
          className="mt-8 inline-flex items-center rounded-full border border-border px-5 py-2.5 text-[13px] font-medium"
          href="/lizards/identifikacia"
        >
          {t("identifyCta")}
        </Link>
      </ClusterContentSection>

      <section
        className="scroll-mt-28 border-t border-border bg-background py-20 lg:py-28"
        id="species"
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <ClusterSectionIntro
            body={t("speciesBody")}
            bodyClassName={CLUSTER_BODY}
            eyebrow={t("speciesEyebrow")}
            eyebrowClassName={CLUSTER_EYEBROW}
            title={t("speciesTitle", { count: species.length })}
            titleClassName={CLUSTER_TITLE_SECTION}
          />
          <SpeciesGuideList locale={locale} source="guide" species={species} />
        </div>
      </section>
    </ClusterPageFrame>
  );
}
