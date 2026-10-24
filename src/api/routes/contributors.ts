import { Hono } from "hono";

import type { ApiEnv } from "../env";

import { listContributors } from "../db/authors";
import { edgeCache, PUBLIC_CACHE } from "../lib/cache";
import { validate } from "../lib/validate";
import { contributorListQuery } from "../schemas/authors";
import { localeHeader } from "../schemas/common";

export const contributors = new Hono<ApiEnv>()
  .use(edgeCache("reptiles-api-contributors"))
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
  );
