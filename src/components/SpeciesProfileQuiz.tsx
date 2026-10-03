import { getTranslations } from "next-intl/server";

import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import { SpeciesQuizTeaser } from "@/components/SpeciesQuizTeaser";
import {
  optimizedEntry,
  optimizedImgSrc,
  pictureSources,
} from "@/data/optimizedImages";
import { QUIZ_TEASER_SIZES } from "@/lib/imageSizes";
import { getSpeciesQuizTeaser } from "@/lib/quizTeaser";

const SPECIES_QUIZ_TEASER_ENABLED: boolean = false;

type SpeciesProfileQuizProps = {
  locale: AppLocale;
  species: Species;
};

export async function SpeciesProfileQuiz({
  locale,
  species,
}: SpeciesProfileQuizProps) {
  if (!SPECIES_QUIZ_TEASER_ENABLED) return null;

  const teaser = getSpeciesQuizTeaser(species.id, locale);
  if (!teaser) return null;

  const snake = teaser.quizId === "snake";
  const [t, tQuiz] = await Promise.all([
    getTranslations({ locale, namespace: "profile" }),
    getTranslations({
      locale,
      namespace: snake ? "snakeQuiz" : "lizardQuiz",
    }),
  ]);
  const correct = teaser.options.find(
    (option) => option.id === teaser.correctId,
  );
  const entry = optimizedEntry(teaser.image);

  return (
    <SpeciesQuizTeaser
      copy={{
        body: snake
          ? t("quizCtaBody", { name: species.commonName })
          : t("quizCtaBodyLizard", { name: species.commonName }),
        correct: tQuiz("correct"),
        cta: t("quizCta"),
        eyebrow: t("quizCtaEyebrow"),
        imageAltHidden: tQuiz("imageAltHidden"),
        incorrect: tQuiz("incorrect"),
        learnMore: tQuiz("learnMore"),
        photoCredit: t("photoCredit"),
        revealLead: tQuiz("revealLead", {
          commonName: correct?.commonName ?? "",
          scientificName: correct?.scientificName ?? "",
        }),
        title: snake ? t("quizCtaTitle") : t("quizCtaTitleLizard"),
      }}
      correctId={teaser.correctId}
      explanation={teaser.explanation}
      image={{
        alt: teaser.imageAlt,
        height: entry?.height,
        photographer: teaser.imageCredit?.photographer,
        sizes: QUIZ_TEASER_SIZES,
        sources: pictureSources(teaser.image, { sizes: QUIZ_TEASER_SIZES }),
        src: optimizedImgSrc(teaser.image, 800),
        width: entry?.width,
      }}
      locale={locale}
      options={teaser.options}
      quizId={teaser.quizId}
      speciesId={species.id}
    />
  );
}
