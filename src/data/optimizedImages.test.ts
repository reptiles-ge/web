import { describe, expect, it } from "vitest";

import { optimizedImgSrc, srcSetPreloadUrl } from "@/data/optimizedImages";

describe("optimized image helpers", () => {
  it("picks an 800px candidate for LCP preloads", () => {
    expect(
      srcSetPreloadUrl(
        "https://cdn.reptiles.ge/optimized/macrovipera-lebetina-nika-1-400.avif 400w, https://cdn.reptiles.ge/optimized/macrovipera-lebetina-nika-1-800.avif 800w, https://cdn.reptiles.ge/optimized/macrovipera-lebetina-nika-1-1024.avif 1024w",
      ),
    ).toBe(
      "https://cdn.reptiles.ge/optimized/macrovipera-lebetina-nika-1-800.avif",
    );
  });

  it("falls back to a mid-size derivative when 1200px is unavailable", () => {
    const src = "https://cdn.reptiles.ge/macrovipera-lebetina-nika-1.jpg";
    expect(optimizedImgSrc(src, 800)).toContain("-800.");
    expect(optimizedImgSrc(src, 400)).toContain("-400.");
  });
});
