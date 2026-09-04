import { ArrowUpRight } from "lucide-react";
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
import { SpeciesIndexTable } from "@/components/SpeciesIndexTable";
import { Link } from "@/i18n/navigation";
import {
  type ClusterGuideViewProps,
  isFrogSpecies,
  isNewtSpecies,
} from "@/lib/clusterGuides";

export async function AmphibianSpeciesIndexPage({
  guideId,
  heroSrc,
  species,
}: ClusterGuideViewProps) {
  const t = await getTranslations("amphibianIndex");
  const locale = (await getLocale()) as AppLocale;
  const frogs = species.filter((item) => isFrogSpecies(item.id));
  const newts = species.filter((item) => isNewtSpecies(item.id));

  return (
    <ClusterPageFrame
      ctaHash="#index"
      guideId={guideId}
      heroSrc={heroSrc}
      stats={
        <section className="border-b border-border bg-surface py-10 sm:py-12">
          <div className="mx-auto grid max-w-[1400px] gap-8 px-6 sm:grid-cols-3 sm:gap-6 lg:px-10">
            <ClusterStat label={t("statSpecies")} value={species.length} />
            <ClusterStat label={t("statFrogs")} value={frogs.length} />
            <ClusterStat label={t("statNewts")} value={newts.length} />
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
              body={t("frogsBody")}
              bodyClassName={CLUSTER_BODY}
              eyebrow={t("frogsEyebrow")}
              eyebrowClassName={CLUSTER_EYEBROW}
              title={t("frogsTitle", { count: frogs.length })}
              titleClassName={CLUSTER_TITLE_SECTION}
            >
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-[13px] font-medium text-foreground"
                  href="/amphibians/bayayi"
                >
                  {t("frogsGuideCta")}
                  <ArrowUpRight className="size-3.5" />
                </Link>
                <Link
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[13px] font-medium text-white dark:text-ink"
                  href="/amphibians/bayayi/saxeoebebi"
                >
                  {t("frogsIndexCta")}
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            </ClusterSectionIntro>
          </div>
          <div className="mt-10">
            <SpeciesIndexTable
              locale={locale}
              showDangerFilter={false}
              species={frogs}
            />
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div>
            <ClusterSectionIntro
              body={t("newtsBody")}
              bodyClassName={CLUSTER_BODY}
              eyebrow={t("newtsEyebrow")}
              eyebrowClassName={CLUSTER_EYEBROW}
              title={t("newtsTitle", { count: newts.length })}
              titleClassName={CLUSTER_TITLE_SECTION}
            >
              <Link
                className="mt-6 inline-flex items-center gap-2 text-[14px] font-medium text-foreground"
                href="/amphibians/tritoni-salamandra"
              >
                {t("newtsCta")}
                <ArrowUpRight className="size-3.5" />
              </Link>
            </ClusterSectionIntro>
          </div>
          <div className="mt-10">
            <SpeciesIndexTable
              locale={locale}
              showDangerFilter={false}
              species={newts}
            />
          </div>
        </div>
      </section>
    </ClusterPageFrame>
  );
}
