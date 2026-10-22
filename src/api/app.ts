import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";

import type { ApiEnv } from "./env";

import { ApiError, errorResponse, handleError } from "./lib/errors";
import { noindex } from "./middleware/noindex";
import { ratings } from "./routes/ratings";
import { species } from "./routes/species";

const MAX_BODY_BYTES = 16 * 1024;

export const app = new Hono<ApiEnv>()
  .use(secureHeaders())
  .use(noindex)
  .use(cors({ allowMethods: ["GET", "OPTIONS"], origin: "*" }))
  .use(
    bodyLimit({
      maxSize: MAX_BODY_BYTES,
      onError: () => {
        throw new ApiError(413, "payload_too_large", "Request body too large");
      },
    }),
  )
  .route("/v1/species", species)
  .route("/v1/ratings", ratings)
  .notFound((c) => errorResponse(c, 404, "not_found", "Not found"))
  .onError(handleError);

export type AppType = typeof app;
