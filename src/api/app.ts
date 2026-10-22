import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { etag } from "hono/etag";
import { secureHeaders } from "hono/secure-headers";

import type { ApiEnv } from "./env";

import { ApiError, errorResponse, handleError } from "./lib/errors";
import { allowedOrigins } from "./lib/origins";
import { noindex } from "./middleware/noindex";
import { adminSpecies } from "./routes/adminSpecies";
import { catalog } from "./routes/catalog";
import { ratings } from "./routes/ratings";
import { species } from "./routes/species";

const MAX_BODY_BYTES = 16 * 1024;

const MAX_ADMIN_BODY_BYTES = 1024 * 1024;

const bodyLimitDefault = limitBody(MAX_BODY_BYTES);

const adminBodyLimit = limitBody(MAX_ADMIN_BODY_BYTES);

const CORS_MAX_AGE = 86_400;

export const app = new Hono<ApiEnv>()
  .use(secureHeaders())
  .use(noindex)
  .use(
    cors({
      allowHeaders: ["Content-Type"],
      allowMethods: ["GET", "POST", "OPTIONS"],
      maxAge: CORS_MAX_AGE,
      origin: (origin, c) =>
        allowedOrigins(c.env).includes(origin) ? origin : "*",
    }),
  )
  .use((c, next) =>
    (c.req.path.startsWith("/v1/admin/") ? adminBodyLimit : bodyLimitDefault)(
      c,
      next,
    ),
  )
  .use(etag())
  .route("/v1/species", species)
  .route("/v1/catalog", catalog)
  .route("/v1/ratings", ratings)
  .route("/v1/admin/species", adminSpecies)
  .notFound((c) => errorResponse(c, 404, "not_found", "Not found"))
  .onError(handleError);

export type AppType = typeof app;

function limitBody(maxSize: number) {
  return bodyLimit({
    maxSize,
    onError: () => {
      throw new ApiError(413, "payload_too_large", "Request body too large");
    },
  });
}
