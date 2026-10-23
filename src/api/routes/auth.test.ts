import type { DatabaseSync } from "node:sqlite";

import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiBindings, RateLimiter } from "../env";

import { app } from "../app";
import { hashSessionToken } from "../lib/sessions";
import { type ErrorBody } from "../testing/request";
import { createTestDatabase } from "../testing/sqliteDatabase";

const TOKEN = "test-token";
const ADMIN_ORIGIN = "https://admin.reptiles.ge";
const COOKIE = "__Host-reptiles_admin_session";
const PASSWORD = "correct horse battery";

let sqlite: DatabaseSync;
let env: ApiBindings;

async function createUser(email = "Admin@Reptiles.ge", password = PASSWORD) {
  const response = await post(
    "/v1/admin/users",
    { email, name: "Admin", password, role: "admin" },
    { Authorization: `Bearer ${TOKEN}` },
  );
  expect(response.status).toBe(201);
  return ((await response.json()) as { data: { id: string } }).data;
}

function limiter(success: boolean): RateLimiter {
  return { limit: vi.fn(async () => ({ success })) };
}

function me(token?: string) {
  return app.request(
    "/v1/auth/me",
    {
      headers: {
        Origin: ADMIN_ORIGIN,
        ...(token ? { Cookie: `${COOKIE}=${token}` } : {}),
      },
    },
    env,
  );
}

function post(
  path: string,
  body: unknown,
  headers: Record<string, string> = {},
) {
  return app.request(
    path,
    {
      body: JSON.stringify(body),
      headers: {
        "cf-connecting-ip": "203.0.113.9",
        "Content-Type": "application/json",
        Origin: ADMIN_ORIGIN,
        ...headers,
      },
      method: "POST",
    },
    env,
  );
}

function sessionToken(response: Response) {
  const header = response.headers.get("Set-Cookie") ?? "";
  return header.match(new RegExp(`${COOKIE}=([^;]*)`))?.[1] ?? "";
}

beforeEach(() => {
  const database = createTestDatabase();
  sqlite = database.sqlite;
  env = {
    ALLOWED_ORIGINS: `https://reptiles.ge,${ADMIN_ORIGIN}`,
    API_WRITE_TOKEN: TOKEN,
    DB: database.db,
    LOGIN_LIMITER: limiter(true),
  };
});

describe("POST /v1/auth/login", () => {
  it("signs in with a case-insensitive email and sets a host-only session cookie", async () => {
    const user = await createUser();
    const response = await post("/v1/auth/login", {
      email: "  ADMIN@reptiles.GE ",
      password: PASSWORD,
    });
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(await response.json()).toEqual({
      data: {
        email: "admin@reptiles.ge",
        id: user.id,
        name: "Admin",
        role: "admin",
      },
    });
    const cookie = response.headers.get("Set-Cookie") ?? "";
    expect(cookie).toMatch(new RegExp(`^${COOKIE}=[A-Za-z0-9_-]{43};`));
    for (const attribute of [
      "Max-Age=604800",
      "Path=/",
      "HttpOnly",
      "Secure",
      "SameSite=Strict",
    ]) {
      expect(cookie).toContain(attribute);
    }
    expect(cookie).not.toContain("Domain=");
    const token = sessionToken(response);
    const stored = sqlite
      .prepare("SELECT token_hash, user_id FROM user_sessions")
      .all();
    expect(stored).toEqual([
      { token_hash: await hashSessionToken(token), user_id: user.id },
    ]);
  });

  it("answers the same 401 for a wrong password and an unknown email", async () => {
    await createUser();
    for (const body of [
      { email: "admin@reptiles.ge", password: "wrong password!" },
      { email: "nobody@reptiles.ge", password: PASSWORD },
    ]) {
      const response = await post("/v1/auth/login", body);
      expect(response.status).toBe(401);
      expect(response.headers.get("Set-Cookie")).toBeNull();
      expect(((await response.json()) as ErrorBody).error).toEqual({
        code: "unauthorized",
        message: "Invalid email or password",
      });
    }
  });

  it("refuses a disabled user", async () => {
    await createUser();
    sqlite.prepare("UPDATE users SET disabled = 1").run();
    const response = await post("/v1/auth/login", {
      email: "admin@reptiles.ge",
      password: PASSWORD,
    });
    expect(response.status).toBe(401);
  });

  it("rejects an invalid body", async () => {
    const response = await post("/v1/auth/login", { email: "not-an-email" });
    expect(response.status).toBe(400);
    expect(((await response.json()) as ErrorBody).error.code).toBe(
      "invalid_request",
    );
  });

  it("rejects a foreign origin", async () => {
    const response = await post(
      "/v1/auth/login",
      { email: "admin@reptiles.ge", password: PASSWORD },
      { Origin: "https://evil.example" },
    );
    expect(response.status).toBe(403);
  });

  it("rate-limits by visitor", async () => {
    env.LOGIN_LIMITER = limiter(false);
    const response = await post("/v1/auth/login", {
      email: "admin@reptiles.ge",
      password: PASSWORD,
    });
    expect(response.status).toBe(429);
    expect(env.LOGIN_LIMITER.limit).toHaveBeenCalledWith({
      key: "203.0.113.9",
    });
  });
});

