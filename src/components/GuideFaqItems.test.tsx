import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { GuideFaqItems } from "@/components/GuideFaqItems";

const items = [
  { answer: "First answer", question: "First question?" },
  { answer: "Second answer", question: "Second question?" },
];

function buttonFor(question: string) {
  return screen.getByRole("button", { name: new RegExp(question) });
}

describe("GuideFaqItems", () => {
  it("marks every question as a level-3 heading tied to its answer", () => {
    render(<GuideFaqItems items={items} />);
    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings.map((node) => node.textContent)).toEqual(
      items.map((item) => item.question),
    );
    expect(
      screen.getByRole("region", { name: "First question?" }),
    ).toHaveTextContent("First answer");
  });

  it("opens questions independently", async () => {
    const user = userEvent.setup();
    render(<GuideFaqItems items={items} />);
    await user.click(buttonFor("Second question"));
    expect(buttonFor("First question")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(buttonFor("Second question")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await user.click(buttonFor("First question"));
    expect(buttonFor("First question")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});
