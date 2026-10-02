import { getGuideArticlesForSpecies } from "@/data/guideArticles";
import {
  dedupeGuideLinks,
  getSpeciesGuideLinks,
  type HubClusterCard,
} from "@/lib/clusterGuides";

export const SPECIES_GUIDE_LINK_LIMIT = 6;

export function getSpeciesProfileGuideLinks(
  speciesId: string,
): HubClusterCard[] {
  const practical: HubClusterCard[] = getGuideArticlesForSpecies(speciesId).map(
    (article) => ({
      href: article.pathname,
      key: article.messageKey,
      kind: "page",
    }),
  );
  return dedupeGuideLinks([
    ...practical,
    ...getSpeciesGuideLinks(speciesId),
  ]).slice(0, SPECIES_GUIDE_LINK_LIMIT);
}
