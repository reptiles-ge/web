import { readFileSync } from "node:fs";

import type { AnimalGroup } from "@/data/speciesAtlasMeta";

import { ANIMAL_GROUP_TO_HUB } from "@/lib/groupHubs";
import { buildPublishedSlugMaps } from "@/lib/speciesSlugRules";

import { speciesFixtureFile } from "../fixtures/speciesFixtureFiles";

type SeedSpecies = { group: AnimalGroup; id: string; slug: string };

const seed = JSON.parse(
  readFileSync(speciesFixtureFile("ka"), "utf8"),
) as SeedSpecies[];

const maps = buildPublishedSlugMaps(
  seed.map((item) => ({
    hub: ANIMAL_GROUP_TO_HUB[item.group],
    id: item.id,
    slug: item.slug,
  })),
);

export const speciesHubById = maps.hubById;

export const kaSlugById = maps.kaSlugById;

export const idByAnySlug = maps.idByAnySlug;
