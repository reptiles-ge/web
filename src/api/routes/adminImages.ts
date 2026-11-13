import { Hono } from "hono";

import type { ApiEnv } from "../env";

import { listImageManifest, writeImageManifest } from "../db/imageManifest";
import {
  listSchemaImageCrops,
  writeSchemaImageCrops,
} from "../db/schemaImageCrops";
import { NO_STORE } from "../lib/cache";
import { purgeApiCache } from "../lib/cachePurge";
import { validate } from "../lib/validate";
import { requireToken } from "../middleware/requireToken";
import { imageManifestBody, schemaImageCropsBody } from "../schemas/images";

export const adminImages = new Hono<ApiEnv>()
  .use(requireToken)
  .get("/manifest", async (c) => {
    const data = await listImageManifest(c.env.DB);
    c.header("Cache-Control", NO_STORE);
    return c.json({ data, total: data.length }, 200);
  })
  .put("/manifest", validate("json", imageManifestBody), async (c) => {
    const { images } = c.req.valid("json");
    await writeImageManifest(c.env.DB, images, new Date().toISOString());
    const purge = await purgeApiCache(c.env, ["images"]);
    c.header("Cache-Control", NO_STORE);
    return c.json({ data: { purge, written: images.length } }, 200);
  })
  .get("/schema-crops", async (c) => {
    const data = await listSchemaImageCrops(c.env.DB);
    c.header("Cache-Control", NO_STORE);
    return c.json({ data, total: data.length }, 200);
  })
  .put("/schema-crops", validate("json", schemaImageCropsBody), async (c) => {
    const { images } = c.req.valid("json");
    await writeSchemaImageCrops(c.env.DB, images, new Date().toISOString());
    const purge = await purgeApiCache(c.env, ["images"]);
    c.header("Cache-Control", NO_STORE);
    return c.json({ data: { purge, written: images.length } }, 200);
  });
