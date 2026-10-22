import { Hono } from "hono";

import type { ApiEnv } from "../env";

import { readLocalizedCatalog } from "../db/speciesCatalogView";
import { edgeCache, PUBLIC_CACHE } from "../lib/cache";
import { validate } from "../lib/validate";
import { catalogQuery } from "../schemas/catalog";

export const catalog = new Hono<ApiEnv>()
  .use(edgeCache("reptiles-api-catalog"))
  .get("/", validate("query", catalogQuery), async (c) => {
    const { locale, view } = c.req.valid("query");
    const data = await readLocalizedCatalog(c.env.DB, locale, view);
    c.header("Cache-Control", PUBLIC_CACHE);
    return c.json({ data, locale, total: data.length, view }, 200);
  });
