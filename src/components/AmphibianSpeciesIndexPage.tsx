import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { ClusterGuideLead } from "@/components/ClusterGuideLead";
import { ClusterPageFrame } from "@/components/ClusterPageFrame";
import {
  CLUSTER_BODY,
  CLUSTER_EYEBROW,
  CLUSTER_TITLE_SECTION,
  ClusterIndexSection,
  ClusterSectionIntro,
  ClusterStat,
  ClusterStatsBand,
} from "@/components/ClusterSectionIntro";
import { SpeciesIndexTable } from "@/components/SpeciesIndexTable";
import { toSpeciesIndexRows } from "@/data/speciesCard";
import { Link } from "@/i18n/navigation";
import {
  type ClusterGuideViewProps,
  isFrogSpecies,
  isNewtSpecies,
} from "@/lib/clusterGuides";

export async function AmphibianSpeciesIndexPage({
  guideId,
  heroSrc,
  locale,
  species,
}: ClusterGuideViewProps) {
  const t = await getTranslations({ locale, namespace: "amphibianIndex" });
  const guideP3 = t.has("guideP3") ? t("guideP3") : null;
  const frogs = species.filter((item) => isFrogSpecies(item.id));
  const newts = species.filter((item) => isNewtSpecies(item.id));

  return (
    <ClusterPageFrame
      ctaHash="#index"
      guideId={guideId}
      heroSrc={heroSrc}
      locale={locale}
      stats={
        <ClusterStatsBand>
          <ClusterStat label={t("statSpecies")} value={species.length} />
          <ClusterStat label={t("statFrogs")} value={frogs.length} />
          <ClusterStat label={t("statNewts")} value={newts.length} />
        </ClusterStatsBand>
      }
    >
      <ClusterGuideLead
        eyebrow={t("guideEyebrow")}
        paragraphs={[t("guideP1"), t("guideP2"), guideP3]}
        title={t("guideTitle")}
      />

      <ClusterIndexSection
        body={t("frogsBody")}
        eyebrow={t("frogsEyebrow")}
        intro={
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
        }
        title={t("frogsTitle", { count: frogs.length })}
      >
        <SpeciesIndexTable
          locale={locale}
          showDangerFilter={false}
          species={toSpeciesIndexRows(frogs)}
        />
      </ClusterIndexSection>

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
              species={toSpeciesIndexRows(newts)}
            />
          </div>
        </div>
      </section>
    </ClusterPageFrame>
  );
}
