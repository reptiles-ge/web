import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "../../tests/msw/server";
import { SessionExpiredError } from "./adminResponse";
import { createApiKey, fetchApiKeys, revokeApiKey } from "./apiKeys";

const KEYS = "https://api.reptiles.ge/v1/admin/api-keys";

describe("API keys client", () => {
  it("lists, creates and revokes keys with credentials", async () => {
    const seen: string[] = [];
    let body: unknown;
    server.use(
      http.all(`${KEYS}*`, async ({ request }) => {
        const url = new URL(request.url);
        seen.push(
          `${request.method} ${url.pathname}${url.search} ${request.credentials}`,
        );
        if (request.method === "POST" && request.url === KEYS) {
          body = await request.json();
          return HttpResponse.json(
            { data: { id: "k1", key: "rpt_secret" } },
            { status: 201 },
          );
        }
        return HttpResponse.json({ data: [{ id: "k1" }], total: 1 });
      }),
    );
    expect(await fetchApiKeys({ limit: 20, page: 1, q: "part" })).toEqual({
      data: [{ id: "k1" }],
      total: 1,
    });
    const input = { expiresAt: null, name: "Partner", note: null };
    expect(await createApiKey(input)).toEqual({ id: "k1", key: "rpt_secret" });
    expect(body).toEqual(input);
    await revokeApiKey("k1");
    expect(seen).toEqual([
      "GET /v1/admin/api-keys?limit=20&page=1&q=part include",
      "POST /v1/admin/api-keys include",
      "POST /v1/admin/api-keys/k1/revoke include",
    ]);
  });

  it("reports an expired session and other failures", async () => {
    server.use(http.get(KEYS, () => new HttpResponse(null, { status: 401 })));
    await expect(fetchApiKeys({ limit: 50, page: 1 })).rejects.toBeInstanceOf(
      SessionExpiredError,
    );
    server.use(http.post(KEYS, () => new HttpResponse(null, { status: 400 })));
    await expect(
      createApiKey({ expiresAt: null, name: "x", note: null }),
    ).rejects.toThrow("API key creation failed: 400");
  });
});
