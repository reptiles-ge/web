import { ANIMAL_GROUP_TO_HUB } from "@/lib/groupHubs";
import { buildPublishedSlugMaps } from "@/lib/speciesSlugRules";

import { lazySeedRecord, seedSpecies } from "./seedRecord";

let maps: ReturnType<typeof buildPublishedSlugMaps> | undefined;

function seedMaps() {
  maps ??= buildPublishedSlugMaps(
    seedSpecies().map((item) => ({
      hub: ANIMAL_GROUP_TO_HUB[item.group],
      id: item.id,
      slug: item.slug,
    })),
  );
  return maps;
}

export const speciesHubById = lazySeedRecord(() => seedMaps().hubById);

export const kaSlugById = lazySeedRecord(() => seedMaps().kaSlugById);

export const idByAnySlug = lazySeedRecord(() => seedMaps().idByAnySlug);
