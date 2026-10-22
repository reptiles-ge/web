import { Hono } from "hono";

import type { ApiEnv } from "../env";

import { readLocalizedCatalog } from "../db/speciesCatalogView";
import { edgeCache, PUBLIC_CACHE } from "../lib/cache";
import { ApiError } from "../lib/errors";
import { validate } from "../lib/validate";
import { catalogQuery } from "../schemas/catalog";
import { localeHeader } from "../schemas/common";

export const catalog = new Hono<ApiEnv>()
  .use(edgeCache("reptiles-api-catalog"))
  .get(
    "/",
    validate("header", localeHeader),
    validate("query", catalogQuery),
    async (c) => {
      const { "x-locale": locale } = c.req.valid("header");
      const { cursor, limit, view } = c.req.valid("query");
      const entries = await readLocalizedCatalog(c.env.DB, locale, view);
      const start = cursor
        ? entries.findIndex((entry) => entry.id === cursor) + 1
        : 0;
      if (start === 0 && cursor) {
        throw new ApiError(400, "invalid_request", "Unknown cursor", [
          { message: "No published species with this id", path: "cursor" },
        ]);
      }
      const end = limit === undefined ? entries.length : start + limit;
      const data = entries.slice(start, end);
      const nextCursor =
        end < entries.length ? (data.at(-1)?.id ?? null) : null;
      c.header("Cache-Control", PUBLIC_CACHE);
      c.header("Content-Language", locale);
      return c.json(
        { data, locale, nextCursor, total: entries.length, view },
        200,
      );
    },
  );
