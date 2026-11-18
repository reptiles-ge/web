import { describe, expect, it, vi } from "vitest";

import type { ApiBindings, RateLimiter } from "../env";
import type { ErrorBody } from "../testing/request";

import { app } from "../app";
import { speciesPageUrl } from "../lib/mcpTools";
import { createNewsTestDatabase } from "../testing/sqliteDatabase";

type RpcBody = {
  error?: { code: number; data?: unknown; message: string };
  id: number;
  jsonrpc: "2.0";
  result?: Record<string, unknown> & {
    content?: Array<{ text: string; type: string }>;
    isError?: boolean;
    structuredContent?: Record<string, unknown>;
  };
};

type SpeciesCard = {
  commonName: string;
  group: string;
  id: string;
  url: string;
};

const NEWS_SLUG = "batumi-raptor-count-2026-season-ends";

const env: ApiBindings = { DB: createNewsTestDatabase().db };

let nextId = 0;

async function callTool(name: string, args: Record<string, unknown> = {}) {
  return rpc("tools/call", { arguments: args, name });
}

function limiter(success: boolean): RateLimiter {
  return { limit: vi.fn(async () => ({ success })) };
}

function post(
  body: unknown,
  headers: Record<string, string> = {},
  bindings: ApiBindings = env,
) {
  return app.request(
    "/v1/mcp",
    {
      body: JSON.stringify(body),
      headers: {
        Accept: "application/json, text/event-stream",
        "cf-connecting-ip": "203.0.113.9",
        "Content-Type": "application/json",
        ...headers,
      },
      method: "POST",
    },
    bindings,
  );
}

async function rpc(method: string, params?: Record<string, unknown>) {
  nextId += 1;
  const response = await post({ id: nextId, jsonrpc: "2.0", method, params });
  expect(response.status).toBe(200);
  return (await response.json()) as RpcBody;
}

async function toolData<T>(name: string, args: Record<string, unknown> = {}) {
  const body = await callTool(name, args);
  expect(body.error).toBeUndefined();
  expect(body.result?.isError).toBeUndefined();
  const data = body.result!.structuredContent as T;
  expect(JSON.parse(body.result!.content![0]!.text)).toEqual(data);
  return data;
}

