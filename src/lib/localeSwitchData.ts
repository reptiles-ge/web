import type {
  LocaleSwitchIndex,
  LocaleSwitchQuiz,
} from "@/lib/localeSwitch";

import { getCatalogSpecies } from "@/data/species";
import { speciesAtlasMeta } from "@/data/speciesAtlasMeta";
import { CLUSTER_GUIDE_LIST } from "@/lib/clusterGuides";
import { GROUP_HUBS } from "@/lib/groupHubs";
import { liveQuizzes } from "@/lib/quizzes";
import { getSpeciesHubId, getSpeciesPublicSlug } from "@/lib/speciesRoutes";

export function getLocaleSwitchIndex(): LocaleSwitchIndex {
  const groupById: LocaleSwitchIndex["groupById"] = {};
  const hubById: LocaleSwitchIndex["hubById"] = {};
  const idBySlug: LocaleSwitchIndex["idBySlug"] = {};
  const kaSlugById: LocaleSwitchIndex["kaSlugById"] = {};

  for (const species of getCatalogSpecies()) {
    const id = species.id;
    const kaSlug = getSpeciesPublicSlug(id, "ka");
    groupById[id] = speciesAtlasMeta[id]?.group ?? "snake";
    hubById[id] = getSpeciesHubId(id);
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
