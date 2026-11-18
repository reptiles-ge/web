import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { RegionSectionNav } from "@/components/region-profile/RegionSectionNav";

const ITEMS = [
  { count: 2, id: "venomous", label: "Venomous", venomous: true },
  { count: 47, id: "species", label: "Species" },
  { count: 4, id: "faq", label: "Questions", phoneCount: false },
  { desktopOnly: true, id: "news", label: "News" },
  { id: "related", label: "Related regions", phoneLabel: "Nearby" },
];

let tops: Record<string, number>;

function currentTab() {
  return screen
    .getAllByRole("link")
    .find((link) => link.getAttribute("aria-current") === "location");
}

function renderNav() {
  return render(
    <>
      <RegionSectionNav items={ITEMS} label="Page sections" />
      {ITEMS.map((item) => (
        <h2 id={item.id} key={item.id}>
          {item.label}
        </h2>
      ))}
    </>,
  );
}

function scrollPage() {
  act(() => {
    window.dispatchEvent(new Event("scroll"));
    vi.runAllTimers();
  });
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal("innerHeight", 1000);
  tops = { faq: 2400, news: 3200, related: 4000, species: 1600, venomous: 800 };
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    function (this: HTMLElement) {
      return { top: tops[this.id] ?? 0 } as DOMRect;
    },
  );
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("RegionSectionNav", () => {
  it("links each section and starts on the first one", () => {
    renderNav();
    const links = screen.getAllByRole("link");
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "#venomous",
      "#species",
      "#faq",
      "#news",
      "#related",
    ]);
    expect(currentTab()).toHaveAttribute("href", "#venomous");
    expect(links[0]).toHaveTextContent("Venomous2");
    expect(links[4]).toHaveTextContent("NearbyRelated regions");
  });

  it("marks the last section that has passed the reading line", () => {
    renderNav();
    tops = {
      faq: 300,
      news: 900,
      related: 1700,
      species: -500,
      venomous: -900,
    };
    scrollPage();
    expect(currentTab()).toHaveAttribute("href", "#faq");

    tops = {
      faq: -900,
      news: -500,
      related: 100,
      species: -2000,
      venomous: -3000,
    };
    scrollPage();
    expect(currentTab()).toHaveAttribute("href", "#related");
  });

  it("falls back to the first section above all of them", () => {
    renderNav();
    tops = {
      faq: 900,
      news: 1500,
      related: 2300,
      species: 100,
      venomous: -900,
    };
    scrollPage();
    expect(currentTab()).toHaveAttribute("href", "#species");

    tops = {
      faq: 2400,
      news: 3200,
      related: 4000,
      species: 1600,
      venomous: 800,
    };
    scrollPage();
    expect(currentTab()).toHaveAttribute("href", "#venomous");
  });

  it("stops listening when it leaves the page", () => {
    const remove = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderNav();
    window.dispatchEvent(new Event("scroll"));
    unmount();
    expect(remove.mock.calls.map(([type]) => type)).toEqual(
      expect.arrayContaining(["scroll", "resize"]),
    );
  });
});
