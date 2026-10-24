import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { server } from "../../../../tests/msw/server";
import { POST } from "./route";

const API = "https://api.reptiles.ge/v1/ratings";
const SITE = "https://reptiles.ge";

let sent: Request[];

function answer(status: number) {
  server.use(
    http.post(API, ({ request: forwarded }) => {
      sent.push(forwarded.clone());
      return status === 201
        ? new HttpResponse(null, { status })
        : HttpResponse.json({ error: { code: "x", message: "x" } }, { status });
    }),
  );
}

function request(body: unknown, headers: Record<string, string> = {}) {
  return new Request(`${SITE}/api/rating`, {
    body: typeof body === "string" ? body : JSON.stringify(body),
    headers: {
      "Accept-Language": "ka-GE,ka;q=0.9",
      "cf-connecting-ip": "203.0.113.5",
      "cf-ipcountry": "GE",
      "Content-Type": "application/json",
      Origin: SITE,
      "User-Agent": "Mozilla/5.0 Test",
      ...headers,
    },
    method: "POST",
  });
}

beforeEach(() => {
  sent = [];
  vi.stubEnv("SITE_API_KEY", "site-key");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("POST /api/rating", () => {
  it("forwards the rating to the API with the site key and the visitor", async () => {
    answer(201);
    const response = await POST(
      request({
        feedback: "ფოტო აკლია",
        locale: "ka",
        pages: 3,
        path: "/gvelebi/giurza",
        rating: 4,
        referrer: "google.com",
        seconds: 95,
      }),
    );
    expect(response.status).toBe(201);
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
    const [forwarded] = sent;
    expect(forwarded?.headers.get("X-Api-Key")).toBe("site-key");
    expect(forwarded?.headers.get("Origin")).toBe(SITE);
    expect(forwarded?.headers.get("X-Visitor-Ip")).toBe("203.0.113.5");
    expect(forwarded?.headers.get("X-Visitor-Country")).toBe("GE");
    expect(forwarded?.headers.get("User-Agent")).toBe("Mozilla/5.0 Test");
    expect(forwarded?.headers.get("Accept-Language")).toBe("ka-GE,ka;q=0.9");
    expect(await forwarded?.json()).toEqual({
      feedback: "ფოტო აკლია",
      locale: "ka",
      pages: 3,
      path: "/gvelebi/giurza",
      rating: 4,
      referrer: "google.com",
      seconds: 95,
    });
  });

  it("refuses other origins without calling the API", async () => {
    answer(201);
    for (const origin of ["https://evil.example", ""]) {
      const response = await POST(
        request({ locale: "ka", path: "/", rating: 5 }, { Origin: origin }),
      );
      expect(response.status).toBe(403);
    }
    expect(sent).toEqual([]);
  });

  it("refuses invalid or oversized bodies without calling the API", async () => {
    answer(201);
    for (const body of [
      "not json",
      [],
      null,
      { locale: "ka", path: "/", rating: 6 },
      { locale: "ka", path: "/", rating: 3 },
    ]) {
      expect((await POST(request(body))).status).toBe(400);
    }
    expect(
      (await POST(request({ feedback: "x".repeat(17 * 1024) }))).status,
    ).toBe(413);
    expect(sent).toEqual([]);
  });

  it("passes on the API's refusals and hides its own errors", async () => {
    const valid = { locale: "ka", path: "/", rating: 5 };
    for (const [status, expected] of [
      [429, 429],
      [400, 400],
      [401, 502],
      [500, 502],
    ]) {
      answer(status!);
      expect((await POST(request(valid))).status).toBe(expected);
    }
    server.use(http.post(API, () => HttpResponse.error()));
    expect((await POST(request(valid))).status).toBe(502);
  });
});
