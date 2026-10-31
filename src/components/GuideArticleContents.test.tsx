import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GuideArticleContents } from "@/components/GuideArticleContents";

const ITEMS = [
  { anchor: "what-to-do", editorAttributes: {}, label: "What to do" },
  { anchor: "what-not-to-do", editorAttributes: {}, label: "What not to do" },
  { anchor: "rabies", editorAttributes: {}, label: "Bats and rabies" },
];

describe("GuideArticleContents", () => {
  it("starts collapsed below desktop and always lists every section link", () => {
    render(
      <GuideArticleContents
        headingId="bat-contents"
        items={ITEMS}
        label="In this guide"
      />,
    );
    const toggle = screen.getByRole("button", { name: "In this guide" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveClass("lg:hidden");
    const list = document.getElementById(
      toggle.getAttribute("aria-controls") ?? "",
    );
    expect(list).toHaveClass("max-lg:hidden");
    for (const item of ITEMS) {
      expect(screen.getByRole("link", { name: item.label })).toHaveAttribute(
        "href",
        `#${item.anchor}`,
      );
    }
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(list).not.toHaveClass("max-lg:hidden");
    expect(
      screen.getByRole("navigation", { name: "In this guide" }),
    ).toBeInTheDocument();
  });
});
