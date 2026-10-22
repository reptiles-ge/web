import { describe, expect, it } from "vitest";

import type { ApiBindings } from "@/api/env";

import { app } from "@/api/app";
import { createTestDatabase } from "@/api/testing/sqliteDatabase";

import { createApiClient, serviceBindingFetch } from "./apiClient";

const TOKEN = "test-token";

function clientFor(env: ApiBindings, token?: string) {
  return createApiClient({
    fetch: serviceBindingFetch({
      fetch: async (input, init) => app.request(input, init, env),
    }),
    token,
  });
}

describe("createApiClient", () => {
  it("calls typed routes through a service binding", async () => {
    const client = clientFor({ DB: createTestDatabase().db });
    const response = await client.v1.species.$get({
      query: { group: "turtle", locale: "en" },
    });
    expect(response.status).toBe(200);
    if (response.status !== 200) return;
    const body = await response.json();
    expect(body.locale).toBe("en");
    expect(body.data.every((item) => item.group === "turtle")).toBe(true);
  });

  it("sends the write token", async () => {
    const database = createTestDatabase();
    const env = { API_WRITE_TOKEN: TOKEN, DB: database.db };
    const rating = { json: { locale: "ka" as const, path: "/", rating: 5 } };
    expect((await clientFor(env).v1.ratings.$post(rating)).status).toBe(401);
    expect((await clientFor(env, TOKEN).v1.ratings.$post(rating)).status).toBe(
      201,
    );
    expect(
      database.sqlite.prepare("SELECT COUNT(*) AS n FROM site_ratings").get(),
    ).toEqual({ n: 1 });
  });

  it("targets api.reptiles.ge by default", () => {
    expect(createApiClient().v1.species.$url().href).toBe(
      "https://api.reptiles.ge/v1/species",
    );
  });
});
