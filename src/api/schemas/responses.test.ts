import type { z } from "zod";

import { describe, expect, it } from "vitest";

import { locales } from "@/i18n/locales";

import { app } from "../app";
import { buildOpenApiDocument } from "../lib/openapi";
import { RESPONSE_EXAMPLES } from "../lib/openapiExamples";
import {
  compiledFieldRecords,
  createFieldRecordsTestDatabase,
} from "../testing/sqliteDatabase";
import {
  catalogCardResponse,
  catalogFullResponse,
  catalogPhotosResponse,
  catalogQuizResponse,
  errorResponse,
  fieldRecordsResponse,
  speciesListResponse,
  speciesResponse,
} from "./responses";

const env = { DB: createFieldRecordsTestDatabase().db };

function expectValid(schema: z.ZodType, value: unknown, label: string) {
  const result = schema.safeParse(value);
  expect(result.success ? [] : result.error.issues.slice(0, 5), label).toEqual(
    [],
  );
}

async function getJson(url: string, locale?: string) {
  const headers: Record<string, string> = locale ? { "X-Locale": locale } : {};
  const response = await app.request(url, { headers }, env);
  return { body: (await response.json()) as unknown, response };
}

describe("documented response schemas", () => {
  it("describe every list, profile and catalog response in every locale", async () => {
    for (const locale of locales) {
      const { body: list } = await getJson("/v1/species", locale);
      expectValid(speciesListResponse, list, `species ${locale}`);
      const { data } = list as { data: Array<{ id: string; slug: string }> };
      expect(data.length).toBeGreaterThan(100);
      for (const { id, slug } of data) {
        const { body } = await getJson(`/v1/species/${slug}`, locale);
        expectValid(speciesResponse, body, `species/${id} ${locale}`);
      }
      const card = await getJson("/v1/catalog", locale);
      expectValid(catalogCardResponse, card.body, `catalog card ${locale}`);
      const full = await getJson("/v1/catalog?view=full", locale);
      expectValid(catalogFullResponse, full.body, `catalog full ${locale}`);
      const photos = await getJson("/v1/catalog?view=photos", locale);
      expectValid(
        catalogPhotosResponse,
        photos.body,
        `catalog photos ${locale}`,
      );
      const quiz = await getJson("/v1/catalog?view=quiz", locale);
      expectValid(catalogQuizResponse, quiz.body, `catalog quiz ${locale}`);
    }
  });

  it("describe the field records of every species that has them", async () => {
    const ids = Object.keys(compiledFieldRecords());
    expect(ids.length).toBeGreaterThan(0);
    for (const id of ids) {
      const { body } = await getJson(`/v1/species/${id}/field-records`, "en");
      expectValid(fieldRecordsResponse, body, `field-records ${id}`);
    }
  });

  it("describe the error responses exactly", async () => {
    const missing = await getJson("/v1/species/no-such-species");
    expect(missing.response.status).toBe(404);
    expect(missing.body).toEqual(RESPONSE_EXAMPLES.error);
    const invalid = await getJson("/v1/species", "xx");
    expect(invalid.response.status).toBe(400);
    expect(invalid.body).toEqual(RESPONSE_EXAMPLES.invalidRequest);
    expectValid(errorResponse, invalid.body, "invalid request");
  });

  it("only show examples that match the schemas", () => {
    expectValid(speciesListResponse, RESPONSE_EXAMPLES.speciesList, "list");
    expectValid(speciesResponse, RESPONSE_EXAMPLES.species, "species");
    expectValid(
      fieldRecordsResponse,
      RESPONSE_EXAMPLES.fieldRecords,
      "field records",
    );
    expectValid(catalogCardResponse, RESPONSE_EXAMPLES.catalogCard, "card");
    expectValid(catalogFullResponse, RESPONSE_EXAMPLES.catalogFull, "full");
    expectValid(catalogQuizResponse, RESPONSE_EXAMPLES.catalogQuiz, "quiz");
    expectValid(
      catalogPhotosResponse,
      RESPONSE_EXAMPLES.catalogPhotos,
      "photos",
    );
    expectValid(errorResponse, RESPONSE_EXAMPLES.error, "error");
  });

  it("resolve every $ref in the OpenAPI document", () => {
    const document = buildOpenApiDocument();
    const refs = [...JSON.stringify(document).matchAll(/"\$ref":"([^"]+)"/g)];
    expect(refs.length).toBeGreaterThan(0);
    for (const [, ref] of refs) {
      const target = ref!
        .replace(/^#\//, "")
        .split("/")
        .reduce<unknown>(
          (node, key) => (node as Record<string, unknown> | undefined)?.[key],
          document,
        );
      expect(target, ref).toBeDefined();
    }
  });

  it("answers a matching If-None-Match with 304 and the ETag", async () => {
    const first = await app.request(
      "/v1/species",
      { headers: { "X-Locale": "en" } },
      env,
    );
    const tag = first.headers.get("ETag") ?? "";
    const second = await app.request(
      "/v1/species",
      { headers: { "If-None-Match": tag, "X-Locale": "en" } },
      env,
    );
    expect(second.status).toBe(304);
    expect(second.headers.get("ETag")).toBe(tag);
  });
});
