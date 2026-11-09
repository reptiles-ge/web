import type { DatabaseSync } from "node:sqlite";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiBindings } from "../env";

import { adminSessionHeaders } from "../testing/adminSession";
import { type ErrorBody, requestJson } from "../testing/request";
import { createTestDatabase } from "../testing/sqliteDatabase";

const TOKEN = "sources-token";

type SourceList = {
  data: Array<{
    channel: string;
    lastDay: string;
    path: string;
    referrer: null | string;
    source: string;
    visits: number;
  }>;
  sources: Array<{ channel: string; source: string; visits: number }>;
  total: number;
  visits: number;
};

let sqlite: DatabaseSync;
let env: ApiBindings;

function sources(
  query = "",
  headers: Record<string, string> = { Authorization: `Bearer ${TOKEN}` },
) {
  return requestJson<ErrorBody & SourceList>(
    `/v1/admin/traffic-sources${query}`,
    env,
    { headers },
  );
}

function visit(
  day: string,
  source: string,
  referrer: string,
  path: string,
  locale: string,
  visits: number,
) {
  sqlite
    .prepare(
      "INSERT INTO traffic_sources (day, source, referrer, path, locale, visits) VALUES (?, ?, ?, ?, ?, ?)",
    )
    .run(day, source, referrer, path, locale, visits);
}

beforeEach(() => {
  const database = createTestDatabase();
  sqlite = database.sqlite;
  env = { API_WRITE_TOKEN: TOKEN, DB: database.db };
  vi.useFakeTimers({ now: new Date("2026-10-24T10:00:00Z"), toFake: ["Date"] });
  visit("2026-10-24", "google", "google.com", "/", "ka", 20);
  visit("2026-10-02", "google", "google.com", "/", "en", 5);
  visit("2026-10-23", "google", "google.ge", "/snakes", "ka", 4);
  visit("2026-10-24", "facebook", "l.facebook.com", "/", "ka", 6);
  visit("2026-09-10", "direct", "", "/about", "ru", 3);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("GET /v1/admin/traffic-sources", () => {
  it("lists source, referrer and landing page with a per-source summary", async () => {
    const { body, response } = await sources();
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(body).toMatchObject({ total: 4, visits: 38 });
    expect(body.sources).toEqual([
      { channel: "search", source: "google", visits: 29 },
      { channel: "social", source: "facebook", visits: 6 },
      { channel: "direct", source: "direct", visits: 3 },
    ]);
    expect(body.data[0]).toEqual({
      channel: "search",
      lastDay: "2026-10-24",
      path: "/",
      referrer: "google.com",
      source: "google",
      visits: 25,
    });
    expect(body.data.at(-1)).toMatchObject({
      referrer: null,
      source: "direct",
    });
  });

  it("filters by period, language, source and search", async () => {
    const today = await sources("?days=1");
    expect(today.body.visits).toBe(26);
    const english = await sources("?lang=en");
    expect(english.body.sources).toEqual([
      { channel: "search", source: "google", visits: 5 },
    ]);
    const google = await sources("?source=google");
    expect(google.body).toMatchObject({ total: 2, visits: 38 });
    const search = await sources("?q=snakes");
    expect(search.body.data.map((row) => row.referrer)).toEqual(["google.ge"]);
  });

  it("accepts an admin session and refuses bad input or no sign-in", async () => {
    const session = await sources("", await adminSessionHeaders(sqlite));
    expect(session.response.status).toBe(200);
    for (const query of ["?source=myspace", "?days=90", "?lang=xx"]) {
      const { body, response } = await sources(query);
      expect(response.status, query).toBe(400);
      expect(body.error.code).toBe("invalid_request");
    }
    const { response } = await sources("", {});
    expect(response.status).toBe(401);
  });
});
