import type { DatabaseSync } from "node:sqlite";

import { beforeEach, describe, expect, it } from "vitest";

import type { ApiBindings } from "../env";

import { app } from "../app";
import {
  ADMIN_SESSION_COOKIE,
  adminSessionHeaders,
} from "../testing/adminSession";
import { type ErrorBody, requestJson } from "../testing/request";
import { createTestDatabase } from "../testing/sqliteDatabase";

const TOKEN = "test-token";
const auth = { Authorization: `Bearer ${TOKEN}` };

type ListBody = {
  data: Array<{
    country: null | string;
    createdAt: string;
    feedback: null | string;
    id: number;
    locale: string;
    path: string;
    rating: number;
  }>;
  limit: number;
  page: number;
  pageCount: number;
  summary: {
    average: null | number;
    byRating: Record<string, number>;
    count: number;
  };
  total: number;
};

let sqlite: DatabaseSync;
let env: ApiBindings;

function insert(
  rating: number,
  path: string,
  createdAt: string,
  feedback: null | string = null,
) {
  sqlite
    .prepare(
      "INSERT INTO site_ratings (rating, path, locale, feedback, country, created_at) VALUES (?, ?, 'ka', ?, 'GE', ?)",
    )
    .run(rating, path, feedback, createdAt);
}

function list(query = "", headers: Record<string, string> = auth) {
  return requestJson<ErrorBody & ListBody>(`/v1/admin/ratings${query}`, env, {
    headers,
  });
}

beforeEach(() => {
  const database = createTestDatabase();
  sqlite = database.sqlite;
  env = { API_WRITE_TOKEN: TOKEN, DB: database.db };
  insert(5, "/gvelebi/giurza", "2026-10-20T10:00:00.000Z");
  insert(2, "/xvlikebi", "2026-10-21T10:00:00.000Z", "ფოტო აკლია");
  insert(4, "/kuebi", "2026-10-22T10:00:00.000Z", "კარგია");
});

describe("GET /v1/admin/ratings", () => {
  it("lists ratings newest first with an all-time summary", async () => {
    const { body, response } = await list();
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(body.data.map(({ path }) => path)).toEqual([
      "/kuebi",
      "/xvlikebi",
      "/gvelebi/giurza",
    ]);
    expect(body.data[1]).toEqual({
      country: "GE",
      createdAt: "2026-10-21T10:00:00.000Z",
      feedback: "ფოტო აკლია",
      id: 2,
      locale: "ka",
      path: "/xvlikebi",
      rating: 2,
    });
    expect(body).toMatchObject({ limit: 50, page: 1, pageCount: 1, total: 3 });
    expect(body.summary).toEqual({
      average: 3.67,
      byRating: { 1: 0, 2: 1, 3: 0, 4: 1, 5: 1 },
      count: 3,
    });
  });

  it("pages with limit and page", async () => {
    const first = await list("?limit=2");
    expect(first.body.data.map(({ id }) => id)).toEqual([3, 2]);
    expect(first.body).toMatchObject({ page: 1, pageCount: 2, total: 3 });
    const second = await list("?limit=2&page=2");
    expect(second.body.data.map(({ id }) => id)).toEqual([1]);
    const past = await list("?limit=2&page=3");
    expect(past.body).toMatchObject({ data: [], total: 3 });
  });

  it("filters by rating and counts the matches", async () => {
    const { body } = await list("?rating=2");
    expect(body.data.map(({ id }) => id)).toEqual([2]);
    expect(body.total).toBe(1);
    expect(body.summary.count).toBe(3);
  });

  it("searches feedback and page paths", async () => {
    const byFeedback = await list(`?q=${encodeURIComponent("ფოტო")}`);
    expect(byFeedback.body.data.map(({ id }) => id)).toEqual([2]);
    expect(byFeedback.body.total).toBe(1);
    const byPath = await list("?q=kuebi&rating=4");
    expect(byPath.body.data.map(({ id }) => id)).toEqual([3]);
    const none = await list("?q=kuebi&rating=5");
    expect(none.body).toMatchObject({ data: [], total: 0 });
  });

  it("answers an empty list when there are no ratings", async () => {
    sqlite.exec("DELETE FROM site_ratings");
    const { body } = await list();
    expect(body).toMatchObject({
      data: [],
      pageCount: 1,
      summary: { average: null, count: 0 },
      total: 0,
    });
  });

  it.each(["?limit=0", "?limit=101", "?rating=6", "?page=abc"])(
    "rejects %s",
    async (query) => {
      const { body, response } = await list(query);
      expect(response.status).toBe(400);
      expect(body.error.code).toBe("invalid_request");
    },
  );

  it("lets a signed-in admin read the list", async () => {
    const { body, response } = await list(
      "",
      await adminSessionHeaders(sqlite),
    );
    expect(response.status).toBe(200);
    expect(body.total).toBe(3);
  });

  it("refuses everyone else", async () => {
    const cases: Array<[Record<string, string>, number]> = [
      [{}, 401],
      [{ Authorization: "Bearer wrong" }, 401],
      [{ Cookie: `${ADMIN_SESSION_COOKIE}=made-up` }, 401],
      [await adminSessionHeaders(sqlite, "admin", -1000), 401],
      [await adminSessionHeaders(sqlite, "editor"), 403],
    ];
    for (const [headers, status] of cases) {
      const { body, response } = await list("", headers);
      expect(response.status).toBe(status);
      expect(body.data).toBeUndefined();
    }
  });

  it("stays out of the public API document", async () => {
    const response = await app.request("/v1/docs/openapi.json", {}, env);
    const document = (await response.json()) as { paths: object };
    expect(Object.keys(document.paths).join()).not.toContain("/admin/ratings");
  });
});
