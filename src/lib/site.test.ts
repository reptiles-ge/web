import { afterEach, describe, expect, it, vi } from "vitest";

import {
  absoluteImageUrl,
  absoluteUrl,
  CDN_BASE,
  FALLBACK_OG_IMAGE_URL,
  ogImageUrlFromSrc,
  openGraphJpeg,
  organizationJsonLd,
  SITE_OG_IMAGE_URL,
  siteEntityId,
  speciesOgImageUrl,
  websiteJsonLd,
} from "@/lib/site";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("absoluteUrl", () => {
  it("uses the production origin by default", () => {
    expect(absoluteUrl("/")).toBe("https://reptiles.ge");
    expect(absoluteUrl()).toBe("https://reptiles.ge");
    expect(absoluteUrl("/gvelebi")).toBe("https://reptiles.ge/gvelebi");
  });

  it("adds a missing leading slash", () => {
    expect(absoluteUrl("about")).toBe("https://reptiles.ge/about");
  });

  it("honours NEXT_PUBLIC_SITE_URL, adding https and trimming a slash", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "staging.reptiles.ge/");
    expect(absoluteUrl("/x")).toBe("https://staging.reptiles.ge/x");
  });

  it("keeps an explicit http origin outside production", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://example.test");
    expect(absoluteUrl("/x")).toBe("http://example.test/x");
  });

  it.each([
    "http://localhost:3333",
    "http://127.0.0.1:3000",
    "http://[::1]:3000",
  ])("ignores a localhost origin (%s) in production", (origin) => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", origin);
    expect(absoluteUrl("/x")).toBe("https://reptiles.ge/x");
  });

  it("uses the dev server origin in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(absoluteUrl("/x")).toBe("http://localhost:3333/x");
  });
});

describe("absoluteImageUrl", () => {
  it("leaves absolute URLs alone", () => {
    expect(absoluteImageUrl("https://cdn.reptiles.ge/a.jpg")).toBe(
      "https://cdn.reptiles.ge/a.jpg",
    );
    expect(absoluteImageUrl("http://example.test/a.jpg")).toBe(
      "http://example.test/a.jpg",
    );
  });

  it("absolutises site paths", () => {
    expect(absoluteImageUrl("/images/a.jpg")).toBe(
      "https://reptiles.ge/images/a.jpg",
    );
  });
});

describe("ogImageUrlFromSrc", () => {
  it("maps a CDN photo to its og/ JPEG", () => {
    expect(ogImageUrlFromSrc(`${CDN_BASE}/snakes/viper.png`)).toBe(
      `${CDN_BASE}/og/snakes/viper.jpg`,
    );
    expect(ogImageUrlFromSrc(`${CDN_BASE}/viper.webp`)).toBe(
      `${CDN_BASE}/og/viper.jpg`,
    );
  });

  it("decodes escaped keys", () => {
    expect(ogImageUrlFromSrc(`${CDN_BASE}/a%20b.jpg`)).toBe(
      `${CDN_BASE}/og/a b.jpg`,
    );
  });

  it("maps a site path the same way", () => {
    expect(ogImageUrlFromSrc("/images/a.jpg")).toBe(
      `${CDN_BASE}/og/images/a.jpg`,
    );
  });

  it.each([
    "",
    "/images/species-placeholder.png",
    `${CDN_BASE}/og/already.jpg`,
    `${CDN_BASE}/optimized/a-640.avif`,
    "https://elsewhere.test/a.jpg",
    `${CDN_BASE}/`,
  ])("returns null for %j", (src) => {
    expect(ogImageUrlFromSrc(src)).toBeNull();
  });
});

describe("speciesOgImageUrl", () => {
  it("derives the OG image from the species photo", () => {
    expect(
      speciesOgImageUrl("some-species", `${CDN_BASE}/snakes/some.jpg`),
    ).toBe(`${CDN_BASE}/og/snakes/some.jpg`);
  });

  it("uses a local override for the Egyptian vulture", () => {
    expect(speciesOgImageUrl("neophron-percnopterus")).toBe(
      "https://reptiles.ge/og/images/species-neophron-percnopterus-adult.jpg",
    );
  });

  it("returns an absolute CDN URL without a photo", () => {
    expect(speciesOgImageUrl("some-species")).toMatch(/^https:\/\//);
  });
});

describe("openGraphJpeg", () => {
  it("describes a 1200x630 JPEG", () => {
    expect(openGraphJpeg("https://x/y.jpg", "Alt")).toEqual({
      alt: "Alt",
      height: 630,
      type: "image/jpeg",
      url: "https://x/y.jpg",
      width: 1200,
    });
  });
});

describe("constants", () => {
  it("keeps the site and fallback OG images on the CDN", () => {
    expect(SITE_OG_IMAGE_URL.startsWith(`${CDN_BASE}/og/`)).toBe(true);
    expect(FALLBACK_OG_IMAGE_URL.startsWith(`${CDN_BASE}/og/`)).toBe(true);
  });
});

describe("structured data", () => {
  it("builds stable entity ids", () => {
    expect(siteEntityId("organization")).toBe(
      "https://reptiles.ge/#organization",
    );
    expect(siteEntityId("website")).toBe("https://reptiles.ge/#website");
  });

  it("describes the organization, with an optional description", () => {
    const base = organizationJsonLd();
    expect(base).toMatchObject({
      "@id": "https://reptiles.ge/#organization",
      "@type": "Organization",
      name: "Reptiles",
      url: "https://reptiles.ge",
    });
    expect(base).not.toHaveProperty("description");
    expect(organizationJsonLd({ description: "d" })).toHaveProperty(
      "description",
      "d",
    );
  });

  it("describes the website, with a search action only when asked", () => {
    const plain = websiteJsonLd({ description: "d" });
    expect(plain["@type"]).toBe("WebSite");
    expect(plain.publisher).toEqual({ "@id": siteEntityId("organization") });
    expect(plain.potentialAction).toBeUndefined();

    const withSearch = websiteJsonLd({
      description: "d",
      searchUrlTemplate: "https://reptiles.ge/species?q={search_term_string}",
    });
    expect(withSearch.potentialAction).toMatchObject({
      "@type": "SearchAction",
      target: {
        urlTemplate: "https://reptiles.ge/species?q={search_term_string}",
      },
    });
  });
});
