import type { DangerLevel } from "@/data/species";
import type { AnimalGroup } from "@/data/speciesAtlas";
import { isVenomousDanger } from "@/data/speciesAtlas";

export function speciesTitleIntentKey(
  group: AnimalGroup,
  danger: DangerLevel,
):
  | "titleSnakeVenomous"
  | "titleSnake"
  | "titleLizard"
  | "titleTurtle"
  | "titleAmphibian" {
  if (group === "snake") {
    return isVenomousDanger(danger) ? "titleSnakeVenomous" : "titleSnake";
  }
  if (group === "lizard") return "titleLizard";
  if (group === "turtle") return "titleTurtle";
  return "titleAmphibian";
}

export function speciesMetaTitle(
  commonName: string,
  scientificName: string,
  intent: string,
) {
  return `${commonName} (${scientificName}) — ${intent}`;
}

export function speciesImageAlt(
  commonName: string,
  scientificName: string,
  location: string,
) {
  return `${commonName} (${scientificName}) ${location}`;
}

export function speciesMetaDescription(overview: string, cta: string) {
  const lead = firstSentence(overview);
  return `${lead} ${cta}`.trim();
}

function firstSentence(text: string) {
  const trimmed = text.trim();
  const match = trimmed.match(/^.*?[.!?…](?=\s|$)/u);
  return match ? match[0].trim() : trimmed;
}
