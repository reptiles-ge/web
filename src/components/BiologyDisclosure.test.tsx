import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BiologyDisclosure } from "@/components/BiologyDisclosure";

const BLOCKS = [
  {
    body: "Adult gyurzas mainly eat rodents, but they also catch small birds and lizards.",
    id: "diet",
    title: "Diet",
  },
  {
    body: "In the South Caucasus the gyurza is usually active from April to the end of October.",
    id: "behavior",
    title: "Behaviour",
  },
  {
    body: "A 2021 assessment found that the gyurza faces a low risk of extinction as a species.",
    id: "conservation",
    title: "Conservation",
  },
];

function renderBlocks() {
  return render(
    <div>
      {BLOCKS.map((block, index) => (
        <BiologyDisclosure
          anchorLabel="Link to section"
          body={block.body}
          defaultOpen={index === 0}
          id={block.id}
          key={block.id}
          readLess="Read less"
          readMore="Read more"
          title={block.title}
        />
      ))}
    </div>,
  );
}

describe("BiologyDisclosure", () => {
  it("renders each block's text exactly once for every viewport", () => {
    const { container } = renderBlocks();
    for (const block of BLOCKS) {
      expect(screen.getAllByText(block.body)).toHaveLength(1);
      expect(container.textContent?.split(block.body)).toHaveLength(2);
      expect(
        screen.getByRole("heading", {
          level: 3,
          name: (name) => name.startsWith(block.title),
        }),
      ).toHaveAttribute("id", block.id);
    }
    expect(container.querySelectorAll("p")).toHaveLength(BLOCKS.length);
  });

  it("opens the first block and toggles the others", () => {
    renderBlocks();
    const first = screen.getByRole("button", { name: "Diet" });
    const second = screen.getByRole("button", { name: "Behaviour" });
    expect(first).toHaveAttribute("aria-expanded", "true");
    expect(second).toHaveAttribute("aria-expanded", "false");
    const panel = document.getElementById(
      second.getAttribute("aria-controls") ?? "",
    );
    expect(panel).toHaveAttribute("data-state", "closed");
    expect(panel).toHaveClass("invisible", "lg:visible");
    fireEvent.click(second);
    expect(second).toHaveAttribute("aria-expanded", "true");
    expect(panel).toHaveAttribute("data-state", "open");
    expect(panel).not.toHaveClass("invisible");
  });

  it("clamps the text only from the desktop breakpoint", () => {
    renderBlocks();
    const text = screen.getByText(BLOCKS[0].body).closest("p");
    expect(text).toHaveClass("lg:line-clamp-3");
    expect(text).not.toHaveClass("line-clamp-3");
  });
});
