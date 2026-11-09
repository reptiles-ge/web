import type { DatabaseSync } from "node:sqlite";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiBindings } from "../env";

import { adminSessionHeaders } from "../testing/adminSession";
import { type ErrorBody, requestJson } from "../testing/request";
import { createTestDatabase } from "../testing/sqliteDatabase";

const TOKEN = "page-views-token";

type PageViewList = {
  data: Array<{ lastDay: string; path: string; views: number }>;
  pageCount: number;
  total: number;
  views: number;
};

let sqlite: DatabaseSync;
let env: ApiBindings;

function pageViews(
  query = "",
  headers: Record<string, string> = { Authorization: `Bearer ${TOKEN}` },
) {
  return requestJson<ErrorBody & PageViewList>(
    `/v1/admin/page-views${query}`,
    env,
    { headers },
  );
}

function seed(path: string, locale: string, day: string, views: number) {
  sqlite
    .prepare(
      "INSERT INTO page_views (path, locale, day, views) VALUES (?, ?, ?, ?)",
    )
    .run(path, locale, day, views);
}

beforeEach(() => {
  const database = createTestDatabase();
  sqlite = database.sqlite;
  env = { API_WRITE_TOKEN: TOKEN, DB: database.db };
  vi.useFakeTimers({ now: new Date("2026-10-24T10:00:00Z"), toFake: ["Date"] });
  seed("/", "ka", "2026-10-24", 30);
  seed("/", "en", "2026-10-01", 12);
  seed("/regions/kakheti", "ka", "2026-10-22", 8);
  seed("/regions/kakheti", "ru", "2026-10-24", 1);
  seed("/about", "tr", "2026-09-01", 2);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("GET /v1/admin/page-views", () => {
  it("sums every locale and day per page, most viewed first", async () => {
    const { body, response } = await pageViews();
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(body).toMatchObject({ pageCount: 1, total: 3, views: 53 });
    expect(body.data).toEqual([
      { lastDay: "2026-10-24", path: "/", views: 42 },
      { lastDay: "2026-10-24", path: "/regions/kakheti", views: 9 },
      { lastDay: "2026-09-01", path: "/about", views: 2 },
    ]);
  });

  it("filters by date range, language and path", async () => {
    const week = await pageViews("?from=2026-10-18&to=2026-10-24");
    expect(week.body.data.map((row) => [row.path, row.views])).toEqual([
      ["/", 30],
      ["/regions/kakheti", 9],
    ]);
    const before = await pageViews("?from=2026-10-01&to=2026-10-22");
    expect(before.body.data.map((row) => [row.path, row.views])).toEqual([
      ["/", 12],
      ["/regions/kakheti", 8],
    ]);
    const until = await pageViews("?to=2026-09-30");
    expect(until.body).toMatchObject({ total: 1, views: 2 });
    const russian = await pageViews("?lang=ru");
    expect(russian.body).toMatchObject({ total: 1, views: 1 });
    const search = await pageViews("?q=kakheti");
    expect(search.body.data.map((row) => row.path)).toEqual([
      "/regions/kakheti",
    ]);
    const paged = await pageViews("?limit=2&page=2");
    expect(paged.body.data.map((row) => row.path)).toEqual(["/about"]);
  });

  it("accepts an admin session and refuses bad input or no sign-in", async () => {
    const session = await pageViews("", await adminSessionHeaders(sqlite));
    expect(session.response.status).toBe(200);
    for (const query of [
      "?from=2026-02-30",
      "?from=2026-10-24&to=2026-10-01",
      "?days=7&to=today",
      "?lang=de",
      "?limit=0",
    ]) {
      const { body, response } = await pageViews(query);
      expect(response.status, query).toBe(400);
      expect(body.error.code).toBe("invalid_request");
    }
    const { response } = await pageViews("", {});
    expect(response.status).toBe(401);
  });
});
