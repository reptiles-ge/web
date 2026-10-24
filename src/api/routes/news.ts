import { Hono } from "hono";

import type { ApiEnv } from "../env";

import { getPublishedNews, listPublishedNews } from "../db/newsView";
import { readViewTotal } from "../db/views";
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
      const { limit, page, ...filters } = c.req.valid("query");
      const result = await listPublishedNews(c.env.DB, locale, filters, {
        limit,
        page,
      });
      c.header("Cache-Control", PUBLIC_CACHE);
      c.header("Content-Language", locale);
      return c.json({ ...result, locale }, 200);
    },
  )
  .get(
    "/:slug",
    validate("param", newsParam),
    validate("header", localeHeader),
    async (c) => {
      const { slug } = c.req.valid("param");
      const [found, views] = await Promise.all([
        getPublishedNews(c.env.DB, slug, c.req.valid("header")["x-locale"]),
        readViewTotal(c.env.DB, "news", slug),
      ]);
      if (!found) throw new ApiError(404, "not_found", "Article not found");
      c.header("Cache-Control", PUBLIC_CACHE);
      c.header("Content-Language", found.locale);
      return c.json({ ...found, views }, 200);
    },
  );
