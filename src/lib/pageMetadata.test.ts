import { describe, expect, it } from "vitest";

import { buildPageMetadata } from "@/lib/pageMetadata";

const base = {
  description: "A description",
  locale: "en",
  ogImageUrl: "https://cdn.reptiles.ge/og/a.jpg",
  pagePath: "/species" as const,
  title: "Title",
};

describe("buildPageMetadata", () => {
  it("builds title, description and canonical", () => {
    const metadata = buildPageMetadata(base);
    expect(metadata.title).toBe("Title");
    expect(metadata.description).toBe("A description");
    expect(metadata.alternates?.canonical).toMatch(/^https:\/\/reptiles\.ge/);
  });

  it("fills Open Graph and Twitter from the same values", () => {
    const metadata = buildPageMetadata(base);
    expect(metadata.openGraph).toMatchObject({
      description: "A description",
      locale: "en_US",
      title: "Title",
      type: "website",
    });
    expect(metadata.openGraph?.images).toEqual([
      expect.objectContaining({
        alt: "Title",
        height: 630,
        url: base.ogImageUrl,
        width: 1200,
      }),
    ]);
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      images: [base.ogImageUrl],
      title: "Title",
    });
  });

  it("splits keywords on commas, trimming and dropping empties", () => {
    expect(
      buildPageMetadata({ ...base, keywords: " a, b ,, c " }).keywords,
    ).toEqual(["a", "b", "c"]);
    expect(buildPageMetadata(base)).not.toHaveProperty("keywords");
  });

  it("is indexable only when asked", () => {
    expect(buildPageMetadata(base)).not.toHaveProperty("robots");
    expect(buildPageMetadata({ ...base, indexable: true }).robots).toEqual({
      follow: true,
      index: true,
    });
  });

  it("supports an article type and a custom Open Graph image", () => {
    const image = {
      alt: "Alt",
      height: 572,
      url: "https://x/y.jpg",
      width: 1024,
    };
    const metadata = buildPageMetadata({
      ...base,
      openGraphImage: image,
      type: "article",
    });
    expect(metadata.openGraph).toMatchObject({ type: "article" });
    expect(metadata.openGraph?.images).toEqual([image]);
  });

  it("supports a separate metadata title", () => {
    const metadata = buildPageMetadata({
      ...base,
      metadataTitle: { absolute: "Absolute" },
    });
    expect(metadata.title).toEqual({ absolute: "Absolute" });
    expect(metadata.openGraph).toMatchObject({ title: "Title" });
  });
});
