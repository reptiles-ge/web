import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiBindings } from "../env";

import { app } from "../app";
import { adminSessionHeaders } from "../testing/adminSession";
import { type ErrorBody, requestJson } from "../testing/request";
import { createSpeciesTestDatabase } from "../testing/sqliteDatabase";

const ADMIN_ORIGIN = "https://admin.reptiles.ge";
const ID = "macrovipera-lebetina";
const PHOTO = "https://static.inaturalist.org/photos/421616506/original.jpg";

let env: ApiBindings;
let session: Record<string, string>;
let upstream: ReturnType<
  typeof vi.fn<(url: string, init?: RequestInit) => Promise<Response>>
>;

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
  upstream = vi.fn<(url: string, init?: RequestInit) => Promise<Response>>(
    async () =>
      new Response(new Uint8Array([1, 2, 3]), {
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
  it("downloads the photo without calling the iNaturalist API", async () => {
    const response = await post({ photoUrl: PHOTO });
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toContain("no-store");
    expect(response.headers.get("Content-Type")).toBe("image/jpeg");
    expect([...new Uint8Array(await response.arrayBuffer())]).toStrictEqual([
      1, 2, 3,
    ]);
    expect(upstream.mock.calls.map(([url]) => url)).toStrictEqual([PHOTO]);
    expect(upstream.mock.calls[0]?.[1]?.redirect).toBe("manual");
  });

  it("refuses a URL that is not an iNaturalist original photo", async () => {
    for (const photoUrl of [
      "https://evil.example/photos/1/original.jpg",
      "https://static.inaturalist.org/photos/1/square.jpg",
      "https://www.inaturalist.org/observations/42",
    ]) {
      const response = await post({ photoUrl });
      expect(response.status).toBe(400);
      expect(((await response.json()) as ErrorBody).error.code).toBe(
        "invalid_request",
      );
    }
    expect(upstream).not.toHaveBeenCalled();
  });

  it("answers 502 when the photo cannot be downloaded", async () => {
    upstream.mockResolvedValueOnce(new Response(null, { status: 403 }));
    const failed = await post({ photoUrl: PHOTO });
    expect(failed.status).toBe(502);
    expect(((await failed.json()) as ErrorBody).error).toStrictEqual({
      code: "upstream_failed",
      message: "Could not download the iNaturalist photo",
    });
    upstream.mockRejectedValueOnce(new TypeError("network"));
    const unreachable = await post({ photoUrl: PHOTO });
    expect(unreachable.status).toBe(502);
  });

  it("answers 422 for a photo it cannot use", async () => {
    upstream.mockResolvedValueOnce(
      new Response("<svg/>", { headers: { "Content-Type": "image/svg+xml" } }),
    );
    expect((await post({ photoUrl: PHOTO })).status).toBe(422);
  });

  it("answers 404 for an unknown species before downloading", async () => {
    const response = await post(
      { photoUrl: PHOTO },
      { ...session, Origin: ADMIN_ORIGIN },
      "no-such-species",
    );
    expect(response.status).toBe(404);
    expect(upstream).not.toHaveBeenCalled();
  });

  it("needs the admin origin and a session", async () => {
    expect((await post({ photoUrl: PHOTO }, { ...session })).status).toBe(403);
    expect(
      (await post({ photoUrl: PHOTO }, { Origin: ADMIN_ORIGIN })).status,
    ).toBe(401);
    const { response } = await requestJson<ErrorBody>(
      `/v1/admin/species/${ID}/photos/inaturalist`,
      env,
      {
        body: JSON.stringify({ photoUrl: PHOTO }),
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
