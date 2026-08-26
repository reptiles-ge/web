import type { DangerLevel, PhotoCredit } from "@/data/species";
import type { AnimalGroup } from "@/data/speciesAtlas";
import { isVenomousDanger } from "@/data/speciesAtlas";

export function speciesTitleIntentKey(
  group: AnimalGroup,
  danger?: DangerLevel,
):
  | "titleSnakeVenomous"
  | "titleSnake"
  | "titleLizard"
  | "titleTurtle"
  | "titleAmphibian"
  | "titleBird" {
  if (group === "snake") {
    return isVenomousDanger(danger) ? "titleSnakeVenomous" : "titleSnake";
  }
  if (group === "lizard") return "titleLizard";
  if (group === "turtle") return "titleTurtle";
  if (group === "bird") return "titleBird";
  return "titleAmphibian";
}

export function speciesMetaTitle(
  commonName: string,
  scientificName: string,
  intent: string,
) {
  return `${commonName} (${scientificName}) | ${intent}`;
}

export function speciesImageAlt(
  commonName: string,
  scientificName: string,
  location: string,
) {
  return `${commonName} (${scientificName}) ${location}`;
}

export function speciesPhotoAlt(
  commonName: string,
  scientificName: string,
  location: string,
  credit?: PhotoCredit,
) {
  const place = credit?.location?.trim() || location;
  const parts = [`${commonName} (${scientificName})`];
  if (place) parts.push(place);
  if (credit?.photographer) parts.push(credit.photographer);
  return parts.join(" — ");
}

export function speciesMetaDescription(overview: string, maxLength = 160) {
  const lead = firstSentence(overview);
  if (lead.length <= maxLength) return lead;

  const truncated = lead.slice(0, maxLength - 1);
  const lastSpace = truncated.lastIndexOf(" ");
  const clipped = (lastSpace > 80 ? truncated.slice(0, lastSpace) : truncated).trim();
  return `${clipped}…`;
}

function firstSentence(text: string) {
  const trimmed = text.trim();
  const match = trimmed.match(/^.*?[.!?…](?=\s|$)/u);
  return match ? match[0].trim() : trimmed;
}
