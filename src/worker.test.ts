import handler from "vinext/server/fetch-handler";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  MAINTENANCE_BYPASS_HEADER,
  MAINTENANCE_HEADER,
} from "@/lib/maintenance";
import { SITEMAP_CACHE_CONTROL } from "@/lib/responseCacheControl";
import worker from "@/worker";

vi.mock("vinext/server/fetch-handler", () => ({
  default: { fetch: vi.fn() },
}));

const VINEXT_DEFAULT = "private, max-age=0, must-revalidate";
const baseFetch = vi.mocked((handler as { fetch: typeof worker.fetch }).fetch);

function appResponse(contentType = "application/xml") {
  return new Response("body", {
    headers: { "Cache-Control": VINEXT_DEFAULT, "Content-Type": contentType },
  });
}

function forwarded() {
  return baseFetch.mock.calls[0][0];
}

describe("Worker fetch", () => {
  beforeEach(() => {
    baseFetch.mockReset();
    baseFetch.mockResolvedValue(appResponse());
  });

  it("answers 503 in maintenance mode before the app runs", async () => {
    const response = await worker.fetch(
      new Request("https://reptiles.ge/en/snakes"),
      { MAINTENANCE_MODE: "on" },
      {},
    );
    expect(response.status).toBe(503);
    expect(response.headers.get(MAINTENANCE_HEADER)).toBe("1");
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(baseFetch).not.toHaveBeenCalled();
  });

  it("lets a bypass token through maintenance to the app", async () => {
    const env = { MAINTENANCE_BYPASS_TOKEN: "team", MAINTENANCE_MODE: "on" };
    const ctx = {};
    const response = await worker.fetch(
      new Request("https://reptiles.ge/sitemap.xml", {
        headers: { [MAINTENANCE_BYPASS_HEADER]: "team" },
      }),
      env,
      ctx,
    );
    expect(response.status).toBe(200);
    expect(baseFetch).toHaveBeenCalledWith(expect.any(Request), env, ctx);
  });

  it("answers 429 to a rating over the Workers rate limit before the app runs", async () => {
    const response = await worker.fetch(
      new Request("https://reptiles.ge/api/rating", {
        headers: { origin: "https://reptiles.ge" },
        method: "POST",
      }),
      {
        RATING_VISITOR_LIMITER: {
          limit: vi.fn().mockResolvedValue({ success: false }),
        },
      },
      {},
    );
    expect(response.status).toBe(429);
    expect(baseFetch).not.toHaveBeenCalled();
  });

  it("sets the shared cache header on the app response", async () => {
    const response = await worker.fetch(
      new Request("https://reptiles.ge/sitemap.xml"),
      {},
      {},
    );
    expect(response.headers.get("Cache-Control")).toBe(SITEMAP_CACHE_CONTROL);
    expect(await response.text()).toBe("body");
  });

  it("leaves other app responses with the vinext header", async () => {
    baseFetch.mockResolvedValue(appResponse("text/html; charset=utf-8"));
    const response = await worker.fetch(
      new Request("https://reptiles.ge/en/snakes"),
      {},
      {},
    );
    expect(response.headers.get("Cache-Control")).toBe(VINEXT_DEFAULT);
  });

  it("hands the app a canonical RSC request", async () => {
    await worker.fetch(
      new Request("https://reptiles.ge/en/snakes?_rsc=abc", {
        headers: { "Next-Router-State-Tree": "tree", RSC: "1" },
      }),
      {},
      {},
    );
    const request = forwarded();
    expect(new URL(request.url).search).toBe("?_rsc");
    expect(request.headers.get("Next-Router-State-Tree")).toBeNull();
    expect(request.headers.get("RSC")).toBe("1");
  });

  it("passes a plain page request to the app unchanged", async () => {
    const request = new Request("https://reptiles.ge/en/snakes");
    await worker.fetch(request, {}, {});
    expect(forwarded()).toBe(request);
  });
});
