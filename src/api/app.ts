import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { etag } from "hono/etag";
import { secureHeaders } from "hono/secure-headers";

import type { ApiEnv } from "./env";

import { needsApiKey } from "./lib/apiKeys";
import { ApiError, errorResponse, handleError } from "./lib/errors";
import { allowedOrigins } from "./lib/origins";
import { noindex } from "./middleware/noindex";
import { requireApiKey } from "./middleware/requireApiKey";
import { adminApiKeys } from "./routes/adminApiKeys";
import { adminAuthors } from "./routes/adminAuthors";
import { adminDrafts } from "./routes/adminDrafts";
import { adminNews } from "./routes/adminNews";
import { adminRatings } from "./routes/adminRatings";
import { adminSite } from "./routes/adminSite";
import { adminSpecies } from "./routes/adminSpecies";
import { adminUsers } from "./routes/adminUsers";
import { adminViews } from "./routes/adminViews";
import { auth } from "./routes/auth";
import { authors } from "./routes/authors";
import { catalog } from "./routes/catalog";
import { contributors } from "./routes/contributors";
import { docs } from "./routes/docs";
import { images } from "./routes/images";
import { news } from "./routes/news";
import { ratings } from "./routes/ratings";
import { species } from "./routes/species";
import { views } from "./routes/views";
import { LOCALE_HEADER } from "./schemas/common";

const MAX_BODY_BYTES = 16 * 1024;

const MAX_ADMIN_BODY_BYTES = 1024 * 1024;

const MAX_UPLOAD_BODY_BYTES = 64 * 1024 * 1024;

const PHOTO_UPLOAD_PATH = /^\/v1\/admin\/species\/[^/]+\/photos$/;

const bodyLimitDefault = limitBody(MAX_BODY_BYTES);

const adminBodyLimit = limitBody(MAX_ADMIN_BODY_BYTES);

const uploadBodyLimit = limitBody(MAX_UPLOAD_BODY_BYTES);

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
  .use((c, next) => bodyLimitFor(c.req.path)(c, next))
  .use((c, next) => (needsApiKey(c.req.path) ? requireApiKey(c, next) : next()))
  .use(etag())
  .route("/v1/species", species)
  .route("/v1/catalog", catalog)
  .route("/v1/authors", authors)
  .route("/v1/contributors", contributors)
  .route("/v1/news", news)
  .route("/v1/images", images)
  .route("/v1/ratings", ratings)
  .route("/v1/views", views)
  .route("/v1/auth", auth)
  .route("/v1/admin/api-keys", adminApiKeys)
  .route("/v1/admin/authors", adminAuthors)
  .route("/v1/admin/drafts", adminDrafts)
  .route("/v1/admin/news", adminNews)
  .route("/v1/admin/ratings", adminRatings)
  .route("/v1/admin/site", adminSite)
  .route("/v1/admin/species", adminSpecies)
  .route("/v1/admin/users", adminUsers)
  .route("/v1/admin/views", adminViews)
  .route("/v1/docs", docs)
  .notFound((c) => errorResponse(c, 404, "not_found", "Not found"))
  .onError(handleError);

export type AppType = typeof app;

function bodyLimitFor(path: string) {
  if (PHOTO_UPLOAD_PATH.test(path)) return uploadBodyLimit;
  return path.startsWith("/v1/admin/") ? adminBodyLimit : bodyLimitDefault;
}

function limitBody(maxSize: number) {
  return bodyLimit({
    maxSize,
    onError: () => {
      throw new ApiError(413, "payload_too_large", "Request body too large");
    },
  });
}
