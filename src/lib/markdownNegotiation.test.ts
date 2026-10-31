import { describe, expect, it } from "vitest";

import {
  htmlRequest,
  htmlToMarkdown,
  MARKDOWN_CONTENT_TYPE,
  MARKDOWN_TOKENS_HEADER,
  markdownAlternatePath,
  markdownPathRequest,
  markdownResponse,
  prefersMarkdown,
  withAcceptVary,
  withMarkdownAlternate,
  withMarkdownLocation,
} from "@/lib/markdownNegotiation";
import { CONTENT_SIGNAL } from "@/lib/robotsTxt";

const URL = "https://reptiles.ge/gvelebi/giurza";

const PAGE = `<!doctype html>
<html lang="ka">
  <head>
    <title>გიურზა — Reptiles.ge</title>
    <meta name="description" content="მაღალი რისკის &quot;გველგესლა&quot;">
    <meta property="og:title" content="გიურზა: შხამიანი გველი">
    <meta property="og:description" content="სხვა აღწერა">
    <meta property="og:image" content="https://cdn.reptiles.ge/og/giurza.jpg">
    <link rel="canonical" href="/gvelebi/giurza">
    <script>window.secret = 1</script>
    <script type="application/ld+json">{"@type":"WebSite","name":"A &amp; B"}</script>
  </head>
  <body>
    <header><nav><a href="/">მთავარი</a></nav></header>
    <main id="main">
      <h1>გიურზა</h1>
      <p>ყველაზე <strong>დიდი</strong> გველგესლა. <a href="/gvelebi">გველები</a></p>
      <h2>მიმოხილვა<a href="#overview"></a></h2>
      <a href="/gvelebi/dinikis-gvelgesla"><span>01</span><span>დინიკის გველგესლა</span></a>
      <img src="/images/giurza.jpg" alt="გიურზა">
      <button type="button">გაზიარება</button>
      <svg><text>icon</text></svg>
      <div hidden>დამალული კითხვა</div>
      <p>დარეკეთ <a href="tel:112">112</a>-ზე.</p>
      <!-- TODO(review #1791): add <h3><button aria-expanded> fixtures, with and without aria-controls, and expect "### Question?" -->
      <button aria-expanded="true" type="button"><span>რამდენად დიდია?</span><svg><path></path></svg></button>
      <div><p>70–90 სმ.</p></div>
      <button aria-controls="sources-more" aria-expanded="false" type="button">ყველა წყარო</button>
      <div aria-hidden="true" id="sources-more" inert><a href="https://doi.org/10.1/x">წყარო 2</a></div>
      <span aria-hidden="true">·</span>
      <p>Range<span aria-hidden="true"> · </span>map <span aria-hidden="true">✦</span>key<span aria-hidden="true">new</span></p>
      <script>window.inline = 2</script>
      <script type="application/ld+json">
        {"@type":"Article"}
      </script>
    </main>
    <footer>ფუტერი</footer>
  </body>
</html>`;

function htmlResponse(body = PAGE, init: ResponseInit = {}) {
  return new Response(body, {
    status: 200,
    ...init,
    headers: {
      "Cache-Control": "private, max-age=0, must-revalidate",
      "Content-Length": String(body.length),
      "Content-Security-Policy": "default-src 'self'",
      "Content-Type": "text/html; charset=utf-8",
      ETag: '"abc"',
      Vary: "RSC",
      ...init.headers,
    },
  });
}

function request(accept: string, init: RequestInit = {}) {
  return new Request(URL, {
    ...init,
    headers: { Accept: accept, ...init.headers },
  });
}

describe("prefersMarkdown", () => {
  it.each([
    "text/markdown",
    "text/markdown, text/html;q=0.9",
    "text/html;q=0.5, text/markdown",
    "text/markdown, text/html",
    "TEXT/MARKDOWN;charset=utf-8",
    "text/markdown, */*",
    "text/markdown, text/html;q=0.9, */*;q=1",
  ])("asks for Markdown with %s", (accept) => {
    expect(prefersMarkdown(request(accept))).toBe(true);
  });

  it.each([
    "",
    "*/*",
    "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "text/html, text/markdown;q=0.5",
    "text/markdown;q=0",
    "text/markdown;q=abc",
    "text/markdown;q=0.1, */*",
    "text/markdown;q=0.5, text/*",
    "text/markdown;Q=0.5, text/html",
  ])("keeps HTML for %s", (accept) => {
    expect(prefersMarkdown(request(accept))).toBe(false);
  });

  it("keeps HTML for RSC requests and non-GET methods", () => {
    expect(
      prefersMarkdown(request("text/markdown", { headers: { RSC: "1" } })),
    ).toBe(false);
    expect(prefersMarkdown(request("text/markdown", { method: "POST" }))).toBe(
      false,
    );
    expect(prefersMarkdown(request("text/markdown", { method: "HEAD" }))).toBe(
      true,
    );
  });
});

