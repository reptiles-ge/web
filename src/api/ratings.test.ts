import { readFileSync } from "node:fs";
import path from "node:path";
import { DatabaseSync, type SQLInputValue } from "node:sqlite";
import { beforeEach, describe, expect, it } from "vitest";

import type { ApiDatabase } from "./ratings";

import app from "./index";

const MIGRATION = readFileSync(
  path.resolve(
    import.meta.dirname,
    "../../migrations/api/0001_site_ratings.sql",
  ),
  "utf8",
);

const TOKEN = "test-token";

let sqlite: DatabaseSync;
let env: { API_WRITE_TOKEN?: string; DB: ApiDatabase };

function apiDatabase(db: DatabaseSync): ApiDatabase {
  const statement = (query: string, values: SQLInputValue[] = []) => ({
    all: async <T>() => ({ results: db.prepare(query).all(...values) as T[] }),
    bind: (...next: unknown[]) => statement(query, next as SQLInputValue[]),
    first: async <T>() =>
      (db.prepare(query).get(...values) ?? null) as null | T,
    run: async () => db.prepare(query).run(...values),
  });
  return { prepare: (query) => statement(query) };
}

function post(body: unknown, token: null | string = TOKEN) {
  return app.request(
    "/v1/ratings",
    {
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      method: "POST",
    },
    env,
  );
}

function rows() {
  return sqlite
    .prepare("SELECT rating, path, locale, feedback, country FROM site_ratings")
    .all();
}

beforeEach(() => {
  sqlite = new DatabaseSync(":memory:");
  sqlite.exec(MIGRATION);
  env = { API_WRITE_TOKEN: TOKEN, DB: apiDatabase(sqlite) };
});

describe("ratings api", () => {
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

  it("keeps cleaned feedback and drops a malformed country", async () => {
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
      expect((await post(body)).status).toBe(400);
    }
    expect(rows()).toEqual([]);
  });

  it("requires the write token", async () => {
    const body = { locale: "ka", path: "/", rating: 5 };
    expect((await post(body, null)).status).toBe(401);
    expect((await post(body, "wrong")).status).toBe(401);
    env.API_WRITE_TOKEN = undefined;
    expect((await post(body, "")).status).toBe(401);
    expect(rows()).toEqual([]);
  });

  it("summarises recent ratings", async () => {
    await post({ locale: "ka", path: "/", rating: 5 });
    await post({ locale: "ka", path: "/", rating: 5 });
    await post({ feedback: "ნელია", locale: "ka", path: "/", rating: 2 });
    sqlite
      .prepare(
        "INSERT INTO site_ratings (rating, path, locale, created_at) VALUES (1, '/', 'ka', '2020-01-01T00:00:00.000Z')",
      )
      .run();
    const response = await app.request(
      "/v1/ratings/summary?days=30",
      { headers: { Authorization: `Bearer ${TOKEN}` } },
      env,
    );
    const body = (await response.json()) as {
      data: {
        average: number;
        byRating: Record<string, number>;
        count: number;
      };
    };
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(body.data.count).toBe(3);
    expect(body.data.average).toBe(4);
    expect(body.data.byRating).toEqual({ 1: 0, 2: 1, 3: 0, 4: 0, 5: 2 });
  });

  it("returns an empty summary and rejects a bad range", async () => {
    const empty = await app.request(
      "/v1/ratings/summary",
      { headers: { Authorization: `Bearer ${TOKEN}` } },
      env,
    );
    expect(
      ((await empty.json()) as { data: { average: null } }).data.average,
    ).toBeNull();
    for (const days of ["0", "366", "x"]) {
      const response = await app.request(
        `/v1/ratings/summary?days=${days}`,
        { headers: { Authorization: `Bearer ${TOKEN}` } },
        env,
      );
      expect(response.status).toBe(400);
    }
    expect((await app.request("/v1/ratings/summary", {}, env)).status).toBe(
      401,
    );
  });

  it("enforces the rules in the database too", () => {
    expect(() =>
      sqlite
        .prepare(
          "INSERT INTO site_ratings (rating, path, locale) VALUES (7, '/', 'ka')",
        )
        .run(),
    ).toThrow();
    expect(() =>
      sqlite
        .prepare(
          "INSERT INTO site_ratings (rating, path, locale) VALUES (5, '/', 'de')",
        )
        .run(),
    ).toThrow();
  });
});
