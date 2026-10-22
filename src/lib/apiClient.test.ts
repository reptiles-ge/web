import { afterEach, describe, expect, it, vi } from "vitest";

import { app } from "@/api/app";
import { createTestDatabase } from "@/api/testing/sqliteDatabase";

import { apiOrigin, createApiClient } from "./apiClient";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("createApiClient", () => {
  it("calls typed routes", async () => {
    const env = { DB: createTestDatabase().db };
    const client = createApiClient({
      fetch: async (input, init) => app.request(input, init, env),
    });
    const response = await client.v1.species.$get({
      query: { group: "turtle", locale: "en" },
    });
    expect(response.status).toBe(200);
    if (response.status !== 200) return;
    const body = await response.json();
    expect(body.locale).toBe("en");
    expect(body.data.every((item) => item.group === "turtle")).toBe(true);
  });

  it("sends a bearer token when given one", async () => {
    const fetch = vi.fn(async () => new Response(null));
    await createApiClient({ fetch, token: "secret" }).v1.ratings.summary.$get({
      query: {},
    });
    const [, init] = fetch.mock.calls[0] as unknown as [string, RequestInit];
    expect(new Headers(init.headers).get("Authorization")).toBe(
      "Bearer secret",
    );
  });

  it("targets api.reptiles.ge unless NEXT_PUBLIC_API_ORIGIN is set", () => {
    expect(apiOrigin()).toBe("https://api.reptiles.ge");
    expect(createApiClient().v1.species.$url().href).toBe(
      "https://api.reptiles.ge/v1/species",
    );
    vi.stubEnv("NEXT_PUBLIC_API_ORIGIN", "localhost:8787/");
    expect(apiOrigin()).toBe("https://localhost:8787");
    vi.stubEnv("NEXT_PUBLIC_API_ORIGIN", "http://localhost:8787");
    expect(createApiClient().v1.species.$url().href).toBe(
      "http://localhost:8787/v1/species",
    );
  });
});
