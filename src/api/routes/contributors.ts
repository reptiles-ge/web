import { Hono } from "hono";

import type { ApiEnv } from "../env";

import { getContributorDetail, listContributors } from "../db/authors";
import { cacheTags, edgeCache, PUBLIC_CACHE } from "../lib/cache";
import { ApiError } from "../lib/errors";
import { validate } from "../lib/validate";
import { authorParam, contributorListQuery } from "../schemas/authors";
import { localeHeader } from "../schemas/common";

export const contributors = new Hono<ApiEnv>()
  .use(edgeCache("reptiles-api-contributors", ["authors"]))
  .get(
    "/",
    validate("header", localeHeader),
    validate("query", contributorListQuery),
    async (c) => {
      const { "x-locale": locale } = c.req.valid("header");
      const { limit } = c.req.valid("query");
      const { data, total } = await listContributors(c.env.DB, locale, limit);
      c.header("Cache-Control", PUBLIC_CACHE);
      c.header("Content-Language", locale);
      return c.json({ data, locale, total }, 200);
    },
  )
  .get(
    "/:id",
    validate("param", authorParam),
    validate("header", localeHeader),
    async (c) => {
      const { id } = c.req.valid("param");
      const { "x-locale": locale } = c.req.valid("header");
      const data = await getContributorDetail(c.env.DB, id, locale);
      if (!data) throw new ApiError(404, "not_found", "Contributor not found");
      cacheTags(c, `author:${id}`);
      c.header("Cache-Control", PUBLIC_CACHE);
      c.header("Content-Language", locale);
      return c.json({ data, locale }, 200);
    },
  );
