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
