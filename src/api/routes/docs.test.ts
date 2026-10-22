import { describe, expect, it } from "vitest";

import { app } from "../app";
import {
  documentedOperations,
  UNDOCUMENTED_PATH_PREFIXES,
} from "../lib/openapi";
import { createTestDatabase } from "../testing/sqliteDatabase";

const env = { DB: createTestDatabase().db };

type Document = {
  openapi: string;
  paths: Record<
    string,
    Record<
      string,
      {
        parameters: Array<{ in: string; name: string; required: boolean }>;
      }
    >
  >;
  security: unknown[];
  servers: Array<{ description: string; url: string }>;
};

const appOperations = app.routes
  .filter(
    (route) =>
      route.method !== "ALL" &&
      !route.path.startsWith("/v1/docs") &&
      !UNDOCUMENTED_PATH_PREFIXES.some((prefix) =>
        route.path.startsWith(prefix),
      ),
  )
  .map((route) => ({
    method: route.method.toLowerCase(),
    path: route.path.replace(/:(\w+)/g, "{$1}").replace(/\/$/, ""),
  }));

const key = (entry: { method: string; path: string }) =>
  `${entry.method} ${entry.path}`;

async function loadDocument() {
  const response = await app.request(
    "https://api.reptiles.ge/v1/docs/openapi.json",
    {},
    env,
  );
  return { document: (await response.json()) as Document, response };
}

describe("docs route", () => {
  it("serves the Scalar API reference pointing at the spec", async () => {
    const response = await app.request("/v1/docs", {}, env);
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("text/html");
    expect(response.headers.get("Cache-Control")).toBe(
      "public, max-age=300, s-maxage=3600",
    );
    const html = await response.text();
    expect(html).toContain(
      "https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.74.0/",
    );
    expect(html).toContain("/v1/docs/openapi.json");
  });

  it("serves an OpenAPI 3.1 document that tries requests on its own origin", async () => {
    const { document, response } = await loadDocument();
    expect(response.status).toBe(200);
    expect(document.openapi).toBe("3.1.0");
    expect(document.security).toEqual([]);
    expect(document.servers.map((server) => server.url)).toEqual([
      "/",
      "https://api.reptiles.ge",
    ]);
  });

  it("documents every route the app serves, and nothing else", () => {
    expect(documentedOperations.map(key).sort()).toEqual(
      [...new Set(appOperations.map(key))].sort(),
    );
  });

  it("matches path parameters to the routes", async () => {
    const { document } = await loadDocument();
    for (const [path, methods] of Object.entries(document.paths)) {
      const names = [...path.matchAll(/\{(\w+)\}/g)].map((match) => match[1]);
      for (const entry of Object.values(methods)) {
        const pathParams = entry.parameters.filter((p) => p.in === "path");
        expect(pathParams.map((p) => p.name).sort(), path).toEqual(
          names.sort(),
        );
        expect(pathParams.every((p) => p.required)).toBe(true);
      }
    }
  });

  it("keeps admin and ratings routes out of the public spec", async () => {
    const { document } = await loadDocument();
    const raw = JSON.stringify(document);
    expect(raw).not.toMatch(/\/v1\/(admin|ratings)|bearerToken/);
    expect(
      Object.values(document.paths).flatMap((methods) => Object.keys(methods)),
    ).toEqual(expect.arrayContaining(["get"]));
    expect(
      Object.values(document.paths).every((methods) =>
        Object.keys(methods).every((method) => method === "get"),
      ),
    ).toBe(true);
  });

  it("documents the locale as an optional header", async () => {
    const { document } = await loadDocument();
    const parameters = document.paths["/v1/catalog"]?.get?.parameters ?? [];
    expect(parameters.find((p) => p.name === "X-Locale")).toMatchObject({
      in: "header",
      required: false,
    });
    expect(parameters.find((p) => p.name === "locale")).toBeUndefined();
    expect(parameters.find((p) => p.name === "limit")).toMatchObject({
      in: "query",
      required: false,
    });
  });

  it("answers 404 for unknown docs paths", async () => {
    const response = await app.request("/v1/docs/nothing", {}, env);
    expect(response.status).toBe(404);
  });
});
