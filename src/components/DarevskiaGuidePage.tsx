import { getTranslations } from "next-intl/server";

import type { ClusterGuideViewProps } from "@/lib/clusterGuides";

import { ClusterContentSection } from "@/components/ClusterContentSection";
import { ClusterGuideLead } from "@/components/ClusterGuideLead";
import { ClusterPageFrame } from "@/components/ClusterPageFrame";
import {
  CLUSTER_BODY,
  CLUSTER_EYEBROW,
  CLUSTER_TITLE_SECTION,
  ClusterFamilyStatsBand,
  ClusterSectionIntro,
} from "@/components/ClusterSectionIntro";
import { SpeciesGuideList } from "@/components/SpeciesGuideRow";
import { toSpeciesCards } from "@/data/speciesCard";
import { Link } from "@/i18n/navigation";

export async function DarevskiaGuidePage({
  guideId,
  heroSrc,
  locale,
  species,
}: ClusterGuideViewProps) {
  const t = await getTranslations({ locale, namespace: "lizardDarevskia" });

  return (
    <ClusterPageFrame
      ctaHash="#species"
      guideId={guideId}
      heroSrc={heroSrc}
      locale={locale}
      stats={<ClusterFamilyStatsBand species={species} t={t} />}
    >
      <ClusterGuideLead
        eyebrow={t("guideEyebrow")}
        paragraphs={[t("guideP1"), t("guideP2")]}
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
          <SpeciesGuideList
            locale={locale}
            source="guide"
            species={toSpeciesCards(species)}
          />
        </div>
      </section>
    </ClusterPageFrame>
  );
}
