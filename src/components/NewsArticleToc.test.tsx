import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { NewsArticleToc } from "@/components/NewsArticleToc";

const ITEMS = [
  { id: "first", label: "First section" },
  { id: "second", label: "Second section" },
];

function placeHeading(id: string, top: number) {
  const heading = document.createElement("h2");
  heading.id = id;
  heading.getBoundingClientRect = () => ({ top }) as DOMRect;
  document.body.append(heading);
}

describe("NewsArticleToc", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("numbers every section and links to its anchor", () => {
    render(
      <NewsArticleToc
        heading="In this article"
        items={ITEMS}
        summary="In this article · 2 sections"
      />,
    );

    const nav = screen.getByRole("navigation", { name: "In this article" });
    const links = screen.getAllByRole("link");
    expect(nav).toBeTruthy();
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "#first",
      "#second",
    ]);
    expect(links[0]?.textContent).toBe("01First section");
    expect(links[1]?.textContent).toBe("02Second section");
  });

  it("marks the last heading above the reading line as current", () => {
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((step) => {
      step(0);
      return 1;
    });
    placeHeading("first", -400);
    placeHeading("second", 2000);
    render(
      <NewsArticleToc
        heading="In this article"
        items={ITEMS}
        summary="In this article · 2 sections"
      />,
    );

    expect(
      screen
        .getByRole("link", { name: /First section/ })
        .getAttribute("aria-current"),
    ).toBe("location");

    document.getElementById("second")!.getBoundingClientRect = () =>
      ({ top: 10 }) as DOMRect;
    fireEvent.scroll(window);

    expect(
      screen
        .getByRole("link", { name: /Second section/ })
        .getAttribute("aria-current"),
    ).toBe("location");
    expect(
      screen
        .getByRole("link", { name: /First section/ })
        .getAttribute("aria-current"),
    ).toBeNull();
  });

  it("collapses the list behind the summary button below the sidebar breakpoint", () => {
    render(
      <NewsArticleToc
        heading="In this article"
        items={ITEMS}
        summary="In this article · 2 sections"
      />,
    );

    const toggle = screen.getByRole("button", {
      name: "In this article · 2 sections",
    });
    const list = document.getElementById(toggle.getAttribute("aria-controls")!);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(list?.classList.contains("hidden")).toBe(true);

    fireEvent.click(toggle);

    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(list?.classList.contains("hidden")).toBe(false);
  });
});
