import type { ReactNode } from "react";

import { getLocale, getTranslations } from "next-intl/server";

import { getSpeciesById, type Species } from "@/data/species";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import type { AppLocale } from "@/i18n/routing";

import { ClusterFaqSection } from "@/components/ClusterFaqSection";
import { ContentAttribution } from "@/components/ContentAttribution";
import { QuizPracticeCta } from "@/components/QuizPracticeCta";
import { SpeciesInlineLink } from "@/components/SpeciesInlineLink";
import { VenomousSnakesCta } from "@/components/VenomousSnakesCta";
import { VenomousSnakesGuides } from "@/components/VenomousSnakesGuides";
import { VenomousSnakesHero } from "@/components/VenomousSnakesHero";
import { VenomousSnakesSpecies } from "@/components/VenomousSnakesSpecies";
import { Link } from "@/i18n/navigation";
import {
  getHubPageRelatedGuides,
  getRearFangedSpecies,
  getViperSpecies,
  REAR_FANGED_SPECIES_IDS,
} from "@/lib/clusterGuides";

const FAQ_ITEMS = [1, 2, 3, 4, 5] as const;

const faqInlineLinkClassName =
  "font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground";

type VenomousSnakesPageProps = {
  heroSrc: string;
  species: Species[];
};

export async function VenomousSnakesPage({
  heroSrc,
  species,
}: VenomousSnakesPageProps) {
  const t = await getTranslations("venomousSnakes");
  const locale = (await getLocale()) as AppLocale;
  const vipers = getViperSpecies(species);
  const rearFangedPool = [...species];
  for (const id of REAR_FANGED_SPECIES_IDS) {
    if (rearFangedPool.some((item) => item.id === id)) continue;
    const extra = getSpeciesById(id);
    if (extra) rearFangedPool.push(localizeSpecies(extra, locale));
  }
  const rearFanged = getRearFangedSpecies(rearFangedPool);
  const highCount = species.filter((item) => item.danger === "High").length;
  const moderateCount = species.filter(
    (item) => item.danger === "Moderate",
  ).length;
  const giurza = species.find((item) => item.id === "macrovipera-lebetina");
  const kaznakovi = species.find((item) => item.id === "vipera-kaznakovi");
  const relatedGuides = getHubPageRelatedGuides(
    "snakes",
    "/venomous-snakes",
  ).filter(
    (card) =>
      card.kind === "quiz" ||
      (card.kind === "page" &&
        card.key !== "identify" &&
        card.key !== "bite" &&
        card.key !== "yard"),
  );

  const faqRich = {
    bite: (chunks: ReactNode) => (
      <Link className={faqInlineLinkClassName} href="/snakes/gvelis-nakbeni">
        {chunks}
      </Link>
    ),
    giurza: (chunks: ReactNode) => (
      <SpeciesInlineLink id="macrovipera-lebetina">{chunks}</SpeciesInlineLink>
    ),
    malpolon: (chunks: ReactNode) => (
      <SpeciesInlineLink id="malpolon-insignitus">{chunks}</SpeciesInlineLink>
    ),
  };

  return (
    <div className="min-h-screen bg-background">
      <div>
        <VenomousSnakesHero
          heroSrc={heroSrc}
          highCount={highCount}
          moderateCount={moderateCount}
          speciesCount={species.length}
        />

        <QuizPracticeCta
          body={t("quizCtaBody")}
          cta={t("quizCta")}
          eyebrow={t("quizCtaEyebrow")}
          locale={locale}
          source="other"
          title={t("quizCtaTitle")}
        />

        <VenomousSnakesSpecies
          giurza={giurza}
          kaznakovi={kaznakovi}
          locale={locale}
          rearFanged={rearFanged}
          speciesCount={species.length}
          vipers={vipers}
        />

        <VenomousSnakesGuides locale={locale} relatedGuides={relatedGuides} />

        <ClusterFaqSection
          intro={{
            body: t("faqIntro"),
            eyebrow: t("faqEyebrow"),
            title: t("faqTitle"),
          }}
          items={FAQ_ITEMS.map((n) => ({
            answer:
              n === 1 || n === 2 || n === 4 || n === 5
                ? t.rich(`faq${n}A`, faqRich)
                : t(`faq${n}A`),
            question: t(`faq${n}Q`),
          }))}
        />

        <ContentAttribution />

        <VenomousSnakesCta heroSrc={heroSrc} />
      </div>
    </div>
  );
}
