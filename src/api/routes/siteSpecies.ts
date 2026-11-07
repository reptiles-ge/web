import { Hono } from "hono";

import type { ApiEnv } from "../env";

import { readFieldRecords } from "../db/fieldRecords";
import { cacheTags, edgeCache, PUBLIC_CACHE } from "../lib/cache";
import { requirePublishedSpeciesId } from "../lib/publishedSpecies";
import { validate } from "../lib/validate";
import { requireSiteKey } from "../middleware/requireSiteKey";
import { localeHeader } from "../schemas/common";
import { speciesParam } from "../schemas/species";

export const siteSpecies = new Hono<ApiEnv>()
  .use(requireSiteKey)
  .use(edgeCache("reptiles-api-site-species", ["species"]))
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
      const data = await readFieldRecords(c.env.DB, id);
      cacheTags(c, `species:${id}`);
      c.header("Cache-Control", PUBLIC_CACHE);
      return c.json({ data, id, total: data.length }, 200);
    },
  );