describe("htmlRequest", () => {
  it("asks the app for HTML with the visitor's other headers", () => {
    const page = htmlRequest(
      request("text/markdown", {
        headers: { "User-Agent": "agent" },
        method: "HEAD",
      }),
    );
    expect(page.url).toBe(URL);
    expect(page.method).toBe("GET");
    expect(page.headers.get("Accept")).toBe("text/html");
    expect(page.headers.get("User-Agent")).toBe("agent");
  });

  it("keeps the visitor's abort signal", () => {
    const controller = new AbortController();
    const page = htmlRequest(
      request("text/markdown", { signal: controller.signal }),
    );
    controller.abort();
    expect(page.signal.aborted).toBe(true);
  });
});

describe("htmlToMarkdown", () => {
  const markdown = htmlToMarkdown(PAGE, URL);

  it("starts with front matter from the meta tags", () => {
    expect(
      markdown.startsWith(`---
title: "გიურზა: შხამიანი გველი"
description: მაღალი რისკის "გველგესლა"
url: https://reptiles.ge/gvelebi/giurza
lang: ka
image: https://cdn.reptiles.ge/og/giurza.jpg
---

# გიურზა
`),
    ).toBe(true);
  });

  it("ends with the page's JSON-LD in one fenced block", () => {
    expect(
      markdown.endsWith(
        '```json\n{"@type":"WebSite","name":"A &amp; B"}\n{"@type":"Article"}\n```\n',
      ),
    ).toBe(true);
  });

  it("converts the main content with absolute links and images", () => {
    expect(markdown).toContain(
      "ყველაზე **დიდი** გველგესლა. [გველები](https://reptiles.ge/gvelebi)",
    );
    expect(markdown).toContain(
      "[01 დინიკის გველგესლა](https://reptiles.ge/gvelebi/dinikis-gvelgesla)",
    );
    expect(markdown).toContain(
      "![გიურზა](https://reptiles.ge/images/giurza.jpg)",
    );
    expect(markdown).toContain("## მიმოხილვა\n");
  });

  it("keeps collapsed content, FAQ questions and words after links", () => {
    expect(markdown).toContain("დამალული კითხვა");
    expect(markdown).toContain("**რამდენად დიდია?**\n\n70–90 სმ.");
    expect(markdown).toContain("[წყარო 2](https://doi.org/10.1/x)");
    expect(markdown).toContain("დარეკეთ [112](tel:112)-ზე.");
  });

  it("leaves out page chrome, scripts and decorative elements", () => {
    for (const text of [
      "window.",
      "მთავარი",
      "ფუტერი",
      "გაზიარება",
      "ყველა წყარო",
      "icon",
      "·",
      "](https://reptiles.ge/gvelebi/giurza#overview)",
    ]) {
      expect(markdown).not.toContain(text);
    }
  });

  it("spaces out aria-hidden separators and drops other aria-hidden text", () => {
    expect(markdown).toContain("Range map key\n");
    expect(markdown).not.toMatch(/✦|new/);
  });

  it("omits the front matter when the page has no supported meta tags", () => {
    expect(
      htmlToMarkdown(
        "<html><head><title>სათაური</title></head><body><p>ტექსტი</p></body></html>",
        URL,
      ),
    ).toBe("ტექსტი\n");
  });

  it("prefers the standard meta tags and quotes values YAML would misread", () => {
    expect(
      htmlToMarkdown(
        '<meta property="og:title" content="og"><meta name="title" content="true"><meta name="description" content="- სია"><p>x</p>',
        URL,
      ),
    ).toBe('---\ntitle: "true"\ndescription: "- სია"\n---\n\nx\n');
  });

  it.each(["Off", "2026-10-30", "1e3", ".inf", "0x1F", "Y"])(
    "quotes the typed YAML value %s",
    (value) => {
      expect(
        htmlToMarkdown(`<meta name="title" content="${value}"><p>x</p>`, URL),
      ).toContain(`title: "${value}"`);
    },
  );
});

