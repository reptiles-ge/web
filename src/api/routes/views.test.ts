import type { DatabaseSync } from "node:sqlite";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiBindings, RateLimiter } from "../env";
import type { ErrorBody } from "../testing/request";

import { app } from "../app";
import { createNewsTestDatabase } from "../testing/sqliteDatabase";

const SITE = "https://reptiles.ge";
const BROWSER =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36";

let sqlite: DatabaseSync;
let env: ApiBindings;
let pending: Array<Promise<unknown>>;

const executionCtx = {
  passThroughOnException: () => {},
  props: {},
  waitUntil: (promise: Promise<unknown>) => {
    pending.push(promise);
  },
};

function limiter(success: boolean): RateLimiter {
  return { limit: vi.fn(async () => ({ success })) };
}

async function post(body: unknown, headers: Record<string, string> = {}) {
  const response = await app.request(
    "/v1/views",
    {
      body: JSON.stringify(body),
      headers: {
        "Accept-Language": "ka-GE,ka;q=0.9",
        "cf-connecting-ip": "203.0.113.5",
        "Content-Type": "application/json",
        Origin: SITE,
        "User-Agent": BROWSER,
        ...headers,
      },
      method: "POST",
    },
    env,
    executionCtx,
  );
  await Promise.all(pending);
  return response;
}

function publishedNewsId() {
  const row = sqlite
    .prepare(
      "SELECT id FROM news_articles WHERE status = 'published' ORDER BY id LIMIT 1",
    )
    .get() as { id: string };
  return row.id;
}

function views() {
  return sqlite
    .prepare(
      "SELECT kind, target_id, views FROM content_views ORDER BY kind, target_id",
    )
    .all();
}

beforeEach(() => {
  const database = createNewsTestDatabase();
  sqlite = database.sqlite;
  pending = [];
  env = { DB: database.db };
  vi.useFakeTimers({ now: new Date("2026-10-24T10:00:00Z"), toFake: ["Date"] });
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("POST /v1/views", () => {
  it("counts a species view once per visitor per day", async () => {
    const first = await post({ id: "macrovipera-lebetina", kind: "species" });
    await post({ id: "macrovipera-lebetina", kind: "species" });

    expect(first.status).toBe(202);
    expect(views()).toEqual([
      { kind: "species", target_id: "macrovipera-lebetina", views: 1 },
    ]);
  });

  it("counts another visitor and the next day again", async () => {
    await post({ id: "macrovipera-lebetina", kind: "species" });
    await post(
      { id: "macrovipera-lebetina", kind: "species" },
      { "cf-connecting-ip": "203.0.113.6" },
    );
    vi.setSystemTime(new Date("2026-10-25T08:00:00Z"));
    await post({ id: "macrovipera-lebetina", kind: "species" });

    expect(
      sqlite.prepare("SELECT day, views FROM content_views ORDER BY day").all(),
    ).toEqual([
      { day: "2026-10-24", views: 2 },
      { day: "2026-10-25", views: 1 },
    ]);
  });

  it("forgets earlier visitors and salts on a new day", async () => {
    await post({ id: "macrovipera-lebetina", kind: "species" });
    vi.setSystemTime(new Date("2026-10-25T08:00:00Z"));
    await post({ id: "paralaudakia-caucasia", kind: "species" });

    expect(
      sqlite.prepare("SELECT day FROM content_view_visitors").all(),
    ).toEqual([{ day: "2026-10-25" }]);
    expect(sqlite.prepare("SELECT day FROM content_view_salts").all()).toEqual([
      { day: "2026-10-25" },
    ]);
  });

  it("never stores the IP address or the user agent", async () => {
    await post({ id: "macrovipera-lebetina", kind: "species" });

    const stored = JSON.stringify(
      sqlite.prepare("SELECT visitor FROM content_view_visitors").all(),
    );
    expect(stored).not.toContain("203.0.113.5");
    expect(stored).not.toContain("Mozilla");
    expect(stored).toMatch(/[0-9a-f]{64}/);
  });

  it("counts a published news article", async () => {
    const id = publishedNewsId();
    await post({ id, kind: "news" });

    expect(views()).toEqual([{ kind: "news", target_id: id, views: 1 }]);
  });

  it("ignores unknown and unpublished targets", async () => {
    sqlite.exec(
      "UPDATE species SET status = 'unpublished' WHERE id = 'macrovipera-lebetina'",
    );
    const response = await post({
      id: "macrovipera-lebetina",
      kind: "species",
    });
    await post({ id: "no-such-article", kind: "news" });

    expect(response.status).toBe(202);
    expect(views()).toEqual([]);
  });

  it("ignores bots and requests without a user agent", async () => {
    await post(
      { id: "macrovipera-lebetina", kind: "species" },
      {
        "User-Agent":
          "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      },
    );
    await post(
      { id: "macrovipera-lebetina", kind: "species" },
      { "User-Agent": "" },
    );

    expect(views()).toEqual([]);
  });

  it("rejects an invalid body", async () => {
    const response = await post({ id: "Not A Slug", kind: "species" });
    const body = (await response.json()) as ErrorBody;

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("invalid_request");
  });

  it("rejects an unknown kind", async () => {
    const response = await post({ id: "giurza", kind: "regions" });

    expect(response.status).toBe(400);
  });

  it("rejects another origin", async () => {
    const response = await post(
      { id: "macrovipera-lebetina", kind: "species" },
      { Origin: "https://example.com" },
    );

    expect(response.status).toBe(403);
    expect(views()).toEqual([]);
  });

  it("answers 429 when the visitor is over the limit", async () => {
    env.VIEW_LIMITER = limiter(false);
    const response = await post({
      id: "macrovipera-lebetina",
      kind: "species",
    });

    expect(response.status).toBe(429);
    expect(views()).toEqual([]);
  });

  it("still answers 202 when counting fails", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    sqlite.exec("DROP TABLE content_views");
    const response = await post({
      id: "macrovipera-lebetina",
      kind: "species",
    });

    expect(response.status).toBe(202);
    expect(error).toHaveBeenCalledWith("View count failed", expect.anything());
  });
});
