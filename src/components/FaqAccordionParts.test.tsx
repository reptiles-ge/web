import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  FaqAnswerPanel,
  FaqQuestion,
  FaqToggleIcon,
} from "@/components/FaqAccordionParts";
import { faqItemIds } from "@/lib/faqAccordion";

describe("FaqAnswerPanel", () => {
  it("expands the grid row when open", () => {
    const { container } = render(
      <FaqAnswerPanel isOpen>
        <p>Answer</p>
      </FaqAnswerPanel>,
    );
    expect(screen.getByText("Answer")).toBeInTheDocument();
    expect(container.firstElementChild).toHaveClass("grid-rows-[1fr]");
  });

  it("collapses the grid row when closed, keeping the content mounted", () => {
    const { container } = render(
      <FaqAnswerPanel isOpen={false}>
        <p>Answer</p>
      </FaqAnswerPanel>,
    );
    expect(container.firstElementChild).toHaveClass("grid-rows-[0fr]");
    expect(screen.getByText("Answer")).toBeInTheDocument();
  });
});

describe("FaqQuestion and FaqAnswerPanel", () => {
  function Item({ isOpen }: { isOpen: boolean }) {
    const ids = faqItemIds("faq", 2);
    return (
      <>
        <FaqQuestion
          className="flex"
          ids={ids}
          isOpen={isOpen}
          onToggle={() => {}}
        >
          Question?
        </FaqQuestion>
        <FaqAnswerPanel ids={ids} isOpen={isOpen}>
          <p>Answer</p>
        </FaqAnswerPanel>
      </>
    );
  }

  it("wires the heading button to a labelled region", () => {
    render(<Item isOpen />);
    const button = screen.getByRole("button", { name: "Question?" });
    expect(button.parentElement?.tagName).toBe("H3");
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(button).toHaveAttribute("aria-controls", "faq-answer-2");
    const region = screen.getByRole("region", { name: "Question?" });
    expect(region).toHaveAttribute("id", "faq-answer-2");
    expect(region).not.toHaveAttribute("inert");
  });

  it("makes a closed panel inert but keeps the answer in the document", () => {
    const { container } = render(<Item isOpen={false} />);
    expect(container.querySelector("#faq-answer-2")).toHaveAttribute("inert");
    expect(screen.getByText("Answer")).toBeInTheDocument();
  });

  it("leaves a panel without ids as a plain wrapper", () => {
    const { container } = render(
      <FaqAnswerPanel isOpen={false}>
        <p>Answer</p>
      </FaqAnswerPanel>,
    );
    const panel = container.firstElementChild;
    expect(panel).not.toHaveAttribute("role");
    expect(panel).not.toHaveAttribute("inert");
  });
});

describe("FaqToggleIcon", () => {
  it("rotates and fills the icon when open", () => {
    const { container } = render(<FaqToggleIcon isOpen />);
    expect(container.firstElementChild).toHaveClass("rotate-45", "bg-ink");
  });

  it("is a plain outlined icon when closed", () => {
    const { container } = render(<FaqToggleIcon isOpen={false} />);
    expect(container.firstElementChild).not.toHaveClass("rotate-45");
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
