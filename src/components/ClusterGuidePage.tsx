import type { ReactNode } from "react";

import { getTranslations } from "next-intl/server";

import type { ClusterGuideViewProps } from "@/lib/clusterGuides";

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
import { SpeciesInlineLink } from "@/components/SpeciesInlineLink";
import { toSpeciesCards } from "@/data/speciesCard";
import { Link } from "@/i18n/navigation";
import { CLUSTER_GUIDES } from "@/lib/clusterGuides";

export async function ClusterGuidePage({
  guideId,
  heroSrc,
  locale,
  species,
}: ClusterGuideViewProps) {
  const guide = CLUSTER_GUIDES[guideId];
  const t = await getTranslations({ locale, namespace: guide.messageKey });
  const guideP3 = t.has("guideP3") ? t("guideP3") : null;
  const richLinks = {
    amphibianIndex: (chunks: ReactNode) => (
      <Link
        className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
        href="/amphibians/saxeoebebi"
      >
        {chunks}
      </Link>
    ),
    anura: (chunks: ReactNode) => (
      <Link
        className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
        href="/amphibians/bayayi"
      >
        {chunks}
      </Link>
    ),
    caucasianBrownFrog: (chunks: ReactNode) => (
      <SpeciesInlineLink id="rana-macrocnemis">{chunks}</SpeciesInlineLink>
    ),
    caucasianSalamander: (chunks: ReactNode) => (
      <SpeciesInlineLink id="mertensiella-caucasica">
        {chunks}
      </SpeciesInlineLink>
    ),
    caudata: (chunks: ReactNode) => (
      <Link
        className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
        href="/amphibians/tritoni-salamandra"
      >
        {chunks}
      </Link>
    ),
    marshFrog: (chunks: ReactNode) => (
      <SpeciesInlineLink id="pelophylax-ridibundus">{chunks}</SpeciesInlineLink>
    ),
  };

  return (
    <ClusterPageFrame
      ctaHash="#species"
      guideId={guideId}
      heroSrc={heroSrc}
      locale={locale}
      stats={<ClusterFamilyStatsBand species={species} t={t} />}
    >
      <ClusterGuideLead
        body={
          <>
            <p>{t.rich("guideP1", richLinks)}</p>
            <p>{t.rich("guideP2", richLinks)}</p>
            {guideP3 ? <p>{t.rich("guideP3", richLinks)}</p> : null}
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
          <div>
            <ClusterSectionIntro
              body={t("speciesBody")}
              bodyClassName={CLUSTER_BODY}
              eyebrow={t("speciesEyebrow")}
              eyebrowClassName={CLUSTER_EYEBROW}
              title={t("speciesTitle", { count: species.length })}
              titleClassName={CLUSTER_TITLE_SECTION}
            />
          </div>
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
