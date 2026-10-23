import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "../../tests/msw/server";
import { fetchCurrentUser, signIn, signOut } from "./session";

const API = "https://api.reptiles.ge/v1/auth";

const ADMIN = {
  email: "nika@reptiles.ge",
  id: "00000000-0000-4000-8000-000000000000",
  name: "Nika",
  role: "admin",
};

function error(status: number) {
  return HttpResponse.json({ error: { code: "x", message: "x" } }, { status });
}

describe("admin session", () => {
  it("sends every request with credentials", async () => {
    const seen: string[] = [];
    server.use(
      http.all(`${API}/*`, ({ request }) => {
        seen.push(`${request.method} ${request.credentials}`);
        return request.method === "GET"
          ? HttpResponse.json({ data: ADMIN })
          : new HttpResponse(null, { status: 204 });
      }),
    );
    await fetchCurrentUser();
    await signOut();
    expect(seen).toEqual(["GET include", "POST include"]);
  });

  it("reads the current user, or null when signed out", async () => {
    server.use(http.get(`${API}/me`, () => HttpResponse.json({ data: ADMIN })));
    expect(await fetchCurrentUser()).toEqual(ADMIN);
    for (const status of [401, 403]) {
      server.use(http.get(`${API}/me`, () => error(status)));
      expect(await fetchCurrentUser()).toBeNull();
    }
    server.use(http.get(`${API}/me`, () => error(500)));
    await expect(fetchCurrentUser()).rejects.toThrow(
      "Session check failed: 500",
    );
  });

  it("maps sign-in answers", async () => {
    let body: unknown;
    server.use(
      http.post(`${API}/login`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ data: ADMIN });
      }),
    );
    expect(await signIn(ADMIN.email, "secret")).toEqual({
      status: "signed_in",
      user: ADMIN,
    });
    expect(body).toEqual({ email: ADMIN.email, password: "secret" });
    for (const [status, result] of [
      [401, "invalid"],
      [429, "rate_limited"],
    ] as const) {
      server.use(http.post(`${API}/login`, () => error(status)));
      expect(await signIn(ADMIN.email, "secret")).toEqual({ status: result });
    }
    server.use(http.post(`${API}/login`, () => error(500)));
    await expect(signIn(ADMIN.email, "secret")).rejects.toThrow(
      "Sign-in failed: 500",
    );
  });

  it("fails loudly when sign-out fails", async () => {
    server.use(http.post(`${API}/logout`, () => error(500)));
    await expect(signOut()).rejects.toThrow("Sign-out failed: 500");
  });
});
