export const HERPETOFAUNA_CHECKLIST_STATUSES = [
  "confirmed",
  "candidate",
  "introduced",
] as const;

export type HerpetofaunaChecklistStatus =
  (typeof HERPETOFAUNA_CHECKLIST_STATUSES)[number];

const HERP_GROUPS = new Set(["amphibian", "lizard", "snake", "turtle"]);

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

export function isHerpetofaunaGroup(group: string) {
  return HERP_GROUPS.has(group);
}
