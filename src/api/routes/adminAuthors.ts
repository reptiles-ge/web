import { Hono } from "hono";

import type { ApiEnv } from "../env";

import {
  authorExists,
  type AuthorRecord,
  findAliasOwners,
  listAdminAuthors,
  listAuthorPhotos,
  readAuthor,
  writeAuthor,
  writeAuthorTexts,
} from "../db/authors";
import { inBackground } from "../lib/background";
import { NO_STORE } from "../lib/cache";
import { ApiError } from "../lib/errors";
import {
  ensureSiteRevalidated,
  revalidateAuthorPages,
  revalidateAuthorsSection,
  revalidateContributorPage,
} from "../lib/revalidateSite";
import { validate } from "../lib/validate";
import { rateLimitAdmin } from "../middleware/rateLimitAdmin";
import { requireAdmin } from "../middleware/requireAdmin";
import { requireAdminSession } from "../middleware/requireAdminSession";
import { requireSiteOrigin } from "../middleware/requireSiteOrigin";
import { requireToken } from "../middleware/requireToken";
import {
  adminAuthorListQuery,
  authorParam,
  authorRecordSchema,
  authorTextsBody,
  authorWriteBody,
} from "../schemas/authors";

export const adminAuthors = new Hono<ApiEnv>()
  .get(
    "/",
    requireAdmin,
    validate("query", adminAuthorListQuery),
    async (c) => {
      const { limit, page, ...filters } = c.req.valid("query");
      const result = await listAdminAuthors(c.env.DB, filters, {
        limit,
        page,
      });
      c.header("Cache-Control", NO_STORE);
      return c.json(result, 200);
    },
  )
  .post(
    "/revalidate",
    requireSiteOrigin,
    rateLimitAdmin,
    requireAdminSession,
    async (c) => {
      await ensureSiteRevalidated(revalidateAuthorsSection(c.env));
      c.header("Cache-Control", NO_STORE);
      return c.json({ data: { tags: ["authors"] } }, 200);
    },
  )
  .post(
    "/:id/revalidate",
    requireSiteOrigin,
    rateLimitAdmin,
    requireAdminSession,
    validate("param", authorParam),
    async (c) => {
      const { id } = c.req.valid("param");
      if (!(await authorExists(c.env.DB, id))) {
        throw new ApiError(404, "not_found", "Author not found");
      }
      await ensureSiteRevalidated(revalidateContributorPage(c.env, id));
      c.header("Cache-Control", NO_STORE);
      return c.json({ data: { id } }, 200);
    },
  )
  .get("/:id", requireAdmin, validate("param", authorParam), async (c) => {
    const author = await readAuthor(c.env.DB, c.req.valid("param").id);
    if (!author) throw new ApiError(404, "not_found", "Author not found");
    c.header("Cache-Control", NO_STORE);
    return c.json({ data: author }, 200);
  })
  .get(
    "/:id/photos",
    requireAdmin,
    validate("param", authorParam),
    async (c) => {
      const { id } = c.req.valid("param");
      if (!(await authorExists(c.env.DB, id))) {
        throw new ApiError(404, "not_found", "Author not found");
      }
      const data = await listAuthorPhotos(c.env.DB, id);
      c.header("Cache-Control", NO_STORE);
      return c.json({ data, id, total: data.length }, 200);
    },
  )
  .post(
    "/:id/texts",
    requireSiteOrigin,
    rateLimitAdmin,
    requireAdminSession,
    validate("param", authorParam),
    validate("json", authorTextsBody),
    async (c) => {
      const { id } = c.req.valid("param");
      const current = await readAuthor(c.env.DB, id);
      if (!current) throw new ApiError(404, "not_found", "Author not found");
      const checked = authorRecordSchema.safeParse({
        ...current,
        texts: c.req.valid("json").texts,
      });
      if (!checked.success) {
        throw new ApiError(
          400,
          "invalid_request",
          "The change breaks a content rule",
          checked.error.issues,
        );
      }
      await writeAuthorTexts(c.env.DB, checked.data as AuthorRecord);
      c.header("Cache-Control", NO_STORE);
      return c.json({ data: { id } }, 200);
    },
  )
  .use(requireToken)
  .put(
    "/:id",
    validate("param", authorParam),
    validate("json", authorWriteBody),
    async (c) => {
      const { id } = c.req.valid("param");
      const author = c.req.valid("json").author as AuthorRecord;
      if (author.id !== id) {
        throw new ApiError(
          400,
          "invalid_request",
          "Body id does not match the URL",
        );
      }
      const taken = [...(await findAliasOwners(c.env.DB, author.aliases))]
        .filter(([, owner]) => owner !== id)
        .map(([alias, owner]) => ({
          message: `Alias belongs to ${owner}`,
          path: alias,
        }));
      if (taken.length > 0) {
        throw new ApiError(
          400,
          "invalid_request",
          "Aliases already belong to another author",
          taken,
        );
      }
      await writeAuthor(c.env.DB, author);
      inBackground(c, revalidateAuthorPages(c.env, id));
      c.header("Cache-Control", NO_STORE);
      return c.json({ data: { id } }, 200);
    },
  );
