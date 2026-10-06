import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/rating/route";

const request = (
  body: unknown,
  origin = "http://localhost",
  visitor = "203.0.113.1",
  headers: Record<string, string> = {},
) =>
  new Request("http://localhost/api/rating", {
    body: JSON.stringify(body),
    headers: {
      "cf-connecting-ip": visitor,
      "Content-Type": "application/json",
      origin,
      ...headers,
    },
    method: "POST",
  });

describe("POST /api/rating", () => {
  beforeEach(() => {
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "test-token");
    vi.stubEnv("TELEGRAM_CHAT_ID", "test-chat");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(Response.json({ ok: true })),
    );
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("sends the rating to Telegram", async () => {
    const response = await POST(
      request({ locale: "ka", path: "/gvelebi/giurza", rating: 4 }),
    );

    expect(response.status).toBe(204);
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, init] = vi.mocked(fetch).mock.calls[0]!;
    expect(url).toBe("https://api.telegram.org/bottest-token/sendMessage");
    expect(JSON.parse(String(init?.body))).toEqual({
      chat_id: "test-chat",
      text: "★★★★☆ 4/5\nhttps://reptiles.ge/gvelebi/giurza\n🌐 ka",
    });
  });

  it("adds the visit details the request carries", async () => {
    const response = await POST(
      request(
        {
          locale: "en",
          pages: 3,
          path: "/en/snakes/macrovipera-lebetina",
          rating: 2,
          referrer: "www.google.com",
          seconds: 135,
        },
        "http://localhost",
        "203.0.113.3",
        {
          "accept-language": "ka-GE,ka;q=0.9,en;q=0.8",
          "cf-ipcountry": "GE",
          "user-agent":
            "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36",
        },
      ),
    );

    expect(response.status).toBe(204);
    const [, init] = vi.mocked(fetch).mock.calls[0]!;
    expect(JSON.parse(String(init?.body)).text).toBe(
      [
        "★★☆☆☆ 2/5",
        "https://reptiles.ge/en/snakes/macrovipera-lebetina",
        "🌐 en · browser ka-GE",
        "📍 🇬🇪 Georgia",
        "📱 Android · Chrome",
        "⏱ 2 min 15 s on site · 3 pages",
        "↩ www.google.com",
      ].join("\n"),
    );
  });

  it("keeps the rating when the visit details are malformed", async () => {
    const response = await POST(
      request(
        {
          locale: "ka",
          pages: "many",
          path: "/",
          rating: 5,
          referrer: "https://evil.example/login now",
          seconds: -4,
        },
        "http://localhost",
        "203.0.113.4",
        { "accept-language": "<script>", "cf-ipcountry": "XX" },
      ),
    );

    expect(response.status).toBe(204);
    const [, init] = vi.mocked(fetch).mock.calls[0]!;
    expect(JSON.parse(String(init?.body)).text).toBe(
      "★★★★★ 5/5\nhttps://reptiles.ge\n🌐 ka",
    );
  });

  it("limits repeated ratings from one visitor", async () => {
    const send = () =>
      POST(
        request(
          { locale: "ka", path: "/", rating: 5 },
          "http://localhost",
          "203.0.113.2",
        ),
      );

    expect((await send()).status).toBe(204);
    expect((await send()).status).toBe(204);
    expect((await send()).status).toBe(204);
    expect((await send()).status).toBe(429);
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it("rejects a cross-origin request", async () => {
    const response = await POST(
      request({ locale: "ka", path: "/", rating: 5 }, "https://evil.example"),
    );

    expect(response.status).toBe(403);
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each([
    { locale: "ka", path: "/", rating: 0 },
    { locale: "ka", path: "/", rating: 6 },
    { locale: "ka", path: "/", rating: 4.5 },
    { locale: "ka", path: "/", rating: "5" },
    { locale: "de", path: "/", rating: 5 },
    { locale: "ka", path: "//evil.example", rating: 5 },
    { locale: "ka", path: "gvelebi", rating: 5 },
    { locale: "ka", path: "/a b", rating: 5 },
    { locale: "ka", path: `/${"a".repeat(300)}`, rating: 5 },
    null,
  ])("rejects an invalid body %#", async (body) => {
    const response = await POST(request(body));

    expect(response.status).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });
});
