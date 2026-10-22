import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { DatabaseSync, type SQLInputValue } from "node:sqlite";

import type { ApiDatabase } from "../db/database";

const MIGRATIONS_DIR = path.resolve(
  import.meta.dirname,
  "../../../migrations/api",
);

export function createTestDatabase() {
  const sqlite = new DatabaseSync(":memory:");
  for (const file of readdirSync(MIGRATIONS_DIR).sort()) {
    sqlite.exec(readFileSync(path.join(MIGRATIONS_DIR, file), "utf8"));
  }
  return { db: toApiDatabase(sqlite), sqlite };
}

function toApiDatabase(sqlite: DatabaseSync): ApiDatabase {
  const statement = (query: string, values: SQLInputValue[] = []) => ({
    all: async <T>() => ({
      results: sqlite.prepare(query).all(...values) as T[],
    }),
    bind: (...next: unknown[]) => statement(query, next as SQLInputValue[]),
    first: async <T>() =>
      (sqlite.prepare(query).get(...values) ?? null) as null | T,
    run: async () => sqlite.prepare(query).run(...values),
  });
  return { prepare: (query) => statement(query) };
}
