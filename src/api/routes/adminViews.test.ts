import type { DatabaseSync } from "node:sqlite";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiBindings } from "../env";

import { adminSessionHeaders } from "../testing/adminSession";
import { type ErrorBody, requestJson } from "../testing/request";
import { createNewsTestDatabase } from "../testing/sqliteDatabase";

const TOKEN = "test-token";

type AdminViewList = {
  data: Array<{
    id: string;
    kind: string;
    lastDay: string;
    name: { en: null | string; ka: null | string };
    views: number;
  }>;
  limit: number;
  page: number;
  pageCount: number;
  total: number;
  views: number;
};

let sqlite: DatabaseSync;
let env: ApiBindings;
let newsId: string;

function addViews(kind: string, id: string, day: string, views: number) {
  sqlite
    .prepare(
      "INSERT INTO content_views (kind, target_id, day, views) VALUES (?, ?, ?, ?)",
    )
    .run(kind, id, day, views);
}

function list(
  query = "",
  headers: Record<string, string> = { Authorization: `Bearer ${TOKEN}` },
) {
  return requestJson<AdminViewList & ErrorBody>(
    `/v1/admin/views${query}`,
    env,
    { headers },
  );
}

function nameOf(table: string, column: string, key: string, id: string) {
  return (
    sqlite
      .prepare(
        `SELECT ${column} AS name FROM ${table} WHERE ${key} = ? AND locale = 'ka'`,
      )
      .get(id) as { name: string }
  ).name;
}

beforeEach(() => {
  const database = createNewsTestDatabase();
  sqlite = database.sqlite;
  env = { API_WRITE_TOKEN: TOKEN, DB: database.db };
  newsId = (
    sqlite
      .prepare(
        "SELECT id FROM news_articles WHERE status = 'published' ORDER BY id LIMIT 1",
      )
      .get() as { id: string }
  ).id;
  vi.useFakeTimers({ now: new Date("2026-10-24T10:00:00Z"), toFake: ["Date"] });
  addViews("species", "macrovipera-lebetina", "2026-09-01", 40);
  addViews("species", "macrovipera-lebetina", "2026-10-24", 2);
  addViews("species", "paralaudakia-caucasia", "2026-10-20", 9);
  addViews("species", "paralaudakia-caucasia", "2026-10-23", 3);
  addViews("news", newsId, "2026-10-24", 5);
  addViews("species", "removed-species", "2026-10-10", 1);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("GET /v1/admin/views", () => {
  it("sums every day per page, most viewed first, with names", async () => {
    const { body, response } = await list();
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(body).toMatchObject({
      limit: 50,
      page: 1,
      pageCount: 1,
      total: 4,
      views: 60,
    });
    expect(body.data).toEqual([
      {
        id: "macrovipera-lebetina",
        kind: "species",
        lastDay: "2026-10-24",
        name: {
          en: expect.any(String),
          ka: nameOf(
            "species_texts",
            "common_name",
            "species_id",
            "macrovipera-lebetina",
          ),
        },
        views: 42,
      },
      expect.objectContaining({ id: "paralaudakia-caucasia", views: 12 }),
      {
        id: newsId,
        kind: "news",
        lastDay: "2026-10-24",
        name: {
          en: expect.any(String),
          ka: nameOf("news_texts", "title", "article_id", newsId),
        },
        views: 5,
      },
      {
        id: "removed-species",
        kind: "species",
        lastDay: "2026-10-10",
        name: { en: null, ka: null },
        views: 1,
      },
    ]);
  });

  it("counts only the chosen period, today included", async () => {
    const today = await list("?days=1");
    expect(today.body.data.map((item) => [item.id, item.views])).toEqual([
      [newsId, 5],
      ["macrovipera-lebetina", 2],
    ]);
    const week = await list("?days=7");
    expect(week.body.data.map((item) => [item.id, item.views])).toEqual([
      ["paralaudakia-caucasia", 12],
      [newsId, 5],
      ["macrovipera-lebetina", 2],
    ]);
    expect(week.body.views).toBe(19);
  });

  it("filters by kind and searches the id and names", async () => {
    const news = await list("?kind=news");
    expect(news.body.data.map((item) => item.id)).toEqual([newsId]);
    const byId = await list("?q=laudakia");
    expect(byId.body.data.map((item) => item.id)).toEqual([
      "paralaudakia-caucasia",
    ]);
    const name = nameOf(
      "species_texts",
      "common_name",
      "species_id",
      "macrovipera-lebetina",
    );
    const byName = await list(`?q=${encodeURIComponent(name)}`);
    expect(byName.body.data.map((item) => item.id)).toContain(
      "macrovipera-lebetina",
    );
    const none = await list("?q=%25_%5C");
    expect(none.body).toMatchObject({ data: [], total: 0, views: 0 });
  });

  it("pages through the list and answers an empty page past the end", async () => {
    const first = await list("?limit=2");
    expect(first.body).toMatchObject({ pageCount: 2, total: 4 });
    const second = await list("?limit=2&page=2");
    expect(
      [...first.body.data, ...second.body.data].map((item) => item.id),
    ).toEqual([
      "macrovipera-lebetina",
      "paralaudakia-caucasia",
      newsId,
      "removed-species",
    ]);
    const past = await list("?page=9");
    expect(past.body).toMatchObject({ data: [], total: 4 });
  });

  it("accepts an admin session", async () => {
    const { response } = await list("", await adminSessionHeaders(sqlite));
    expect(response.status).toBe(200);
  });

  it("refuses an invalid query and a missing sign-in", async () => {
    for (const query of ["?days=3", "?kind=regions", "?limit=101", "?page=0"]) {
      const { response } = await list(query);
      expect(response.status, query).toBe(400);
    }
    const { response } = await list("", {});
    expect(response.status).toBe(401);
  });
});
