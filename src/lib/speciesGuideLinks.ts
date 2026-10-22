import type { SpeciesSummary } from "@/data/speciesTypes";

import { getGuideArticlesForSpecies } from "@/data/guideArticles";
import {
  dedupeGuideLinks,
  getSpeciesGuideLinks,
  type HubClusterCard,
} from "@/lib/clusterGuides";

export const SPECIES_GUIDE_LINK_LIMIT = 6;

export function getSpeciesProfileGuideLinks(
  species: Pick<SpeciesSummary, "danger" | "genus" | "id">,
): HubClusterCard[] {
  const practical: HubClusterCard[] = getGuideArticlesForSpecies(
    species.id,
  ).map((article) => ({
    href: article.pathname,
    key: article.messageKey,
    kind: "page",
  }));
  return dedupeGuideLinks([
    ...practical,
    ...getSpeciesGuideLinks(species),
  ]).slice(0, SPECIES_GUIDE_LINK_LIMIT);
}
