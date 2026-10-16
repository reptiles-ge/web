import { describe, expect, it } from "vitest";

import { GET } from "@/app/api/geo/route";

const request = (headers: Record<string, string> = {}) =>
  new Request("http://localhost/api/geo", { headers });

describe("GET /api/geo", () => {
  it("returns the Cloudflare country without caching or indexing", async () => {
    const response = GET(request({ "cf-ipcountry": "de" }));
    expect(await response.json()).toEqual({ country: "DE" });
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
  });

  it("returns null without a usable country header", async () => {
    expect(await GET(request()).json()).toEqual({ country: null });
    expect(await GET(request({ "cf-ipcountry": "XX" })).json()).toEqual({
      country: null,
    });
  });
});
