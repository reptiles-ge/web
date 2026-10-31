import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { SpeciesFaqItems } from "@/components/SpeciesFaqItems";

const items = [
  { answer: "First answer", question: "First question?" },
  { answer: "Second answer", question: "Second question?" },
  { answer: "Third answer", question: "Third question?" },
];

function buttonFor(question: string) {
  return screen.getByRole("button", { name: new RegExp(question) });
}

function renderItems(visibleCount = 5) {
  return render(
    <SpeciesFaqItems
      editable={false}
      entityId="macrovipera-lebetina"
      items={items}
      moreLabel="Show more"
      pageType="species"
      visibleCount={visibleCount}
    />,
  );
}

describe("SpeciesFaqItems", () => {
  it("marks every question as a level-3 heading", () => {
    renderItems();
    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings.map((node) => node.textContent)).toEqual(
      items.map((item) => item.question),
    );
    expect(headings[0]?.querySelector("button")).toBe(
      buttonFor("First question"),
    );
  });

  it("opens one question at a time", async () => {
    const user = userEvent.setup();
    renderItems();
    expect(buttonFor("First question")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await user.click(buttonFor("Second question"));
    expect(buttonFor("Second question")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(buttonFor("First question")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("hides questions past the visible count until expanded", async () => {
    const user = userEvent.setup();
    renderItems(2);
    expect(
      screen.queryByRole("heading", { name: "Third question?" }),
    ).toBeNull();
    await user.click(screen.getByRole("button", { name: "Show more" }));
    expect(
      screen.getByRole("heading", { level: 3, name: "Third question?" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Show more" })).toBeNull();
  });
});
