import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { DangerLevel, Species } from "@/data/species";

import { ClusterFaqSection } from "@/components/ClusterFaqSection";
import {
  CLUSTER_HERO_BODY,
  CLUSTER_HERO_EYEBROW,
  CLUSTER_HERO_TITLE,
  ClusterSectionIntro,
} from "@/components/ClusterSectionIntro";
import { ContentAttribution } from "@/components/ContentAttribution";
import { Reveal } from "@/components/Reveal";
import { RiskLevelList } from "@/components/RiskLevelList";
import { RiskToHumansHero } from "@/components/RiskToHumansHero";
import { Link } from "@/i18n/navigation";

type RiskToHumansPageProps = {
  harmlessCount: number;
  harmlessExamples: Species[];
  high: Species[];
  moderate: Species[];
};

const FAQ_ITEMS = [1, 2, 3, 4, 5] as const;

export async function RiskToHumansPage({
  harmlessCount,
  harmlessExamples,
  high,
  moderate,
}: RiskToHumansPageProps) {
  const t = await getTranslations("riskToHumans");
  const speciesByLevel: Record<DangerLevel, Species[]> = {
    Harmless: harmlessExamples,
    High: high,
    Moderate: moderate,
  };
  const countByLevel: Record<DangerLevel, number> = {
    Harmless: harmlessCount,
    High: high.length,
    Moderate: moderate.length,
  };

  return (
    <div className="min-h-screen bg-background">
      <div>
        <RiskToHumansHero countByLevel={countByLevel} />
        <RiskLevelList speciesByLevel={speciesByLevel} />

        <ClusterFaqSection
          intro={{
            body: t("faqIntro"),
            eyebrow: t("faqEyebrow"),
            title: t("faqTitle"),
          }}
          items={FAQ_ITEMS.map((n) => ({
            answer: t(`faq${n}A`),
            question: t(`faq${n}Q`),
          }))}
        />

        <ContentAttribution />

        <section className="border-t border-border bg-ink py-20 lg:py-28">
          <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <ClusterSectionIntro
                body={t("ctaBody")}
                bodyClassName={CLUSTER_HERO_BODY}
                eyebrow={t("ctaEyebrow")}
                eyebrowClassName={CLUSTER_HERO_EYEBROW}
                title={t("ctaTitle")}
                titleClassName={CLUSTER_HERO_TITLE}
              />
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[14px] font-medium text-ink transition-opacity hover:opacity-90"
                  href="/species"
                >
                  {t("ctaAllSpecies")}
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-[14px] font-medium text-white/85 transition-colors hover:border-white/35 hover:text-white"
                  href="/venomous-snakes"
                >
                  {t("ctaVenomous")}
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </div>
  );
}
