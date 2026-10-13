import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RangeHabitatExpandable } from "@/components/map/RangeHabitatExpandable";

const BODY = Array.from(
  { length: 8 },
  (_, index) =>
    `Record ${index + 1}: the badger lives in forests, river valleys, and scrub.`,
).join(" ");

function occurrences(haystack: string, needle: string) {
  return haystack.split(needle).length - 1;
}

describe("RangeHabitatExpandable", () => {
  it("renders the distribution text once, collapsed or open", () => {
    const { container } = render(
      <RangeHabitatExpandable
        body={BODY}
        readLess="Read less"
        readMore="Read more"
      />,
    );
    const sentence = BODY.slice(0, 60);

    expect(occurrences(container.innerHTML, sentence)).toBe(1);
    expect(container.querySelectorAll("p")).toHaveLength(1);
    expect(container.querySelector("details")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Read more" }));

    expect(occurrences(container.innerHTML, sentence)).toBe(1);
  });

  it("clamps the text and toggles it with an accessible button", () => {
    const { container } = render(
      <RangeHabitatExpandable
        body={BODY}
        readLess="Read less"
        readMore="Read more"
      />,
    );
    const text = container.querySelector("p");
    const button = screen.getByRole("button", { name: "Read more" });

    expect(text).toHaveClass("line-clamp-3");
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-controls", text?.id);

    fireEvent.click(button);

    expect(text).not.toHaveClass("line-clamp-3");
    expect(screen.getByRole("button", { name: "Read less" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("shows the full editable text without a toggle in editor mode", () => {
    const { container } = render(
      <RangeHabitatExpandable
        body={BODY}
        editorField="habitat"
        readLess="Read less"
        readMore="Read more"
        speciesId="meles-canescens"
      />,
    );
    const text = container.querySelector("p");

    expect(text).toHaveAttribute("data-content-field", "habitat");
    expect(text).toHaveAttribute("data-content-id", "meles-canescens");
    expect(text).not.toHaveClass("line-clamp-3");
    expect(screen.queryByRole("button")).toBeNull();
  });
});
