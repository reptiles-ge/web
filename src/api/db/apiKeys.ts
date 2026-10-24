import { type PageParams, toPage } from "@/lib/pagination";

import type { ApiDatabase } from "./database";

import { readPage } from "./paging";
import { containsPattern } from "./search";

export type ApiKey = {
  createdAt: string;
  createdBy: string;
  expiresAt: null | string;
  id: string;
  keyPrefix: string;
  lastUsedAt: null | string;
  name: string;
  note: null | string;
  revokedAt: null | string;
};

type ApiKeyRow = {
  created_at: string;
  created_by: string;
  expires_at: null | string;
  id: string;
  key_prefix: string;
  last_used_at: null | string;
  name: string;
  note: null | string;
  revoked_at: null | string;
};

const COLUMNS =
  "id, name, note, key_prefix, created_by, created_at, expires_at, revoked_at, last_used_at";

export async function findActiveApiKey(
  db: ApiDatabase,
  keyHash: string,
  now: string,
) {
  return db
    .prepare(
      "SELECT id, last_used_at FROM api_keys WHERE key_hash = ? AND revoked_at IS NULL AND (expires_at IS NULL OR expires_at > ?)",
    )
    .bind(keyHash, now)
    .first<{ id: string; last_used_at: null | string }>();
}

export async function findApiKey(db: ApiDatabase, id: string) {
  const row = await db
    .prepare(`SELECT ${COLUMNS} FROM api_keys WHERE id = ?`)
    .bind(id)
    .first<ApiKeyRow>();
  return row ? toApiKey(row) : null;
}

export async function insertApiKey(
  db: ApiDatabase,
  key: {
    createdBy: string;
    expiresAt: null | string;
    id: string;
    keyHash: string;
    keyPrefix: string;
    name: string;
    note: null | string;
  },
) {
  await db
    .prepare(
      "INSERT INTO api_keys (id, name, note, key_prefix, key_hash, created_by, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(
      key.id,
      key.name,
      key.note,
      key.keyPrefix,
      key.keyHash,
      key.createdBy,
      key.expiresAt,
    )
    .run();
}

export async function listApiKeys(
  db: ApiDatabase,
  filters: { q?: string },
  page: PageParams,
) {
  const { rows, total } = await readPage<ApiKeyRow>(
    db,
    {
      from: "FROM api_keys WHERE (?1 IS NULL OR name LIKE ?1 ESCAPE '\\' OR note LIKE ?1 ESCAPE '\\' OR key_prefix LIKE ?1 ESCAPE '\\')",
      order: "created_at DESC, id",
      select: COLUMNS,
    },
    [containsPattern(filters.q)],
    page,
  );
  return toPage(rows.map(toApiKey), total, page);
}

export async function revokeApiKey(db: ApiDatabase, id: string, now: string) {
  await db
    .prepare(
      "UPDATE api_keys SET revoked_at = ? WHERE id = ? AND revoked_at IS NULL",
    )
    .bind(now, id)
    .run();
}

export async function touchApiKey(db: ApiDatabase, id: string, now: string) {
  await db
    .prepare("UPDATE api_keys SET last_used_at = ? WHERE id = ?")
    .bind(now, id)
    .run();
}

function toApiKey(row: ApiKeyRow): ApiKey {
  return {
    createdAt: row.created_at,
    createdBy: row.created_by,
    expiresAt: row.expires_at,
    id: row.id,
    keyPrefix: row.key_prefix,
    lastUsedAt: row.last_used_at,
    name: row.name,
    note: row.note,
    revokedAt: row.revoked_at,
  };
}
