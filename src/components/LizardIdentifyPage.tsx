import { ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import { ClusterContentSection } from "@/components/ClusterContentSection";
import { ClusterGuideLead } from "@/components/ClusterGuideLead";
import { ClusterNumberedSteps } from "@/components/ClusterNumberedSteps";
import { ClusterPageFrame } from "@/components/ClusterPageFrame";
import { LookalikePair } from "@/components/LookalikePair";
import { SpeciesGuideList } from "@/components/SpeciesGuideRow";
import { Link } from "@/i18n/navigation";
import {
  type ClusterGuideViewProps,
  isDarevskiaSpecies,
  LIZARD_LOOKALIKE_PAIRS,
} from "@/lib/clusterGuides";
import { speciesHref } from "@/lib/speciesRoutes";

export async function LizardIdentifyPage({
  guideId,
  heroSrc,
  species,
}: ClusterGuideViewProps) {
  const t = await getTranslations("lizardIdentify");
  const locale = (await getLocale()) as AppLocale;
  const byId = new Map(species.map((item) => [item.id, item]));
  const featured = [
    byId.get("paralaudakia-caucasia"),
    byId.get("pseudopus-apodus"),
  ].filter((item): item is Species => Boolean(item));
  const darevskia = species.filter(isDarevskiaSpecies);
  const pairs = LIZARD_LOOKALIKE_PAIRS.map((pair) => ({
    a: byId.get(pair.a),
    b: byId.get(pair.b),
  })).filter((pair): pair is { a: Species; b: Species } =>
    Boolean(pair.a && pair.b),
  );

  return (
    <ClusterPageFrame ctaHash="#flow" guideId={guideId} heroSrc={heroSrc}>
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

      <ClusterContentSection
        body={t("flowBody")}
        eyebrow={t("flowEyebrow")}
        id="flow"
        title={t("flowTitle")}
      >
        <ClusterNumberedSteps
          steps={([1, 2, 3, 4, 5] as const).map((n) => ({
            body: t(`step${n}Body`),
            title: t(`step${n}Title`),
          }))}
        />
      </ClusterContentSection>

      <ClusterContentSection
        body={t("darevskiaBody")}
        eyebrow={t("darevskiaEyebrow")}
        surface="background"
        title={t("darevskiaTitle")}
      >
        <SpeciesGuideList locale={locale} source="guide" species={darevskia} />
        <Link
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-[13px] font-medium text-foreground"
          href="/lizards/darevskia"
        >
          {t("darevskiaCta")}
          <ArrowUpRight className="size-3.5" />
        </Link>
      </ClusterContentSection>

      <ClusterContentSection
        body={t("featuredBody")}
        eyebrow={t("featuredEyebrow")}
        title={t("featuredTitle")}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          {featured.map((item) => (
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-[13px] font-medium text-foreground"
              href={speciesHref(item.id, locale)}
              key={item.id}
            >
              {item.commonName}
              <ArrowUpRight className="size-3.5" />
            </Link>
          ))}
          <Link
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[13px] font-medium text-white dark:text-ink"
            href="/lizards/xvlikis-da-gvelxokeras-gansxvaveba"
          >
            {t("compareCta")}
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </ClusterContentSection>

      <ClusterContentSection
        body={t("pairsBody")}
        eyebrow={t("pairsEyebrow")}
        surface="background"
        title={t("pairsTitle")}
      >
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {pairs.map((pair, index) => (
            <div key={`${pair.a.id}-${pair.b.id}`}>
              <LookalikePair
                a={pair.a}
                b={pair.b}
                locale={locale}
                vs={t("vs")}
              />
            </div>
          ))}
        </div>
      </ClusterContentSection>
    </ClusterPageFrame>
  );
}