describe("markdownResponse", () => {
  it("reuses the converted Markdown for the same page", async () => {
    const page = `${PAGE}<!-- cache -->`;
    const first = await markdownResponse(
      request("text/markdown"),
      htmlResponse(page),
    );
    const second = await markdownResponse(
      request("text/markdown"),
      htmlResponse(page),
    );
    expect(await second.text()).toBe(await first.text());
  });

  it("answers an HTML page as Markdown", async () => {
    const response = await markdownResponse(
      request("text/markdown"),
      htmlResponse(),
    );
    const body = await response.text();
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe(MARKDOWN_CONTENT_TYPE);
    expect(response.headers.get("Vary")).toBe("RSC, Accept");
    expect(response.headers.get("Cache-Control")).toBe(
      "private, max-age=0, must-revalidate",
    );
    expect(response.headers.get(MARKDOWN_TOKENS_HEADER)).toBe(
      String(Math.ceil(body.length / 4)),
    );
    expect(response.headers.get("Content-Signal")).toBe(CONTENT_SIGNAL);
    expect(response.headers.get("Content-Security-Policy")).toBe(
      "default-src 'self'",
    );
    for (const name of ["Content-Length", "ETag"]) {
      expect(response.headers.has(name), name).toBe(false);
    }
    expect(body).toContain("# გიურზა");
    expect(response.headers.get("Link")).toBe(
      '<https://reptiles.ge/gvelebi/giurza>; rel="canonical"',
    );
  });

  it("adds the canonical page to the Link header the app sent", async () => {
    const response = await markdownResponse(
      new Request(`${URL}?q=1`, { headers: { Accept: "text/markdown" } }),
      htmlResponse(PAGE, {
        headers: { Link: '</llms.txt>; rel="alternate"' },
      }),
    );
    expect(response.headers.get("Link")).toBe(
      '</llms.txt>; rel="alternate", <https://reptiles.ge/gvelebi/giurza>; rel="canonical"',
    );
  });

  it("names the page's own canonical when it points elsewhere", async () => {
    const response = await markdownResponse(
      new Request("https://reptiles.ge/species/macrovipera-lebetina", {
        headers: { Accept: "text/markdown" },
      }),
      htmlResponse(PAGE),
    );
    const body = await response.text();
    expect(response.headers.get("Link")).toBe(
      '<https://reptiles.ge/gvelebi/giurza>; rel="canonical"',
    );
    expect(body).toContain("url: https://reptiles.ge/gvelebi/giurza");
  });

  it("falls back to the requested page without a canonical tag", async () => {
    const response = await markdownResponse(
      new Request(`${URL}?q=1`, { headers: { Accept: "text/markdown" } }),
      htmlResponse("<html><body><p>x</p></body></html>"),
    );
    expect(response.headers.get("Link")).toBe(`<${URL}>; rel="canonical"`);
  });

  it("keeps a Content-Signal the app already sent", async () => {
    const response = await markdownResponse(
      request("text/markdown"),
      htmlResponse(PAGE, { headers: { "Content-Signal": "ai-train=no" } }),
    );
    expect(response.headers.get("Content-Signal")).toBe("ai-train=no");
  });

  it("sends the Markdown headers without a body for HEAD", async () => {
    const response = await markdownResponse(
      request("text/markdown", { method: "HEAD" }),
      htmlResponse(),
    );
    expect(response.headers.get("Content-Type")).toBe(MARKDOWN_CONTENT_TYPE);
    expect(response.body).toBeNull();
  });

  it("passes redirects, errors and non-HTML responses through", async () => {
    const redirect = new Response(null, {
      headers: { Location: "https://reptiles.ge/gvelebi" },
      status: 301,
    });
    expect(await markdownResponse(request("text/markdown"), redirect)).toBe(
      redirect,
    );

    const missing = await markdownResponse(
      request("text/markdown"),
      htmlResponse("<main>404</main>", { status: 404 }),
    );
    expect(missing.status).toBe(404);
    expect(missing.headers.get("Content-Type")).toContain("text/html");
    expect(missing.headers.get("Vary")).toBe("RSC, Accept");

    const text = new Response("llms", {
      headers: { "Content-Type": "text/plain" },
    });
    expect(await markdownResponse(request("text/markdown"), text)).toBe(text);
  });
});

describe("markdownAlternatePath", () => {
  it.each([
    ["/", "/index.md"],
    ["/gvelebi/giurza", "/gvelebi/giurza.md"],
    ["/en", "/en.md"],
    ["/gvelebi/", "/gvelebi.md"],
  ])("maps %s to %s", (pathname, alternate) => {
    expect(markdownAlternatePath(pathname)).toBe(alternate);
  });
});

