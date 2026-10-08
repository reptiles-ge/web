import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GuideMythList, GuideSummaryBlock } from "@/components/GuideShared";

describe("GuideMythList", () => {
  const myths = [
    { claim: "Myth one", id: 1, truth: "Truth one" },
    { claim: "Myth two", id: 2, truth: "Truth two" },
  ];

  it("renders each myth next to its correction", () => {
    render(<GuideMythList myths={myths} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(within(items[0]).getByText("Myth one")).toBeInTheDocument();
    expect(within(items[0]).getByText("Truth one")).toBeInTheDocument();
    expect(within(items[1]).getByText("Truth two")).toBeInTheDocument();
  });

  it("renders nothing but an empty list without myths", () => {
    render(<GuideMythList myths={[]} />);
    expect(screen.getByRole("list")).toBeEmptyDOMElement();
  });

  it("accepts custom list and truth classes", () => {
    render(
      <GuideMythList className="mt-1" myths={myths} truthClassName="mt-3" />,
    );
    expect(screen.getByRole("list")).toHaveClass("mt-1");
    expect(screen.getByText("Truth one")).toHaveClass("mt-3");
  });
});

describe("GuideSummaryBlock", () => {
  it("renders the eyebrow, title, lead and items in order", () => {
    render(
      <GuideSummaryBlock
        eyebrow="In short"
        items={[
          { id: 1, text: "First point" },
          { id: 2, text: "Second point" },
        ]}
        lead="Lead text"
        title="Summary title"
      />,
    );
    expect(screen.getByText("In short")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Summary title" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Lead text")).toBeInTheDocument();
    expect(
      screen.getAllByRole("listitem").map((item) => item.textContent),
    ).toEqual(["First point", "Second point"]);
  });

  it("turns the emergency number in a summary item into a tel link", () => {
    render(
      <GuideSummaryBlock
        eyebrow="e"
        items={[{ id: 1, text: "Call 112 immediately." }]}
        lead="l"
        title="t"
      />,
    );
    expect(screen.getByRole("link", { name: "112" })).toHaveAttribute(
      "href",
      "tel:112",
    );
  });
});
