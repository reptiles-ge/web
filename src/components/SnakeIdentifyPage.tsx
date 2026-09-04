import { ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import { ClusterContentSection } from "@/components/ClusterContentSection";
import { ClusterGuideLead } from "@/components/ClusterGuideLead";
import { ClusterNumberedSteps } from "@/components/ClusterNumberedSteps";
import { ClusterPageFrame } from "@/components/ClusterPageFrame";
import { LookalikePair } from "@/components/LookalikePair";
import { QuizPracticeCta } from "@/components/QuizPracticeCta";
import { SpeciesGuideList } from "@/components/SpeciesGuideRow";
import { SpeciesInlineLink } from "@/components/SpeciesInlineLink";
import { Link } from "@/i18n/navigation";
import {
  type ClusterGuideViewProps,
  getRearFangedSpecies,
  getViperSpecies,
  SNAKE_LOOKALIKE_PAIRS,
} from "@/lib/clusterGuides";
import { speciesHref } from "@/lib/speciesRoutes";

export async function SnakeIdentifyPage({
  guideId,
  heroSrc,
  species,
}: ClusterGuideViewProps) {
  const t = await getTranslations("snakeIdentify");
  const locale = (await getLocale()) as AppLocale;
  const byId = new Map(species.map((item) => [item.id, item]));
  const vipers = getViperSpecies(species);
  const rearFanged = getRearFangedSpecies(species);
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
    >
      <ClusterGuideLead
        body={
          <>
            <p>{t("guideP1")}</p>
            <p>
              {t.rich("guideP2", {
                kaznakovi: (chunks) => (
                  <SpeciesInlineLink id="vipera-kaznakovi">
                    {chunks}
                  </SpeciesInlineLink>
                ),
              })}
            </p>
          </>
        }
        eyebrow={t("guideEyebrow")}
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
          <SpeciesGuideList locale={locale} source="guide" species={venomous} />
      </ClusterContentSection>

      <ClusterContentSection
        body={t("pairsBody")}
        eyebrow={t("pairsEyebrow")}
        title={t("pairsTitle")}
      >
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {pairs.map((pair) => (
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
