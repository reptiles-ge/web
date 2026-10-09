import type { ComponentProps } from "react";

import type { Link } from "@/i18n/navigation";
import type { GroupHubId } from "@/lib/groupHubs";

type HubFaqHref = ComponentProps<typeof Link>["href"];

const HUB_FAQ_LINKS: Partial<
  Record<GroupHubId, Partial<Record<number, Record<string, HubFaqHref>>>>
> = {
  amphibians: {
    3: { frogs: "/amphibians/bayayi" },
  },
  insects: {
    2: {
      bedbug: "/insects/baghlinjo-sakhlshi",
      cockroach: "/insects/taraknebi-sakhlshi",
      stinkbug: "/insects/farosana-sakhlshi",
    },
  },
  lizards: {
    2: { compare: "/lizards/xvlikis-da-gvelxokeras-gansxvaveba" },
    3: { darevskia: "/lizards/darevskia" },
    5: { house: "/lizards/xvliki-sakhlshi" },
  },
  mammals: {
    5: { bear: "/mammals/datvi-shekhvedra", jackal: "/mammals/tura-ezoshi" },
  },
  scorpions: {
    5: { sting: "/scorpions/morielis-nakbeni" },
  },
  snakes: {
    2: { venomous: "/venomous-snakes" },
    3: { identify: "/snakes/shxamiani-gvelis-amocnoba" },
    4: { range: "/snakes/gavrtseleba" },
    5: { bite: "/snakes/gvelis-nakbeni", yard: "/snakes-in-the-yard" },
  },
  spiders: {
    5: {
      bite: "/spiders/obobis-nakbeni",
      venomous: "/spiders/shxamiani-obobebi",
    },
  },
  turtles: {
    4: { identify: "/turtles/identifikacia" },
  },
};

export function hubFaqLinks(hubId: GroupHubId, n: number) {
  return HUB_FAQ_LINKS[hubId]?.[n];
}
