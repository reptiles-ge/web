import type { DatabaseSync } from "node:sqlite";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiBindings } from "../env";

import { adminSessionHeaders } from "../testing/adminSession";
import { type ErrorBody, requestJson } from "../testing/request";
import { createTestDatabase } from "../testing/sqliteDatabase";

const TOKEN = "sources-token";

type SourceList = {
  countries: Array<{ country: null | string; visits: number }>;
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
  country = "",
) {
  sqlite
    .prepare(
      "INSERT INTO traffic_sources (day, source, referrer, path, locale, country, visits) VALUES (?, ?, ?, ?, ?, ?, ?)",
    )
    .run(day, source, referrer, path, locale, country, visits);
}

beforeEach(() => {
  const database = createTestDatabase();
  sqlite = database.sqlite;
  env = { API_WRITE_TOKEN: TOKEN, DB: database.db };
  vi.useFakeTimers({ now: new Date("2026-10-24T10:00:00Z"), toFake: ["Date"] });
  visit("2026-10-24", "google", "google.com", "/", "ka", 20, "GE");
  visit("2026-10-02", "google", "google.com", "/", "en", 5, "GE");
  visit("2026-10-23", "google", "google.ge", "/snakes", "ka", 4);
  visit("2026-10-24", "facebook", "l.facebook.com", "/", "ka", 6, "GE");
  visit("2026-09-10", "direct", "", "/about", "ru", 3, "DE");
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
    expect(body.countries).toEqual([
      { country: "GE", visits: 31 },
      { country: null, visits: 4 },
      { country: "DE", visits: 3 },
    ]);
    expect(body.data[0]).toEqual({
      channel: "search",
      country: "GE",
      lastDay: "2026-10-24",
      path: "/",
      referrer: "google.com",
      source: "google",
      visits: 25,
    });
    expect(body.data.at(-1)).toMatchObject({
      country: "DE",
      referrer: null,
      source: "direct",
    });
  });

  it("filters by date range, language, source and search", async () => {
    const today = await sources("?from=2026-10-24&to=2026-10-24");
    expect(today.body.visits).toBe(26);
    const october = await sources("?from=2026-10-01&to=2026-10-23");
    expect(october.body.sources).toEqual([
      { channel: "search", source: "google", visits: 9 },
    ]);
    const english = await sources("?lang=en");
    expect(english.body.sources).toEqual([
      { channel: "search", source: "google", visits: 5 },
    ]);
    const google = await sources("?source=google");
    expect(google.body).toMatchObject({ total: 2, visits: 38 });
    const georgia = await sources("?country=GE");
    expect(georgia.body).toMatchObject({ total: 2, visits: 31 });
    expect(georgia.body.countries).toEqual([
      { country: "GE", visits: 31 },
      { country: null, visits: 4 },
      { country: "DE", visits: 3 },
    ]);
    const search = await sources("?q=snakes");
    expect(search.body.data.map((row) => row.referrer)).toEqual(["google.ge"]);
  });

  it("accepts an admin session and refuses bad input or no sign-in", async () => {
    const session = await sources("", await adminSessionHeaders(sqlite));
    expect(session.response.status).toBe(200);
    for (const query of [
      "?source=myspace",
      "?to=2026-13-01",
      "?from=2026-10-24&to=2026-10-02",
      "?lang=xx",
      "?country=ge",
      "?country=GEO",
    ]) {
      const { body, response } = await sources(query);
      expect(response.status, query).toBe(400);
      expect(body.error.code).toBe("invalid_request");
    }
    const { response } = await sources("", {});
    expect(response.status).toBe(401);
  });
});
