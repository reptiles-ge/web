import { GROUP_HUBS, type GroupHubId } from "@/lib/groupHubs";

export type WallHub = Extract<
  GroupHubId,
  "amphibians" | "birds" | "lizards" | "mammals" | "snakes" | "turtles"
>;

type WallRow = {
  direction: "l" | "r";
  durationLg: number;
  durationSm: number;
  hubs: WallHub[];
  mobile: boolean;
};

export const SQUARE_HUBS: ReadonlySet<WallHub> = new Set(["birds", "mammals"]);

export const HERO_WALL_ROWS: WallRow[] = [
  {
    direction: "l",
    durationLg: 95,
    durationSm: 70,
    hubs: ["birds", "turtles", "mammals", "amphibians", "lizards", "snakes"],
    mobile: true,
  },
  {
    direction: "r",
    durationLg: 104,
    durationSm: 79,
    hubs: ["amphibians", "lizards", "mammals", "snakes", "turtles", "birds"],
    mobile: true,
  },
  {
    direction: "l",
    durationLg: 113,
    durationSm: 88,
    hubs: ["mammals", "birds", "snakes", "turtles", "amphibians", "lizards"],
    mobile: true,
  },
  {
    direction: "r",
    durationLg: 122,
    durationSm: 122,
    hubs: ["turtles", "amphibians", "birds", "lizards", "snakes", "mammals"],
    mobile: false,
  },
  {
    direction: "l",
    durationLg: 131,
    durationSm: 131,
    hubs: ["snakes", "mammals", "turtles", "birds", "lizards", "amphibians"],
    mobile: false,
  },
];

export function heroWallSpeciesIds(): Record<WallHub, string> {
  const hubs = new Set(HERO_WALL_ROWS.flatMap((row) => row.hubs));
  return Object.fromEntries(
    [...hubs].map((hub) => [hub, GROUP_HUBS[hub].heroSpeciesId]),
  ) as Record<WallHub, string>;
}
