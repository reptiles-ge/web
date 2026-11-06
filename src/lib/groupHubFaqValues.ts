import type { HerpetofaunaChecklistStatus } from "@/data/herpetofauna-checklist";
import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import { formatList } from "@/lib/formatList";

export type HubFaqValues = { candidates: string; count: number };

type ChecklistItem = {
  checklistStatus: HerpetofaunaChecklistStatus | null;
};

export function hubCandidateSpecies<T extends ChecklistItem>(species: T[]) {
  return species.filter((item) => item.checklistStatus === "candidate");
}

export function hubFaqValues(
  species: (ChecklistItem & Pick<Species, "commonName">)[],
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
