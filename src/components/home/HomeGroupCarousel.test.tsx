import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { HomeGroupCarousel } from "@/components/home/HomeGroupCarousel";

function drag(strip: HTMLElement) {
  fireEvent.pointerDown(strip, {
    button: 0,
    clientX: 100,
    pointerId: 1,
    pointerType: "mouse",
  });
  fireEvent.pointerMove(strip, {
    clientX: 50,
    pointerId: 1,
    pointerType: "mouse",
  });
  fireEvent.pointerUp(strip, { pointerId: 1, pointerType: "mouse" });
}

function renderCarousel() {
  const onActivate = vi.fn();
  render(
    <HomeGroupCarousel action={null} nextLabel="Next" previousLabel="Previous">
      <a href="#birds" onClick={onActivate}>
        Birds
      </a>
    </HomeGroupCarousel>,
  );
  const link = screen.getByRole("link", { name: "Birds" });
  const strip = link.parentElement!;
  strip.setPointerCapture = vi.fn();
  strip.hasPointerCapture = vi.fn(() => true);
  strip.releasePointerCapture = vi.fn();
  return { link, onActivate, strip };
}

describe("HomeGroupCarousel", () => {
  it("scrolls on drag and blocks the accidental pointer click", () => {
    const { link, onActivate, strip } = renderCarousel();
    drag(strip);
    expect(strip.scrollLeft).toBe(50);
    fireEvent.click(link, { detail: 1 });
    expect(onActivate).not.toHaveBeenCalled();
    fireEvent.click(link, { detail: 1 });
    expect(onActivate).toHaveBeenCalledOnce();
  });

  it("allows keyboard activation after dragging", () => {
    const { link, onActivate, strip } = renderCarousel();
    drag(strip);
    fireEvent.keyDown(link, { key: "Enter" });
    fireEvent.click(link, { detail: 0 });
    expect(onActivate).toHaveBeenCalledOnce();
  });
});
