import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { DatabaseSync, type SQLInputValue } from "node:sqlite";

import { speciesImportSource } from "@/lib/speciesImportSource";

import type { ApiDatabase } from "../db/database";

import { buildSpeciesImport } from "../db/speciesImport";

const MIGRATIONS_DIR = path.resolve(
  import.meta.dirname,
  "../../../migrations/api",
);

let speciesStatements: string[] | undefined;

export function createSpeciesTestDatabase() {
  const database = createTestDatabase();
  speciesStatements ??= buildSpeciesImport(speciesImportSource());
  for (const statement of speciesStatements) database.sqlite.exec(statement);
  return database;
}

export function createTestDatabase() {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec("PRAGMA foreign_keys = ON");
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
  return {
    batch: async (statements) => {
      sqlite.exec("BEGIN");
      try {
        const results = [];
        for (const entry of statements) results.push(await entry.all());
        sqlite.exec("COMMIT");
        return results;
      } catch (error) {
        sqlite.exec("ROLLBACK");
        throw error;
      }
    },
    prepare: (query) => statement(query),
  };
}
