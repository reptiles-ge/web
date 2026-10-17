import { describe, expect, it, vi } from "vitest";

import { ratingRateLimitResponse } from "@/lib/ratingRateLimit";

const rating = (method = "POST", path = "/api/rating", ip = "203.0.113.1") =>
  new Request(`https://reptiles.ge${path}`, {
    headers: { "cf-connecting-ip": ip },
    method,
  });

const limiter = (success: boolean) => ({
  limit: vi.fn().mockResolvedValue({ success }),
});

describe("ratingRateLimitResponse", () => {
  it("passes a rating within both limits", async () => {
    const visitor = limiter(true);
    const global = limiter(true);
    const env = {
      RATING_GLOBAL_LIMITER: global,
      RATING_VISITOR_LIMITER: visitor,
    };

    expect(await ratingRateLimitResponse(rating(), env)).toBeNull();
    expect(visitor.limit).toHaveBeenCalledWith({ key: "203.0.113.1" });
    expect(global.limit).toHaveBeenCalledWith({ key: "all" });
  });

  it("answers 429 when the visitor limit is spent", async () => {
    const global = limiter(true);
    const response = await ratingRateLimitResponse(rating(), {
      RATING_GLOBAL_LIMITER: global,
      RATING_VISITOR_LIMITER: limiter(false),
    });

    expect(response?.status).toBe(429);
    expect(response?.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
    expect(await response?.json()).toEqual({ error: "Too many ratings" });
    expect(global.limit).not.toHaveBeenCalled();
  });

  it("answers 429 when the global limit is spent", async () => {
    const response = await ratingRateLimitResponse(rating(), {
      RATING_GLOBAL_LIMITER: limiter(false),
      RATING_VISITOR_LIMITER: limiter(true),
    });

    expect(response?.status).toBe(429);
  });

  it("keys a request without a client IP as unknown", async () => {
    const visitor = limiter(true);
    await ratingRateLimitResponse(
      new Request("https://reptiles.ge/api/rating", { method: "POST" }),
      { RATING_VISITOR_LIMITER: visitor },
    );

    expect(visitor.limit).toHaveBeenCalledWith({ key: "unknown" });
  });

  it.each([
    ["GET", "/api/rating"],
    ["POST", "/api/ratings"],
    ["POST", "/en/snakes"],
  ])("ignores %s %s", async (method, path) => {
    const visitor = limiter(false);

    expect(
      await ratingRateLimitResponse(rating(method, path), {
        RATING_VISITOR_LIMITER: visitor,
      }),
    ).toBeNull();
    expect(visitor.limit).not.toHaveBeenCalled();
  });

  it.each([undefined, null, "env", {}, { RATING_VISITOR_LIMITER: {} }])(
    "passes through without the bindings %#",
    async (env) => {
      expect(await ratingRateLimitResponse(rating(), env)).toBeNull();
    },
  );
});
