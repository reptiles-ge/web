import { describe, expect, it } from "vitest";

import { canonicalRscRequest } from "./rscCanonicalRequest";

const URL_BASE = "https://reptiles.ge/gvelebi/giurza";

function rscRequest(url: string, headers: Record<string, string> = {}) {
  return new Request(url, { headers: { RSC: "1", ...headers } });
}

describe("canonicalRscRequest", () => {
  it("strips router context from a navigation request", () => {
    const request = canonicalRscRequest(
      rscRequest(`${URL_BASE}?_rsc=abc`, {
        "Next-Url": "/gvelebi",
        "X-Vinext-Client-Reuse-Manifest": "{}",
        "X-Vinext-Rsc-State-Fingerprint": "fd62a7e8caae0eb8",
      }),
    );

    expect(request.url).toBe(`${URL_BASE}?_rsc`);
    expect(request.headers.get("RSC")).toBe("1");
    expect(request.headers.has("Next-Url")).toBe(false);
    expect(request.headers.has("X-Vinext-Client-Reuse-Manifest")).toBe(false);
    expect(request.headers.has("X-Vinext-Rsc-State-Fingerprint")).toBe(false);
  });

  it("strips prefetch headers from an intent prefetch", () => {
    const request = canonicalRscRequest(
      rscRequest(`${URL_BASE}?_rsc=abc`, {
        "Next-Router-Prefetch": "1",
        "Next-Router-Segment-Prefetch": "1",
        "Next-Router-State-Tree": "%7B%7D",
      }),
    );

    expect(request.url).toBe(`${URL_BASE}?_rsc`);
    expect(request.headers.has("Next-Router-Prefetch")).toBe(false);
    expect(request.headers.has("Next-Router-Segment-Prefetch")).toBe(false);
    expect(request.headers.has("Next-Router-State-Tree")).toBe(false);
  });

  it("keeps the page query", () => {
    const request = canonicalRscRequest(
      rscRequest("https://reptiles.ge/species?group=snakes&_rsc=abc", {
        "X-Vinext-Rsc-State-Fingerprint": "fd62a7e8caae0eb8",
      }),
    );

    expect(request.url).toBe("https://reptiles.ge/species?group=snakes&_rsc");
  });

  it("leaves an already canonical request alone", () => {
    const original = rscRequest(`${URL_BASE}?_rsc`);

    expect(canonicalRscRequest(original)).toBe(original);
  });

  it("leaves document requests alone", () => {
    const original = new Request(URL_BASE, {
      headers: { "X-Vinext-Rsc-State-Fingerprint": "fd62a7e8caae0eb8" },
    });

    expect(canonicalRscRequest(original)).toBe(original);
  });

  it("leaves non-GET requests alone", () => {
    const original = new Request(URL_BASE, {
      headers: {
        RSC: "1",
        "X-Vinext-Rsc-State-Fingerprint": "fd62a7e8caae0eb8",
      },
      method: "POST",
    });

    expect(canonicalRscRequest(original)).toBe(original);
  });

  it.each([
    "X-Vinext-Interception-Context",
    "X-Vinext-Interception-Id",
    "X-Vinext-Mounted-Slots",
    "X-Vinext-Rsc-Render-Mode",
  ])("leaves a %s variant alone", (name) => {
    const original = rscRequest(`${URL_BASE}?_rsc=abc`, {
      [name]: "x",
      "X-Vinext-Rsc-State-Fingerprint": "fd62a7e8caae0eb8",
    });

    expect(canonicalRscRequest(original)).toBe(original);
  });
});
