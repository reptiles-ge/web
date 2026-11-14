import { act, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { NavigationSkeleton } from "@/components/NavigationSkeleton";
import {
  beginPendingNavigation,
  endPendingNavigation,
} from "@/lib/pendingNavigation";

import en from "../../messages/en.json";

function renderSkeleton() {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      <NavigationSkeleton>
        <p>Current page</p>
      </NavigationSkeleton>
    </NextIntlClientProvider>,
  );
}

let scrollTo: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.useFakeTimers();
  scrollTo = vi.fn();
  window.scrollTo = scrollTo as unknown as typeof window.scrollTo;
});

afterEach(() => {
  act(() => endPendingNavigation());
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("NavigationSkeleton", () => {
  it("shows the page with no pending navigation", () => {
    renderSkeleton();
    expect(screen.getByText("Current page")).toBeVisible();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("shows the species skeleton after a short delay and hides the old page", () => {
    renderSkeleton();
    act(() => beginPendingNavigation("/en/snakes/vipera-dinniki"));
    expect(screen.queryByRole("status")).toBeNull();

    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(screen.getByRole("status")).toHaveTextContent(en.nav.loadingPage);
    expect(screen.getByText("Current page").parentElement).toHaveClass(
      "hidden",
    );
    expect(scrollTo).toHaveBeenCalledWith(0, 0);

    act(() => endPendingNavigation());
    expect(screen.queryByRole("status")).toBeNull();
    expect(screen.getByText("Current page").parentElement).toHaveClass(
      "contents",
    );
  });

  it("skips navigations that finish before the delay", () => {
    renderSkeleton();
    act(() => beginPendingNavigation("/en/snakes/vipera-dinniki"));
    act(() => {
      vi.advanceTimersByTime(100);
    });
    act(() => endPendingNavigation());
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("does nothing for pages that are not species profiles", () => {
    renderSkeleton();
    act(() => beginPendingNavigation("/en/snakes/species"));
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.queryByRole("status")).toBeNull();
  });
});
