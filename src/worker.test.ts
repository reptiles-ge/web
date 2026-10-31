import handler from "vinext/server/fetch-handler";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  MAINTENANCE_BYPASS_HEADER,
  MAINTENANCE_HEADER,
} from "@/lib/maintenance";
import { MARKDOWN_CONTENT_TYPE } from "@/lib/markdownNegotiation";
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

  it("hands an RSC request to the app unchanged", async () => {
    const original = new Request("https://reptiles.ge/en/snakes?_rsc=abc", {
      headers: { "Next-Router-State-Tree": "tree", RSC: "1" },
    });
    await worker.fetch(original, {}, {});
    expect(forwarded()).toBe(original);
  });

  it("serves the API docs page from the API binding at /docs", async () => {
    const apiFetch = vi.fn(
      async () =>
        new Response("<html>docs</html>", {
          headers: { "Cache-Control": "public, max-age=300" },
        }),
    );
    const response = await worker.fetch(
      new Request("https://reptiles.ge/docs?theme=dark", {
        headers: { "If-None-Match": '"tag"' },
      }),
      { API: { fetch: apiFetch } },
      {},
    );
    const [request] = apiFetch.mock.calls[0] as unknown as [Request];
    expect(request.url).toBe("https://api.reptiles.ge/v1/docs?theme=dark");
    expect(request.headers.get("If-None-Match")).toBe('"tag"');
    expect(response.headers.get("Cache-Control")).toBe("public, max-age=300");
    expect(response.headers.get("Content-Security-Policy")).toBeNull();
    expect(await response.text()).toBe("<html>docs</html>");
    expect(baseFetch).not.toHaveBeenCalled();
  });

  it("serves the OpenAPI document from the API binding", async () => {
    const apiFetch = vi.fn(async () => Response.json({ openapi: "3.1.0" }));
    const response = await worker.fetch(
      new Request("https://reptiles.ge/v1/docs/openapi.json"),
      { API: { fetch: apiFetch } },
      {},
    );
    const [request] = apiFetch.mock.calls[0] as unknown as [Request];
    expect(request.url).toBe("https://api.reptiles.ge/v1/docs/openapi.json");
    expect(await response.json()).toEqual({ openapi: "3.1.0" });
    expect(baseFetch).not.toHaveBeenCalled();
  });

  it("keeps other API paths on the app", async () => {
    const apiFetch = vi.fn();
    for (const path of ["/v1/docs", "/v1/species", "/docs/extra"]) {
      await worker.fetch(
        new Request(`https://reptiles.ge${path}`),
        { API: { fetch: apiFetch } },
        {},
      );
    }
    expect(apiFetch).not.toHaveBeenCalled();
    expect(baseFetch).toHaveBeenCalledTimes(3);
  });

  it("leaves /docs to the app without an API binding", async () => {
    await worker.fetch(new Request("https://reptiles.ge/docs"), {}, {});
    expect(baseFetch).toHaveBeenCalledTimes(1);
  });

  it("answers /docs with 503 in maintenance mode", async () => {
    const apiFetch = vi.fn();
    const response = await worker.fetch(
      new Request("https://reptiles.ge/docs"),
      { API: { fetch: apiFetch }, MAINTENANCE_MODE: "on" },
      {},
    );
    expect(response.status).toBe(503);
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it("passes a plain page request to the app unchanged", async () => {
    const request = new Request("https://reptiles.ge/en/snakes");
    await worker.fetch(request, {}, {});
    expect(forwarded()).toBe(request);
  });

  it("adds Accept to Vary on HTML pages", async () => {
    baseFetch.mockResolvedValue(appResponse("text/html; charset=utf-8"));
    const response = await worker.fetch(
      new Request("https://reptiles.ge/en/snakes"),
      {},
      {},
    );
    expect(response.headers.get("Vary")).toBe("Accept");
    expect(response.headers.get("Link")).toBe(
      '</en/snakes.md>; rel="alternate"; type="text/markdown"',
    );
  });

  it("answers Accept: text/markdown with the page as Markdown", async () => {
    baseFetch.mockResolvedValue(
      new Response("<html><body><main><h1>გველები</h1></main></body></html>", {
        headers: {
          "Cache-Control": VINEXT_DEFAULT,
          "Content-Type": "text/html; charset=utf-8",
        },
      }),
    );
    const response = await worker.fetch(
      new Request("https://reptiles.ge/gvelebi", {
        headers: { Accept: "text/markdown, text/html;q=0.9" },
      }),
      {},
      {},
    );
    expect(forwarded().headers.get("Accept")).toBe("text/html");
    expect(response.headers.get("Content-Type")).toBe(MARKDOWN_CONTENT_TYPE);
    expect(response.headers.get("Cache-Control")).toBe(VINEXT_DEFAULT);
    expect(await response.text()).toBe("# გველები\n");
  });

  it("answers a .md URL with its page as Markdown", async () => {
    baseFetch.mockResolvedValue(
      new Response("<html><body><main><h1>გიურზა</h1></main></body></html>", {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }),
    );
    const response = await worker.fetch(
      new Request("https://reptiles.ge/gvelebi/giurza.md"),
      {},
      {},
    );
    expect(forwarded().url).toBe("https://reptiles.ge/gvelebi/giurza");
    expect(forwarded().headers.get("Accept")).toBe("text/html");
    expect(response.headers.get("Content-Type")).toBe(MARKDOWN_CONTENT_TYPE);
    expect(await response.text()).toBe("# გიურზა\n");
  });

  it("keeps a redirected .md URL on Markdown", async () => {
    baseFetch.mockResolvedValue(
      new Response(null, {
        headers: { Location: "/gvelebi/giurza" },
        status: 301,
      }),
    );
    const response = await worker.fetch(
      new Request("https://reptiles.ge/species/macrovipera-lebetina.md"),
      {},
      {},
    );
    expect(response.status).toBe(301);
    expect(response.headers.get("Location")).toBe(
      "https://reptiles.ge/gvelebi/giurza.md",
    );
  });

  it("keeps an Accept-negotiated redirect on the HTML URL", async () => {
    baseFetch.mockResolvedValue(
      new Response(null, {
        headers: { Location: "/gvelebi/giurza" },
        status: 301,
      }),
    );
    const response = await worker.fetch(
      new Request("https://reptiles.ge/species/macrovipera-lebetina", {
        headers: { Accept: "text/markdown" },
      }),
      {},
      {},
    );
    expect(response.headers.get("Location")).toBe("/gvelebi/giurza");
  });

  it("answers Markdown requests with 503 in maintenance mode", async () => {
    const response = await worker.fetch(
      new Request("https://reptiles.ge/gvelebi", {
        headers: { Accept: "text/markdown" },
      }),
      { MAINTENANCE_MODE: "on" },
      {},
    );
    expect(response.status).toBe(503);
    expect(baseFetch).not.toHaveBeenCalled();
  });
});
