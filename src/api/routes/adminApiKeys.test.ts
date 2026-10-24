import type { DatabaseSync } from "node:sqlite";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiBindings } from "../env";

import { app } from "../app";
import { hashApiKey, needsApiKey } from "../lib/apiKeys";
import { clearApiKeyLookups } from "../middleware/requireApiKey";
import { adminSessionHeaders } from "../testing/adminSession";
import { type ErrorBody, requestJson } from "../testing/request";
import { createTestDatabase } from "../testing/sqliteDatabase";

const ADMIN_ORIGIN = "https://admin.reptiles.ge";
const SITE_KEY = "site-key-for-tests";

type ApiKeyBody = {
  data: {
    createdBy: string;
    expiresAt: null | string;
    id: string;
    key?: string;
    keyPrefix: string;
    lastUsedAt: null | string;
    name: string;
    note: null | string;
    revokedAt: null | string;
  };
};

let sqlite: DatabaseSync;
let env: ApiBindings;

beforeEach(() => {
  clearApiKeyLookups();
  const database = createTestDatabase();
  sqlite = database.sqlite;
  env = {
    ALLOWED_ORIGINS: `https://reptiles.ge,${ADMIN_ORIGIN}`,
    API_WRITE_TOKEN: "test-token",
    DB: database.db,
    SITE_API_KEY: SITE_KEY,
  };
});

afterEach(() => {
  vi.restoreAllMocks();
});

async function createKey(body: unknown = { name: "Partner" }) {
  return requestJson<ApiKeyBody & ErrorBody>("/v1/admin/api-keys", env, {
    body: JSON.stringify(body),
    headers: { ...(await signedIn()), "Content-Type": "application/json" },
    method: "POST",
  });
}

function readAuthors(headers: Record<string, string> = {}) {
  return app.request("/v1/authors", { headers }, env);
}

async function signedIn() {
  return { ...(await adminSessionHeaders(sqlite)), Origin: ADMIN_ORIGIN };
}

describe("POST /v1/admin/api-keys", () => {
  it("creates a key, shows it once and stores only its hash", async () => {
    const { body, response } = await createKey({
      name: " Partner ",
      note: "Museum app",
    });
    expect(response.status).toBe(201);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    const key = body.data.key ?? "";
    expect(key).toMatch(/^rpt_[\w-]{43}$/);
    expect(body.data).toMatchObject({
      createdBy: "Admin",
      expiresAt: null,
      keyPrefix: key.slice(0, 12),
      lastUsedAt: null,
      name: "Partner",
      note: "Museum app",
      revokedAt: null,
    });
    const row = sqlite
      .prepare("SELECT key_hash FROM api_keys WHERE id = ?")
      .get(body.data.id) as { key_hash: string };
    expect(row.key_hash).toBe(await hashApiKey(key));
    expect(row.key_hash).not.toContain(key);
  });

  it("rejects an invalid body", async () => {
    for (const body of [
      {},
      { name: "" },
      { expiresAt: "2000-01-01T00:00:00Z", name: "Old" },
    ]) {
      const { body: error, response } = await createKey(body);
      expect(response.status).toBe(400);
      expect(error.error.code).toBe("invalid_request");
    }
  });

  it("needs an admin session from an allowed origin", async () => {
    const session = await signedIn();
    for (const [headers, status] of [
      [{ Origin: ADMIN_ORIGIN }, 401],
      [{ Authorization: "Bearer test-token", Origin: ADMIN_ORIGIN }, 401],
      [{ ...session, Origin: "https://evil.example" }, 403],
    ] as const) {
      const response = await app.request(
        "/v1/admin/api-keys",
        {
          body: JSON.stringify({ name: "Partner" }),
          headers: { ...headers, "Content-Type": "application/json" },
          method: "POST",
        },
        env,
      );
      expect(response.status).toBe(status);
    }
  });

  it("is rate limited", async () => {
    env.ADMIN_LIMITER = { limit: async () => ({ success: false }) };
    const { response } = await createKey();
    expect(response.status).toBe(429);
  });
});

describe("GET /v1/admin/api-keys", () => {
  it("lists keys newest first without the key itself", async () => {
    await createKey({ name: "First" });
    await createKey({ name: "Second" });
    const { body, response } = await requestJson<{
      data: ApiKeyBody["data"][];
      total: number;
    }>("/v1/admin/api-keys", env, {
      headers: { Authorization: "Bearer test-token" },
    });
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(body.total).toBe(2);
    expect(body.data.map((key) => key.name).sort()).toEqual([
      "First",
      "Second",
    ]);
    expect(body.data.every((key) => !("key" in key))).toBe(true);
  });

  it("needs an admin", async () => {
    const response = await app.request("/v1/admin/api-keys", {}, env);
    expect(response.status).toBe(401);
  });
});

