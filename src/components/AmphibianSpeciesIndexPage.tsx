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
import { SpeciesIndexTable } from "@/components/SpeciesIndexTable";
import type { AppLocale } from "@/i18n/routing";
import {
  isFrogSpecies,
  isNewtSpecies,
  type ClusterGuideViewProps,
} from "@/lib/clusterGuides";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export function AmphibianSpeciesIndexPage({
  guideId,
  species,
  heroSrc,
}: ClusterGuideViewProps) {
  const t = useTranslations("amphibianIndex");
  const locale = useLocale() as AppLocale;
  const frogs = species.filter((item) => isFrogSpecies(item.id));
  const newts = species.filter((item) => isNewtSpecies(item.id));

  return (
    <ClusterPageFrame
      guideId={guideId}
      heroSrc={heroSrc}
      ctaHash="#index"
      stats={
        <section className="border-b border-border bg-surface py-10 sm:py-12">
          <div className="mx-auto grid max-w-[1400px] gap-8 px-6 sm:grid-cols-3 sm:gap-6 lg:px-10">
            <ClusterStat value={species.length} label={t("statSpecies")} />
            <ClusterStat value={frogs.length} label={t("statFrogs")} />
            <ClusterStat value={newts.length} label={t("statNewts")} />
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
              eyebrow={t("frogsEyebrow")}
              title={t("frogsTitle", { count: frogs.length })}
              body={t("frogsBody")}
              eyebrowClassName={CLUSTER_EYEBROW}
              titleClassName={CLUSTER_TITLE_SECTION}
              bodyClassName={CLUSTER_BODY}
            >
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/amphibians/bayayi"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-[13px] font-medium text-foreground"
              >
                {t("frogsGuideCta")}
                <ArrowUpRight className="size-3.5" />
              </Link>
              <Link
                href="/amphibians/bayayi/saxeoebebi"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[13px] font-medium text-white dark:text-ink"
              >
                {t("frogsIndexCta")}
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          </Reveal>
          <div className="mt-10">
            <SpeciesIndexTable
              species={frogs}
              locale={locale}
              showDangerFilter={false}
            />
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <ClusterSectionIntro
              eyebrow={t("newtsEyebrow")}
              title={t("newtsTitle", { count: newts.length })}
              body={t("newtsBody")}
              eyebrowClassName={CLUSTER_EYEBROW}
              titleClassName={CLUSTER_TITLE_SECTION}
              bodyClassName={CLUSTER_BODY}
            >
            <Link
              href="/amphibians/tritoni-salamandra"
              className="mt-6 inline-flex items-center gap-2 text-[14px] font-medium text-foreground"
            >
              {t("newtsCta")}
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Reveal>
          <div className="mt-10">
            <SpeciesIndexTable
              species={newts}
              locale={locale}
              showDangerFilter={false}
            />
          </div>
        </div>
      </section>
    </ClusterPageFrame>
  );
}
