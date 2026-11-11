import { afterEach, describe, expect, it, vi } from "vitest";

import type { ApiBindings } from "../env";

import {
  requestFullSiteWarm,
  WARM_CONCURRENCY,
  WARM_WORKFLOW_URL,
  warmSitePaths,
} from "./siteWarm";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function siteEnv(fetch: (request: Request) => Promise<Response>) {
  return { SITE: { fetch } } as unknown as ApiBindings;
}

describe("warmSitePaths", () => {
  it("fetches every path as HTML and as RSC through the site binding", async () => {
    const requests: Request[] = [];
    const env = siteEnv(async (request) => {
      requests.push(request);
      return new Response("<html></html>");
    });
    expect(await warmSitePaths(env, ["/gvelebi/giurza", "/en/snakes/x"])).toBe(
      4,
    );
    expect(requests.map((request) => request.url).sort()).toEqual([
      "https://reptiles.ge/en/snakes/x",
      "https://reptiles.ge/en/snakes/x?_rsc",
      "https://reptiles.ge/gvelebi/giurza",
      "https://reptiles.ge/gvelebi/giurza?_rsc",
    ]);
    const html = requests.find((request) => !request.url.endsWith("?_rsc"))!;
    expect(html.headers.get("Accept")).toBe("text/html");
    expect(html.headers.get("RSC")).toBeNull();
    const rsc = requests.find((request) => request.url.endsWith("?_rsc"))!;
    expect(rsc.headers.get("RSC")).toBe("1");
    expect(rsc.headers.get("User-Agent")).toBe("reptiles-cache-warmer");
  });

  it("keeps at most a few requests in flight", async () => {
    let open = 0;
    let peak = 0;
    const env = siteEnv(async () => {
      open += 1;
      peak = Math.max(peak, open);
      await new Promise((resolve) => setTimeout(resolve, 1));
      open -= 1;
      return new Response("ok");
    });
    const paths = Array.from({ length: 6 }, (_, index) => `/p${index}`);
    expect(await warmSitePaths(env, paths)).toBe(12);
    expect(peak).toBe(WARM_CONCURRENCY);
  });

  it("counts only successful pages and survives a failed fetch", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const env = siteEnv(async (request) => {
      if (request.url.endsWith("?_rsc")) throw new Error("down");
      return new Response(null, { status: 500 });
    });
    expect(await warmSitePaths(env, ["/a"])).toBe(0);
    expect(console.error).toHaveBeenCalledWith(
      "Site warm failed for https://reptiles.ge/a?_rsc",
      expect.any(Error),
    );
  });

  it("does nothing without the site binding", async () => {
    expect(await warmSitePaths({} as ApiBindings, ["/a"])).toBe(0);
  });
});

describe("requestFullSiteWarm", () => {
  it("dispatches the warm workflow on main with warm_only", async () => {
    const fetch = vi.fn<(url: string, init: RequestInit) => Promise<Response>>(
      async () => new Response(null, { status: 204 }),
    );
    vi.stubGlobal("fetch", fetch);
    const env = { WARM_DISPATCH_TOKEN: "gh-token" } as ApiBindings;
    expect(await requestFullSiteWarm(env)).toBe(true);
    const [url, init] = fetch.mock.calls[0]!;
    expect(url).toBe(WARM_WORKFLOW_URL);
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>).Authorization).toBe(
      "Bearer gh-token",
    );
    expect(JSON.parse(init.body as string)).toEqual({
      inputs: { warm_only: "true" },
      ref: "main",
    });
  });

  it("logs and skips without a token, on a refusal and on a network error", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const fetch = vi.fn(async () => new Response(null, { status: 403 }));
    vi.stubGlobal("fetch", fetch);
    expect(await requestFullSiteWarm({} as ApiBindings)).toBe(false);
    expect(fetch).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith("Site warm is not configured");
    const env = { WARM_DISPATCH_TOKEN: "gh-token" } as ApiBindings;
    expect(await requestFullSiteWarm(env)).toBe(false);
    expect(log).toHaveBeenCalledWith("Site warm dispatch answered 403");
    fetch.mockRejectedValueOnce(new Error("offline"));
    expect(await requestFullSiteWarm(env)).toBe(false);
    expect(log).toHaveBeenCalledWith(
      "Site warm dispatch failed",
      expect.any(Error),
    );
  });
});