describe("GET /v1/auth/me", () => {
  it("returns the signed-in admin", async () => {
    await createUser();
    const login = await post("/v1/auth/login", {
      email: "admin@reptiles.ge",
      password: PASSWORD,
    });
    const response = await me(sessionToken(login));
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe(
      ADMIN_ORIGIN,
    );
    expect(response.headers.get("Access-Control-Allow-Credentials")).toBe(
      "true",
    );
    expect(
      ((await response.json()) as { data: { email: string } }).data.email,
    ).toBe("admin@reptiles.ge");
  });

  it("answers 401 without a cookie or with an unknown token", async () => {
    for (const token of [undefined, "made-up-token"]) {
      const response = await me(token);
      expect(response.status).toBe(401);
      expect(((await response.json()) as ErrorBody).error.code).toBe(
        "unauthorized",
      );
    }
  });

  it("answers 401 once the session has expired", async () => {
    await createUser();
    const login = await post("/v1/auth/login", {
      email: "admin@reptiles.ge",
      password: PASSWORD,
    });
    sqlite
      .prepare("UPDATE user_sessions SET expires_at = ?")
      .run(new Date(Date.now() - 1000).toISOString());
    expect((await me(sessionToken(login))).status).toBe(401);
  });

  it("answers 403 for a user without the admin role", async () => {
    await createUser();
    const login = await post("/v1/auth/login", {
      email: "admin@reptiles.ge",
      password: PASSWORD,
    });
    sqlite.prepare("INSERT INTO user_roles (id) VALUES ('editor')").run();
    sqlite.prepare("UPDATE users SET role_id = 'editor'").run();
    const response = await me(sessionToken(login));
    expect(response.status).toBe(403);
    expect(((await response.json()) as ErrorBody).error.code).toBe("forbidden");
  });
});

describe("POST /v1/auth/logout", () => {
  it("ends the session and clears the cookie", async () => {
    await createUser();
    const login = await post("/v1/auth/login", {
      email: "admin@reptiles.ge",
      password: PASSWORD,
    });
    const token = sessionToken(login);
    const response = await post(
      "/v1/auth/logout",
      {},
      { Cookie: `${COOKIE}=${token}` },
    );
    expect(response.status).toBe(204);
    expect(response.headers.get("Set-Cookie")).toMatch(
      new RegExp(`^${COOKIE}=;.*Max-Age=0`),
    );
    expect(
      sqlite.prepare("SELECT token_hash FROM user_sessions").all(),
    ).toEqual([]);
    expect((await me(token)).status).toBe(401);
  });

  it("succeeds without a session and still checks the origin", async () => {
    expect((await post("/v1/auth/logout", {})).status).toBe(204);
    expect(
      (await post("/v1/auth/logout", {}, { Origin: "https://evil.example" }))
        .status,
    ).toBe(403);
  });
});

describe("CORS", () => {
  it("allows credentials only for a configured origin", async () => {
    const preflight = await app.request(
      "/v1/auth/login",
      {
        headers: {
          "Access-Control-Request-Method": "POST",
          Origin: ADMIN_ORIGIN,
        },
        method: "OPTIONS",
      },
      env,
    );
    expect(preflight.headers.get("Access-Control-Allow-Origin")).toBe(
      ADMIN_ORIGIN,
    );
    expect(preflight.headers.get("Access-Control-Allow-Credentials")).toBe(
      "true",
    );
    const foreign = await me();
    expect(foreign.headers.get("Access-Control-Allow-Origin")).toBe(
      ADMIN_ORIGIN,
    );
    const other = await app.request(
      "/v1/auth/me",
      { headers: { Origin: "https://evil.example" } },
      env,
    );
    expect(other.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });
});
