import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BiologyExpandable } from "@/components/BiologyExpandable";

const BODY = "The badger is mainly active at night and at dusk.";

describe("BiologyExpandable", () => {
  it("clamps at every width by default", () => {
    render(
      <BiologyExpandable
        body={BODY}
        needsExpand
        readLess="Read less"
        readMore="Read more"
      />,
    );
    const text = screen.getByText(BODY).closest("p");
    expect(text).toHaveClass("line-clamp-3", "text-[16px]");
    expect(text).not.toHaveClass("lg:line-clamp-3");
  });

  it("clamps only on desktop when asked", () => {
    render(
      <BiologyExpandable
        body={BODY}
        clampFromDesktop
        needsExpand
        readLess="Read less"
        readMore="Read more"
      />,
    );
    const text = screen.getByText(BODY).closest("p");
    expect(text).toHaveClass("lg:line-clamp-3", "text-[17px]");
    expect(text).not.toHaveClass("line-clamp-3");
  });

  it("keeps editor attributes and skips the toggle for short text", () => {
    render(
      <BiologyExpandable
        body={BODY}
        editorField="interaction"
        needsExpand={false}
        readLess="Read less"
        readMore="Read more"
        speciesId="meles-canescens"
      />,
    );
    const text = screen.getByText(BODY).closest("p");
    expect(text).toHaveAttribute("data-content-field", "interaction");
    expect(text).not.toHaveClass("line-clamp-3");
    expect(screen.queryByRole("button")).toBeNull();
  });
});
