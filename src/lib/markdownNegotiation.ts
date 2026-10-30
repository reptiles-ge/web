import { NodeHtmlMarkdown } from "node-html-markdown";
import { type HTMLElement, parse } from "node-html-parser";

import { CONTENT_SIGNAL } from "@/lib/robotsTxt";

export const MARKDOWN_CONTENT_TYPE = "text/markdown; charset=utf-8";

export const MARKDOWN_TOKENS_HEADER = "X-Markdown-Tokens";

const MARKDOWN = "text/markdown";

const HTML = "text/html";

const CHARS_PER_TOKEN = 4;

const JSON_LD = 'script[type="application/ld+json"]';

const DROPPED_ELEMENTS = [
  "head",
  "header",
  "footer",
  "script",
  "style",
  "noscript",
  "template",
  "svg",
  "iframe",
  "canvas",
  "button",
  "form",
  "dialog",
  "[hidden]",
  '[aria-hidden="true"]',
].join(", ");

const DROPPED_HEADERS = [
  "Content-Encoding",
  "Content-Length",
  "Content-Range",
  "ETag",
  "Last-Modified",
  "Transfer-Encoding",
];

const YAML_PLAIN = /^[^\s!"#%&'*,:>?@[\]`{|}-](?:[^:#]|:(?!\s)|#(?<!\s#))*$/u;

const YAML_TYPED = /^(?:true|false|yes|no|null|~|[-+]?[\d.]+)$/i;

const converter = new NodeHtmlMarkdown({ useInlineLinks: true });

export function htmlRequest(request: Request): Request {
  const headers = new Headers(request.headers);
  headers.set("Accept", HTML);
  return new Request(request.url, { headers, method: "GET" });
}

export function htmlToMarkdown(html: string, url: string): string {
  const root = parse(html);
  const frontMatter = [
    [
      "title",
      metaContent(root, 'meta[name="title"]', 'meta[property="og:title"]'),
    ],
    [
      "description",
      metaContent(
        root,
        'meta[name="description"]',
        'meta[property="og:description"]',
      ),
    ],
    ["image", metaContent(root, 'meta[property="og:image"]')],
  ]
    .filter((entry): entry is [string, string] => Boolean(entry[1]))
    .map(([key, value]) => `${key}: ${yamlScalar(value)}`);
  const jsonLd = root
    .querySelectorAll(JSON_LD)
    .map((script) => script.text.trim())
    .filter(Boolean);
  const page = root.querySelector("body") ?? root;
  for (const element of page.querySelectorAll(DROPPED_ELEMENTS)) {
    element.remove();
  }
  for (const element of page.querySelectorAll("a, a *")) {
    element.insertAdjacentHTML("afterend", " ");
  }
  for (const [selector, attribute] of [
    ["a[href]", "href"],
    ["img[src]", "src"],
  ] as const) {
    for (const element of page.querySelectorAll(selector)) {
      const value = element.getAttribute(attribute);
      if (value) element.setAttribute(attribute, absoluteUrl(value, url));
    }
  }
  const body = converter
    .translate(page.innerHTML)
    .replace(/(?<!!)\[\]\([^)]*\)/g, "")
    .replace(/(?<!\\)\[ +/g, "[")
    .replace(/ +\]\(/g, "](")
    .replace(/[ \t]+$/gm, "")
    .trim();
  return [
    frontMatter.length > 0 ? `---\n${frontMatter.join("\n")}\n---` : "",
    body,
    jsonLd.length > 0 ? `\`\`\`json\n${jsonLd.join("\n")}\n\`\`\`` : "",
  ]
    .filter(Boolean)
    .join("\n\n")
    .concat("\n");
}

export async function markdownResponse(
  request: Request,
  response: Response,
): Promise<Response> {
  if (response.status !== 200 || !isHtml(response)) {
    return withAcceptVary(response);
  }
  const markdown = htmlToMarkdown(await response.text(), request.url);
  const headers = new Headers(response.headers);
  for (const name of DROPPED_HEADERS) headers.delete(name);
  headers.set("Content-Type", MARKDOWN_CONTENT_TYPE);
  if (!headers.has("Content-Signal"))
    headers.set("Content-Signal", CONTENT_SIGNAL);
  headers.set(
    MARKDOWN_TOKENS_HEADER,
    String(Math.ceil(markdown.length / CHARS_PER_TOKEN)),
  );
  appendVaryAccept(headers);
  return new Response(request.method === "HEAD" ? null : markdown, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
}

export function prefersMarkdown(request: Request): boolean {
  if (request.method !== "GET" && request.method !== "HEAD") return false;
  if (request.headers.has("RSC")) return false;
  const ranges = mediaRanges(request.headers.get("Accept") ?? "");
  const markdown = ranges.get(MARKDOWN) ?? 0;
  return markdown > 0 && markdown >= (ranges.get(HTML) ?? 0);
}

export function withAcceptVary(response: Response): Response {
  if (!isHtml(response)) return response;
  const varied = new Response(response.body, response);
  appendVaryAccept(varied.headers);
  return varied;
}

function absoluteUrl(value: string, base: string): string {
  try {
    return new URL(value, base).href;
  } catch {
    return value;
  }
}

function appendVaryAccept(headers: Headers) {
  const vary = headers.get("Vary");
  if (vary?.split(",").some((name) => name.trim().toLowerCase() === "accept")) {
    return;
  }
  headers.set("Vary", vary ? `${vary}, Accept` : "Accept");
}

function isHtml(response: Response): boolean {
  return response.headers.get("Content-Type")?.startsWith(HTML) ?? false;
}

function mediaRanges(accept: string): Map<string, number> {
  const ranges = new Map<string, number>();
  for (const range of accept.split(",")) {
    const [type, ...params] = range.split(";").map((part) => part.trim());
    if (!type) continue;
    const q = params.find((param) => param.startsWith("q="));
    const quality = q ? Number(q.slice(2)) : 1;
    ranges.set(type.toLowerCase(), Number.isFinite(quality) ? quality : 0);
  }
  return ranges;
}

function metaContent(root: HTMLElement, ...selectors: string[]) {
  for (const selector of selectors) {
    const value = root.querySelector(selector)?.getAttribute("content")?.trim();
    if (value) return value;
  }
  return undefined;
}

function yamlScalar(value: string): string {
  const line = value.replace(/\s+/g, " ");
  return YAML_PLAIN.test(line) && !YAML_TYPED.test(line)
    ? line
    : JSON.stringify(line);
}
