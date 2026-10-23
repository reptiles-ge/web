import type { DatabaseSync } from "node:sqlite";

import { beforeEach, describe, expect, it } from "vitest";

import type { ApiBindings } from "../env";

import { verifyPassword } from "../lib/passwords";
import { type ErrorBody, requestJson } from "../testing/request";
import { createTestDatabase } from "../testing/sqliteDatabase";

const TOKEN = "test-token";
const PASSWORD = "correct horse battery";

let sqlite: DatabaseSync;
let env: ApiBindings;

function create(body: unknown, token: null | string = TOKEN) {
  return requestJson<ErrorBody & { data: Record<string, string> }>(
    "/v1/admin/users",
    env,
    {
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      method: "POST",
    },
  );
}

beforeEach(() => {
  const database = createTestDatabase();
  sqlite = database.sqlite;
  env = { API_WRITE_TOKEN: TOKEN, DB: database.db };
});

describe("POST /v1/admin/users", () => {
  it("creates an admin with a hashed password", async () => {
    const { body, response } = await create({
      email: " Nika@Reptiles.ge ",
      name: " Nika ",
      password: PASSWORD,
      role: "admin",
    });
    expect(response.status).toBe(201);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(body.data).toEqual({
      email: "nika@reptiles.ge",
      id: expect.stringMatching(/^[0-9a-f-]{36}$/),
      name: "Nika",
      role: "admin",
    });
    const row = sqlite
      .prepare("SELECT email, role_id, password_hash, disabled FROM users")
      .get() as {
      disabled: number;
      email: string;
      password_hash: string;
      role_id: string;
    };
    expect(row).toMatchObject({
      disabled: 0,
      email: "nika@reptiles.ge",
      role_id: "admin",
    });
    expect(row.password_hash).not.toContain(PASSWORD);
    expect(row.password_hash).toMatch(/^pbkdf2-sha256\$100000\$/);
    expect(await verifyPassword(PASSWORD, row.password_hash)).toBe(true);
    expect(await verifyPassword("wrong password", row.password_hash)).toBe(
      false,
    );
  });

  it("refuses a second user with the same email", async () => {
    const user = {
      email: "nika@reptiles.ge",
      name: "Nika",
      password: PASSWORD,
      role: "admin",
    };
    expect((await create(user)).response.status).toBe(201);
    const { body, response } = await create({
      ...user,
      email: "NIKA@reptiles.ge",
    });
    expect(response.status).toBe(409);
    expect(body.error.code).toBe("conflict");
  });

  it("rejects a short password, an unknown role and a bad email", async () => {
    for (const invalid of [
      { password: "short" },
      { role: "editor" },
      { email: "nope" },
    ]) {
      const { body, response } = await create({
        email: "nika@reptiles.ge",
        name: "Nika",
        password: PASSWORD,
        role: "admin",
        ...invalid,
      });
      expect(response.status).toBe(400);
      expect(body.error.code).toBe("invalid_request");
    }
  });

  it("needs the write token", async () => {
    for (const token of [null, "wrong"]) {
      const { body, response } = await create(
        {
          email: "nika@reptiles.ge",
          name: "Nika",
          password: PASSWORD,
          role: "admin",
        },
        token,
      );
      expect(response.status).toBe(401);
      expect(body.error.code).toBe("unauthorized");
    }
    expect(sqlite.prepare("SELECT id FROM users").all()).toEqual([]);
  });
});
