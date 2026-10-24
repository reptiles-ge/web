import { Hono } from "hono";

import type { ApiEnv } from "../env";

import {
  type AuthorRecord,
  findAliasOwners,
  readAuthor,
  writeAuthor,
} from "../db/authors";
import { inBackground } from "../lib/background";
import { NO_STORE } from "../lib/cache";
import { ApiError } from "../lib/errors";
import { revalidateAuthorPages } from "../lib/revalidateSite";
import { validate } from "../lib/validate";
import { requireToken } from "../middleware/requireToken";
import { authorParam, authorWriteBody } from "../schemas/authors";

export const adminAuthors = new Hono<ApiEnv>()
  .use(requireToken)
  .get("/:id", validate("param", authorParam), async (c) => {
    const author = await readAuthor(c.env.DB, c.req.valid("param").id);
    if (!author) throw new ApiError(404, "not_found", "Author not found");
    c.header("Cache-Control", NO_STORE);
    return c.json({ data: author }, 200);
  })
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
