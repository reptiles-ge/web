import type { DatabaseSync } from "node:sqlite";

import { hashSessionToken } from "../lib/sessions";

export const ADMIN_SESSION_COOKIE = "__Host-reptiles_admin_session";

export async function adminSessionHeaders(
  sqlite: DatabaseSync,
  role = "admin",
  expiresInMs = 60_000,
) {
  if (role !== "admin") {
    sqlite
      .prepare("INSERT OR IGNORE INTO user_roles (id) VALUES (?)")
      .run(role);
  }
  const userId = crypto.randomUUID();
  sqlite
    .prepare(
      "INSERT INTO users (id, email, name, role_id, password_hash) VALUES (?, ?, ?, ?, 'x')",
    )
    .run(userId, `${userId}@reptiles.ge`, "Admin", role);
  const token = crypto.randomUUID();
  sqlite
    .prepare(
      "INSERT INTO user_sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)",
    )
    .run(
      await hashSessionToken(token),
      userId,
      new Date(Date.now() + expiresInMs).toISOString(),
    );
  return { Cookie: `${ADMIN_SESSION_COOKIE}=${token}` };
}
