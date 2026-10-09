import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AuthorGalleryGrid } from "@/components/AuthorGalleryGrid";
import { AuthorIndexGrid } from "@/components/AuthorIndexGrid";

describe("AuthorIndexGrid", () => {
  it("filters cards by role and updates the count line", () => {
    render(
      <AuthorIndexGrid
        countLabels={{ all: "3 people", ranger: "1 person" }}
        filterLabel="Role"
        filters={[
          { count: 3, id: "all", label: "All" },
          { count: 1, id: "ranger", label: "Rangers" },
        ]}
        items={[
          { id: "a", node: <span>Ana</span>, role: "ranger" },
          { id: "b", node: <span>Ben</span>, role: "researcher" },
          { id: "c", node: <span>Cy</span>, role: "researcher" },
        ]}
        sortedLabel="by photos"
      />,
    );
    expect(screen.getByText("3 people · by photos")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Rangers/ }));
    expect(screen.getByRole("button", { name: /Rangers/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByText("1 person · by photos")).toBeInTheDocument();
    expect(screen.getByText("Ana").closest("li")).not.toHaveAttribute("hidden");
    expect(screen.getByText("Ben").closest("li")).toHaveAttribute("hidden");
  });
});

describe("AuthorGalleryGrid", () => {
  const items = Array.from({ length: 12 }, (_, index) => ({
    group: index < 10 ? "snakes" : "spiders",
    id: `p${index}`,
    node: <span>{`photo ${index}`}</span>,
  }));
  const filters = [
    {
      count: 12,
      countLabel: "12 photos · all",
      id: "all",
      label: "All",
      showAllLabel: "See all 12",
    },
    {
      count: 10,
      countLabel: "10 photos · snakes",
      id: "snakes",
      label: "Snakes",
      showAllLabel: "See all 10",
    },
    {
      count: 2,
      countLabel: "2 photos · spiders",
      id: "spiders",
      label: "Spiders",
      showAllLabel: "See all 2",
    },
  ];

  function shown() {
    return screen
      .getAllByRole("listitem", { hidden: true })
      .filter((li) => !li.hasAttribute("hidden"));
  }

  it("shows nine photos, the first one large, then everything on demand", () => {
    render(
      <AuthorGalleryGrid
        filterLabel="Group"
        filters={filters}
        heading={<h2>Gallery</h2>}
        items={items}
      />,
    );
    expect(shown()).toHaveLength(9);
    expect(shown()[0].className).toContain("col-span-2");
    fireEvent.click(screen.getByRole("button", { name: /See all 12/ }));
    expect(shown()).toHaveLength(12);
    expect(screen.queryByRole("button", { expanded: false })).toBeNull();
  });

  it("filters by group and makes that group's first photo the large one", () => {
    render(
      <AuthorGalleryGrid
        filterLabel="Group"
        filters={filters}
        heading={<h2>Gallery</h2>}
        items={items}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Spiders/ }));
    expect(screen.getByText("2 photos · spiders")).toBeInTheDocument();
    expect(shown().map((li) => li.textContent)).toEqual([
      "photo 10",
      "photo 11",
    ]);
    expect(shown()[0].className).toContain("col-span-2");
    expect(screen.queryByRole("button", { expanded: false })).toBeNull();
  });
});
