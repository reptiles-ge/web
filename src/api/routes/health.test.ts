import { describe, expect, it } from "vitest";

import type { ApiDatabase } from "../db/database";

import { app } from "../app";
import { NO_STORE } from "../lib/cache";
import { createTestDatabase } from "../testing/sqliteDatabase";

const brokenDatabase = {
  prepare: () => ({
    first: () => Promise.reject(new Error("D1 down")),
  }),
} as unknown as ApiDatabase;

describe("GET /health", () => {
  it.each(["/health", "/v1/health"])(
    "answers ok at %s when the database responds",
    async (path) => {
      const { db } = createTestDatabase();
      const response = await app.request(path, {}, { DB: db });
      expect(response.status).toBe(200);
      expect(response.headers.get("Cache-Control")).toBe(NO_STORE);
      expect(await response.json()).toStrictEqual({
        data: { database: "ok", status: "ok" },
      });
    },
  );

  it("needs no API key while keys are enforced", async () => {
    const { db } = createTestDatabase();
    const response = await app.request(
      "/v1/health",
      {},
      { API_KEY_MODE: "enforce", DB: db },
    );
    expect(response.status).toBe(200);
  });

  it("answers 503 with the API still ok when the database fails", async () => {
    const response = await app.request("/health", {}, { DB: brokenDatabase });
    expect(response.status).toBe(503);
    expect(response.headers.get("Cache-Control")).toBe(NO_STORE);
    expect(await response.json()).toStrictEqual({
      data: { database: "error", status: "ok" },
    });
  });

  it("answers 404 below it", async () => {
    const { db } = createTestDatabase();
    const response = await app.request("/health/nope", {}, { DB: db });
    expect(response.status).toBe(404);
  });
});