describe("markdownPathRequest", () => {
  it.each([
    ["https://reptiles.ge/index.md", "https://reptiles.ge/"],
    [
      "https://reptiles.ge/gvelebi/giurza.md?x=1",
      "https://reptiles.ge/gvelebi/giurza?x=1",
    ],
    ["https://reptiles.ge/en.md", "https://reptiles.ge/en"],
    ["https://reptiles.ge/en/index.md", "https://reptiles.ge/en"],
  ])("serves %s from the page %s", (url, page) => {
    const forwarded = markdownPathRequest(
      new Request(url, { headers: { "X-Test": "1" }, method: "HEAD" }),
    );
    expect(forwarded?.url).toBe(page);
    expect(forwarded?.method).toBe("HEAD");
    expect(forwarded?.headers.get("X-Test")).toBe("1");
  });

  it.each([
    new Request("https://reptiles.ge/gvelebi/giurza"),
    new Request("https://reptiles.ge/.md"),
    new Request("https://reptiles.ge/gvelebi/.md"),
    new Request("https://reptiles.ge/gvelebi.md", { method: "POST" }),
    new Request("https://reptiles.ge/gvelebi.md", { headers: { RSC: "1" } }),
  ])("leaves other requests alone (%#)", (request) => {
    expect(markdownPathRequest(request)).toBeUndefined();
  });
});

describe("withMarkdownLocation", () => {
  const md = new Request("https://reptiles.ge/species/macrovipera-lebetina.md");

  it.each([
    ["/gvelebi/giurza", "https://reptiles.ge/gvelebi/giurza.md"],
    [
      "https://reptiles.ge/en/snakes?x=1",
      "https://reptiles.ge/en/snakes.md?x=1",
    ],
    ["/", "https://reptiles.ge/index.md"],
  ])("keeps a redirect to %s on Markdown", (location, target) => {
    const response = withMarkdownLocation(
      md,
      new Response(null, { headers: { Location: location }, status: 301 }),
    );
    expect(response.status).toBe(301);
    expect(response.headers.get("Location")).toBe(target);
  });

  it("leaves other origins and non-redirects alone", () => {
    const away = new Response(null, {
      headers: { Location: "https://example.com/x" },
      status: 302,
    });
    expect(withMarkdownLocation(md, away)).toBe(away);
    const page = htmlResponse();
    expect(withMarkdownLocation(md, page)).toBe(page);
  });
});

describe("withMarkdownAlternate", () => {
  it("points an HTML page at its Markdown version", () => {
    const response = withMarkdownAlternate(
      new Request(URL),
      htmlResponse(PAGE, { headers: { Link: '</llms.txt>; rel="alternate"' } }),
    );
    expect(response.headers.get("Link")).toBe(
      '</llms.txt>; rel="alternate", </gvelebi/giurza.md>; rel="alternate"; type="text/markdown"',
    );
    expect(response.headers.get("Vary")).toBe("RSC, Accept");
  });

  it("keeps the query string in the alternate", () => {
    const response = withMarkdownAlternate(
      new Request("https://reptiles.ge/species?q=giurza"),
      htmlResponse(),
    );
    expect(response.headers.get("Link")).toBe(
      '</species.md?q=giurza>; rel="alternate"; type="text/markdown"',
    );
  });

  it("leaves errors and non-HTML responses without the alternate", () => {
    expect(
      withMarkdownAlternate(
        new Request(URL),
        htmlResponse(PAGE, { status: 404 }),
      ).headers.has("Link"),
    ).toBe(false);
    expect(
      withMarkdownAlternate(
        new Request(URL),
        new Response("{}", { headers: { "Content-Type": "application/json" } }),
      ).headers.has("Link"),
    ).toBe(false);
  });
});

describe("withAcceptVary", () => {
  it("adds Accept to Vary on HTML once", () => {
    const varied = withAcceptVary(htmlResponse());
    expect(varied.headers.get("Vary")).toBe("RSC, Accept");
    expect(withAcceptVary(varied).headers.get("Vary")).toBe("RSC, Accept");
    expect(
      withAcceptVary(htmlResponse(PAGE, { headers: { Vary: "" } })).headers.get(
        "Vary",
      ),
    ).toBe("Accept");
  });

  it("leaves other responses alone", () => {
    const json = Response.json({});
    expect(withAcceptVary(json)).toBe(json);
  });
});
