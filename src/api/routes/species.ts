import { Hono } from "hono";

import type { AnimalGroup } from "@/data/speciesAtlasMeta";
import type { AppLocale } from "@/i18n/routing";

import { getCatalogSpecies } from "@/data/species";
import { speciesAtlasMeta } from "@/data/speciesAtlasMeta";
import { localizeSpecies, speciesUpdatedAt } from "@/i18n/localizeSpecies";
import { getSpeciesPublicSlug } from "@/lib/speciesSlugTable";

import type { ApiEnv } from "../env";

import { PUBLIC_CACHE } from "../lib/cache";
import { validate } from "../lib/validate";
import { speciesListQuery } from "../schemas/species";

export const species = new Hono<ApiEnv>().get(
  "/",
  validate("query", speciesListQuery),
  (c) => {
    const { group, locale } = c.req.valid("query");
    const data = listSpecies(locale, group);
    c.header("Cache-Control", PUBLIC_CACHE);
    return c.json({ data, locale, total: data.length }, 200);
  },
);

function listSpecies(locale: AppLocale, group?: AnimalGroup) {
  return getCatalogSpecies()
    .filter((item) => !group || speciesAtlasMeta[item.id]?.group === group)
    .map((item) => {
      const localized = localizeSpecies(item, locale);
      return {
        commonName: localized.commonName,
        danger: localized.danger ?? null,
        group: speciesAtlasMeta[item.id]?.group ?? null,
        id: item.id,
        image: localized.image,
        scientificName: localized.scientificName,
        slug: getSpeciesPublicSlug(item.id, locale),
        updatedAt: speciesUpdatedAt(item, locale),
      };
    });
}
