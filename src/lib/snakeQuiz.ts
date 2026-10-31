import type { CatalogQuizSpecies } from "@/data/speciesCatalogTypes";

import { isLizardSpecies, isSnakeSpecies } from "@/lib/clusterGuides";
import { type SnakeQuizSpecies } from "@/lib/snakeQuizEngine";
import { stripSpeciesInlineLinks } from "@/lib/speciesInlineLinks";
import { speciesImageAlt } from "@/lib/speciesMeta";
import { getRelatedSpecies } from "@/lib/speciesRelated";

export { QUIZ_LENGTH, type SnakeQuizSpecies } from "@/lib/snakeQuizEngine";

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
  "natrix-natrix": "https://cdn.reptiles.ge/natrix-natrix-7.jpg",
  "vipera-renardi": "https://cdn.reptiles.ge/vipera-renardi-2.jpg",
  "vipera-transcaucasiana":
    "https://cdn.reptiles.ge/vipera-transcaucasiana-mobile.webp",
  "zamenis-hohenackeri": "https://cdn.reptiles.ge/zamenis-hohenackeri-2.jpg",
};

type QuizPoolCandidate = Pick<CatalogQuizSpecies, "genus" | "id" | "image">;

const QUIZ_HINT_TRAIT_INDEX: Record<string, number> = {
  "eirenis-collaris": 1,
  "eirenis-modestus": 1,
  "vipera-dinniki": 1,
};

export function getLizardQuizCatalog(
  catalog: readonly CatalogQuizSpecies[],
): SnakeQuizSpecies[] {
  return catalog
    .filter(isLizardQuizSpecies)
    .map((item) => toSnakeQuizSpecies(item, catalog));
}

export function getSnakeQuizCatalog(
  catalog: readonly CatalogQuizSpecies[],
): SnakeQuizSpecies[] {
  return catalog
    .filter(isSnakeQuizSpecies)
    .map((item) => toSnakeQuizSpecies(item, catalog));
}

export function isLizardQuizSpecies(item: QuizPoolCandidate) {
  return isLizardSpecies(item) && Boolean(item.image);
}

export function isSnakeQuizSpecies(item: QuizPoolCandidate) {
  return isSnakeSpecies(item) && Boolean(item.image);
}

export function toSnakeQuizSpecies(
  species: CatalogQuizSpecies,
  catalog: readonly CatalogQuizSpecies[],
): SnakeQuizSpecies {
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
  const mobileOverride =
    QUIZ_MOBILE_IMAGE_OVERRIDES[species.id] ?? species.mobileImage;
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
    lookalikeIds: species.lookalikes,
    mobileImage,
    relatedIds: getRelatedSpecies(species.id, catalog, 8).map(
      (item) => item.id,
    ),
    scientificName: species.scientificName,
  };
}

const HABITAT_LABEL = /ჰაბიტატი|habitat|местообитание|yaşam alanı/i;

function buildQuizHint(species: CatalogQuizSpecies) {
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
  const picked = traits
    .slice(0, 1)
    .map((trait) => stripSpeciesInlineLinks(trait.trim()))
    .filter(Boolean);
  if (picked.length > 0) return picked.join(" ");

  const habitat = species.stats.find((stat) =>
    HABITAT_LABEL.test(stat.label),
  )?.value;
  if (habitat) return habitat;
  return species.location;
}

function spoilsAnswer(text: string, species: CatalogQuizSpecies) {
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
