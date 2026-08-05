import type { Species } from "@/data/species";
import {
  getSpeciesAtlasMeta,
  isVenomousDanger,
  type AnimalGroup,
} from "@/data/speciesAtlas";
import { GROUP_HUBS, type GroupHubId } from "@/lib/groupHubs";

export type SpeciesBreadcrumbCrumb = {
  name: string;
  href?: "/" | "/species" | "/venomous-snakes" | `/${GroupHubId}`;
};

const groupToHubId: Record<AnimalGroup, GroupHubId> = {
  snake: "snakes",
  lizard: "lizards",
  turtle: "turtles",
  amphibian: "amphibians",
};

export function getSpeciesParentHub(species: Species): {
  kind: "venomous" | "group";
  href: "/venomous-snakes" | `/${GroupHubId}`;
  hubId?: GroupHubId;
} {
  if (isVenomousDanger(species.danger)) {
    return { kind: "venomous", href: "/venomous-snakes" };
  }

  const hubId = groupToHubId[getSpeciesAtlasMeta(species.id).group];
  return {
    kind: "group",
    href: GROUP_HUBS[hubId].path,
    hubId,
  };
}

export function buildSpeciesBreadcrumbs(options: {
  species: Species;
  homeLabel: string;
  speciesLabel: string;
  venomousLabel: string;
  groupLabel: string;
}): SpeciesBreadcrumbCrumb[] {
  const parent = getSpeciesParentHub(options.species);

  return [
    { name: options.homeLabel, href: "/" },
    { name: options.speciesLabel, href: "/species" },
    {
      name:
        parent.kind === "venomous" ? options.venomousLabel : options.groupLabel,
      href: parent.href,
    },
    { name: options.species.commonName },
  ];
}
