import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { server } from "../../../../tests/msw/server";
import { POST } from "./route";

const API = "https://api.reptiles.ge/v1/access-requests";
const SITE = "https://reptiles.ge";

const validBody = {
  consent: true,
  data: ["species"],
  description: "",
  email: "nino@example.com",
  locale: "en",
  name: "Nino",
  organization: "",
  projectType: "education",
  volume: "10kTo100k",
  website: "https://school.example.com",
};

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
  return new Request(`${SITE}/api/access-request`, {
    body: typeof body === "string" ? body : JSON.stringify(body),
    headers: {
      "cf-connecting-ip": "203.0.113.5",
      "Content-Type": "application/json",
      Origin: SITE,
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

describe("POST /api/access-request", () => {
  it("forwards the request to the API with the site key and the visitor", async () => {
    answer(201);
    const response = await POST(request(validBody));
    expect(response.status).toBe(201);
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
    const [forwarded] = sent;
    expect(forwarded?.headers.get("X-Api-Key")).toBe("site-key");
    expect(forwarded?.headers.get("Origin")).toBe(SITE);
    expect(forwarded?.headers.get("X-Visitor-Ip")).toBe("203.0.113.5");
    expect(await forwarded?.json()).toEqual(validBody);
  });

  it("refuses another origin", async () => {
    const response = await POST(
      request(validBody, { Origin: "https://example.com" }),
    );
    expect(response.status).toBe(403);
    expect(sent).toEqual([]);
  });

  it("refuses a body over 16 KB", async () => {
    const response = await POST(
      request({ ...validBody, description: "x".repeat(17 * 1024) }),
    );
    expect(response.status).toBe(413);
  });

  it("refuses invalid JSON and an invalid request", async () => {
    expect((await POST(request("{"))).status).toBe(400);
    expect((await POST(request([]))).status).toBe(400);
    expect((await POST(request({ ...validBody, consent: false }))).status).toBe(
      400,
    );
    expect(sent).toEqual([]);
  });

  it("passes on a delivery failure and hides other API errors", async () => {
    answer(503);
    expect((await POST(request(validBody))).status).toBe(503);
    answer(500);
    const response = await POST(request(validBody));
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: "Request not sent" });
  });

  it("answers 502 when the API cannot be reached", async () => {
    server.use(http.post(API, () => HttpResponse.error()));
    expect((await POST(request(validBody))).status).toBe(502);
  });
});
