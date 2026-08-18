import type { Species } from "@/data/species";
import { isVenomousDanger } from "@/data/speciesAtlas";
import type { GroupHubId } from "@/lib/groupHubs";

export const FROG_SPECIES_IDS = [
  "pelobates-syriacus",
  "pelodytes-caucasicus",
  "bufotes-viridis",
  "bufo-verrucosissimus",
  "hyla-orientalis",
  "hyla-savignyi",
  "rana-macrocnemis",
  "pelophylax-ridibundus",
] as const;

export const NEWT_SPECIES_IDS = [
  "mertensiella-caucasica",
  "lissotriton-lantzi",
  "ommatotriton-ophryticus",
  "triturus-karelinii",
] as const;

const frogIdSet = new Set<string>(FROG_SPECIES_IDS);
const newtIdSet = new Set<string>(NEWT_SPECIES_IDS);

export function isFrogSpecies(id: string) {
  return frogIdSet.has(id);
}

export function isNewtSpecies(id: string) {
  return newtIdSet.has(id);
}

export type ClusterGuideId = "amphibian-frogs";

export type ClusterGuidePath = "/amphibians/bayayi";

export type ClusterGuideConfig = {
  id: ClusterGuideId;
  pathname: ClusterGuidePath;
  parentHub: GroupHubId;
  messageKey: "amphibianFrogs";
  heroSpeciesId: string;
  matches: (species: Species) => boolean;
};

export const CLUSTER_GUIDES: Record<ClusterGuideId, ClusterGuideConfig> = {
  "amphibian-frogs": {
    id: "amphibian-frogs",
    pathname: "/amphibians/bayayi",
    parentHub: "amphibians",
    messageKey: "amphibianFrogs",
    heroSpeciesId: "pelophylax-ridibundus",
    matches: (species) => isFrogSpecies(species.id),
  },
};

export type HubClusterCard =
  | {
      kind: "page";
      href: "/venomous-snakes" | "/snakes-in-the-yard" | "/amphibians/bayayi";
      key: "venomous" | "yard" | "frogs";
    }
  | {
      kind: "species";
      id: string;
      key: "giurza" | "jojo" | "gvelxokera" | "slider" | "tortoise";
    };

export const HUB_CLUSTER_CARDS: Record<GroupHubId, HubClusterCard[]> = {
  snakes: [
    { kind: "page", href: "/venomous-snakes", key: "venomous" },
    { kind: "page", href: "/snakes-in-the-yard", key: "yard" },
    { kind: "species", id: "macrovipera-lebetina", key: "giurza" },
  ],
  lizards: [
    { kind: "species", id: "paralaudakia-caucasia", key: "jojo" },
    { kind: "species", id: "pseudopus-apodus", key: "gvelxokera" },
  ],
  turtles: [
    { kind: "species", id: "testudo-graeca", key: "tortoise" },
    { kind: "species", id: "trachemys-scripta", key: "slider" },
  ],
  amphibians: [
    { kind: "page", href: "/amphibians/bayayi", key: "frogs" },
  ],
};

export type SpeciesSection = {
  key: string;
  items: Species[];
};

export function splitHubSpecies(
  hubId: GroupHubId,
  species: Species[],
): SpeciesSection[] {
  if (hubId === "snakes") {
    return [
      {
        key: "venomous",
        items: species.filter((item) => isVenomousDanger(item.danger)),
      },
      {
        key: "harmless",
        items: species.filter((item) => !isVenomousDanger(item.danger)),
      },
    ].filter((section) => section.items.length > 0);
  }

  if (hubId === "lizards") {
    return [
      {
        key: "featured",
        items: species.filter(
          (item) =>
            item.id === "paralaudakia-caucasia" ||
            item.id === "pseudopus-apodus",
        ),
      },
      {
        key: "darevskia",
        items: species.filter((item) => item.genus === "Darevskia"),
      },
      {
        key: "other",
        items: species.filter(
          (item) =>
            item.genus !== "Darevskia" &&
            item.id !== "paralaudakia-caucasia" &&
            item.id !== "pseudopus-apodus",
        ),
      },
    ].filter((section) => section.items.length > 0);
  }

  if (hubId === "turtles") {
    return [
      {
        key: "native",
        items: species.filter((item) => item.id !== "trachemys-scripta"),
      },
      {
        key: "introduced",
        items: species.filter((item) => item.id === "trachemys-scripta"),
      },
    ].filter((section) => section.items.length > 0);
  }

  return [
    {
      key: "frogs",
      items: species.filter((item) => isFrogSpecies(item.id)),
    },
    {
      key: "newts",
      items: species.filter((item) => isNewtSpecies(item.id)),
    },
  ].filter((section) => section.items.length > 0);
}

export function getViperSpecies(species: Species[]) {
  return species.filter((item) => item.family === "Viperidae");
}

export function getRearFangedSpecies(species: Species[]) {
  return species.filter(
    (item) => isVenomousDanger(item.danger) && item.family !== "Viperidae",
  );
}
