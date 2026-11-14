import { afterEach, describe, expect, it, vi } from "vitest";

import { purgeSiteCache } from "@/lib/responseStoreDataCache";

import { POST } from "./route";

vi.mock("@/lib/responseStoreDataCache", () => ({
  purgeSiteCache: vi.fn(async () => true),
}));

function request(token?: string) {
  return new Request("https://reptiles.ge/api/revalidate", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    method: "POST",
  });
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("POST /api/revalidate", () => {
  it("purges the whole site cache with the shared token", async () => {
    vi.stubEnv("REVALIDATE_TOKEN", "secret");
    const response = await POST(request("secret"));
    expect(response.status).toBe(200);
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
    expect(await response.json()).toEqual({ revalidated: true });
    expect(purgeSiteCache).toHaveBeenCalledTimes(1);
  });

  it("rejects a missing or wrong token, and a missing secret", async () => {
    vi.stubEnv("REVALIDATE_TOKEN", "secret");
    expect((await POST(request())).status).toBe(401);
    expect((await POST(request("nope"))).status).toBe(401);
    vi.stubEnv("REVALIDATE_TOKEN", "");
    expect((await POST(request(""))).status).toBe(401);
    expect(purgeSiteCache).not.toHaveBeenCalled();
  });

  it("answers 503 when Cloudflare refuses the purge or the store fails", async () => {
    vi.stubEnv("REVALIDATE_TOKEN", "secret");
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(purgeSiteCache).mockResolvedValueOnce(false);
    expect((await POST(request("secret"))).status).toBe(503);
    vi.mocked(purgeSiteCache).mockRejectedValueOnce(new Error("down"));
    expect((await POST(request("secret"))).status).toBe(503);
    expect(log).toHaveBeenCalledWith(
      "Site cache purge failed",
      expect.any(Error),
    );
    log.mockRestore();
  });
});
