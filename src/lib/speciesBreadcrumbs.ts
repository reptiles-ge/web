import type { Species } from "@/data/species";

import { getSpeciesAtlasMeta, isVenomousDanger } from "@/data/speciesAtlas";
import { type ClusterGuidePath, HUB_INDEX_PATH } from "@/lib/clusterGuides";
import {
  ANIMAL_GROUP_TO_HUB,
  GROUP_HUBS,
  type GroupHubId,
} from "@/lib/groupHubs";
import { speciesSeoAnchor } from "@/lib/seoKeywords";

export type SpeciesBreadcrumbCrumb = {
  href?: SpeciesBreadcrumbHref;
  name: string;
};

export type SpeciesBreadcrumbHref =
  "/" | "/species" | "/venomous-snakes" | `/${GroupHubId}` | ClusterGuidePath;

export function buildSpeciesBreadcrumbs(options: {
  groupLabel: string;
  homeLabel: string;
  indexLabel: string;
  species: Species;
  venomousLabel: string;
}): SpeciesBreadcrumbCrumb[] {
  const parent = getSpeciesParentHub(options.species);
  const hubPath = GROUP_HUBS[parent.hubId].path;

  const crumbs: SpeciesBreadcrumbCrumb[] = [
    { href: "/", name: options.homeLabel },
    { href: hubPath, name: options.groupLabel },
  ];

  if (parent.kind === "venomous") {
    crumbs.push({
      href: "/venomous-snakes",
      name: options.venomousLabel,
    });
  } else if (HUB_INDEX_PATH[parent.hubId] !== hubPath) {
    crumbs.push({
      href: HUB_INDEX_PATH[parent.hubId],
      name: options.indexLabel,
    });
  }

  crumbs.push({
    name: speciesSeoAnchor(
      options.species.commonName,
      options.species.scientificName,
    ),
  });
  return crumbs;
}

export function getSpeciesParentHub(species: Species): {
  href: "/venomous-snakes" | `/${GroupHubId}`;
  hubId: GroupHubId;
  kind: "group" | "venomous";
} {
  const hubId = ANIMAL_GROUP_TO_HUB[getSpeciesAtlasMeta(species.id).group];
  if (
    isVenomousDanger(species.danger) &&
    getSpeciesAtlasMeta(species.id).group === "snake"
  ) {
    return { href: "/venomous-snakes", hubId, kind: "venomous" };
  }

  return {
    href: GROUP_HUBS[hubId].path,
    hubId,
    kind: "group",
  };
}