describe("POST /v1/admin/api-keys/:id/revoke", () => {
  it("revokes a key", async () => {
    const { body: created } = await createKey();
    const { body, response } = await requestJson<ApiKeyBody>(
      `/v1/admin/api-keys/${created.data.id}/revoke`,
      env,
      { headers: await signedIn(), method: "POST" },
    );
    expect(response.status).toBe(200);
    expect(body.data.revokedAt).toEqual(expect.any(String));
  });

  it("answers 404 for an unknown key and 400 for a bad id", async () => {
    const unknown = await requestJson<ErrorBody>(
      `/v1/admin/api-keys/${crypto.randomUUID()}/revoke`,
      env,
      { headers: await signedIn(), method: "POST" },
    );
    expect(unknown.response.status).toBe(404);
    const bad = await requestJson<ErrorBody>(
      "/v1/admin/api-keys/nope/revoke",
      env,
      { headers: await signedIn(), method: "POST" },
    );
    expect(bad.response.status).toBe(400);
    expect(bad.body.error.code).toBe("invalid_request");
  });
});

describe("API keys on public routes", () => {
  it("keeps admin, auth, docs and views keyless", () => {
    expect(needsApiKey("/v1/species")).toBe(true);
    expect(needsApiKey("/v1/species/giurza")).toBe(true);
    expect(needsApiKey("/v1/catalog")).toBe(true);
    expect(needsApiKey("/v1/news/x")).toBe(true);
    expect(needsApiKey("/v1/admin/species")).toBe(false);
    expect(needsApiKey("/v1/auth/login")).toBe(false);
    expect(needsApiKey("/v1/docs")).toBe(false);
    expect(needsApiKey("/v1/docs/openapi.json")).toBe(false);
    expect(needsApiKey("/v1/ratings")).toBe(true);
    expect(needsApiKey("/v1/views")).toBe(false);
    expect(needsApiKey("/v1/viewsx")).toBe(true);
  });

  it("lets everyone through when the mode is off", async () => {
    expect((await readAuthors()).status).toBe(200);
  });

  it("logs, but still answers, requests without a valid key in log mode", async () => {
    env.API_KEY_MODE = "log";
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect((await readAuthors()).status).toBe(200);
    expect((await readAuthors({ "X-Api-Key": "rpt_unknown" })).status).toBe(
      200,
    );
    expect(warn).toHaveBeenCalledTimes(2);
    expect(warn.mock.calls[0]?.[1]).toMatchObject({
      key: "missing",
      path: "/v1/authors",
    });
    expect(warn.mock.calls[1]?.[1]).toMatchObject({ key: "invalid" });
  });

  it("rejects missing, unknown and revoked keys in enforce mode", async () => {
    env.API_KEY_MODE = "enforce";
    const { body: created } = await createKey();
    const key = created.data.key ?? "";
    const missing = await readAuthors();
    expect(missing.status).toBe(401);
    expect(await missing.json()).toEqual({
      error: { code: "unauthorized", message: "Missing API key" },
    });
    expect((await readAuthors({ "X-Api-Key": "rpt_unknown" })).status).toBe(
      401,
    );
    expect((await readAuthors({ "X-Api-Key": key })).status).toBe(200);
    await app.request(
      `/v1/admin/api-keys/${created.data.id}/revoke`,
      { headers: await signedIn(), method: "POST" },
      env,
    );
    clearApiKeyLookups();
    expect((await readAuthors({ "X-Api-Key": key })).status).toBe(401);
  });

  it("rejects an expired key", async () => {
    env.API_KEY_MODE = "enforce";
    const { body: created } = await createKey();
    sqlite
      .prepare("UPDATE api_keys SET expires_at = ? WHERE id = ?")
      .run("2000-01-01T00:00:00.000Z", created.data.id);
    expect(
      (await readAuthors({ "X-Api-Key": created.data.key ?? "" })).status,
    ).toBe(401);
  });

  it("accepts the site key without a rate limit", async () => {
    env.API_KEY_MODE = "enforce";
    const limit = vi.fn(async () => ({ success: false }));
    env.API_KEY_LIMITER = { limit };
    expect((await readAuthors({ "X-Api-Key": SITE_KEY })).status).toBe(200);
    expect(limit).not.toHaveBeenCalled();
  });

  it("rate limits each key on its own", async () => {
    env.API_KEY_MODE = "enforce";
    const { body: created } = await createKey();
    const limit = vi.fn(async () => ({ success: false }));
    env.API_KEY_LIMITER = { limit };
    const response = await readAuthors({ "X-Api-Key": created.data.key ?? "" });
    expect(response.status).toBe(429);
    expect(limit).toHaveBeenCalledWith({ key: created.data.id });
  });

  it("records when a key was last used", async () => {
    env.API_KEY_MODE = "enforce";
    const { body: created } = await createKey();
    await readAuthors({ "X-Api-Key": created.data.key ?? "" });
    await vi.waitFor(() => {
      const row = sqlite
        .prepare("SELECT last_used_at FROM api_keys WHERE id = ?")
        .get(created.data.id) as { last_used_at: null | string };
      expect(row.last_used_at).toEqual(expect.any(String));
    });
  });

  it("keeps keyless routes open in enforce mode", async () => {
    env.API_KEY_MODE = "enforce";
    expect((await app.request("/v1/docs/openapi.json", {}, env)).status).toBe(
      200,
    );
    expect((await app.request("/v1/admin/api-keys", {}, env)).status).toBe(401);
  });
});
