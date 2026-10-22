import { z } from "zod";

import { catalogQuery } from "../schemas/catalog";
import { ratingBody, ratingSummaryQuery } from "../schemas/ratings";
import {
  speciesDetailQuery,
  speciesListQuery,
  speciesParam,
} from "../schemas/species";
import {
  draftCreateBody,
  draftDecisionBody,
  draftParam,
  photoCoordinatesBody,
  photoCoverBody,
  photoOrderBody,
  photoRemoveBody,
  speciesIdParam,
  speciesWriteBody,
} from "../schemas/speciesRecord";
import { type ApiErrorCode } from "./errors";

type JsonSchema = Record<string, unknown>;

type Method = "delete" | "get" | "patch" | "post" | "put";

type Operation = {
  auth?: "site" | "token";
  body?: z.ZodType;
  description?: string;
  errors: number[];
  method: Method;
  param?: z.ZodObject;
  path: string;
  query?: z.ZodObject;
  success: { description: string; schema?: JsonSchema; status: number };
  summary: string;
  tag: "Admin" | "Catalog" | "Ratings" | "Species";
};

const ERROR_CODES = [
  "forbidden",
  "internal_error",
  "invalid_request",
  "not_found",
  "payload_too_large",
  "rate_limited",
  "unauthorized",
  "version_conflict",
] as const satisfies readonly ApiErrorCode[];

const ERROR_DESCRIPTIONS: Record<number, string> = {
  400: "Invalid request",
  401: "Missing or wrong bearer token",
  403: "Origin not allowed",
  404: "Not found",
  409: "Version conflict",
  413: "Request body too large",
  429: "Rate limited",
};

const LOCALE_NOTE = "Resolved locale of the response.";

const object = (
  properties: JsonSchema,
  required = Object.keys(properties),
) => ({
  properties,
  required,
  type: "object",
});

const item = { additionalProperties: true, type: "object" };

const envelope = (data: JsonSchema, extra: JsonSchema = {}) =>
  object({ data, ...extra });

const listEnvelope = (extra: JsonSchema = {}) =>
  envelope(
    { items: item, type: "array" },
    { total: { type: "integer" }, ...extra },
  );

const locale = { description: LOCALE_NOTE, type: "string" };

const version = { type: "integer" };

