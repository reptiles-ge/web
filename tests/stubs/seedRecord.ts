import { readFileSync } from "node:fs";

import type { AnimalGroup, HabitatTag } from "@/data/speciesAtlasMeta";

import { speciesFixtureFile } from "../fixtures/speciesFixtureFiles";

export type SeedSpecies = {
  group: AnimalGroup;
  habitats: HabitatTag[];
  id: string;
  slug: string;
};

let seed: SeedSpecies[] | undefined;

export function lazySeedRecord<T>(
  load: () => Record<string, T>,
): Record<string, T> {
  let cache: Record<string, T> | undefined;
  const target = () => (cache ??= load());
  return new Proxy({} as Record<string, T>, {
    get: (_, key) => Reflect.get(target(), key),
    getOwnPropertyDescriptor: (_, key) => {
      const descriptor = Reflect.getOwnPropertyDescriptor(target(), key);
      return descriptor && { ...descriptor, configurable: true };
    },
    has: (_, key) => Reflect.has(target(), key),
    ownKeys: () => Reflect.ownKeys(target()),
  });
}

export function seedSpecies() {
  seed ??= JSON.parse(
    readFileSync(speciesFixtureFile("ka"), "utf8"),
  ) as SeedSpecies[];
  return seed;
}
