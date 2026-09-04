import { getLocale, getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

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
import { SpeciesIndexTable } from "@/components/SpeciesIndexTable";
import {
  type ClusterGuideViewProps,
  isDarevskiaSpecies,
} from "@/lib/clusterGuides";

export async function LizardSpeciesIndexPage({
  guideId,
  heroSrc,
  species,
}: ClusterGuideViewProps) {
  const t = await getTranslations("lizardIndex");
  const locale = (await getLocale()) as AppLocale;
  const featured = species.filter(
    (item) =>
      item.id === "paralaudakia-caucasia" || item.id === "pseudopus-apodus",
  );
  const darevskia = species.filter(isDarevskiaSpecies);
  const other = species.filter(
    (item) =>
      !isDarevskiaSpecies(item) &&
      item.id !== "paralaudakia-caucasia" &&
      item.id !== "pseudopus-apodus",
  );
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
            <ClusterStat label={t("statDarevskia")} value={darevskia.length} />
            <ClusterStat label={t("statFamilies")} value={familyCount} />
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
              body={t("featuredBody")}
              bodyClassName={CLUSTER_BODY}
              eyebrow={t("featuredEyebrow")}
              eyebrowClassName={CLUSTER_EYEBROW}
              title={t("featuredTitle")}
              titleClassName={CLUSTER_TITLE_SECTION}
            />
          </div>
          <SpeciesGuideList locale={locale} source="guide" species={featured} />
        </div>
      </section>

      <section className="border-t border-border bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div>
            <ClusterSectionIntro
              body={t("darevskiaBody")}
              bodyClassName={CLUSTER_BODY}
              eyebrow={t("darevskiaEyebrow")}
              eyebrowClassName={CLUSTER_EYEBROW}
              title={t("darevskiaTitle", { count: darevskia.length })}
              titleClassName={CLUSTER_TITLE_SECTION}
            />
          </div>
          <div className="mt-10">
            <SpeciesIndexTable
              locale={locale}
              showDangerFilter={false}
              showFamilyFilter={false}
              species={darevskia}
            />
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div>
            <ClusterSectionIntro
              body={t("otherBody")}
              bodyClassName={CLUSTER_BODY}
              eyebrow={t("otherEyebrow")}
              eyebrowClassName={CLUSTER_EYEBROW}
              title={t("otherTitle", { count: other.length })}
              titleClassName={CLUSTER_TITLE_SECTION}
            />
          </div>
          <div className="mt-10">
            <SpeciesIndexTable
              locale={locale}
              showDangerFilter={false}
              species={other}
            />
          </div>
        </div>
      </section>
    </ClusterPageFrame>
  );
}
