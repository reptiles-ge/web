import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  NewsSeriesBlock,
  type NewsSeriesItem,
} from "@/components/NewsSeriesBlock";

const ITEMS: NewsSeriesItem[] = [
  {
    current: false,
    dateLabel: "27 August 2026",
    href: "/en/news/first",
    id: "first",
    publishedAt: "2026-08-27",
    title: "First update",
  },
  {
    current: true,
    dateLabel: "14 October 2026",
    href: "/en/news/second",
    id: "second",
    publishedAt: "2026-10-14",
    title: "Second update",
  },
  {
    current: false,
    dateLabel: "18 October 2026",
    href: "/en/news/third",
    id: "third",
    publishedAt: "2026-10-18",
    title: "Third update",
  },
];

function renderBlock(items: readonly NewsSeriesItem[]) {
  return render(
    <NewsSeriesBlock
      currentLabel="This article"
      eyebrow="In this series"
      items={items}
      name="Batumi Raptor Count, autumn 2026"
    />,
  );
}

describe("NewsSeriesBlock", () => {
  it("lists the series in the given order and links the other articles", () => {
    renderBlock(ITEMS);

    const nav = screen.getByRole("navigation", {
      name: "Batumi Raptor Count, autumn 2026",
    });
    const entries = nav.querySelectorAll("li");
    expect([...entries].map((entry) => entry.textContent)).toEqual([
      "0127 August 2026First update",
      "0214 October 2026 · This articleSecond update",
      "0318 October 2026Third update",
    ]);
    expect(
      screen.getAllByRole("link").map((link) => link.getAttribute("href")),
    ).toEqual(["/en/news/first", "/en/news/third"]);
    expect(screen.getByText("In this series")).toBeTruthy();
  });

  it("marks the current article without linking it", () => {
    renderBlock(ITEMS);

    const current = document.querySelector('[aria-current="page"]');
    expect(current?.tagName).toBe("SPAN");
    expect(current?.textContent).toContain("Second update");
  });

  it("renders nothing for a series of one", () => {
    const { container } = renderBlock(ITEMS.slice(1, 2));

    expect(container.innerHTML).toBe("");
  });
});
