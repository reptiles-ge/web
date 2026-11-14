import type { ComponentProps } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  HoverPrefetchLink,
  IntentPrefetchLink,
} from "@/components/IntentPrefetchLink";

vi.mock("@/i18n/baseNavigation", () => ({
  Link: ({
    children,
    href,
    onFocus,
    onMouseEnter,
    onTouchStart,
    prefetch,
  }: ComponentProps<"a"> & { prefetch?: boolean | null }) => (
    <a
      data-prefetch={String(prefetch)}
      href={String(href)}
      onFocus={onFocus}
      onMouseEnter={onMouseEnter}
      onTouchStart={onTouchStart}
    >
      {children}
    </a>
  ),
}));

function link() {
  return screen.getByRole("link", { name: "Giurza" });
}

describe("HoverPrefetchLink", () => {
  it("starts with prefetch off and turns on a full prefetch when hovered", () => {
    render(<HoverPrefetchLink href="/snakes">Giurza</HoverPrefetchLink>);
    expect(link()).toHaveAttribute("data-prefetch", "false");
    fireEvent.mouseEnter(link());
    expect(link()).toHaveAttribute("data-prefetch", "true");
  });

  it("turns prefetch on when focused", () => {
    render(<HoverPrefetchLink href="/snakes">Giurza</HoverPrefetchLink>);
    fireEvent.focus(link());
    expect(link()).toHaveAttribute("data-prefetch", "true");
  });

  it("does not prefetch on touch but still calls the caller's handler", () => {
    const onTouchStart = vi.fn();
    render(
      <HoverPrefetchLink href="/snakes" onTouchStart={onTouchStart}>
        Giurza
      </HoverPrefetchLink>,
    );
    fireEvent.touchStart(link());
    expect(link()).toHaveAttribute("data-prefetch", "false");
    expect(onTouchStart).toHaveBeenCalledTimes(1);
  });
});

describe("IntentPrefetchLink", () => {
  it("turns prefetch on when touched", () => {
    render(<IntentPrefetchLink href="/snakes">Giurza</IntentPrefetchLink>);
    fireEvent.touchStart(link());
    expect(link()).toHaveAttribute("data-prefetch", "null");
  });

  it("keeps an explicit prefetch prop", () => {
    render(
      <IntentPrefetchLink href="/snakes" prefetch={false}>
        Giurza
      </IntentPrefetchLink>,
    );
    fireEvent.mouseEnter(link());
    expect(link()).toHaveAttribute("data-prefetch", "false");
  });
});
