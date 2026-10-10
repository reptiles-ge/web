import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BiologyDisclosure } from "@/components/BiologyDisclosure";

describe("BiologyDisclosure", () => {
  it("toggles the section", () => {
    render(
      <BiologyDisclosure defaultOpen={false} title="Habitat">
        Forest
      </BiologyDisclosure>,
    );
    const button = screen.getByRole("button", { name: "Habitat" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Forest")).toBeInTheDocument();
  });
});
