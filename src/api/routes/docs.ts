import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";

import type { ApiEnv } from "../env";

import { PUBLIC_CACHE } from "../lib/cache";
import { buildOpenApiDocument } from "../lib/openapi";

const SPEC_PATH = "/v1/docs/openapi.json";
const SCALAR_CDN =
  "https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.74.0/dist/browser/standalone.min.js";

const reference = Scalar<ApiEnv>({
  agent: { disabled: true },
  cdn: SCALAR_CDN,
  mcp: { disabled: true },
  pageTitle: "reptiles.ge API",
  url: SPEC_PATH,
});

export const docs = new Hono<ApiEnv>()
  .get("/", async (c, next) => {
    c.header("Cache-Control", PUBLIC_CACHE);
    return reference(c, next);
  })
  .get("/openapi.json", (c) => {
    c.header("Cache-Control", PUBLIC_CACHE);
    return c.json(buildOpenApiDocument(), 200);
  });
