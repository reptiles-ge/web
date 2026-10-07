import { getTranslations } from "next-intl/server";

import { ClusterGuideLead } from "@/components/ClusterGuideLead";
import { ClusterPageFrame } from "@/components/ClusterPageFrame";
import {
  CLUSTER_BODY,
  CLUSTER_EYEBROW,
  CLUSTER_TITLE_SECTION,
  ClusterSectionIntro,
  ClusterStat,
  ClusterStatsBand,
} from "@/components/ClusterSectionIntro";
import { SpeciesGuideList } from "@/components/SpeciesGuideRow";
import { SpeciesIndexTable } from "@/components/SpeciesIndexTable";
import { toSpeciesCards, toSpeciesIndexRows } from "@/data/speciesCard";
import {
  type ClusterGuideViewProps,
  isDarevskiaSpecies,
} from "@/lib/clusterGuides";

export async function LizardSpeciesIndexPage({
  guideId,
  heroSrc,
  locale,
  species,
}: ClusterGuideViewProps) {
  const t = await getTranslations({ locale, namespace: "lizardIndex" });
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
      locale={locale}
      stats={
        <ClusterStatsBand>
          <ClusterStat label={t("statSpecies")} value={species.length} />
          <ClusterStat label={t("statDarevskia")} value={darevskia.length} />
          <ClusterStat label={t("statFamilies")} value={familyCount} />
        </ClusterStatsBand>
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
          <SpeciesGuideList
            locale={locale}
            source="guide"
            species={toSpeciesCards(featured)}
          />
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
              species={toSpeciesIndexRows(darevskia)}
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
              species={toSpeciesIndexRows(other)}
            />
          </div>
        </div>
      </section>
    </ClusterPageFrame>
  );
}
