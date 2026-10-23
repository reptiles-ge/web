import { Hono } from "hono";

import type { ApiEnv } from "../env";

import { getAuthorDetail, listAuthors } from "../db/authors";
import { edgeCache, PUBLIC_CACHE } from "../lib/cache";
import { ApiError } from "../lib/errors";
import { validate } from "../lib/validate";
import { authorListQuery, authorParam } from "../schemas/authors";
import { localeHeader } from "../schemas/common";

export const authors = new Hono<ApiEnv>()
  .use(edgeCache("reptiles-api-authors"))
  .get(
    "/",
    validate("header", localeHeader),
    validate("query", authorListQuery),
    async (c) => {
      const { "x-locale": locale } = c.req.valid("header");
      const { contributor } = c.req.valid("query");
      const data = await listAuthors(c.env.DB, locale, contributor);
      c.header("Cache-Control", PUBLIC_CACHE);
      c.header("Content-Language", locale);
      return c.json({ data, locale, total: data.length }, 200);
    },
  )
  .get(
    "/:id",
    validate("param", authorParam),
    validate("header", localeHeader),
    async (c) => {
      const { id } = c.req.valid("param");
      const { "x-locale": locale } = c.req.valid("header");
      const data = await getAuthorDetail(c.env.DB, id, locale);
      if (!data) throw new ApiError(404, "not_found", "Author not found");
      c.header("Cache-Control", PUBLIC_CACHE);
      c.header("Content-Language", locale);
      return c.json({ data, locale }, 200);
    },
  );
