import { afterEach, describe, expect, it, vi } from "vitest";

import {
  adminErrorResponse,
  isLocalAdminOriginRequest,
  readAdminJsonText,
  readBodyString,
  readLocalAdminFormData,
  readLocalAdminJsonBody,
} from "@/lib/adminRequest";

function jsonRequest(body: string, url = "http://localhost:3000/api/x") {
  return new Request(url, {
    body,
    headers: { origin: new URL(url).origin },
    method: "POST",
  });
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("readBodyString", () => {
  it("trims string values", () => {
    expect(readBodyString({ id: "  abc " }, "id")).toBe("abc");
  });

  it.each([null, undefined, "text", 5, [], {}])(
    "returns an empty string for %j",
    (body) => {
      expect(readBodyString(body, "id")).toBe("");
    },
  );

  it("ignores non-string values", () => {
    expect(readBodyString({ id: 4 }, "id")).toBe("");
  });
});

describe("adminErrorResponse", () => {
  it("returns the error message with status 400", async () => {
    const response = adminErrorResponse(new Error("boom"), "fallback");
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "boom" });
  });

  it("uses the fallback for non-Error values", async () => {
    const response = adminErrorResponse("nope", "Upload failed");
    expect(await response.json()).toEqual({ error: "Upload failed" });
  });
});

describe("isLocalAdminOriginRequest", () => {
  it.each(["localhost", "127.0.0.1", "[::1]"])("accepts %s", (host) => {
    const request = jsonRequest("{}", `http://${host}:3000/api/x`);
    expect(isLocalAdminOriginRequest(request)).toBe(true);
  });

  it("rejects a remote hostname", () => {
    const request = jsonRequest("{}", "http://example.com/api/x");
    expect(isLocalAdminOriginRequest(request)).toBe(false);
  });

  it("rejects a missing or foreign origin", () => {
    const missing = new Request("http://localhost:3000/api/x", {
      method: "POST",
    });
    const foreign = new Request("http://localhost:3000/api/x", {
      headers: { origin: "http://evil.test" },
      method: "POST",
    });
    expect(isLocalAdminOriginRequest(missing)).toBe(false);
    expect(isLocalAdminOriginRequest(foreign)).toBe(false);
  });

  it("rejects everything in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(isLocalAdminOriginRequest(jsonRequest("{}"))).toBe(false);
  });

  it("rejects everything on Vercel", () => {
    vi.stubEnv("VERCEL", "1");
    expect(isLocalAdminOriginRequest(jsonRequest("{}"))).toBe(false);
  });
});

describe("readAdminJsonText", () => {
  it("parses a small JSON body", async () => {
    await expect(readAdminJsonText(jsonRequest('{"id":"a"}'))).resolves.toEqual(
      { id: "a" },
    );
  });

  it("rejects a body over 1000 characters", async () => {
    const body = JSON.stringify({ id: "a".repeat(1000) });
    await expect(readAdminJsonText(jsonRequest(body))).rejects.toThrow(
      "Invalid request",
    );
  });

  it("rejects invalid JSON", async () => {
    await expect(readAdminJsonText(jsonRequest("{"))).rejects.toThrow();
  });
});

describe("readLocalAdminJsonBody", () => {
  it("returns the parsed body", async () => {
    const result = await readLocalAdminJsonBody(jsonRequest('{"id":"a"}'));
    expect(result.response).toBeUndefined();
    expect(result.body).toEqual({ id: "a" });
  });

  it("answers 400 for invalid JSON", async () => {
    const result = await readLocalAdminJsonBody(jsonRequest("{"));
    expect(result.response?.status).toBe(400);
    expect(await result.response?.json()).toEqual({ error: "Invalid JSON" });
  });

  it("answers 404 with noindex outside local admin", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const result = await readLocalAdminJsonBody(jsonRequest("{}"));
    expect(result.response?.status).toBe(404);
    expect(result.response?.headers.get("X-Robots-Tag")).toBe(
      "noindex, nofollow",
    );
  });
});

describe("readLocalAdminFormData", () => {
  it("returns the parsed form", async () => {
    const form = new FormData();
    form.set("id", "a");
    const request = new Request("http://localhost:3000/api/x", {
      body: form,
      method: "POST",
    });
    const result = await readLocalAdminFormData(request);
    expect(result.form?.get("id")).toBe("a");
  });

  it("answers 400 for a body that is not a form", async () => {
    const request = new Request("http://localhost:3000/api/x", {
      body: "plain",
      headers: { "content-type": "text/plain" },
      method: "POST",
    });
    const result = await readLocalAdminFormData(request);
    expect(result.response?.status).toBe(400);
    expect(await result.response?.json()).toEqual({ error: "Invalid form" });
  });

  it("answers 404 outside local admin", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const result = await readLocalAdminFormData(jsonRequest("{}"));
    expect(result.response?.status).toBe(404);
  });
});
