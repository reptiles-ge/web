import type { Species } from "@/data/species";

import { getRegionsForSpecies, type Region } from "@/data/mapRegions";

export const TURTLE_ORDER = [
  "testudo-graeca",
  "emys-orbicularis",
  "mauremys-caspica",
  "trachemys-scripta",
] as const;

export type TurtleId = (typeof TURTLE_ORDER)[number];

type TurtleKind = "land" | "water";
type TurtleStatus = "introduced" | "native";

export const TURTLE_META: Record<
  TurtleId,
  { kind: TurtleKind; status: TurtleStatus }
> = {
  "emys-orbicularis": { kind: "water", status: "native" },
  "mauremys-caspica": { kind: "water", status: "native" },
  "testudo-graeca": { kind: "land", status: "native" },
  "trachemys-scripta": { kind: "water", status: "introduced" },
};

export function collectTurtleRegions(turtles: Species[]) {
  const regionMap = new Map<string, Region>();
  for (const item of turtles) {
    for (const region of getRegionsForSpecies(item.id)) {
      regionMap.set(region.id, region);
    }
  }
  return [...regionMap.values()];
}
