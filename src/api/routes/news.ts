import { Hono } from "hono";

import type { ApiEnv } from "../env";

import { getPublishedNews, listPublishedNews } from "../db/newsView";
import { edgeCache, PUBLIC_CACHE } from "../lib/cache";
import { ApiError } from "../lib/errors";
import { validate } from "../lib/validate";
import { localeHeader } from "../schemas/common";
import { newsListQuery, newsParam } from "../schemas/news";

export const news = new Hono<ApiEnv>()
  .use(edgeCache("reptiles-api-news"))
  .get(
    "/",
    validate("header", localeHeader),
    validate("query", newsListQuery),
    async (c) => {
      const { "x-locale": locale } = c.req.valid("header");
      const { cursor, limit, ...filters } = c.req.valid("query");
      const entries = await listPublishedNews(c.env.DB, locale, filters);
      const start = cursor
        ? entries.findIndex((entry) => entry.slug === cursor) + 1
        : 0;
      if (start === 0 && cursor) {
        throw new ApiError(400, "invalid_request", "Unknown cursor", [
          { message: "No article with this slug in the list", path: "cursor" },
        ]);
      }
      const end = limit === undefined ? entries.length : start + limit;
      const data = entries.slice(start, end);
      const nextCursor =
        end < entries.length ? (data.at(-1)?.slug ?? null) : null;
      c.header("Cache-Control", PUBLIC_CACHE);
      c.header("Content-Language", locale);
      return c.json({ data, locale, nextCursor, total: entries.length }, 200);
    },
  )
  .get(
    "/:slug",
    validate("param", newsParam),
    validate("header", localeHeader),
    async (c) => {
      const found = await getPublishedNews(
        c.env.DB,
        c.req.valid("param").slug,
        c.req.valid("header")["x-locale"],
      );
      if (!found) throw new ApiError(404, "not_found", "Article not found");
      c.header("Cache-Control", PUBLIC_CACHE);
      c.header("Content-Language", found.locale);
      return c.json(found, 200);
    },
  );
