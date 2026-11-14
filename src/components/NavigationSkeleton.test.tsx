import { act, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";

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

afterEach(() => {
  act(() => endPendingNavigation());
  vi.restoreAllMocks();
});

describe("NavigationSkeleton", () => {
  it("shows the page with no pending navigation", () => {
    renderSkeleton();
    expect(screen.getByText("Current page")).toBeVisible();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("covers the screen with the species skeleton at once without scrolling", () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    renderSkeleton();
    act(() => beginPendingNavigation("/en/snakes/vipera-dinniki"));

    const status = screen.getByRole("status");
    expect(status).toHaveTextContent(en.nav.loadingPage);
    expect(status.parentElement).toHaveClass("fixed", "inset-0");
    expect(screen.getByText("Current page").parentElement).toHaveAttribute(
      "inert",
    );
    expect(scrollTo).not.toHaveBeenCalled();

    act(() => endPendingNavigation());
    expect(screen.queryByRole("status")).toBeNull();
    expect(screen.getByText("Current page").parentElement).not.toHaveAttribute(
      "inert",
    );
  });

  it("does nothing for pages that are not species profiles", () => {
    renderSkeleton();
    act(() => beginPendingNavigation("/en/snakes/species"));
    expect(screen.queryByRole("status")).toBeNull();
  });
});
