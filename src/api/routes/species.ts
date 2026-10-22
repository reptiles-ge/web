import { Hono } from "hono";

import type { ApiEnv } from "../env";

import { readFieldRecords } from "../db/fieldRecords";
import {
  findPublishedSpeciesId,
  getSpeciesDetail,
  listPublishedSpecies,
} from "../db/species";
import { edgeCache, PUBLIC_CACHE } from "../lib/cache";
import { ApiError } from "../lib/errors";
import { validate } from "../lib/validate";
import { localeHeader } from "../schemas/common";
import { speciesListQuery, speciesParam } from "../schemas/species";

export const species = new Hono<ApiEnv>()
  .use(edgeCache("reptiles-api-species"))
  .get(
    "/",
    validate("header", localeHeader),
    validate("query", speciesListQuery),
    async (c) => {
      const { "x-locale": locale } = c.req.valid("header");
      const { group } = c.req.valid("query");
      const data = await listPublishedSpecies(c.env.DB, locale, group);
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
      const id = await findPublishedSpeciesId(c.env.DB, slug, locale);
      const data = id ? await getSpeciesDetail(c.env.DB, id, locale) : null;
      if (!data) throw new ApiError(404, "not_found", "Species not found");
      c.header("Cache-Control", PUBLIC_CACHE);
      c.header("Content-Language", locale);
      return c.json({ data, locale }, 200);
    },
  )
  .get(
    "/:slug/field-records",
    validate("param", speciesParam),
    validate("header", localeHeader),
    async (c) => {
      const id = await findPublishedSpeciesId(
        c.env.DB,
        c.req.valid("param").slug,
        c.req.valid("header")["x-locale"],
      );
      if (!id) throw new ApiError(404, "not_found", "Species not found");
      const data = await readFieldRecords(c.env.DB, id);
      c.header("Cache-Control", PUBLIC_CACHE);
      return c.json({ data, id, total: data.length }, 200);
    },
  );
