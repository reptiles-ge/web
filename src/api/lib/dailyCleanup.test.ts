import { describe, expect, it } from "vitest";

import { createTestDatabase } from "../testing/sqliteDatabase";
import { runDailyCleanup } from "./dailyCleanup";

const USER_ID = "00000000-0000-4000-8000-000000000001";
const VISITOR = "a".repeat(64);

function column(sqlite: ReturnType<typeof seeded>["sqlite"], query: string) {
  return sqlite
    .prepare(query)
    .all()
    .map((row) => Object.values(row)[0]);
}

function seeded() {
  const { db, sqlite } = createTestDatabase();
  sqlite
    .prepare(
      "INSERT INTO users (id, email, name, role_id, password_hash) VALUES (?, ?, ?, 'admin', 'x')",
    )
    .run(USER_ID, "admin@example.com", "Admin");
  const session = sqlite.prepare(
    "INSERT INTO user_sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)",
  );
  session.run("1".repeat(64), USER_ID, "2026-11-20T00:00:00.000Z");
  session.run("2".repeat(64), USER_ID, "2026-12-20T00:00:00.000Z");
  for (const day of ["2026-11-25", "2026-11-26"]) {
    sqlite
      .prepare("INSERT INTO content_view_salts (day, salt) VALUES (?, ?)")
      .run(day, VISITOR);
    sqlite
      .prepare(
        "INSERT INTO page_view_visitors (day, path, visitor) VALUES (?, '/', ?)",
      )
      .run(day, VISITOR);
    sqlite
      .prepare(
        "INSERT INTO traffic_source_visitors (day, source, visitor) VALUES (?, 'google', ?)",
      )
      .run(day, VISITOR);
  }
  return { db, sqlite };
}

describe("runDailyCleanup", () => {
  it("deletes expired sessions and keeps live ones", async () => {
    const { db, sqlite } = seeded();
    await runDailyCleanup(db, new Date("2026-11-26T00:05:00.000Z"));
    expect(column(sqlite, "SELECT token_hash FROM user_sessions")).toEqual([
      "2".repeat(64),
    ]);
  });

  it("forgets view visitors and salts from before the Tbilisi day", async () => {
    const { db, sqlite } = seeded();
    await runDailyCleanup(db, new Date("2026-11-26T00:05:00.000Z"));
    for (const table of [
      "content_view_salts",
      "page_view_visitors",
      "traffic_source_visitors",
    ]) {
      expect(column(sqlite, `SELECT day FROM ${table}`)).toEqual([
        "2026-11-26",
      ]);
    }
  });
});
