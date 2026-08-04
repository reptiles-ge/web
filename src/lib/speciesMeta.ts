import type { DangerLevel } from "@/data/species";

export function speciesMetaTitle(
  commonName: string,
  scientificName: string,
  danger: DangerLevel,
  intentVenomous: string,
  intentHarmless: string,
) {
  const intent =
    danger === "Harmless" ? intentHarmless : intentVenomous;
  return `${commonName} (${scientificName}) — ${intent}`;
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
