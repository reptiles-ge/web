import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  inspectProxyRequest,
  isBackgroundRequest,
  matchesInspectorScope,
  requestInspectorScope,
  snapshotRequest,
} from "@/lib/requestInspector";

function request(path: string, headers: Record<string, string> = {}) {
  return new NextRequest(`http://localhost:3001${path}`, { headers });
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("requestInspectorScope", () => {
  it("is off outside development", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("REQUEST_INSPECTOR", "*");
    expect(requestInspectorScope()).toBeNull();
  });

  it("is off in development without the variable", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("REQUEST_INSPECTOR", " ");
    expect(requestInspectorScope()).toBeNull();
  });

  it.each(["*", "1"])("covers every path for %s", (value) => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("REQUEST_INSPECTOR", value);
    expect(requestInspectorScope()).toEqual([]);
  });

  it("parses a comma-separated pathname list", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("REQUEST_INSPECTOR", "/gvelebi/, /en/snakes,nope");
    expect(requestInspectorScope()).toEqual(["/gvelebi", "/en/snakes"]);
  });

  it("is off when no value is a pathname", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("REQUEST_INSPECTOR", "nope");
    expect(requestInspectorScope()).toBeNull();
  });
});

describe("matchesInspectorScope", () => {
  it("matches the path and its children only", () => {
    expect(matchesInspectorScope(["/gvelebi"], "/gvelebi")).toBe(true);
    expect(matchesInspectorScope(["/gvelebi"], "/gvelebi/giurza")).toBe(true);
    expect(matchesInspectorScope(["/gvelebi"], "/gvelebix")).toBe(false);
    expect(matchesInspectorScope([], "/anything")).toBe(true);
    expect(matchesInspectorScope([""], "/anything")).toBe(true);
  });
});

describe("isBackgroundRequest", () => {
  it.each<Record<string, string>>([
    { rsc: "1" },
    { "next-router-prefetch": "1" },
    { purpose: "prefetch" },
    { "sec-purpose": "prefetch;prerender" },
  ])("skips %o", (headers) => {
    expect(isBackgroundRequest(new Headers(headers))).toBe(true);
  });

  it("keeps a document request", () => {
    expect(isBackgroundRequest(new Headers({ accept: "text/html" }))).toBe(
      false,
    );
  });
});

describe("snapshotRequest", () => {
  it("keeps allowlisted headers and cookie names only", () => {
    const headers = new Headers({
      authorization: "Bearer secret",
      cookie: "session=secret; NEXT_LOCALE=en",
      "user-agent": "test-agent",
      "x-forwarded-proto": "https",
    });
    const snapshot = snapshotRequest(
      "proxy",
      headers,
      ["session", "NEXT_LOCALE", "session"],
      new URL("http://localhost:3001/gvelebi?q=1"),
      "GET",
    );
    expect(snapshot).toEqual({
      cookieNames: ["NEXT_LOCALE", "session"],
      headers: { "user-agent": "test-agent", "x-forwarded-proto": "https" },
      method: "GET",
      pathname: "/gvelebi",
      query: "?q=1",
      source: "proxy",
      url: "http://localhost:3001/gvelebi?q=1",
    });
    expect(JSON.stringify(snapshot)).not.toContain("secret");
  });
});

describe("inspectProxyRequest", () => {
  it("logs a matching document request", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("REQUEST_INSPECTOR", "/gvelebi");
    const info = vi.spyOn(console, "info").mockImplementation(() => undefined);
    inspectProxyRequest(
      request("/gvelebi/giurza", { cookie: "NEXT_LOCALE=ka" }),
    );
    expect(info).toHaveBeenCalledOnce();
    const [prefix, body] = info.mock.calls[0];
    expect(prefix).toBe("[request-inspector]");
    expect(JSON.parse(String(body))).toMatchObject({
      cookieNames: ["NEXT_LOCALE"],
      method: "GET",
      pathname: "/gvelebi/giurza",
      source: "proxy",
    });
  });

  it.each([
    ["production", "*", "/gvelebi", {}],
    ["development", undefined, "/gvelebi", {}],
    ["development", "/en", "/gvelebi", {}],
    ["development", "*", "/gvelebi", { rsc: "1" }],
  ])("stays silent (%s, %s, %s)", (mode, scope, path, headers) => {
    vi.stubEnv("NODE_ENV", mode);
    vi.stubEnv("REQUEST_INSPECTOR", scope);
    const info = vi.spyOn(console, "info").mockImplementation(() => undefined);
    inspectProxyRequest(request(path, headers));
    expect(info).not.toHaveBeenCalled();
  });
});
