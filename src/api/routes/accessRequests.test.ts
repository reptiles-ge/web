import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiBindings, RateLimiter } from "../env";

import { app } from "../app";
import { type ErrorBody } from "../testing/request";
import { createTestDatabase } from "../testing/sqliteDatabase";

const SITE = "https://reptiles.ge";
const SITE_KEY = "site-key";

const validBody = {
  consent: true,
  data: ["species", "risk"],
  description: "Show venomous snakes along hiking routes.",
  email: "nino@example.com",
  locale: "ka",
  name: "Nino",
  organization: "Trails Georgia",
  projectType: "tourism",
  volume: "under10k",
  website: "https://trails.example.com",
};

let env: ApiBindings;

function limiter(success: boolean): RateLimiter {
  return { limit: vi.fn(async () => ({ success })) };
}

function post(body: unknown, headers: Record<string, string> = {}) {
  return app.request(
    "/v1/access-requests",
    {
      body: JSON.stringify(body),
      headers: {
        "cf-connecting-ip": "203.0.113.5",
        "Content-Type": "application/json",
        Origin: SITE,
        "X-Api-Key": SITE_KEY,
        ...headers,
      },
      method: "POST",
    },
    env,
  );
}

function telegramText() {
  const [, init] = vi.mocked(fetch).mock.calls[0]!;
  return (JSON.parse(String(init?.body)) as { text: string }).text;
}

beforeEach(() => {
  env = {
    DB: createTestDatabase().db,
    SITE_API_KEY: SITE_KEY,
    TELEGRAM_BOT_TOKEN: "bot",
    TELEGRAM_CHAT_ID: "chat",
  };
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => Response.json({ ok: true })),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("POST /v1/access-requests", () => {
  it("sends the request to Telegram and answers 201", async () => {
    const response = await post(validBody);
    expect(response.status).toBe(201);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe(SITE);
    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      "https://api.telegram.org/botbot/sendMessage",
      expect.objectContaining({ method: "POST" }),
    );
    expect(telegramText()).toBe(
      [
        "🔑 API access request",
        "👤 Nino",
        "✉️ nino@example.com",
        "🏢 Trails Georgia",
        "🔗 https://trails.example.com",
        "📁 Tourism",
        "📦 species, risk information",
        "📈 up to 10k requests a month",
        "🌐 ka",
        "\n💬 Show venomous snakes along hiking routes.",
      ].join("\n"),
    );
  });

  it("leaves out empty optional fields", async () => {
    const response = await post({
      ...validBody,
      data: [],
      description: "  ",
      organization: undefined,
      volume: "over100k",
    });
    expect(response.status).toBe(201);
    expect(telegramText()).not.toMatch(/🏢|📦|💬/);
    expect(telegramText()).toContain("📈 over 100k requests a month");
  });

  it("rejects an invalid body with every problem listed", async () => {
    const response = await post({
      ...validBody,
      consent: false,
      data: ["species", "species"],
      email: "not-an-email",
      name: " ",
    });
    expect(response.status).toBe(400);
    const body = (await response.json()) as ErrorBody;
    expect(body.error.code).toBe("invalid_request");
    expect(vi.mocked(fetch)).not.toHaveBeenCalled();
  });

  it("needs the site key", async () => {
    const response = await post(validBody, { "X-Api-Key": "other" });
    expect(response.status).toBe(401);
    expect(vi.mocked(fetch)).not.toHaveBeenCalled();
  });

  it("refuses another origin", async () => {
    const response = await post(validBody, {
      Origin: "https://example.com",
    });
    expect(response.status).toBe(403);
  });

  it("rate-limits per visitor", async () => {
    env.ACCESS_REQUEST_VISITOR_LIMITER = limiter(false);
    env.ACCESS_REQUEST_GLOBAL_LIMITER = limiter(true);
    const response = await post(validBody);
    expect(response.status).toBe(429);
    expect(vi.mocked(fetch)).not.toHaveBeenCalled();
  });

  it("answers 503 when Telegram is not configured", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    delete env.TELEGRAM_BOT_TOKEN;
    const response = await post(validBody);
    expect(response.status).toBe(503);
    const body = (await response.json()) as ErrorBody;
    expect(body.error.code).toBe("delivery_failed");
  });

  it("answers 503 when Telegram fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(fetch).mockResolvedValueOnce(
      Response.json({ ok: false }, { status: 400 }),
    );
    const response = await post(validBody);
    expect(response.status).toBe(503);
  });
});
