import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FaqAnswerPanel, FaqToggleIcon } from "@/components/FaqAccordionParts";

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
