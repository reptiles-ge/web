import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { RiskSegment } from "@/components/species-atlas/RiskSegment";

import ka from "../../../messages/ka.json";

function renderSegment(value: "all" | "harmless" | "venomous") {
  const onChange = vi.fn();
  render(
    <NextIntlClientProvider locale="ka" messages={ka}>
      <RiskSegment
        label={ka.speciesAtlas.filters.danger}
        onChange={onChange}
        value={value}
      />
    </NextIntlClientProvider>,
  );
  return onChange;
}

describe("RiskSegment", () => {
  it("is a labelled radio group with the current value checked", () => {
    renderSegment("venomous");
    const group = screen.getByRole("radiogroup", {
      name: ka.speciesAtlas.filters.danger,
    });
    expect(group).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: ka.speciesAtlas.danger.venomous }),
    ).toHaveAttribute("aria-checked", "true");
    expect(
      screen.getByRole("radio", { name: ka.speciesAtlas.danger.harmless }),
    ).toHaveAttribute("aria-checked", "false");
  });

  it("reports the picked option and gives every option a 44px hit area", () => {
    const onChange = renderSegment("all");
    const harmless = screen.getByRole("radio", {
      name: ka.speciesAtlas.danger.harmless,
    });
    fireEvent.click(harmless);
    expect(onChange).toHaveBeenCalledWith("harmless");
    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).toHaveClass("tap-target");
    }
  });
});
