import type { DatabaseSync } from "node:sqlite";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiBindings, RateLimiter } from "../env";

import { app } from "../app";
import { type ErrorBody, requestJson } from "../testing/request";
import { createTestDatabase } from "../testing/sqliteDatabase";

const TOKEN = "test-token";
const SITE = "https://reptiles.ge";
const SITE_KEY = "site-key";
const auth = { headers: { Authorization: `Bearer ${TOKEN}` } };

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

function post(body: unknown, headers: Record<string, string> = {}) {
  return app.request(
    "/v1/ratings",
    {
      body: JSON.stringify(body),
      headers: {
        "cf-connecting-ip": "203.0.113.5",
        "cf-ipcountry": "GE",
        "Content-Type": "application/json",
        Origin: SITE,
        "X-Api-Key": SITE_KEY,
        ...headers,
      },
      method: "POST",
    },
    env,
    executionCtx,
  );
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
  pending = [];
  env = { API_WRITE_TOKEN: TOKEN, DB: database.db, SITE_API_KEY: SITE_KEY };
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => Response.json({ ok: true })),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("POST /v1/ratings", () => {
  it("stores a rating from the site with the country from Cloudflare", async () => {
    const response = await post({
      locale: "ka",
      pages: 3,
      path: "/gvelebi/giurza",
      rating: 5,
      referrer: "google.com",
      seconds: 95,
    });
    expect(response.status).toBe(201);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe(SITE);
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

  it("sends the Telegram notice in the background when configured", async () => {
    env.TELEGRAM_BOT_TOKEN = "bot";
    env.TELEGRAM_CHAT_ID = "chat";
    await post({
      feedback: "ფოტო აკლია",
      locale: "ka",
      path: "/xvlikebi",
      rating: 3,
    });
    await Promise.all(pending);
    const [url, init] = vi.mocked(fetch).mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url).toBe("https://api.telegram.org/botbot/sendMessage");
    const text = (JSON.parse(String(init.body)) as { text: string }).text;
    expect(text).toContain("★★★☆☆ 3/5");
    expect(text).toContain("https://reptiles.ge/xvlikebi");
    expect(text).toContain("💬 ფოტო აკლია");
  });

  it("logs and still stores the rating when Telegram is not configured", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    expect((await post({ locale: "ka", path: "/", rating: 5 })).status).toBe(
      201,
    );
    await Promise.all(pending);
    expect(log).toHaveBeenCalledWith("Rating Telegram not_configured");
    expect(rows()).toHaveLength(1);
  });

  it("drops a missing or unknown country", async () => {
    await post(
      { locale: "en", path: "/en", rating: 5 },
      { "cf-ipcountry": "XX" },
    );
    await post(
      { locale: "en", path: "/en", rating: 5 },
      { "cf-ipcountry": "T1" },
    );
    expect(rows().map((row) => (row as { country: unknown }).country)).toEqual([
      null,
      null,
    ]);
  });

  it("rejects ratings without the site key", async () => {
    for (const key of ["", "wrong-key", "rpt_client-key"]) {
      const response = await post(
        { locale: "ka", path: "/", rating: 5 },
        { "X-Api-Key": key },
      );
      expect(response.status).toBe(401);
      expect(((await response.json()) as ErrorBody).error.code).toBe(
        "unauthorized",
      );
    }
    delete env.SITE_API_KEY;
    expect((await post({ locale: "ka", path: "/", rating: 5 })).status).toBe(
      401,
    );
    expect(rows()).toEqual([]);
  });

  it("takes the visitor IP and country from the site proxy", async () => {
    env.RATING_VISITOR_LIMITER = limiter(true);
    const response = await post(
      { locale: "ka", path: "/", rating: 5 },
      {
        "cf-connecting-ip": "2a06:98c0:3600::103",
        "cf-ipcountry": "US",
        "X-Visitor-Country": "GE",
        "X-Visitor-Ip": "203.0.113.9",
      },
    );
    expect(response.status).toBe(201);
    expect(env.RATING_VISITOR_LIMITER.limit).toHaveBeenCalledWith({
      key: "203.0.113.9",
    });
    expect(rows().map((row) => (row as { country: unknown }).country)).toEqual([
      "GE",
    ]);
  });

  it("rejects requests from other origins", async () => {
    for (const origin of ["https://evil.example", ""]) {
      const response = await post(
        { locale: "ka", path: "/", rating: 5 },
        { Origin: origin },
      );
      expect(response.status).toBe(403);
      expect(((await response.json()) as ErrorBody).error.code).toBe(
        "forbidden",
      );
    }
    expect(rows()).toEqual([]);
  });

  it("accepts origins listed in ALLOWED_ORIGINS", async () => {
    env.ALLOWED_ORIGINS = "https://reptiles.ge, http://localhost:3333";
    const response = await post(
      { locale: "ka", path: "/", rating: 5 },
      { Origin: "http://localhost:3333" },
    );
    expect(response.status).toBe(201);
  });

  it("applies the visitor and global rate limits", async () => {
    env.RATING_VISITOR_LIMITER = limiter(false);
    const visitor = await post({ locale: "ka", path: "/", rating: 5 });
    expect(visitor.status).toBe(429);
    expect(((await visitor.json()) as ErrorBody).error.code).toBe(
      "rate_limited",
    );
    expect(env.RATING_VISITOR_LIMITER.limit).toHaveBeenCalledWith({
      key: "203.0.113.5",
    });
    env.RATING_VISITOR_LIMITER = limiter(true);
    env.RATING_GLOBAL_LIMITER = limiter(false);
    expect((await post({ locale: "ka", path: "/", rating: 5 })).status).toBe(
      429,
    );
    expect(rows()).toEqual([]);
  });

  it("lets ratings through when a limiter fails", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    env.RATING_VISITOR_LIMITER = {
      limit: async () => {
        throw new Error("down");
      },
    };
    expect((await post({ locale: "ka", path: "/", rating: 5 })).status).toBe(
      201,
    );
    expect(log).toHaveBeenCalled();
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

  it("rejects a body over the size limit", async () => {
    const response = await post({
      feedback: "ა".repeat(20_000),
      locale: "ka",
      path: "/",
      rating: 2,
    });
    expect(response.status).toBe(413);
  });

  it("answers the CORS preflight for the site", async () => {
    const response = await app.request(
      "/v1/ratings",
      {
        headers: {
          "Access-Control-Request-Headers": "content-type",
          "Access-Control-Request-Method": "POST",
          Origin: SITE,
        },
        method: "OPTIONS",
      },
      env,
    );
    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe(SITE);
    expect(response.headers.get("Access-Control-Allow-Methods")).toContain(
      "POST",
    );
  });
});

describe("GET /v1/ratings", () => {
  it("has no read endpoint outside the admin API", async () => {
    await post({ locale: "ka", path: "/", rating: 5 });
    for (const path of ["/v1/ratings", "/v1/ratings/summary"]) {
      const { body, response } = await requestJson<ErrorBody>(path, env, auth);
      expect(response.status).toBe(404);
      expect(body.error.code).toBe("not_found");
    }
  });
});
