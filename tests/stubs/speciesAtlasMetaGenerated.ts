import { readFileSync } from "node:fs";

import type { SpeciesAtlasMeta } from "@/data/speciesAtlasMeta";

import { speciesFixtureFile } from "../fixtures/speciesFixtureFiles";

type SeedSpecies = SpeciesAtlasMeta & { id: string };

const seed = JSON.parse(
  readFileSync(speciesFixtureFile("ka"), "utf8"),
) as SeedSpecies[];

export const speciesAtlasMetaById: Record<string, SpeciesAtlasMeta> =
  Object.fromEntries(
    seed.map((item) => [
      item.id,
      { group: item.group, habitats: item.habitats },
    ]),
  );
