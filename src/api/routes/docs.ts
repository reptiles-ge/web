import { swaggerUI } from "@hono/swagger-ui";
import { Hono } from "hono";

import type { ApiEnv } from "../env";

import { PUBLIC_CACHE } from "../lib/cache";
import { buildOpenApiDocument } from "../lib/openapi";

const SPEC_PATH = "/v1/docs/openapi.json";

export const docs = new Hono<ApiEnv>()
  .get("/", async (c, next) => {
    c.header("Cache-Control", PUBLIC_CACHE);
    return swaggerUI<ApiEnv>({ title: "reptiles.ge API", url: SPEC_PATH })(
      c,
      next,
    );
  })
  .get("/openapi.json", (c) => {
    c.header("Cache-Control", PUBLIC_CACHE);
    return c.json(buildOpenApiDocument(), 200);
  });
