import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import { getHerpetofaunaChecklistStatus } from "@/data/herpetofauna-checklist";

export type HubFaqValues = { candidates: string; count: number };

export function hubCandidateSpecies<T extends Pick<Species, "id">>(
  species: T[],
) {
  return species.filter(
    (item) => getHerpetofaunaChecklistStatus(item.id) === "candidate",
  );
}

export function hubFaqValues(
  species: Pick<Species, "commonName" | "id">[],
  locale: AppLocale,
): HubFaqValues {
  return {
    candidates: new Intl.ListFormat(locale, { type: "conjunction" }).format(
      hubCandidateSpecies(species).map((item) =>
        listName(item.commonName, locale),
      ),
    ),
    count: species.length,
  };
}

function listName(name: string, locale: AppLocale) {
  return locale === "ru"
    ? name.charAt(0).toLocaleLowerCase("ru") + name.slice(1)
    : name;
}
