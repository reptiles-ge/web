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
import { SpeciesInlineLink } from "@/components/SpeciesInlineLink";
import { Link } from "@/i18n/navigation";
import { SpeciesGuideList } from "@/components/SpeciesGuideRow";
import { CLUSTER_GUIDES } from "@/lib/clusterGuides";

export async function ClusterGuidePage({
  guideId,
  heroSrc,
  species,
}: ClusterGuideViewProps) {
  const guide = CLUSTER_GUIDES[guideId];
  const t = await getTranslations(guide.messageKey);
  const locale = (await getLocale()) as AppLocale;
  const guideP3 = t.has("guideP3") ? t("guideP3") : null;
  const familyCount = new Set(species.map((item) => item.family)).size;
  const richLinks = {
    amphibianIndex: (chunks) => (
      <Link
        className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
        href="/amphibians/saxeoebebi"
      >
        {chunks}
      </Link>
    ),
    anura: (chunks) => (
      <Link
        className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
        href="/amphibians/bayayi"
      >
        {chunks}
      </Link>
    ),
    caudata: (chunks) => (
      <Link
        className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
        href="/amphibians/tritoni-salamandra"
      >
        {chunks}
      </Link>
    ),
    caucasianBrownFrog: (chunks) => (
      <SpeciesInlineLink id="rana-macrocnemis">{chunks}</SpeciesInlineLink>
    ),
    caucasianSalamander: (chunks) => (
      <SpeciesInlineLink id="mertensiella-caucasica">
        {chunks}
      </SpeciesInlineLink>
    ),
    marshFrog: (chunks) => (
      <SpeciesInlineLink id="pelophylax-ridibundus">
        {chunks}
      </SpeciesInlineLink>
    ),
  };

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
          <SpeciesGuideList locale={locale} source="guide" species={species} />
        </div>
      </section>
    </ClusterPageFrame>
  );
}
