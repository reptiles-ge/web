import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { SpeciesGalleryLightbox } from "@/components/SpeciesGalleryLightbox";

const props = {
  children: "Preview",
  closeLabel: "Close",
  galleryLabel: "Gallery",
  nextLabel: "Next",
  prevLabel: "Previous",
  slides: [
    {
      alt: "First photo",
      sources: [],
      src: "https://cdn.reptiles.ge/first.jpg",
    },
    {
      alt: "Second photo",
      sources: [],
      src: "https://cdn.reptiles.ge/second.jpg",
    },
  ],
};

describe("SpeciesGalleryLightbox server markup", () => {
  it("includes every slide image when requested for the species gallery", () => {
    const html = renderToStaticMarkup(
      createElement(SpeciesGalleryLightbox, {
        ...props,
        renderAllSlides: true,
      }),
    );

    expect(html).toContain('src="https://cdn.reptiles.ge/first.jpg"');
    expect(html).toContain('src="https://cdn.reptiles.ge/second.jpg"');
  });

  it("keeps unopened author lightboxes out of the initial markup", () => {
    const html = renderToStaticMarkup(
      createElement(SpeciesGalleryLightbox, props),
    );

    expect(html).not.toContain("https://cdn.reptiles.ge/first.jpg");
  });
});
