import { afterEach, describe, expect, it, vi } from "vitest";

import { EnvError, publicEnv, serverEnv, validateEnv } from "@/lib/env";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("publicEnv", () => {
  it("allows every public variable to be unset", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_ENV", "");
    expect(publicEnv().NEXT_PUBLIC_SITE_URL).toBeUndefined();
    expect(publicEnv().VERCEL_ENV).toBeUndefined();
  });

  it("adds https to a bare host and strips trailing slashes", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "staging.reptiles.ge//");
    expect(publicEnv().NEXT_PUBLIC_SITE_URL).toBe(
      "https://staging.reptiles.ge",
    );
  });

  it("keeps an explicit http origin", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3333/");
    expect(publicEnv().NEXT_PUBLIC_SITE_URL).toBe("http://localhost:3333");
  });

  it("rejects a site URL that is not a URL", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "not a url");
    expect(() => publicEnv()).toThrow(EnvError);
    expect(() => publicEnv()).toThrow(/NEXT_PUBLIC_SITE_URL/);
  });

  it("rejects an unknown NODE_ENV or VERCEL_ENV", () => {
    vi.stubEnv("NODE_ENV", "staging");
    expect(() => publicEnv()).toThrow(/NODE_ENV/);
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("VERCEL_ENV", "qa");
    expect(() => publicEnv()).toThrow(/VERCEL_ENV/);
  });
});

describe("serverEnv", () => {
  it("treats blank values as unset and trims the rest", () => {
    vi.stubEnv("BUNNY_STORAGE_ZONE", " zone ");
    vi.stubEnv("BUNNY_STORAGE_ACCESS_KEY", "   ");
    const env = serverEnv();
    expect(env.BUNNY_STORAGE_ZONE).toBe("zone");
    expect(env.BUNNY_STORAGE_ACCESS_KEY).toBeUndefined();
  });

  it("rejects a CDN base URL that is not a URL", () => {
    vi.stubEnv("BUNNY_CDN_BASE_URL", "cdn");
    expect(() => serverEnv()).toThrow(/BUNNY_CDN_BASE_URL/);
  });

  it("defaults the local AI backend to Claude without overrides", () => {
    vi.stubEnv("AI_BACKEND", "");
    vi.stubEnv("AI_EFFORT_OVERRIDES", "");
    const env = serverEnv();
    expect(env.AI_BACKEND).toBe("claude");
    expect(env.AI_EFFORT_OVERRIDES).toBeUndefined();
  });

  it("parses per-profile effort and model overrides", () => {
    vi.stubEnv("AI_BACKEND", "codex");
    vi.stubEnv(
      "AI_EFFORT_OVERRIDES",
      "super:analysis=medium, super:texts = high",
    );
    vi.stubEnv("AI_MODEL_OVERRIDES", "super:links=claude-haiku-5-5");
    const env = serverEnv();
    expect(env.AI_BACKEND).toBe("codex");
    expect(env.AI_EFFORT_OVERRIDES).toEqual({
      "super:analysis": "medium",
      "super:texts": "high",
    });
    expect(env.AI_MODEL_OVERRIDES).toEqual({
      "super:links": "claude-haiku-5-5",
    });
  });

  it("rejects an unknown backend, profile, effort or model", () => {
    vi.stubEnv("AI_BACKEND", "gemini");
    expect(() => serverEnv()).toThrow(/AI_BACKEND/);
    vi.stubEnv("AI_BACKEND", "");
    vi.stubEnv("AI_EFFORT_OVERRIDES", "super:analysis=xhigh");
    expect(() => serverEnv()).toThrow(/AI_EFFORT_OVERRIDES/);
    vi.stubEnv("AI_EFFORT_OVERRIDES", "super:everything=low");
    expect(() => serverEnv()).toThrow(/AI_EFFORT_OVERRIDES/);
    vi.stubEnv("AI_EFFORT_OVERRIDES", "");
    vi.stubEnv("AI_MODEL_OVERRIDES", "super:links=gpt-6-sol");
    expect(() => serverEnv()).toThrow(/AI_MODEL_OVERRIDES/);
  });
});

describe("validateEnv", () => {
  it("passes for the default test environment", () => {
    expect(() => validateEnv()).not.toThrow();
  });

  it("lists every problem in one error", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "not a url");
    vi.stubEnv("BUNNY_CDN_BASE_URL", "cdn");
    expect(() => validateEnv()).toThrow(/NEXT_PUBLIC_SITE_URL/);
  });
});