const OPERATIONS: Operation[] = [
  {
    description:
      "Every published species, localized. Edge-cached for an hour; filter by animal group.",
    errors: [400],
    method: "get",
    path: "/v1/species",
    query: speciesListQuery,
    success: {
      description: "Published species",
      schema: listEnvelope({ locale }),
      status: 200,
    },
    summary: "List published species",
    tag: "Species",
  },
  {
    description:
      "Accepts the species id, the Georgian slug, or any alias slug, case-insensitive. Unpublished species answer 404.",
    errors: [400, 404],
    method: "get",
    param: speciesParam,
    path: "/v1/species/{idOrSlug}",
    query: speciesDetailQuery,
    success: {
      description: "Species profile",
      schema: envelope(item, { locale }),
      status: 200,
    },
    summary: "Get a species profile",
    tag: "Species",
  },
  {
    description: "Observation, literature and specimen locations.",
    errors: [400, 404],
    method: "get",
    param: speciesParam,
    path: "/v1/species/{idOrSlug}/field-records",
    success: {
      description: "Field records of the species",
      schema: listEnvelope({ id: { type: "string" } }),
      status: 200,
    },
    summary: "List field records of a species",
    tag: "Species",
  },
  {
    description:
      "Every published species in catalog order. `card` is the light view for lists; `full` carries every text and is several MB.",
    errors: [400],
    method: "get",
    path: "/v1/catalog",
    query: catalogQuery,
    success: {
      description: "Localized catalog",
      schema: listEnvelope({
        locale,
        view: { enum: ["card", "full"], type: "string" },
      }),
      status: 200,
    },
    summary: "Get the species catalog",
    tag: "Catalog",
  },
  {
    auth: "site",
    body: ratingBody,
    description:
      "Posted by the site rating form. Needs an allowed `Origin` and is rate-limited.",
    errors: [400, 403, 413, 429],
    method: "post",
    path: "/v1/ratings",
    success: { description: "Rating stored", status: 201 },
    summary: "Submit a site rating",
    tag: "Ratings",
  },
  {
    auth: "token",
    errors: [400, 401],
    method: "get",
    path: "/v1/ratings/summary",
    query: ratingSummaryQuery,
    success: {
      description: "Rating counts since the start of the window",
      schema: envelope(
        object({
          average: { type: ["number", "null"] },
          byRating: {
            additionalProperties: { type: "integer" },
            type: "object",
          },
          count: { type: "integer" },
          since: { format: "date-time", type: "string" },
        }),
      ),
      status: 200,
    },
    summary: "Summarise ratings",
    tag: "Ratings",
  },
  {
    auth: "token",
    errors: [400, 401, 404],
    method: "get",
    param: speciesIdParam,
    path: "/v1/admin/species/{id}",
    success: {
      description: "Full species record and its version",
      schema: envelope(object({ record: item, version })),
      status: 200,
    },
    summary: "Read a species record",
    tag: "Admin",
  },
  {
    auth: "token",
    body: speciesWriteBody,
    description:
      "Replaces the whole record in one transaction, adds a revision and revalidates the site. A stale `expectedVersion` answers 409.",
    errors: [400, 401, 404, 409, 413],
    method: "put",
    param: speciesIdParam,
    path: "/v1/admin/species/{id}",
    success: {
      description: "Saved",
      schema: envelope(object({ id: { type: "string" }, version })),
      status: 200,
    },
    summary: "Save a species record",
    tag: "Admin",
  },
  {
    auth: "token",
    body: photoCoverBody,
    errors: [400, 401, 404, 409],
    method: "post",
    param: speciesIdParam,
    path: "/v1/admin/species/{id}/photos/cover",
    success: {
      description: "Cover set",
      schema: envelope({ ...item, properties: { version } }),
      status: 200,
    },
    summary: "Set the cover photo",
    tag: "Admin",
  },
  {
    auth: "token",
    body: photoOrderBody,
    errors: [400, 401, 404, 409],
    method: "post",
    param: speciesIdParam,
    path: "/v1/admin/species/{id}/photos/order",
    success: {
      description: "Gallery reordered",
      schema: envelope(object({ version })),
      status: 200,
    },
    summary: "Reorder the gallery",
    tag: "Admin",
  },
  {
    auth: "token",
    body: photoRemoveBody,
    errors: [400, 401, 404, 409],
    method: "post",
    param: speciesIdParam,
    path: "/v1/admin/species/{id}/photos/remove",
    success: {
      description: "Photo removed",
      schema: envelope({ ...item, properties: { version } }),
      status: 200,
    },
    summary: "Remove a photo",
    tag: "Admin",
  },
  {
    auth: "token",
    body: photoCoordinatesBody,
    errors: [400, 401, 404, 409],
    method: "post",
    param: speciesIdParam,
    path: "/v1/admin/species/{id}/photos/coordinates",
    success: {
      description: "Photo coordinates saved",
      schema: envelope(object({ credit: item, version })),
      status: 200,
    },
    summary: "Set photo coordinates",
    tag: "Admin",
  },
  {
    auth: "token",
    body: draftCreateBody,
    description:
      "Every AI change lands here for human approval. `baseVersion` must equal the current version.",
    errors: [400, 401, 404, 409, 413],
    method: "post",
    param: speciesIdParam,
    path: "/v1/admin/species/{id}/drafts",
    success: {
      description: "Draft created",
      schema: envelope(object({ draftId: { type: "integer" } })),
      status: 201,
    },
    summary: "Propose a draft",
    tag: "Admin",
  },
  {
    auth: "token",
    errors: [400, 401],
    method: "get",
    param: speciesIdParam,
    path: "/v1/admin/species/{id}/drafts",
    success: {
      description: "Pending drafts",
      schema: envelope({ items: item, type: "array" }),
      status: 200,
    },
    summary: "List pending drafts",
    tag: "Admin",
  },
  {
    auth: "token",
    body: draftDecisionBody,
    errors: [400, 401, 404, 409],
    method: "post",
    param: draftParam,
    path: "/v1/admin/species/{id}/drafts/{draftId}/approve",
    success: {
      description: "Draft approved and saved",
      schema: envelope(object({ status: { const: "approved" }, version })),
      status: 200,
    },
    summary: "Approve a draft",
    tag: "Admin",
  },
  {
    auth: "token",
    body: draftDecisionBody,
    errors: [400, 401, 404, 409],
    method: "post",
    param: draftParam,
    path: "/v1/admin/species/{id}/drafts/{draftId}/reject",
    success: {
      description: "Draft rejected",
      schema: envelope(object({ status: { const: "rejected" } })),
      status: 200,
    },
    summary: "Reject a draft",
    tag: "Admin",
  },
];

