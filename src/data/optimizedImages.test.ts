import { describe, expect, it } from "vitest";

import {
  optimizedImgSrc,
  pictureSources,
  srcSetPreloadUrl,
} from "@/data/optimizedImages";

describe("optimized image helpers", () => {
  it("picks an 800px candidate for LCP preloads", () => {
    expect(
      srcSetPreloadUrl(
        "https://cdn.reptiles.ge/optimized/macrovipera-lebetina-nika-4-400.avif 400w, https://cdn.reptiles.ge/optimized/macrovipera-lebetina-nika-4-800.avif 800w, https://cdn.reptiles.ge/optimized/macrovipera-lebetina-nika-4-1024.avif 1024w",
      ),
    ).toBe(
      "https://cdn.reptiles.ge/optimized/macrovipera-lebetina-nika-4-800.avif",
    );
  });

  it("falls back to a mid-size derivative when 1200px is unavailable", () => {
    const src = "https://cdn.reptiles.ge/macrovipera-lebetina-nika-4.jpg";
    expect(optimizedImgSrc(src, 800)).toContain("-800.");
    expect(optimizedImgSrc(src, 400)).toContain("-400.");
    expect(optimizedImgSrc("")).toBe("");
    const sources = pictureSources(src, { sizes: "100vw" });
    expect(sources.length).toBeGreaterThan(0);
    expect(sources[0].props.srcSet).toContain("800w");
    expect(
      pictureSources(src, { media: "(min-width: 800px)", sizes: "100vw" })[0]
        .props.media,
    ).toBe("(min-width: 800px)");
    expect(pictureSources(null, { sizes: "100vw" })).toEqual([]);
    expect(srcSetPreloadUrl("https://cdn.example/a.avif 400w")).toBe(
      "https://cdn.example/a.avif",
    );
    expect(srcSetPreloadUrl("https://cdn.example/a.avif 2x")).toBe(
      "https://cdn.example/a.avif",
    );
    expect(srcSetPreloadUrl("")).toBeUndefined();
  });
});
