import { speciesAtlasMeta } from "@/data/speciesAtlasMeta";

export type HerpetofaunaChecklistStatus =
  "candidate" | "confirmed" | "introduced";

const HERP_GROUPS = new Set(["amphibian", "lizard", "snake", "turtle"]);

const CANDIDATE = new Set<string>([
  "anguis-colchica",
  "darevskia-adjarica",
  "darevskia-alpina",
  "darevskia-brauneri",
  "darevskia-caucasica",
  "darevskia-obscura",
  "darevskia-pontica",
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

export const HERPETOFAUNA_CHECKLIST_SOURCE = {
  name: "Tarkhnishvili et al. 2026 — Annotated checklist of Georgia's amphibians and reptiles",
  supports: {
    en: "Species composition of Georgia’s amphibians and reptiles and the status of each taxon in this atlas: confirmed, candidate, or introduced.",
    ka: "საქართველოს ამფიბიებისა და ქვეწარმავლების სახეობრივი შემადგენლობა და თითოეული ტაქსონის სტატუსი ამ ატლასში: დადასტურებული, კანდიდატი ან შემოყვანილი.",
    ru: "Видовой состав амфибий и рептилий Грузии и статус каждого таксона в этом атласе: подтверждённый, кандидат или интродуцированный.",
    tr: "Gürcistan’ın amfibi ve sürüngenlerinin tür bileşimi ve bu atlastaki her taksonun durumu: doğrulanmış, aday veya sonradan getirilmiş.",
  },
  url: "https://doi.org/10.3897/caucasiana.5.e189214",
} as const;

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

export function isHerpetofaunaGroup(group: string) {
  return HERP_GROUPS.has(group);
}
