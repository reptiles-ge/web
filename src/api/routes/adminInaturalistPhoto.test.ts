import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiBindings } from "../env";

import { app } from "../app";
import { adminSessionHeaders } from "../testing/adminSession";
import { type ErrorBody, requestJson } from "../testing/request";
import { createSpeciesTestDatabase } from "../testing/sqliteDatabase";

const ADMIN_ORIGIN = "https://admin.reptiles.ge";
const ID = "macrovipera-lebetina";
const OBSERVATION = "https://www.inaturalist.org/observations/42";
const SQUARE =
  "https://inaturalist-open-data.s3.amazonaws.com/photos/7/square.jpeg";

let env: ApiBindings;
let session: Record<string, string>;
let upstream: ReturnType<typeof vi.fn<(url: string) => Promise<Response>>>;

function post(
  body: unknown,
  headers: Record<string, string> = { ...session, Origin: ADMIN_ORIGIN },
  id = ID,
) {
  return app.request(
    `/v1/admin/species/${id}/photos/inaturalist`,
    {
      body: JSON.stringify(body),
      headers: { ...headers, "Content-Type": "application/json" },
      method: "POST",
    },
    env,
  );
}

beforeEach(async () => {
  const database = createSpeciesTestDatabase();
  upstream = vi.fn<(url: string) => Promise<Response>>(async (url) =>
    url.startsWith("https://api.inaturalist.org/")
      ? Response.json({
          results: [
            {
              geojson: { coordinates: [45.35, 41.81667] },
              id: 42,
              observed_on: "2026-05-10",
              photos: [{ id: 7, license_code: "cc-by", url: SQUARE }],
              place_guess: "Vashlovani, Georgia",
              place_ids: [8857],
              user: { login: "ana" },
            },
          ],
        })
      : new Response(new Uint8Array([1, 2, 3]), {
          headers: { "Content-Type": "image/jpeg" },
        }),
  );
  vi.stubGlobal("fetch", upstream);
  env = { ALLOWED_ORIGINS: ADMIN_ORIGIN, DB: database.db };
  session = await adminSessionHeaders(database.sqlite);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("POST /v1/admin/species/:id/photos/inaturalist", () => {
  it("returns the observation's first photo and its credit", async () => {
    const response = await post({ url: OBSERVATION });
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toContain("no-store");
    const form = await response.formData();
    const photo = form.get("photo") as File;
    expect(photo.name).toBe("inaturalist-42-7.jpg");
    expect(photo.size).toBe(3);
    expect(JSON.parse(form.get("metadata") as string)).toStrictEqual({
      date: "2026-05-10",
      georgiaField: true,
      lat: 41.81667,
      license: "cc-by",
      lng: 45.35,
      location: "Vashlovani",
      photographer: "ana",
      url: "https://www.inaturalist.org/photos/7",
    });
    expect(upstream.mock.calls.map(([url]) => url)).toStrictEqual([
      "https://api.inaturalist.org/v1/observations/42",
      "https://inaturalist-open-data.s3.amazonaws.com/photos/7/original.jpeg",
    ]);
  });

  it("answers a URL that is not an observation with 400", async () => {
    const response = await post({ url: "https://example.com/observations/1" });
    expect(response.status).toBe(400);
    const body = (await response.json()) as ErrorBody;
    expect(body.error).toStrictEqual({
      code: "invalid_request",
      message: "Paste an iNaturalist observation URL",
    });
    expect(upstream).not.toHaveBeenCalled();
  });

  it("answers 502 when iNaturalist cannot be reached", async () => {
    upstream.mockRejectedValue(new TypeError("network"));
    const response = await post({ url: OBSERVATION });
    expect(response.status).toBe(502);
    expect(((await response.json()) as ErrorBody).error.code).toBe(
      "upstream_failed",
    );
  });

  it("answers 404 for an unknown species before calling iNaturalist", async () => {
    const response = await post(
      { url: OBSERVATION },
      { ...session, Origin: ADMIN_ORIGIN },
      "no-such-species",
    );
    expect(response.status).toBe(404);
    expect(upstream).not.toHaveBeenCalled();
  });

  it("needs the admin origin and a session", async () => {
    expect((await post({ url: OBSERVATION }, { ...session })).status).toBe(403);
    expect(
      (await post({ url: OBSERVATION }, { Origin: ADMIN_ORIGIN })).status,
    ).toBe(401);
    const { response } = await requestJson<ErrorBody>(
      `/v1/admin/species/${ID}/photos/inaturalist`,
      env,
      {
        body: JSON.stringify({ url: OBSERVATION }),
        headers: {
          Authorization: "Bearer token",
          "Content-Type": "application/json",
          Origin: ADMIN_ORIGIN,
        },
        method: "POST",
      },
    );
    expect(response.status).toBe(401);
    expect(upstream).not.toHaveBeenCalled();
  });
});
