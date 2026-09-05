import { type Species } from "@/data/species";
import { isLizardSpecies, isSnakeSpecies } from "@/lib/clusterGuides";
import { stripSpeciesInlineLinks } from "@/lib/speciesInlineLinks";
import { speciesImageAlt } from "@/lib/speciesMeta";
import { getRelatedSpecies } from "@/lib/speciesRelated";
import { getSpeciesLookalikes } from "@/lib/speciesRoutes";
import { type SnakeQuizSpecies } from "@/lib/snakeQuizEngine";

export {
  DEFAULT_QUIZ_MIX,
  EASY_LIZARD_IDS,
  EASY_SNAKE_IDS,
  generateLizardQuiz,
  generateSnakeQuiz,
  HARD_LIZARD_IDS,
  HARD_SNAKE_IDS,
  MEDIUM_LIZARD_IDS,
  MEDIUM_SNAKE_IDS,
  pickSnakeDistractors,
  QUIZ_LENGTH,
  QUIZ_OPTION_COUNT,
  SCORE_BANDS,
  scoreMessageKey,
  scorePercent,
  type QuizDifficulty,
  type QuizMode,
  type ScoreMessageKey,
  type SnakeQuizQuestion,
  type SnakeQuizSpecies,
} from "@/lib/snakeQuizEngine";

const QUIZ_IMAGE_OVERRIDES: Record<string, string> = {
  "vipera-kaznakovi": "https://cdn.reptiles.ge/vipera-kaznakovi-sandro-1.jpg",
  "vipera-transcaucasiana":
    "https://cdn.reptiles.ge/vipera-transcaucasiana-2.jpg",
  "zamenis-longissimus": "https://cdn.reptiles.ge/zamenis-longissimus-4.jpg",
};

const QUIZ_MOBILE_IMAGE_OVERRIDES: Record<string, string> = {
  "dolichophis-schmidti": "https://cdn.reptiles.ge/dolichophis-schmidti-3.webp",
  "eirenis-modestus": "https://cdn.reptiles.ge/eirenis-modestus-mobile.jpg",
  "elaphe-urartica": "https://cdn.reptiles.ge/elaphe-urartica-mobile.webp",
  "eryx-jaculus": "https://cdn.reptiles.ge/eryx-jaculus-ioane-1.jpg",
  "malpolon-insignitus": "https://cdn.reptiles.ge/malpolon-insignitus-2.jpg",
  "natrix-natrix": "https://cdn.reptiles.ge/natrix-natrix-mobile.jpg",
  "vipera-darevskii": "https://cdn.reptiles.ge/vipera-darevskii-mobile.jpg",
  "vipera-dinniki": "https://cdn.reptiles.ge/vipera-cover-on-mobile.webp",
  "vipera-renardi": "https://cdn.reptiles.ge/vipera-renardi-2.jpg",
  "vipera-transcaucasiana":
    "https://cdn.reptiles.ge/vipera-transcaucasiana-mobile.webp",
  "zamenis-hohenackeri": "https://cdn.reptiles.ge/zamenis-hohenackeri-2.jpg",
};

const QUIZ_HINT_TRAIT_INDEX: Record<string, number> = {
  "eirenis-collaris": 1,
  "eirenis-modestus": 1,
  "vipera-dinniki": 1,
};

export function buildQuizHint(species: Species) {
  const all = species.identification?.traits ?? [];
  const preferredIndex = QUIZ_HINT_TRAIT_INDEX[species.id];
  const preferred =
    preferredIndex != null
      ? stripSpeciesInlineLinks(all[preferredIndex]?.trim() ?? "")
      : undefined;
  if (preferred && !spoilsAnswer(preferred, species)) return preferred;

  const traits = all.filter(
    (trait) => trait.trim() && !spoilsAnswer(trait, species),
  );
  const picked = (traits.length > 0 ? traits : all)
    .slice(0, 1)
    .map((trait) => stripSpeciesInlineLinks(trait.trim()))
    .filter(Boolean);
  if (picked.length > 0) return picked.join(" ");

  const habitat = species.stats.find((stat) =>
    /ჰაბიტატი|habitat/i.test(stat.label),
  )?.value;
  if (habitat) return habitat;
  return species.location;
}

export function getLizardQuizCatalog(species: Species[]): SnakeQuizSpecies[] {
  const catalog: SnakeQuizSpecies[] = [];
  for (const item of species) {
    if (isLizardSpecies(item) && Boolean(item.image)) {
      catalog.push(toSnakeQuizSpecies(item));
    }
  }
  return catalog;
}

export function getSnakeQuizCatalog(species: Species[]): SnakeQuizSpecies[] {
  const catalog: SnakeQuizSpecies[] = [];
  for (const item of species) {
    if (isSnakeSpecies(item) && Boolean(item.image)) {
      catalog.push(toSnakeQuizSpecies(item));
    }
  }
  return catalog;
}

export function toSnakeQuizSpecies(species: Species): SnakeQuizSpecies {
  const explanation = stripSpeciesInlineLinks(
    species.identification?.summary?.trim() ||
      species.facts[0]?.trim() ||
      species.description.trim(),
  );
  const overrideSrc = QUIZ_IMAGE_OVERRIDES[species.id];
  const overridePhoto = overrideSrc
    ? species.gallery.find((item) => item.src === overrideSrc)
    : undefined;
  const image = overridePhoto?.src ?? species.image;
  const mobileOverride = QUIZ_MOBILE_IMAGE_OVERRIDES[species.id];
  const mobileImage =
    mobileOverride && mobileOverride !== image ? mobileOverride : undefined;

  return {
    commonName: species.commonName,
    explanation,
    family: species.family,
    genus: species.genus,
    hint: buildQuizHint(species),
    id: species.id,
    image,
    imageAlt: speciesImageAlt(
      species.commonName,
      species.scientificName,
      species.location,
    ),
    imageCredit: overridePhoto?.credit ?? species.imageCredit,
    lookalikeIds: getSpeciesLookalikes(species.id),
    mobileImage,
    relatedIds: getRelatedSpecies(species.id, 8).map((item) => item.id),
    scientificName: species.scientificName,
  };
}

function spoilsAnswer(text: string, species: Species) {
  const haystack = stripSpeciesInlineLinks(text).toLowerCase();
  for (const item of [
    species.commonName,
    species.scientificName,
    ...species.scientificName.split(/\s+/),
  ]) {
    const needle = item.trim().toLowerCase();
    if (needle.length > 3 && haystack.includes(needle)) return true;
  }
  return false;
}
