import { z } from "zod";

import { catalogQuery } from "../schemas/catalog";
import { localeHeader } from "../schemas/common";
import { speciesListQuery, speciesParam } from "../schemas/species";
import { type ApiErrorCode } from "./errors";

type JsonSchema = Record<string, unknown>;

type Method = "delete" | "get" | "patch" | "post" | "put";

type Operation = {
  description?: string;
  errors: number[];
  header?: z.ZodObject;
  method: Method;
  param?: z.ZodObject;
  path: string;
  query?: z.ZodObject;
  success: { description: string; schema?: JsonSchema; status: number };
  summary: string;
  tag: "Catalog" | "Species";
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
  404: "Not found",
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

const OPERATIONS: Operation[] = [
  {
    description:
      "Every published species, localized. Edge-cached for an hour; filter by animal group.",
    errors: [400],
    header: localeHeader,
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
    header: localeHeader,
    method: "get",
    param: speciesParam,
    path: "/v1/species/{idOrSlug}",
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
      "Every published species in catalog order. `card` is the light view for lists; `full` carries every text and is several MB. Pagination is optional: pass `limit`, then the previous page's `nextCursor` as `cursor`. Without `limit` the whole catalog comes back.",
    errors: [400],
    header: localeHeader,
    method: "get",
    path: "/v1/catalog",
    query: catalogQuery,
    success: {
      description: "Localized catalog",
      schema: listEnvelope({
        locale,
        nextCursor: {
          description: "Cursor for the next page; null on the last page.",
          type: ["string", "null"],
        },
        view: { enum: ["card", "full"], type: "string" },
      }),
      status: 200,
    },
    summary: "Get the species catalog",
    tag: "Catalog",
  },
];

export const UNDOCUMENTED_PATH_PREFIXES = ["/v1/admin/", "/v1/ratings"];

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
    },
    info: {
      description:
        "Public read API of the reptiles.ge atlas of animals of Georgia. Every error has the shape `{ error: { code, message, details? } }`.",
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
    ],
  };
}

function operation(entry: Operation) {
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
      ...(entry.header ? parameters(entry.header, "header") : []),
      ...(entry.query ? parameters(entry.query, "query") : []),
    ],
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
    summary: entry.summary,
    tags: [entry.tag],
  };
}

function parameters(
  schema: z.ZodObject,
  location: "header" | "path" | "query",
) {
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
