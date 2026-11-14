import { Hono } from "hono";

import type { ApiEnv } from "../env";

import { readFieldRecords } from "../db/fieldRecords";
import { readRangeMap } from "../db/rangeMaps";
import {
  findPublishedSpeciesId,
  getPublishedSpeciesPage,
  listPublishedSpecies,
} from "../db/species";
import { cacheTags, edgeCache, PUBLIC_CACHE } from "../lib/cache";
import { ApiError } from "../lib/errors";
import { requirePublishedSpeciesId } from "../lib/publishedSpecies";
import { validate } from "../lib/validate";
import { localeHeader } from "../schemas/common";
import { speciesListQuery, speciesParam } from "../schemas/species";

export const species = new Hono<ApiEnv>()
  .use(edgeCache("reptiles-api-species", ["species"]))
  .get(
    "/",
    validate("header", localeHeader),
    validate("query", speciesListQuery),
    async (c) => {
      const { "x-locale": locale } = c.req.valid("header");
      const { group } = c.req.valid("query");
      const data = await listPublishedSpecies(c.env.DB, locale, group);
      cacheTags(c, "catalog");
      c.header("Cache-Control", PUBLIC_CACHE);
      c.header("Content-Language", locale);
      return c.json({ data, locale, total: data.length }, 200);
    },
  )
  .get(
    "/:slug",
    validate("param", speciesParam),
    validate("header", localeHeader),
    async (c) => {
      const { slug } = c.req.valid("param");
      const { "x-locale": locale } = c.req.valid("header");
      const found = await getPublishedSpeciesPage(c.env.DB, slug, locale);
      if (!found) throw new ApiError(404, "not_found", "Species not found");
      const { data, id, views } = found;
      cacheTags(c, `species:${id}`);
      c.header("Cache-Control", PUBLIC_CACHE);
      c.header("Content-Language", locale);
      return c.json({ data, locale, views }, 200);
    },
  )
  .get(
    "/:slug/field-records",
    validate("param", speciesParam),
    validate("header", localeHeader),
    async (c) => {
      const id = await requirePublishedSpeciesId(
        c.env.DB,
        c.req.valid("param").slug,
        c.req.valid("header")["x-locale"],
      );
      const hidden = (await readRangeMap(c.env.DB, id))?.hidePoints === true;
      const data = hidden ? [] : await readFieldRecords(c.env.DB, id);
      cacheTags(c, `species:${id}`);
      c.header("Cache-Control", PUBLIC_CACHE);
      return c.json({ data, hidden, id, total: data.length }, 200);
    },
  )
  .get(
    "/:slug/range-map",
    validate("param", speciesParam),
    validate("header", localeHeader),
    async (c) => {
      const { "x-locale": locale } = c.req.valid("header");
      const id = await findPublishedSpeciesId(
        c.env.DB,
        c.req.valid("param").slug,
        locale,
      );
      if (!id) throw new ApiError(404, "not_found", "Species not found");
      const rangeMap = await readRangeMap(c.env.DB, id);
      cacheTags(c, `species:${id}`);
      const data = rangeMap
        ? { ...rangeMap, copy: rangeMap.copy[locale] }
        : null;
      c.header("Cache-Control", PUBLIC_CACHE);
      c.header("Content-Language", locale);
      return c.json({ data, id, locale }, 200);
    },
  );
