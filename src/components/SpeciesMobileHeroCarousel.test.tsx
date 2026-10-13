import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  type MobileHeroSlide,
  SpeciesMobileHeroCarousel,
} from "@/components/SpeciesMobileHeroCarousel";

function progressBars(container: HTMLElement) {
  return container.querySelectorAll("div[aria-hidden='true'] > span");
}

function slideImages(container: HTMLElement) {
  return Array.from(container.querySelectorAll("[role='region'] img"));
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

  describe("deferred slides", () => {
    afterEach(() => {
      vi.restoreAllMocks();
      vi.useRealTimers();
    });

    it("keeps photos after the first unloaded until the user touches the carousel", () => {
      vi.spyOn(document, "readyState", "get").mockReturnValue("loading");
      const { container, getByRole } = render(
        <SpeciesMobileHeroCarousel
          label="Gallery"
          slides={slides(3)}
          speciesId="macrovipera-lebetina"
        />,
      );
      const before = slideImages(container);
      expect(before[0].getAttribute("src")).toContain("cdn.reptiles.ge");
      expect(before[1].getAttribute("src")).toMatch(/^data:image\/gif/);
      expect(before[2].getAttribute("src")).toMatch(/^data:image\/gif/);
      expect(
        container
          .querySelectorAll("[role='region'] picture")[1]
          .querySelectorAll("source"),
      ).toHaveLength(1);

      fireEvent.pointerDown(getByRole("region"), { button: 0 });

      const after = slideImages(container);
      expect(after[1].getAttribute("src")).toContain("cdn.reptiles.ge");
      expect(after[2].getAttribute("src")).toContain("cdn.reptiles.ge");
    });

    it("loads the remaining photos once the page has loaded and the browser is idle", () => {
      vi.useFakeTimers();
      vi.spyOn(document, "readyState", "get").mockReturnValue("loading");
      const idle = vi.fn((callback: IdleRequestCallback) =>
        window.setTimeout(() => callback({} as IdleDeadline), 10),
      );
      vi.stubGlobal("requestIdleCallback", idle);
      vi.stubGlobal("cancelIdleCallback", vi.fn());
      const { container } = render(
        <SpeciesMobileHeroCarousel
          label="Gallery"
          slides={slides(2)}
          speciesId="macrovipera-lebetina"
        />,
      );
      expect(slideImages(container)[1].getAttribute("src")).toMatch(
        /^data:image\/gif/,
      );

      act(() => {
        window.dispatchEvent(new Event("load"));
        vi.advanceTimersByTime(20);
      });

      expect(idle).toHaveBeenCalledOnce();
      expect(slideImages(container)[1].getAttribute("src")).toContain(
        "cdn.reptiles.ge",
      );
      vi.unstubAllGlobals();
    });
  });
});
