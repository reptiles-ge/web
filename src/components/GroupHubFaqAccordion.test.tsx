import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { GroupHubFaqAccordion } from "@/components/GroupHubFaqAccordion";

const items = [
  { answer: "First answer", n: 1, question: "First question?" },
  { answer: "Second answer", n: 2, question: "Second question?" },
];

function buttonFor(question: string) {
  return screen.getByRole("button", { name: new RegExp(question) });
}

describe("GroupHubFaqAccordion", () => {
  it("marks every question as a level-3 heading", () => {
    render(<GroupHubFaqAccordion hubId="snakes" items={items} />);
    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings.map((node) => node.textContent)).toEqual(
      items.map((item) => item.question),
    );
    expect(headings[1]?.querySelector("button")).toBe(
      buttonFor("Second question"),
    );
  });

  it("toggles a question open and closed", async () => {
    const user = userEvent.setup();
    render(<GroupHubFaqAccordion hubId="snakes" items={items} />);
    await user.click(buttonFor("Second question"));
    expect(buttonFor("Second question")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(buttonFor("First question")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    await user.click(buttonFor("Second question"));
    expect(buttonFor("Second question")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});