export const documentedOperations = OPERATIONS.map(({ method, path }) => ({
  method,
  path,
}));

export function buildOpenApiDocument() {
  const paths: Record<string, Record<string, unknown>> = {};
  for (const entry of OPERATIONS) {
    paths[entry.path] = {
      ...paths[entry.path],
      [entry.method]: operation(entry),
    };
  }
  const errorSchema = { $ref: "#/components/schemas/Error" };
  return {
    components: {
      responses: Object.fromEntries(
        Object.entries({ ...ERROR_DESCRIPTIONS, 500: "Internal error" }).map(
          ([status, description]) => [
            `Error${status}`,
            {
              content: { "application/json": { schema: errorSchema } },
              description,
            },
          ],
        ),
      ),
      schemas: {
        Error: object({
          error: object(
            {
              code: { enum: ERROR_CODES, type: "string" },
              details: {},
              message: { type: "string" },
            },
            ["code", "message"],
          ),
        }),
      },
      securitySchemes: {
        bearerToken: {
          description: "API_WRITE_TOKEN for admin and internal routes.",
          scheme: "bearer",
          type: "http",
        },
      },
    },
    info: {
      description:
        "Public read API and token-protected admin API of the reptiles.ge atlas of animals of Georgia. Every error has the shape `{ error: { code, message, details? } }`.",
      title: "reptiles.ge API",
      version: "1",
    },
    openapi: "3.1.0",
    paths,
    servers: [
      { description: "This server", url: "/" },
      { description: "Production", url: "https://api.reptiles.ge" },
    ],
    tags: [
      { description: "Published species profiles", name: "Species" },
      { description: "Localized species catalog", name: "Catalog" },
      { description: "Site ratings", name: "Ratings" },
      { description: "Token-only species editing", name: "Admin" },
    ],
  };
}

function operation(entry: Operation) {
  const security = {
    site: [],
    token: [{ bearerToken: [] }],
  };
  const content = (schema: JsonSchema) => ({
    "application/json": { schema },
  });
  return {
    ...(entry.description ? { description: entry.description } : {}),
    operationId: `${entry.method}${entry.path
      .replace(/^\/v1/, "")
      .replace(/[{}]/g, "")
      .split(/[/-]/)
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase() + part.slice(1))
      .join("")}`,
    parameters: [
      ...(entry.param ? parameters(entry.param, "path") : []),
      ...(entry.query ? parameters(entry.query, "query") : []),
    ],
    ...(entry.body
      ? {
          requestBody: {
            content: content(toSchema(entry.body)),
            required: true,
          },
        }
      : {}),
    responses: {
      [entry.success.status]: {
        description: entry.success.description,
        ...(entry.success.schema
          ? { content: content(entry.success.schema) }
          : {}),
      },
      ...Object.fromEntries(
        [...entry.errors, 500].map((status) => [
          status,
          { $ref: `#/components/responses/Error${status}` },
        ]),
      ),
    },
    security: entry.auth ? security[entry.auth] : [],
    summary: entry.summary,
    tags: [entry.tag],
  };
}

function parameters(schema: z.ZodObject, location: "path" | "query") {
  const required = new Set((toSchema(schema).required as string[]) ?? []);
  return Object.entries(schema.shape).map(([name, field]) => ({
    in: location,
    name,
    required: location === "path" || required.has(name),
    schema: toSchema(field as z.ZodType),
  }));
}

function toSchema(schema: z.ZodType): JsonSchema {
  const { $schema: _, ...rest } = z.toJSONSchema(schema, {
    io: "input",
    unrepresentable: "any",
  });
  return rest;
}
