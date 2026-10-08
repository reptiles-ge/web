import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { Species } from "@/data/species";

import { ClusterContentSection } from "@/components/ClusterContentSection";
import { ClusterGuideLead } from "@/components/ClusterGuideLead";
import { ClusterNumberedSteps } from "@/components/ClusterNumberedSteps";
import { ClusterPageFrame } from "@/components/ClusterPageFrame";
import { GuideEditorialNote, GuideMythList } from "@/components/GuideShared";
import { LookalikePairGrid } from "@/components/LookalikePairGrid";
import { QuizPracticeCta } from "@/components/QuizPracticeCta";
import { SpeciesGuideList } from "@/components/SpeciesGuideRow";
import { SpeciesInlineLink } from "@/components/SpeciesInlineLink";
import { isVenomousDanger } from "@/data/speciesAtlasMeta";
import { toSpeciesCards } from "@/data/speciesCard";
import { Link } from "@/i18n/navigation";
import {
  type ClusterGuideViewProps,
  getRearFangedSpecies,
  getViperSpecies,
  SNAKE_LOOKALIKE_PAIRS,
} from "@/lib/clusterGuides";
import { formatContentDate } from "@/lib/formatDate";
import { speciesHref } from "@/lib/speciesRoutes";

const MYTHS = [1, 2, 3, 4] as const;
const EDITORIAL_UPDATED = "2026-09-07";

export async function SnakeIdentifyPage({
  guideId,
  heroSrc,
  locale,
  species,
}: ClusterGuideViewProps) {
  const t = await getTranslations({ locale, namespace: "snakeIdentify" });
  const byId = new Map(species.map((item) => [item.id, item]));
  const vipers = getViperSpecies(species);
  const rearFanged = getRearFangedSpecies(species).filter((item) =>
    isVenomousDanger(item.danger),
  );
  const venomous = [...vipers, ...rearFanged];
  const pairs = SNAKE_LOOKALIKE_PAIRS.map((pair) => ({
    a: byId.get(pair.a),
    b: byId.get(pair.b),
  })).filter((pair): pair is { a: Species; b: Species } =>
    Boolean(pair.a && pair.b),
  );
  const giurza = byId.get("macrovipera-lebetina");
  const kaznakovi = byId.get("vipera-kaznakovi");

  return (
    <ClusterPageFrame
      ctaHash="#signs"
      guideId={guideId}
      heroObjectClass="object-[50%_50%]"
      heroSrc={heroSrc}
      locale={locale}
    >
      <ClusterGuideLead
        eyebrow={t("guideEyebrow")}
        paragraphs={[
          t("guideP1"),
          t.rich("guideP2", {
            kaznakovi: (chunks) => (
              <SpeciesInlineLink id="vipera-kaznakovi">
                {chunks}
              </SpeciesInlineLink>
            ),
          }),
        ]}
        title={t("guideTitle")}
      />

      <div>
        <QuizPracticeCta
          body={t("quizCtaBody")}
          cta={t("quizCta")}
          eyebrow={t("quizCtaEyebrow")}
          locale={locale}
          source="other"
          title={t("quizCtaTitle")}
        />
      </div>

      <ClusterContentSection
        body={t("signsWarning")}
        eyebrow={t("signsEyebrow")}
        id="signs"
        title={t("signsTitle")}
      >
        <ClusterNumberedSteps
          steps={([1, 2, 3, 4] as const).map((n) => ({
            body: t(`sign${n}Body`),
            title: t(`sign${n}Title`),
          }))}
        />
      </ClusterContentSection>

      <ClusterContentSection
        body={t("chainBody")}
        eyebrow={t("chainEyebrow")}
        surface="background"
        title={t("chainTitle")}
      >
        {(giurza || kaznakovi) && (
          <div className="mt-10 flex flex-wrap gap-3">
            {giurza ? (
              <Link
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[13px] font-medium text-white dark:text-ink"
                href={speciesHref(giurza.id, locale)}
              >
                {giurza.commonName}
                <ArrowUpRight className="size-3.5" />
              </Link>
            ) : null}
            {kaznakovi ? (
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-[13px] font-medium text-foreground"
                href={speciesHref(kaznakovi.id, locale)}
              >
                {kaznakovi.commonName}
                <ArrowUpRight className="size-3.5" />
              </Link>
            ) : null}
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-[13px] font-medium text-foreground"
              href="/venomous-snakes"
            >
              {t("chainVenomous")}
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        )}
        <SpeciesGuideList
          locale={locale}
          source="guide"
          species={toSpeciesCards(venomous)}
        />
      </ClusterContentSection>

      <ClusterContentSection
        body={t("pairsBody")}
        eyebrow={t("pairsEyebrow")}
        title={t("pairsTitle")}
      >
        <LookalikePairGrid locale={locale} pairs={pairs} vs={t("vs")} />
      </ClusterContentSection>

      <ClusterContentSection
        body={t("mythsLead")}
        eyebrow={t("mythsEyebrow")}
        id="myths"
        surface="background"
        title={t("mythsTitle")}
      >
        <GuideMythList
          myths={MYTHS.map((n) => ({
            claim: t(`myth${n}False`),
            id: n,
            truth: t(`myth${n}True`),
          }))}
        />
        <GuideEditorialNote
          body={t("editorialBody")}
          disclaimer={t("editorialDisclaimer")}
          updated={t("editorialUpdated", {
            date: formatContentDate(EDITORIAL_UPDATED, locale),
          })}
        />
      </ClusterContentSection>
    </ClusterPageFrame>
  );
}
