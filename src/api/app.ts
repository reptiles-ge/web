import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { etag } from "hono/etag";
import { secureHeaders } from "hono/secure-headers";

import type { ApiEnv } from "./env";

import { ApiError, errorResponse, handleError } from "./lib/errors";
import { allowedOrigins } from "./lib/origins";
import { noindex } from "./middleware/noindex";
import { adminAuthors } from "./routes/adminAuthors";
import { adminNews } from "./routes/adminNews";
import { adminRatings } from "./routes/adminRatings";
import { adminSpecies } from "./routes/adminSpecies";
import { adminUsers } from "./routes/adminUsers";
import { auth } from "./routes/auth";
import { authors } from "./routes/authors";
import { catalog } from "./routes/catalog";
import { docs } from "./routes/docs";
import { news } from "./routes/news";
import { ratings } from "./routes/ratings";
import { species } from "./routes/species";
import { LOCALE_HEADER } from "./schemas/common";

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
      allowHeaders: ["Content-Type", LOCALE_HEADER],
      allowMethods: ["GET", "POST", "OPTIONS"],
      credentials: true,
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
  .route("/v1/authors", authors)
  .route("/v1/news", news)
  .route("/v1/ratings", ratings)
  .route("/v1/auth", auth)
  .route("/v1/admin/authors", adminAuthors)
  .route("/v1/admin/news", adminNews)
  .route("/v1/admin/ratings", adminRatings)
  .route("/v1/admin/species", adminSpecies)
  .route("/v1/admin/users", adminUsers)
  .route("/v1/docs", docs)
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
