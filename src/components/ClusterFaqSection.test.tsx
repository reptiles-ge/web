import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ClusterFaqSection } from "@/components/ClusterFaqSection";

const intro = { body: "Intro body", eyebrow: "FAQ", title: "Questions" };
const items = [
  { answer: "First answer", question: "First question?" },
  { answer: "Second answer", question: "Second question?" },
  { answer: "Third answer", question: "Third question?" },
];

function buttonFor(question: string) {
  return screen.getByRole("button", { name: new RegExp(question) });
}

describe("ClusterFaqSection", () => {
  it("renders the intro and every question", () => {
    render(<ClusterFaqSection intro={intro} items={items} />);
    expect(screen.getByText("Questions")).toBeInTheDocument();
    expect(screen.getByText("Intro body")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  it("opens the first question by default", () => {
    render(<ClusterFaqSection intro={intro} items={items} />);
    expect(buttonFor("First question")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(buttonFor("Second question")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("opens one question at a time", async () => {
    const user = userEvent.setup();
    render(<ClusterFaqSection intro={intro} items={items} />);
    await user.click(buttonFor("Third question"));
    expect(buttonFor("Third question")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(buttonFor("First question")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("closes an open question when it is clicked again", async () => {
    const user = userEvent.setup();
    render(<ClusterFaqSection intro={intro} items={items} />);
    await user.click(buttonFor("First question"));
    expect(buttonFor("First question")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("keeps every answer in the document so crawlers can read it", () => {
    render(<ClusterFaqSection intro={intro} items={items} />);
    for (const item of items) {
      expect(screen.getByText(item.answer as string)).toBeInTheDocument();
    }
  });

  it("uses the requested surface", () => {
    const { container } = render(
      <ClusterFaqSection intro={intro} items={items} surface="background" />,
    );
    expect(container.firstElementChild).toHaveClass("bg-background");
  });
});
