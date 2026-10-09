import type { ComponentProps } from "react";

import type { Link } from "@/i18n/navigation";
import type { GroupHubId } from "@/lib/groupHubs";

type HubFaqHref = ComponentProps<typeof Link>["href"];

const HUB_FAQ_LINKS: Partial<
  Record<GroupHubId, Partial<Record<number, Record<string, HubFaqHref>>>>
> = {
  snakes: {
    2: { venomous: "/venomous-snakes" },
    3: { identify: "/snakes/shxamiani-gvelis-amocnoba" },
    4: { range: "/snakes/gavrtseleba" },
    5: { bite: "/snakes/gvelis-nakbeni", yard: "/snakes-in-the-yard" },
  },
  turtles: {
    4: { identify: "/turtles/identifikacia" },
  },
};

export function hubFaqLinks(hubId: GroupHubId, n: number) {
  return HUB_FAQ_LINKS[hubId]?.[n];
}
