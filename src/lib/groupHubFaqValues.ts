import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import { getHerpetofaunaChecklistStatus } from "@/data/herpetofauna-checklist";
import { formatList } from "@/lib/formatList";

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
    candidates: formatList(
      hubCandidateSpecies(species).map((item) =>
        listName(item.commonName, locale),
      ),
      locale,
    ),
    count: species.length,
  };
}

function listName(name: string, locale: AppLocale) {
  return locale === "ru"
    ? name.charAt(0).toLocaleLowerCase("ru") + name.slice(1)
    : name;
}
