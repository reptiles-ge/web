import { speciesAtlasMeta } from "@/data/speciesAtlasMeta";

export type HerpetofaunaChecklistStatus =
  | "candidate"
  | "confirmed"
  | "introduced";

const HERP_GROUPS = new Set(["amphibian", "lizard", "snake", "turtle"]);

const CANDIDATE = new Set<string>([
  "anguis-colchica",
  "darevskia-adjarica",
  "darevskia-alpina",
  "darevskia-brauneri",
  "darevskia-caucasica",
  "darevskia-obscura",
  "darevskia-pontica",
  "darevskia-raddei",
  "dolichophis-caspius",
  "dolichophis-schmidti",
  "hyla-orientalis",
  "lacerta-agilis",
  "lacerta-media",
  "lissotriton-lantzi",
  "vipera-dinniki",
  "vipera-kaznakovi",
]);

const INTRODUCED = new Set<string>([
  "phoenicolacerta-laevis",
  "trachemys-scripta",
]);

export function getHerpetofaunaChecklistStatus(
  id: string,
): HerpetofaunaChecklistStatus | null {
  const group = speciesAtlasMeta[id]?.group;
  if (!group || !HERP_GROUPS.has(group)) return null;
  if (INTRODUCED.has(id)) return "introduced";
  if (CANDIDATE.has(id)) return "candidate";
  return "confirmed";
}

export function herpetofaunaChecklistIds() {
  return Object.keys(speciesAtlasMeta).filter((id) => {
    const group = speciesAtlasMeta[id]?.group;
    return group ? HERP_GROUPS.has(group) : false;
  });
}