describe("POST /v1/mcp", () => {
  it("initializes without an API key and echoes a supported version", async () => {
    const response = await app.request(
      "/v1/mcp",
      {
        body: JSON.stringify({
          id: 1,
          jsonrpc: "2.0",
          method: "initialize",
          params: {
            capabilities: {},
            clientInfo: { name: "test", version: "1" },
            protocolVersion: "2025-06-18",
          },
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      },
      { ...env, API_KEY_MODE: "enforce" },
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    const body = (await response.json()) as RpcBody;
    expect(body.result).toMatchObject({
      capabilities: { tools: {} },
      protocolVersion: "2025-06-18",
      serverInfo: { name: "reptiles-ge" },
    });
    expect(body.result!.instructions).toContain("112");
  });

  it("offers its newest version for an unknown one", async () => {
    const body = await rpc("initialize", { protocolVersion: "1999-01-01" });
    expect(body.result!.protocolVersion).toBe("2025-11-25");
  });

  it("accepts notifications with 202 and no body", async () => {
    const response = await post({
      jsonrpc: "2.0",
      method: "notifications/initialized",
    });
    expect(response.status).toBe(202);
    expect(await response.text()).toBe("");
  });

  it("answers ping", async () => {
    expect((await rpc("ping")).result).toEqual({});
  });

  it("lists read-only tools with JSON input schemas", async () => {
    const body = await rpc("tools/list");
    const tools = body.result!.tools as Array<{
      annotations: Record<string, boolean>;
      inputSchema: Record<string, unknown>;
      name: string;
    }>;
    expect(tools.map((tool) => tool.name)).toEqual([
      "search_species",
      "get_species",
      "search_news",
      "get_news",
    ]);
    for (const tool of tools) {
      expect(tool.annotations.readOnlyHint).toBe(true);
      expect(tool.inputSchema.type).toBe("object");
      expect(tool.inputSchema).not.toHaveProperty("$schema");
      expect(tool.inputSchema.required ?? []).not.toContain("locale");
    }
  });

  it("finds species by name in any locale and pages through them", async () => {
    const giurza = await toolData<{ results: SpeciesCard[]; total: number }>(
      "search_species",
      { locale: "en", query: "გიურზა" },
    );
    expect(giurza.results.map((card) => card.id)).toEqual([
      "macrovipera-lebetina",
    ]);
    expect(giurza.results[0]!.url).toBe(
      "https://reptiles.ge/en/snakes/macrovipera-lebetina",
    );

    const snakes = await toolData<{
      nextOffset: null | number;
      results: SpeciesCard[];
      total: number;
    }>("search_species", { group: "snake", limit: 5 });
    expect(snakes.results).toHaveLength(5);
    expect(snakes.total).toBeGreaterThan(5);
    expect(snakes.nextOffset).toBe(5);
    expect(snakes.results.every((card) => card.group === "snake")).toBe(true);
    expect(
      snakes.results.every((card) =>
        card.url.startsWith("https://reptiles.ge/gvelebi/"),
      ),
    ).toBe(true);

    const rest = await toolData<{ results: SpeciesCard[] }>("search_species", {
      group: "snake",
      limit: 5,
      offset: 5,
    });
    expect(rest.results[0]!.id).not.toBe(snakes.results[0]!.id);
  });

  it("reads a profile by id or Georgian slug without the photo gallery", async () => {
    const byId = await toolData<Record<string, unknown>>("get_species", {
      id: "macrovipera-lebetina",
    });
    const bySlug = await toolData<Record<string, unknown>>("get_species", {
      id: "giurza",
    });
    expect(bySlug).toEqual(byId);
    expect(byId).toMatchObject({
      id: "macrovipera-lebetina",
      locale: "ka",
      slug: "giurza",
      url: "https://reptiles.ge/gvelebi/giurza",
    });
    expect(byId).not.toHaveProperty("gallery");
    expect(typeof byId.photoCount).toBe("number");
    expect(Array.isArray(byId.sources)).toBe(true);

    const english = await toolData<Record<string, unknown>>("get_species", {
      id: "macrovipera-lebetina",
      locale: "en",
    });
    expect(english.url).toBe(
      "https://reptiles.ge/en/snakes/macrovipera-lebetina",
    );
    expect(english.commonName).not.toBe(byId.commonName);
  });

  it("resolves a former slug or a scientific name to the current profile", async () => {
    for (const id of [
      "tsxvirrkosani-gvelgesla",
      "vipera-ammodytes",
      "VIPERA-AMMODYTES",
    ]) {
      const profile = await toolData<Record<string, unknown>>("get_species", {
        id,
        locale: "en",
      });
      expect(profile, id).toMatchObject({
        id: "vipera-transcaucasiana",
        url: "https://reptiles.ge/en/snakes/vipera-transcaucasiana",
      });
    }
    const lebetinus = await toolData<Record<string, unknown>>("get_species", {
      id: "macrovipera-lebetinus",
    });
    expect(lebetinus.id).toBe("macrovipera-lebetina");
    const former = await toolData<Record<string, unknown>>("get_species", {
      id: "kavkasiuri-jvarula",
    });
    expect(former).toMatchObject({
      id: "pelodytes-caucasicus",
      slug: "kavkasiuri-jvriana",
    });
  });

  it("reports an unknown species as a tool error", async () => {
    const body = await callTool("get_species", { id: "no-such-species" });
    expect(body.result!.isError).toBe(true);
    expect(body.result!.content![0]!.text).toContain("search_species");
  });

  it("finds and reads news", async () => {
    const list = await toolData<{
      results: Array<{ slug: string; url: string }>;
      total: number;
    }>("search_news", { locale: "en", query: "raptor" });
    expect(list.results.map((article) => article.slug)).toContain(NEWS_SLUG);
    expect(
      list.results.find((article) => article.slug === NEWS_SLUG)!.url,
    ).toBe(`https://reptiles.ge/en/news/${NEWS_SLUG}`);

    const article = await toolData<Record<string, unknown>>("get_news", {
      locale: "en",
      slug: NEWS_SLUG,
    });
    expect(article).toMatchObject({
      locale: "en",
      slug: NEWS_SLUG,
      url: `https://reptiles.ge/en/news/${NEWS_SLUG}`,
    });
    expect(Array.isArray(article.sections)).toBe(true);

    const missing = await callTool("get_news", { slug: "no-such-article" });
    expect(missing.result!.isError).toBe(true);
  });

  it("answers JSON-RPC errors for bad methods, tools and arguments", async () => {
    expect((await rpc("resources/list")).error?.code).toBe(-32_601);
    expect((await callTool("drop_tables")).error?.code).toBe(-32_602);
    expect((await rpc("tools/call", {})).error?.code).toBe(-32_602);
    const invalid = await callTool("search_species", { limit: 500 });
    expect(invalid.error?.code).toBe(-32_602);
    const extra = await callTool("get_species", { id: "giurza", sql: "x" });
    expect(extra.error?.code).toBe(-32_602);
  });

  it("refuses a message that is not JSON-RPC", async () => {
    const response = await post({ hello: "world" });
    expect(response.status).toBe(400);
    expect(((await response.json()) as ErrorBody).error.code).toBe(
      "invalid_request",
    );
  });

  it("refuses an unsupported protocol version header", async () => {
    const response = await post(
      { id: 1, jsonrpc: "2.0", method: "ping" },
      { "MCP-Protocol-Version": "1999-01-01" },
    );
    expect(response.status).toBe(400);
    const ok = await post(
      { id: 1, jsonrpc: "2.0", method: "ping" },
      { "MCP-Protocol-Version": "2025-06-18" },
    );
    expect(ok.status).toBe(200);
  });

  it("rate limits by IP address", async () => {
    const blocked = limiter(false);
    const response = await post(
      { id: 1, jsonrpc: "2.0", method: "ping" },
      {},
      { ...env, MCP_LIMITER: blocked },
    );
    expect(response.status).toBe(429);
    expect(blocked.limit).toHaveBeenCalledWith({ key: "203.0.113.9" });
    const open = await post(
      { id: 1, jsonrpc: "2.0", method: "ping" },
      {},
      { ...env, MCP_LIMITER: limiter(true) },
    );
    expect(open.status).toBe(200);
  });
});

describe("GET /v1/mcp", () => {
  it("opens no event stream", async () => {
    const response = await app.request("/v1/mcp", {}, env);
    expect(response.status).toBe(405);
    expect(response.headers.get("Allow")).toBe("POST");
    expect(((await response.json()) as ErrorBody).error.code).toBe(
      "method_not_allowed",
    );
  });
});

describe("speciesPageUrl", () => {
  it("builds a page URL for every animal group", () => {
    expect(speciesPageUrl("fish", "x", "ka")).toBe(
      "https://reptiles.ge/tevzebi/x",
    );
    expect(speciesPageUrl("bird", "bubo-bubo", "ru")).toBe(
      "https://reptiles.ge/ru/birds/bubo-bubo",
    );
  });
});
