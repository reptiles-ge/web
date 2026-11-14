import type { AnimalGroup } from "@/data/speciesAtlasMeta";

import { pathnames } from "@/i18n/pathnames";
import { publicEnv } from "@/lib/env";
import { ANIMAL_GROUP_TO_HUB } from "@/lib/groupHubs";

export function speciesPublicUrl(
  species: { group: AnimalGroup; id: string; slugKa: null | string },
  locale: "en" | "ka" = "ka",
  site = publicEnv().NEXT_PUBLIC_SITE_URL ?? "https://reptiles.ge",
) {
  const pattern = pathnames[`/${ANIMAL_GROUP_TO_HUB[species.group]}/[slug]`];
  if (locale === "en")
    return `${site}/en${pattern.en.replace("[slug]", species.id)}`;
  return `${site}${pattern.ka.replace("[slug]", species.slugKa ?? species.id)}`;
}
