import {
  CONTENT_SECURITY_POLICY,
  scriptSourceOrigins,
  withScriptNonce,
} from "@/lib/securityHeaders";

export type HtmlRewriter = {
  on(selector: string, handler: ElementHandler): HtmlRewriter;
  transform(response: Response): Response;
};

export type HtmlRewriterConstructor = new () => HtmlRewriter;

export type RewriterElement = {
  getAttribute(name: string): null | string;
  setAttribute(name: string, value: string): void;
};

type ElementHandler = { element(element: RewriterElement): void };

const NONCE_BYTES = 16;

const DATA_BLOCK = /json$/i;

const SCRIPT_LINK_SELECTORS = [
  'link[rel~="modulepreload"]',
  'link[rel~="preload"][as="script"]',
];

export function addScriptNonce(
  request: Request,
  response: Response,
  Rewriter = htmlRewriter(),
  nonce = createScriptNonce(),
): Response {
  const policy = response.headers.get(CONTENT_SECURITY_POLICY);
  if (!Rewriter || !policy || !response.body || response.status === 304) {
    return response;
  }
  if (!response.headers.get("Content-Type")?.startsWith("text/html")) {
    return response;
  }

  const trusted = new Set([
    new URL(request.url).origin,
    ...scriptSourceOrigins(policy),
  ]);
  const isTrusted = (url: null | string) =>
    url === null || trustedOrigin(url, request.url, trusted);
  const stamp = (attribute: string) => ({
    element(element: RewriterElement) {
      if (DATA_BLOCK.test(element.getAttribute("type") ?? "")) return;
      if (isTrusted(element.getAttribute(attribute))) {
        element.setAttribute("nonce", nonce);
      }
    },
  });

  const rewriter = SCRIPT_LINK_SELECTORS.reduce(
    (current, selector) => current.on(selector, stamp("href")),
    new Rewriter().on("script", stamp("src")),
  );
  const transformed = rewriter.transform(response);
  const headers = new Headers(transformed.headers);
  headers.set(CONTENT_SECURITY_POLICY, withScriptNonce(policy, nonce));
  headers.delete("Content-Length");
  headers.delete("ETag");
  headers.delete("Last-Modified");
  return new Response(transformed.body, {
    headers,
    status: transformed.status,
    statusText: transformed.statusText,
  });
}

export function createScriptNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(NONCE_BYTES));
  return btoa(String.fromCharCode(...bytes));
}

function htmlRewriter(): HtmlRewriterConstructor | undefined {
  return (globalThis as { HTMLRewriter?: HtmlRewriterConstructor })
    .HTMLRewriter;
}

function trustedOrigin(url: string, base: string, trusted: Set<string>) {
  try {
    return trusted.has(new URL(url, base).origin);
  } catch {
    return false;
  }
}
