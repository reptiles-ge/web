import { getLocale, getTranslations } from "next-intl/server";

import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import { ClusterFaqSection } from "@/components/ClusterFaqSection";
import { ContentAttribution } from "@/components/ContentAttribution";
import { QuizPracticeCta } from "@/components/QuizPracticeCta";
import { VenomousSnakesCta } from "@/components/VenomousSnakesCta";
import { VenomousSnakesGuides } from "@/components/VenomousSnakesGuides";
import { VenomousSnakesHero } from "@/components/VenomousSnakesHero";
import { VenomousSnakesSpecies } from "@/components/VenomousSnakesSpecies";
import {
  getHubPageRelatedGuides,
  getRearFangedSpecies,
  getViperSpecies,
} from "@/lib/clusterGuides";

const FAQ_ITEMS = [1, 2, 3, 4, 5] as const;

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
  const rearFanged = getRearFangedSpecies(species);
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
            answer: t(`faq${n}A`),
            question: t(`faq${n}Q`),
          }))}
        />

        <ContentAttribution />

        <VenomousSnakesCta heroSrc={heroSrc} />
      </div>
    </div>
  );
}
