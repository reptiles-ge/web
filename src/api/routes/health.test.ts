import { afterEach, describe, expect, it, vi } from "vitest";

import type { ApiDatabase } from "../db/database";

import { app } from "../app";
import { NO_STORE } from "../lib/cache";
import { createTestDatabase } from "../testing/sqliteDatabase";
import { SLOW_PING_MS } from "./health";

const brokenDatabase = {
  prepare: () => ({
    all: () => Promise.reject(new Error("D1 down")),
  }),
} as unknown as ApiDatabase;

const d1Meta = {
  duration: 0.2,
  served_by_primary: true,
  served_by_region: "EEUR",
  timings: { sql_duration_ms: 0.1 },
  total_attempts: 1,
};

const metaDatabase = {
  prepare: () => ({
    all: () => Promise.resolve({ meta: d1Meta, results: [{ ok: 1 }] }),
  }),
} as unknown as ApiDatabase;

// Date.now() returns `start` first, then `start + elapsed` for every later call
function mockElapsed(elapsed: number) {
  const start = Date.UTC(2026, 10, 11, 21, 0, 36);
  vi.spyOn(Date, "now")
    .mockReturnValueOnce(start)
    .mockReturnValue(start + elapsed);
}

afterEach(() => {
  vi.restoreAllMocks();
});

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

  it("answers 503 when the database fails", async () => {
    const response = await app.request("/health", {}, { DB: brokenDatabase });
    expect(response.status).toBe(503);
    expect(response.headers.get("Cache-Control")).toBe(NO_STORE);
    expect(await response.json()).toStrictEqual({
      error: { code: "service_unavailable", message: "Database unavailable" },
    });
  });

  it("logs D1's meta when the ping is slow", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    mockElapsed(SLOW_PING_MS + 13_000);
    const response = await app.request("/health", {}, { DB: metaDatabase });
    expect(response.status).toBe(200);
    expect(warn).toHaveBeenCalledWith("Slow D1 health ping", {
      duration: 0.2,
      elapsedMs: SLOW_PING_MS + 13_000,
      servedByPrimary: true,
      servedByRegion: "EEUR",
      sqlDurationMs: 0.1,
      startedAt: "2026-11-11T21:00:36.000Z",
      totalAttempts: 1,
    });
  });

  it("does not log a fast ping", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    mockElapsed(SLOW_PING_MS - 1);
    const response = await app.request("/health", {}, { DB: metaDatabase });
    expect(response.status).toBe(200);
    expect(warn).not.toHaveBeenCalledWith(
      "Slow D1 health ping",
      expect.anything(),
    );
  });

  it("logs the D1 error message and elapsed time on failure", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    mockElapsed(14_000);
    await app.request("/health", {}, { DB: brokenDatabase });
    expect(error).toHaveBeenCalledWith("Health check failed", {
      elapsedMs: 14_000,
      error: "Error: D1 down",
      startedAt: "2026-11-11T21:00:36.000Z",
    });
  });

  it("answers 404 below it", async () => {
    const { db } = createTestDatabase();
    const response = await app.request("/health/nope", {}, { DB: db });
    expect(response.status).toBe(404);
  });
});
