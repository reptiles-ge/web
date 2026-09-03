"use client";

import { ClusterPageFrame } from "@/components/ClusterPageFrame";
import {
  CLUSTER_BODY,
  CLUSTER_EYEBROW,
  CLUSTER_TITLE_GUIDE,
  CLUSTER_TITLE_SECTION,
  ClusterSectionIntro,
  ClusterStat,
} from "@/components/ClusterSectionIntro";
import { Reveal } from "@/components/Reveal";
import { SpeciesGuideList } from "@/components/SpeciesGuideRow";
import { SpeciesIndexTable } from "@/components/SpeciesIndexTable";
import type { AppLocale } from "@/i18n/routing";
import {
  isDarevskiaSpecies,
  type ClusterGuideViewProps,
} from "@/lib/clusterGuides";
import { useLocale, useTranslations } from "next-intl";

export function LizardSpeciesIndexPage({
  guideId,
  species,
  heroSrc,
}: ClusterGuideViewProps) {
  const t = useTranslations("lizardIndex");
  const locale = useLocale() as AppLocale;
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
      guideId={guideId}
      heroSrc={heroSrc}
      ctaHash="#index"
      stats={
        <section className="border-b border-border bg-surface py-10 sm:py-12">
          <div className="mx-auto grid max-w-[1400px] gap-8 px-6 sm:grid-cols-3 sm:gap-6 lg:px-10">
            <ClusterStat value={species.length} label={t("statSpecies")} />
            <ClusterStat value={darevskia.length} label={t("statDarevskia")} />
            <ClusterStat value={familyCount} label={t("statFamilies")} />
          </div>
        </section>
      }
    >
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
            <Reveal>
              <ClusterSectionIntro
                eyebrow={t("guideEyebrow")}
                title={t("guideTitle")}
                eyebrowClassName={CLUSTER_EYEBROW}
                titleClassName={CLUSTER_TITLE_GUIDE}
              />
            </Reveal>
            <Reveal delay={60}>
              <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                <p>{t("guideP1")}</p>
                <p>{t("guideP2")}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section
        id="index"
        className="scroll-mt-28 border-t border-border bg-surface py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <ClusterSectionIntro
              eyebrow={t("featuredEyebrow")}
              title={t("featuredTitle")}
              body={t("featuredBody")}
              eyebrowClassName={CLUSTER_EYEBROW}
              titleClassName={CLUSTER_TITLE_SECTION}
              bodyClassName={CLUSTER_BODY}
            />
          </Reveal>
          <SpeciesGuideList species={featured} locale={locale} source="guide" />
        </div>
      </section>

      <section className="border-t border-border bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <ClusterSectionIntro
              eyebrow={t("darevskiaEyebrow")}
              title={t("darevskiaTitle", { count: darevskia.length })}
              body={t("darevskiaBody")}
              eyebrowClassName={CLUSTER_EYEBROW}
              titleClassName={CLUSTER_TITLE_SECTION}
              bodyClassName={CLUSTER_BODY}
            />
          </Reveal>
          <div className="mt-10">
            <SpeciesIndexTable
              species={darevskia}
              locale={locale}
              showDangerFilter={false}
              showFamilyFilter={false}
            />
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <ClusterSectionIntro
              eyebrow={t("otherEyebrow")}
              title={t("otherTitle", { count: other.length })}
              body={t("otherBody")}
              eyebrowClassName={CLUSTER_EYEBROW}
              titleClassName={CLUSTER_TITLE_SECTION}
              bodyClassName={CLUSTER_BODY}
            />
          </Reveal>
          <div className="mt-10">
            <SpeciesIndexTable
              species={other}
              locale={locale}
              showDangerFilter={false}
            />
          </div>
        </div>
      </section>
    </ClusterPageFrame>
  );
}
