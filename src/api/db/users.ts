import type { ApiDatabase } from "./database";

export type SessionUser = {
  email: string;
  id: string;
  name: string;
  role: string;
};

type UserRow = {
  disabled: number;
  email: string;
  id: string;
  name: string;
  password_hash: string;
  role_id: string;
};

export async function createSession(
  db: ApiDatabase,
  session: {
    expiresAt: string;
    now: string;
    tokenHash: string;
    userId: string;
  },
) {
  await db.batch([
    db
      .prepare(
        "DELETE FROM user_sessions WHERE user_id = ? AND expires_at <= ?",
      )
      .bind(session.userId, session.now),
    db
      .prepare(
        "INSERT INTO user_sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)",
      )
      .bind(session.tokenHash, session.userId, session.expiresAt),
  ]);
}

export async function deleteSession(db: ApiDatabase, tokenHash: string) {
  await db
    .prepare("DELETE FROM user_sessions WHERE token_hash = ?")
    .bind(tokenHash)
    .run();
}

export async function findSessionUser(
  db: ApiDatabase,
  tokenHash: string,
  now: string,
) {
  const row = await db
    .prepare(
      "SELECT u.id AS id, u.email AS email, u.name AS name, u.role_id AS role_id FROM user_sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ? AND u.disabled = 0",
    )
    .bind(tokenHash, now)
    .first<Pick<UserRow, "email" | "id" | "name" | "role_id">>();
  return row ? toSessionUser(row) : null;
}

export async function findUserByEmail(db: ApiDatabase, email: string) {
  const row = await db
    .prepare(
      "SELECT id, email, name, role_id, password_hash, disabled FROM users WHERE email = ?",
    )
    .bind(email)
    .first<UserRow>();
  if (!row) return null;
  return {
    disabled: row.disabled === 1,
    passwordHash: row.password_hash,
    user: toSessionUser(row),
  };
}

export async function insertUser(
  db: ApiDatabase,
  user: SessionUser & { passwordHash: string },
) {
  await db
    .prepare(
      "INSERT INTO users (id, email, name, role_id, password_hash) VALUES (?, ?, ?, ?, ?)",
    )
    .bind(user.id, user.email, user.name, user.role, user.passwordHash)
    .run();
}

function toSessionUser(
  row: Pick<UserRow, "email" | "id" | "name" | "role_id">,
): SessionUser {
  return { email: row.email, id: row.id, name: row.name, role: row.role_id };
}
