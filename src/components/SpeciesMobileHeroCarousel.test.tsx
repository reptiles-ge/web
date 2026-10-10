import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  type MobileHeroSlide,
  SpeciesMobileHeroCarousel,
} from "@/components/SpeciesMobileHeroCarousel";

function progressBars(container: HTMLElement) {
  return container.querySelectorAll("div[aria-hidden='true'] > span");
}

function slides(count: number): MobileHeroSlide[] {
  return Array.from({ length: count }, (_, index) => ({
    alt: `photo ${index + 1}`,
    displaySrc: `https://cdn.reptiles.ge/test/${index + 1}.jpg`,
    gallerySrc: `https://cdn.reptiles.ge/test/${index + 1}-1200.jpg`,
  }));
}

describe("SpeciesMobileHeroCarousel", () => {
  it("renders one progress segment per photo with the first active", () => {
    const { container } = render(
      <SpeciesMobileHeroCarousel
        label="Gallery"
        slides={slides(4)}
        speciesId="macrovipera-lebetina"
      />,
    );
    const bars = progressBars(container);
    expect(bars).toHaveLength(4);
    expect(bars[0].className).toContain("bg-white");
    expect(bars[0].className).not.toContain("bg-white/36");
    expect(bars[1].className).toContain("bg-white/36");
  });

  it("moves the active segment with the scroll position", () => {
    const { container, getByRole } = render(
      <SpeciesMobileHeroCarousel
        label="Gallery"
        slides={slides(3)}
        speciesId="macrovipera-lebetina"
      />,
    );
    const scroller = getByRole("region");
    Object.defineProperty(scroller, "clientWidth", { value: 390 });
    scroller.scrollLeft = 780;
    fireEvent.scroll(scroller);
    const bars = progressBars(container);
    expect(bars[2].className).not.toContain("bg-white/36");
    expect(bars[0].className).toContain("bg-white/36");
  });

  it("hides the progress bar for a single photo", () => {
    const { container } = render(
      <SpeciesMobileHeroCarousel
        label="Gallery"
        slides={slides(1)}
        speciesId="macrovipera-lebetina"
      />,
    );
    expect(progressBars(container)).toHaveLength(0);
  });
});
