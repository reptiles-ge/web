import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SpeciesSourcesDisclosure } from "@/components/SpeciesSourcesDisclosure";

describe("SpeciesSourcesDisclosure", () => {
  it("opens the collapsed source list", () => {
    render(
      <SpeciesSourcesDisclosure label="More sources">
        Paper
      </SpeciesSourcesDisclosure>,
    );
    const button = screen.getByRole("button", { name: "More sources" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Paper")).toBeInTheDocument();
  });
});
