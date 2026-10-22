import type { DatabaseSync } from "node:sqlite";

import { beforeEach, describe, expect, it } from "vitest";

import type { ApiBindings } from "../env";

import { app } from "../app";
import { type ErrorBody, jsonInit, requestJson } from "../testing/request";
import { createTestDatabase } from "../testing/sqliteDatabase";

const TOKEN = "test-token";
const auth = { headers: { Authorization: `Bearer ${TOKEN}` } };

let sqlite: DatabaseSync;
let env: ApiBindings;

function post(body: unknown, token: null | string = TOKEN) {
  return app.request("/v1/ratings", jsonInit(body, token ?? undefined), env);
}

function rows() {
  return sqlite
    .prepare(
      "SELECT rating, path, locale, feedback, country FROM site_ratings ORDER BY id",
    )
    .all();
}

beforeEach(() => {
  const database = createTestDatabase();
  sqlite = database.sqlite;
  env = { API_WRITE_TOKEN: TOKEN, DB: database.db };
});

describe("POST /v1/ratings", () => {
  it("stores a valid rating", async () => {
    const response = await post({
      country: "GE",
      locale: "ka",
      path: "/gvelebi/giurza",
      rating: 5,
    });
    expect(response.status).toBe(201);
    expect(rows()).toEqual([
      {
        country: "GE",
        feedback: null,
        locale: "ka",
        path: "/gvelebi/giurza",
        rating: 5,
      },
    ]);
  });

  it("cleans feedback and drops a malformed country", async () => {
    await post({
      country: "georgia",
      feedback: "  ფოტო აკლია\r\n ",
      locale: "en",
      path: "/en/snakes",
      rating: 3,
    });
    expect(rows()).toEqual([
      {
        country: null,
        feedback: "ფოტო აკლია",
        locale: "en",
        path: "/en/snakes",
        rating: 3,
      },
    ]);
  });

  it("rejects invalid ratings without storing them", async () => {
    for (const body of [
      null,
      { locale: "ka", path: "/", rating: 6 },
      { locale: "ka", path: "/", rating: 4.5 },
      { locale: "de", path: "/", rating: 5 },
      { locale: "ka", path: "//evil.example", rating: 5 },
      { locale: "ka", path: `/${"a".repeat(300)}`, rating: 5 },
      { locale: "ka", path: "/", rating: 2 },
    ]) {
      const response = await post(body);
      expect(response.status).toBe(400);
      expect(((await response.json()) as ErrorBody).error.code).toBe(
        "invalid_request",
      );
    }
    expect(rows()).toEqual([]);
  });

  it("requires the write token", async () => {
    const body = { locale: "ka", path: "/", rating: 5 };
    for (const token of [null, "wrong"]) {
      const response = await post(body, token);
      expect(response.status).toBe(401);
      expect(((await response.json()) as ErrorBody).error.code).toBe(
        "unauthorized",
      );
    }
    env.API_WRITE_TOKEN = undefined;
    expect((await post(body, "")).status).toBe(401);
    expect(rows()).toEqual([]);
  });

  it("rejects a body over the size limit", async () => {
    const response = await post({
      feedback: "ა".repeat(20_000),
      locale: "ka",
      path: "/",
      rating: 2,
    });
    expect(response.status).toBe(413);
    expect(((await response.json()) as ErrorBody).error.code).toBe(
      "payload_too_large",
    );
  });
});

describe("GET /v1/ratings/summary", () => {
  it("summarises recent ratings only", async () => {
    await post({ locale: "ka", path: "/", rating: 5 });
    await post({ locale: "ka", path: "/", rating: 5 });
    await post({ feedback: "ნელია", locale: "ka", path: "/", rating: 2 });
    sqlite
      .prepare(
        "INSERT INTO site_ratings (rating, path, locale, created_at) VALUES (1, '/', 'ka', '2020-01-01T00:00:00.000Z')",
      )
      .run();
    const { body, response } = await requestJson<{
      data: {
        average: number;
        byRating: Record<string, number>;
        count: number;
      };
    }>("/v1/ratings/summary?days=30", env, auth);
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(body.data).toMatchObject({
      average: 4,
      byRating: { 1: 0, 2: 1, 3: 0, 4: 0, 5: 2 },
      count: 3,
    });
  });

  it("returns an empty summary and rejects a bad range", async () => {
    const empty = await requestJson<{ data: { average: null; count: number } }>(
      "/v1/ratings/summary",
      env,
      auth,
    );
    expect(empty.body.data).toMatchObject({ average: null, count: 0 });
    for (const days of ["0", "366", "x"]) {
      const response = await app.request(
        `/v1/ratings/summary?days=${days}`,
        auth,
        env,
      );
      expect(response.status).toBe(400);
    }
    expect((await app.request("/v1/ratings/summary", {}, env)).status).toBe(
      401,
    );
  });
});
