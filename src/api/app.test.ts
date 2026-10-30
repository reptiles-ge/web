import { HTTPException } from "hono/http-exception";
import { describe, expect, it, vi } from "vitest";

import { STRICT_TRANSPORT_SECURITY } from "@/lib/securityHeaders";

import { app } from "./app";
import { handleError } from "./lib/errors";
import { type ErrorBody, requestJson } from "./testing/request";
import { createSpeciesTestDatabase } from "./testing/sqliteDatabase";

const env = { DB: createSpeciesTestDatabase().db };

describe("api app", () => {
  it("sends security, noindex and CORS headers", async () => {
    const response = await app.request("/v1/species", {}, env);
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex");
    expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(response.headers.get("Strict-Transport-Security")).toBe(
      STRICT_TRANSPORT_SECURITY.value,
    );
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
    const site = await app.request(
      "/v1/species",
      { headers: { Origin: "https://reptiles.ge" } },
      env,
    );
    expect(site.headers.get("Access-Control-Allow-Origin")).toBe(
      "https://reptiles.ge",
    );
  });

  it("answers a repeated GET with 304 when the ETag matches", async () => {
    const first = await app.request("/v1/species", {}, env);
    const tag = first.headers.get("ETag");
    expect(tag).toBeTruthy();
    const second = await app.request(
      "/v1/species",
      { headers: { "If-None-Match": tag ?? "" } },
      env,
    );
    expect(second.status).toBe(304);
    expect(await second.text()).toBe("");
  });

  it("answers unknown paths with the shared 404 shape", async () => {
    const { body, response } = await requestJson<ErrorBody>("/v1/nothing", env);
    expect(response.status).toBe(404);
    expect(body).toEqual({
      error: { code: "not_found", message: "Not found" },
    });
  });

  it("hides unexpected errors behind a generic 500", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const broken = {
      DB: {
        batch: () => {
          throw new Error("secret detail");
        },
        prepare: () => {
          throw new Error("secret detail");
        },
      },
    };
    const { body, response } = await requestJson<ErrorBody>(
      "/v1/contributors",
      broken,
    );
    expect(response.status).toBe(500);
    expect(body).toEqual({
      error: { code: "internal_error", message: "Internal error" },
    });
    expect(log).toHaveBeenCalled();
    log.mockRestore();
  });

  it("maps a plain HTTPException to the shared shape", async () => {
    const context = {
      json: (value: unknown, status: number) =>
        Response.json(value, { status }),
    } as unknown as Parameters<typeof handleError>[1];
    for (const [status, code] of [
      [400, "invalid_request"],
      [401, "unauthorized"],
      [404, "not_found"],
      [403, "forbidden"],
      [413, "payload_too_large"],
      [429, "rate_limited"],
      [503, "internal_error"],
    ] as const) {
      const response = handleError(
        new HTTPException(status, { message: "x" }),
        context,
      );
      expect(response.status).toBe(status);
      expect(((await response.json()) as ErrorBody).error.code).toBe(code);
    }
  });
});
