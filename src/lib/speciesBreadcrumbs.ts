import type { Species } from "@/data/species";
import {
  getSpeciesAtlasMeta,
  isVenomousDanger,
  type AnimalGroup,
} from "@/data/speciesAtlas";
import { ANIMAL_GROUP_TO_HUB, GROUP_HUBS, type GroupHubId } from "@/lib/groupHubs";

export type SpeciesBreadcrumbHref =
  | "/"
  | "/species"
  | "/venomous-snakes"
  | `/${GroupHubId}`;

export type SpeciesBreadcrumbCrumb = {
  name: string;
  href?: SpeciesBreadcrumbHref;
};

export function getSpeciesParentHub(species: Species): {
  kind: "venomous" | "group";
  href: "/venomous-snakes" | `/${GroupHubId}`;
  hubId: GroupHubId;
} {
  const hubId = ANIMAL_GROUP_TO_HUB[getSpeciesAtlasMeta(species.id).group];
  if (isVenomousDanger(species.danger)) {
    return { kind: "venomous", href: "/venomous-snakes", hubId };
  }

  return {
    kind: "group",
    href: GROUP_HUBS[hubId].path,
    hubId,
  };
}

export function buildSpeciesBreadcrumbs(options: {
  species: Species;
  homeLabel: string;
  venomousLabel: string;
  groupLabel: string;
}): SpeciesBreadcrumbCrumb[] {
  const parent = getSpeciesParentHub(options.species);
  const hubPath = GROUP_HUBS[parent.hubId].path;

  const crumbs: SpeciesBreadcrumbCrumb[] = [
    { name: options.homeLabel, href: "/" },
    { name: options.groupLabel, href: hubPath },
  ];

  if (parent.kind === "venomous") {
    crumbs.push({
      name: options.venomousLabel,
      href: "/venomous-snakes",
    });
  }

  crumbs.push({ name: options.species.commonName });
  return crumbs;
}

export function animalGroupToHubId(group: AnimalGroup): GroupHubId {
  return ANIMAL_GROUP_TO_HUB[group];
}