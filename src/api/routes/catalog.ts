import { Hono } from "hono";

import type { ApiEnv } from "../env";

import { readLocalizedCatalog } from "../db/speciesCatalogView";
import { edgeCache, PUBLIC_CACHE } from "../lib/cache";
import {
  catalogFacets,
  catalogStats,
  filterCatalog,
  sortCatalog,
} from "../lib/catalogFilter";
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
      const { cursor, limit, page, sort, view, ...filters } =
        c.req.valid("query");
      const rows = await readLocalizedCatalog(c.env.DB, locale, view);
      const index = rows.map((row) => row.index);
      const entryById = new Map(rows.map((row) => [row.index.id, row.entry]));
      const matches = sortCatalog(filterCatalog(index, filters), sort, locale);
      let start = page === undefined ? 0 : (page - 1) * limit!;
      if (cursor) {
        start = matches.findIndex((entry) => entry.id === cursor) + 1;
        if (start === 0) {
          throw new ApiError(400, "invalid_request", "Unknown cursor", [
            { message: "No published species with this id", path: "cursor" },
          ]);
        }
      }
      const end = limit === undefined ? matches.length : start + limit;
      const data = matches
        .slice(start, end)
        .map((entry) => entryById.get(entry.id)!);
      const nextCursor =
        end < matches.length ? (matches[end - 1]?.id ?? null) : null;
      c.header("Cache-Control", PUBLIC_CACHE);
      c.header("Content-Language", locale);
      return c.json(
        {
          data,
          facets: catalogFacets(index, filters),
          locale,
          nextCursor,
          stats: catalogStats(matches),
          total: matches.length,
          view,
        },
        200,
      );
    },
  );
