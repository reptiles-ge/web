import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  NewsIndexBrowser,
  type NewsIndexBrowserItem,
} from "@/components/NewsIndexBrowser";

function item(
  id: string,
  monthKey: string,
  topics: string[],
  searchText: string,
): NewsIndexBrowserItem {
  return {
    card: <span>{`card-${id}`}</span>,
    id,
    monthKey,
    searchText,
    topics,
  };
}

const ITEMS = [
  item("a", "2026-09", ["mammals"], "bezoar goat javakheti"),
  item("b", "2026-09", ["amphibians"], "caucasian toad genome"),
  item("c", "2026-09", ["snakes"], "snake occupancy"),
  item("d", "2026-09", ["turtles"], "leatherback black sea"),
  item("e", "2026-09", ["snakes", "lizards"], "herpetofauna checklist"),
  item("f", "2026-08", ["birds"], "batumi raptors"),
];

function renderBrowser() {
  render(
    <NewsIndexBrowser
      articleWords={["articles", "article", "articles", "articles", "articles"]}
      chips={[
        { count: 6, id: "all", label: "All" },
        { count: 2, id: "snakes", label: "Snakes" },
        { count: 1, id: "birds", label: "Birds" },
      ]}
      featured={<section aria-label="Featured">featured block</section>}
      featuredCount={3}
      items={ITEMS}
      labels={{
        clear: "Clear",
        emptyCta: "All news",
        emptyText: "Try another word.",
        emptyTitle: "No articles match this search",
        emptyTitleShort: "No articles found",
        resetFilter: "Clear filter",
        resetFilterShort: "Clear",
        searchLabel: "Search news",
        searchPlaceholder: "Search news",
        topicsLabel: "Topics",
      }}
      monthLabels={{ "2026-08": "August 2026", "2026-09": "September 2026" }}
    />,
  );
}

function search(value: string) {
  fireEvent.change(screen.getByRole("searchbox", { name: "Search news" }), {
    target: { value },
  });
}

describe("NewsIndexBrowser", () => {
  it("shows the featured block and the remaining articles grouped by month", () => {
    renderBrowser();
    expect(screen.getByText("featured block")).toBeInTheDocument();
    expect(screen.queryByText("card-a")).not.toBeInTheDocument();
    const september = screen.getByRole("region", { name: "September 2026" });
    expect(within(september).getByText("card-d")).toBeInTheDocument();
    expect(within(september).getByText("card-e")).toBeInTheDocument();
    expect(within(september).getByText("2 articles")).toBeInTheDocument();
    const august = screen.getByRole("region", { name: "August 2026" });
    expect(within(august).getByText("1 article")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("filters by topic, hides the featured block, and resets", () => {
    renderBrowser();
    const snakes = screen.getByRole("button", { name: /Snakes/ });
    fireEvent.click(snakes);
    expect(snakes).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByText("featured block")).not.toBeInTheDocument();
    expect(screen.getByText("card-c")).toBeInTheDocument();
    expect(screen.getByText("card-e")).toBeInTheDocument();
    expect(screen.queryByText("card-f")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("2 articles · Snakes");

    fireEvent.click(screen.getByRole("button", { name: "Clear Clear filter" }));
    expect(screen.getByText("featured block")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /All/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("searches case-insensitively and clears the query", () => {
    renderBrowser();
    search("  BATUMI ");
    expect(screen.getByText("card-f")).toBeInTheDocument();
    expect(screen.queryByText("card-c")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "1 article · „BATUMI“",
    );

    fireEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(screen.getByRole("searchbox", { name: "Search news" })).toHaveValue(
      "",
    );
    expect(screen.getByText("featured block")).toBeInTheDocument();
  });

  it("shows the empty state and returns to all news", () => {
    renderBrowser();
    fireEvent.click(screen.getByRole("button", { name: /Birds/ }));
    search("toad");
    expect(screen.getByText("No articles found")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "All news" }));
    expect(screen.queryByText("No articles found")).not.toBeInTheDocument();
    expect(screen.getByText("featured block")).toBeInTheDocument();
  });
});
