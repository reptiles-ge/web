import { Hono } from "hono";

import type { ApiEnv } from "../env";

import {
  readSpeciesRecord,
  readSpeciesVersion,
  writeSpeciesRecord,
} from "../db/speciesWrite";
import { inBackground } from "../lib/background";
import { NO_STORE } from "../lib/cache";
import { ApiError } from "../lib/errors";
import { revalidateSpeciesPages } from "../lib/revalidateSite";
import { validate } from "../lib/validate";
import { requireToken } from "../middleware/requireToken";
import { speciesIdParam, speciesWriteBody } from "../schemas/speciesRecord";

export const adminSpecies = new Hono<ApiEnv>()
  .use(requireToken)
  .get("/:id", validate("param", speciesIdParam), async (c) => {
    const found = await readSpeciesRecord(c.env.DB, c.req.valid("param").id);
    if (!found) throw new ApiError(404, "not_found", "Species not found");
    c.header("Cache-Control", NO_STORE);
    return c.json({ data: found }, 200);
  })
  .put(
    "/:id",
    validate("param", speciesIdParam),
    validate("json", speciesWriteBody),
    async (c) => {
      const { id } = c.req.valid("param");
      const { actor, expectedVersion, record, source, summary } =
        c.req.valid("json");
      if (record.base.id !== id) {
        throw new ApiError(
          400,
          "invalid_request",
          "Body id does not match the URL",
        );
      }
      const conflict = (currentVersion: number) =>
        new ApiError(
          409,
          "version_conflict",
          "Species changed since it was read",
          {
            currentVersion,
          },
        );
      const current = await readSpeciesVersion(c.env.DB, id);
      if (current === null) {
        throw new ApiError(404, "not_found", "Species not found");
      }
      if (current !== expectedVersion) throw conflict(current);
      let version: number;
      try {
        version = await writeSpeciesRecord(c.env.DB, record, expectedVersion, {
          actor,
          source,
          summary,
        });
      } catch (error) {
        const now = await readSpeciesVersion(c.env.DB, id);
        if (now !== null && now !== expectedVersion) throw conflict(now);
        throw error;
      }
      inBackground(c, revalidateSpeciesPages(c.env, id));
      c.header("Cache-Control", NO_STORE);
      return c.json({ data: { id, version } }, 200);
    },
  );
