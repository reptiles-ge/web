import { act, fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SiteRating } from "@/components/SiteRating";
import { trackEvent } from "@/lib/analytics";

import en from "../../messages/en.json";

const navigation = vi.hoisted(() => ({ pathname: "/en/snakes" }));

vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
}));
vi.mock("@/lib/analytics", () => ({ trackEvent: vi.fn() }));

function renderRating({ pagesBefore = 1 } = {}) {
  window.sessionStorage.setItem("reptiles-rating-pages", String(pagesBefore));
  render(
    <NextIntlClientProvider locale="en" messages={en}>
      <SiteRating />
    </NextIntlClientProvider>,
  );
  act(() => {
    vi.advanceTimersByTime(60_000);
  });
}

function sentBody() {
  const [url, init] = vi.mocked(fetch).mock.calls[0]!;
  expect(String(url)).toBe("/api/rating");
  expect(init?.method).toBe("POST");
  return JSON.parse(String(init?.body)) as Record<string, unknown>;
}

describe("SiteRating", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.localStorage.clear();
    window.sessionStorage.clear();
    navigation.pathname = "/en/snakes";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null)));
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("sends 5 stars at once", () => {
    renderRating();
    fireEvent.click(screen.getByRole("button", { name: "5 out of 5 stars" }));

    expect(screen.getByRole("status")).toHaveTextContent("Thank you");
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(sentBody()).toMatchObject({ locale: "en", rating: 5 });
    expect(sentBody()).not.toHaveProperty("feedback");
    expect(window.localStorage.getItem("reptiles-rating")).toBe("rated");
  });

  it("asks why before sending fewer than 5 stars", () => {
    renderRating();
    fireEvent.click(screen.getByRole("button", { name: "2 out of 5 stars" }));

    expect(fetch).not.toHaveBeenCalled();
    const field = screen.getByLabelText("What could we do better?");
    expect(field).toHaveFocus();
    const send = screen.getByRole("button", { name: "Send" });
    expect(send).toBeDisabled();

    fireEvent.change(field, { target: { value: "   " } });
    expect(send).toBeDisabled();

    fireEvent.change(field, { target: { value: "  The map is missing  " } });
    expect(send).toBeEnabled();
    fireEvent.click(send);

    expect(screen.getByRole("status")).toHaveTextContent("Thank you");
    expect(sentBody()).toMatchObject({
      feedback: "The map is missing",
      rating: 2,
    });
    expect(trackEvent).toHaveBeenCalledWith("site_rating", { rating: 2 });
  });

  it("sends nothing when closed before the reason is written", () => {
    renderRating();
    fireEvent.click(screen.getByRole("button", { name: "3 out of 5 stars" }));
    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(fetch).not.toHaveBeenCalled();
    expect(screen.queryByLabelText("What could we do better?")).toBeNull();
    expect(window.localStorage.getItem("reptiles-rating")).not.toBe("rated");
    expect(trackEvent).toHaveBeenCalledWith("site_rating_dismissed");
  });

  it("sends at once when the visitor switches to 5 stars", () => {
    renderRating();
    fireEvent.click(screen.getByRole("button", { name: "1 out of 5 stars" }));
    fireEvent.click(screen.getByRole("button", { name: "5 out of 5 stars" }));

    expect(sentBody()).toMatchObject({ rating: 5 });
  });

  it("waits for a second page before asking", () => {
    renderRating({ pagesBefore: 0 });

    expect(screen.queryByRole("button", { name: "Close" })).toBeNull();
    expect(trackEvent).not.toHaveBeenCalled();
  });

  it("never asks on a quiz page", () => {
    navigation.pathname = "/en/quiz/which-snake";
    renderRating();

    expect(screen.queryByRole("button", { name: "Close" })).toBeNull();
    expect(trackEvent).not.toHaveBeenCalled();
  });

  it("counts pages across the session for the rating", () => {
    renderRating({ pagesBefore: 4 });
    fireEvent.click(screen.getByRole("button", { name: "5 out of 5 stars" }));

    expect(sentBody()).toMatchObject({ pages: 5 });
    expect(window.sessionStorage.getItem("reptiles-rating-pages")).toBe("5");
  });
});
