import { Window } from "happy-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  addScriptNonce,
  createScriptNonce,
  type HtmlRewriter,
  type RewriterElement,
} from "@/lib/scriptNonce";
import { securityHeaders } from "@/lib/securityHeaders";

type Handler = { element(element: RewriterElement): void };

const NONCE = "TESTNONCE";

class FakeRewriter implements HtmlRewriter {
  private handlers: { handler: Handler; selector: string }[] = [];

  on(selector: string, handler: Handler) {
    this.handlers.push({ handler, selector });
    return this;
  }

  transform(response: Response) {
    const rewrite = (html: string) => {
      const template = new Window().document.createElement("template");
      template.innerHTML = html;
      for (const { handler, selector } of this.handlers) {
        for (const element of template.content.querySelectorAll(selector)) {
          handler.element(element);
        }
      }
      return template.innerHTML;
    };
    const text = response.text().then(rewrite);
    const body = new ReadableStream<Uint8Array>({
      async start(controller) {
        controller.enqueue(new TextEncoder().encode(await text));
        controller.close();
      },
    });
    return new Response(body, response);
  }
}

const POLICY = securityHeaders(false).find(
  (header) => header.key === "Content-Security-Policy",
)!.value;

const HTML = [
  '<script src="/_next/static/chunks/framework.js" type="module"></script>',
  "<script>(function(){})()</script>",
  '<script type="application/ld+json">{}</script>',
  '<script src="https://counter.top.ge/counter.js"></script>',
  '<script src="https://evil.example/x.js"></script>',
  '<script src="//evil.example/y.js"></script>',
  '<script src="http://[bad/x.js"></script>',
  '<link rel="modulepreload" href="/_next/static/chunks/index.js"/>',
  '<link rel="preload" as="script" href="https://evil.example/z.js"/>',
  '<link rel="preload" as="image" href="/hero.avif"/>',
].join("");

function htmlResponse(init: ResponseInit = {}, body: null | string = HTML) {
  return new Response(body, {
    headers: {
      "Content-Length": "123",
      "Content-Security-Policy": POLICY,
      "Content-Type": "text/html; charset=utf-8",
      ETag: '"abc"',
    },
    ...init,
  });
}

const request = new Request("https://reptiles.ge/gvelebi/giurza");

describe("addScriptNonce", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("stamps a nonce on own and allowlisted scripts only", async () => {
    const response = addScriptNonce(
      request,
      htmlResponse(),
      FakeRewriter,
      NONCE,
    );
    const html = await response.text();
    const nonced = (fragment: string) => {
      const at = html.indexOf(fragment);
      expect(at).toBeGreaterThan(-1);
      const tag = html.slice(html.lastIndexOf("<", at), html.indexOf(">", at));
      return tag.includes(`nonce="${NONCE}"`);
    };

    expect(nonced('src="/_next/static/chunks/framework.js"')).toBe(true);
    expect(nonced('src="https://counter.top.ge/counter.js"')).toBe(true);
    expect(nonced('href="/_next/static/chunks/index.js"')).toBe(true);
    expect(html).toContain(`<script nonce="${NONCE}">(function(){})()`);
    expect(nonced('src="https://evil.example/x.js"')).toBe(false);
    expect(nonced('src="//evil.example/y.js"')).toBe(false);
    expect(nonced('src="http://[bad/x.js"')).toBe(false);
    expect(nonced('href="https://evil.example/z.js"')).toBe(false);
    expect(nonced('href="/hero.avif"')).toBe(false);
    expect(nonced('type="application/ld+json"')).toBe(false);
  });

  it("sends a nonce policy without unsafe-inline or unsafe-eval", () => {
    const response = addScriptNonce(
      request,
      htmlResponse(),
      FakeRewriter,
      NONCE,
    );
    const policy = response.headers.get("Content-Security-Policy")!;
    const scriptSrc = policy
      .split("; ")
      .find((directive) => directive.startsWith("script-src "))!;

    expect(scriptSrc).toContain(`'nonce-${NONCE}'`);
    expect(scriptSrc).toContain("'strict-dynamic'");
    expect(scriptSrc).not.toContain("'unsafe-inline'");
    expect(scriptSrc).not.toContain("'unsafe-eval'");
    expect(policy).toContain("style-src 'self' 'unsafe-inline'");
    expect(response.headers.get("ETag")).toBeNull();
    expect(response.headers.get("Content-Length")).toBeNull();
  });

  it("uses the global HTMLRewriter and a fresh nonce per response", () => {
    vi.stubGlobal("HTMLRewriter", FakeRewriter);
    const nonceOf = (response: Response) =>
      response.headers
        .get("Content-Security-Policy")!
        .match(/'nonce-([^']+)'/)![1];

    const first = nonceOf(addScriptNonce(request, htmlResponse()));
    const second = nonceOf(addScriptNonce(request, htmlResponse()));

    expect(first).not.toBe(second);
    expect(atob(first)).toHaveLength(16);
  });

  it.each([
    ["no HTMLRewriter", htmlResponse(), undefined],
    [
      "a non-HTML response",
      new Response("x", {
        headers: {
          "Content-Security-Policy": POLICY,
          "Content-Type": "text/x-component",
        },
      }),
      FakeRewriter,
    ],
    ["a 304", htmlResponse({ status: 304 }, null), FakeRewriter],
    ["no body", htmlResponse({}, null), FakeRewriter],
    [
      "no CSP",
      new Response(HTML, { headers: { "Content-Type": "text/html" } }),
      FakeRewriter,
    ],
  ])("leaves %s untouched", (_case, response, Rewriter) => {
    expect(addScriptNonce(request, response, Rewriter, NONCE)).toBe(response);
  });

  it("creates base64 nonces of 128 bits", () => {
    expect(createScriptNonce()).toMatch(/^[A-Za-z0-9+/]{22}==$/);
  });
});
