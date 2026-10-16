import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { NewsShareButtons } from "@/components/NewsShareButtons";

const URL = "https://reptiles.ge/news/bezoar-goat-restoration-javakheti-2026";

function mockClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
}

function renderButtons() {
  return render(
    <NewsShareButtons
      copiedLabel="Link copied"
      copyLabel="Copy link"
      facebookLabel="Share on Facebook"
      url={URL}
    />,
  );
}

describe("NewsShareButtons", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("links to the Facebook sharer with the article URL", () => {
    renderButtons();

    const link = screen.getByRole("link", { name: "Share on Facebook" });
    expect(link.getAttribute("href")).toBe(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(URL)}`,
    );
    expect(link.getAttribute("target")).toBe("_blank");
  });

  it("copies the article URL and resets the label", async () => {
    vi.useFakeTimers();
    const writeText = vi.fn(() => Promise.resolve());
    mockClipboard(writeText);
    renderButtons();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy link" }));
    });

    expect(writeText).toHaveBeenCalledWith(URL);
    expect(screen.getByRole("button", { name: "Link copied" })).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByRole("button", { name: "Copy link" })).toBeTruthy();
  });

  it("keeps the copy label when the clipboard is unavailable", async () => {
    mockClipboard(() => Promise.reject(new Error("denied")));
    renderButtons();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy link" }));
    });

    expect(screen.getByRole("button", { name: "Copy link" })).toBeTruthy();
  });
});
