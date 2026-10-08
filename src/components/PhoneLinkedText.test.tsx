import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PhoneLinkedText } from "@/components/PhoneLinkedText";

describe("PhoneLinkedText", () => {
  it("leaves ordinary text alone", () => {
    render(<PhoneLinkedText>No numbers here.</PhoneLinkedText>);
    expect(screen.getByText("No numbers here.")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("links the emergency number", () => {
    render(<PhoneLinkedText>Call 112 now.</PhoneLinkedText>);
    const link = screen.getByRole("link", { name: "112" });
    expect(link).toHaveAttribute("href", "tel:112");
  });

  it("links the agency number to its dialable form", () => {
    render(<PhoneLinkedText>Agency: 032 272 16 00.</PhoneLinkedText>);
    expect(screen.getByRole("link", { name: "032 272 16 00" })).toHaveAttribute(
      "href",
      "tel:0322721600",
    );
  });

  it("does not link 112 inside a longer number or a year-like range", () => {
    render(
      <PhoneLinkedText>Codes 1120 and 112–115 are not phones.</PhoneLinkedText>,
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("links markdown external links and opens them safely in a new tab", () => {
    render(
      <PhoneLinkedText>
        See [IUCN](https://www.iucnredlist.org/species/1).
      </PhoneLinkedText>,
    );
    const link = screen.getByRole("link", { name: "IUCN" });
    expect(link).toHaveAttribute(
      "href",
      "https://www.iucnredlist.org/species/1",
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("keeps surrounding text around a link", () => {
    const { container } = render(
      <p>
        <PhoneLinkedText>Before 112 after</PhoneLinkedText>
      </p>,
    );
    expect(container.textContent).toBe("Before 112 after");
  });

  it("walks nested elements", () => {
    render(
      <PhoneLinkedText>
        <strong>Emergency: 112</strong>
      </PhoneLinkedText>,
    );
    expect(screen.getByRole("link", { name: "112" })).toBeInTheDocument();
  });
});
