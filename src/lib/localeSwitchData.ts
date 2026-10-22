import type { CatalogCard } from "@/data/speciesCatalogTypes";
import type { LocaleSwitchIndex, LocaleSwitchQuiz } from "@/lib/localeSwitch";

import { CLUSTER_GUIDE_LIST } from "@/lib/clusterGuides";
import { ANIMAL_GROUP_TO_HUB, GROUP_HUBS } from "@/lib/groupHubs";
import { liveQuizzes } from "@/lib/quizzes";

export function getLocaleSwitchIndex(
  kaCatalog: readonly Pick<CatalogCard, "group" | "id" | "slug">[],
): LocaleSwitchIndex {
  const groupById: LocaleSwitchIndex["groupById"] = {};
  const hubById: LocaleSwitchIndex["hubById"] = {};
  const idBySlug: LocaleSwitchIndex["idBySlug"] = {};
  const kaSlugById: LocaleSwitchIndex["kaSlugById"] = {};

  for (const species of kaCatalog) {
    const id = species.id;
    const kaSlug = species.slug;
    groupById[id] = species.group;
    hubById[id] = ANIMAL_GROUP_TO_HUB[species.group];
    idBySlug[id] = id;
    idBySlug[kaSlug] = id;
    kaSlugById[id] = kaSlug;
  }

  const guides: LocaleSwitchIndex["guides"] = {};
  for (const guide of CLUSTER_GUIDE_LIST) {
    guides[guide.pathname] = {
      group: GROUP_HUBS[guide.parentHub].group,
      id: guide.id,
    };
  }

  const quizzes: LocaleSwitchQuiz[] = liveQuizzes().map((quiz) => ({
    group: quiz.group,
    id: quiz.id,
    slugs: {
      en: quiz.slugs.en,
      ka: quiz.slugs.ka,
      ru: quiz.slugs.ru,
      tr: quiz.slugs.tr,
    },
  }));

  return {
    groupById,
    guides,
    hubById,
    idBySlug,
    kaSlugById,
    quizzes,
  };
}
