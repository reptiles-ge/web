import { Hono } from "hono";

import type { ApiEnv } from "../env";

import { listOptimizedImages } from "../db/optimizedImages";
import { edgeCache, PUBLIC_CACHE } from "../lib/cache";

export const images = new Hono<ApiEnv>()
  .use(edgeCache("reptiles-api-images"))
  .get("/", async (c) => {
    const data = await listOptimizedImages(c.env.DB);
    c.header("Cache-Control", PUBLIC_CACHE);
    return c.json({ data, total: data.length }, 200);
  });
